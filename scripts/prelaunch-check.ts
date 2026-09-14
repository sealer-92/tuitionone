import { config } from "dotenv";
config({ path: ".env.local" });
config();

import Stripe from "stripe";

const WEBHOOK_PATH = "/api/webhooks/stripe";
const REQUIRED_EVENT = "checkout.session.completed";

const baseUrl = (process.argv[2] ?? process.env.PRELAUNCH_URL ?? process.env.NEXTAUTH_URL ?? "").replace(/\/$/, "");

let failed = false;
let unresolved = 0;

function pass(msg: string) { console.log(`  PASS  ${msg}`); }
function warn(msg: string) { console.log(`  WARN  ${msg}`); unresolved++; }
function fail(msg: string) { console.log(`  FAIL  ${msg}`); failed = true; }
function skip(msg: string) { console.log(`  SKIP  ${msg}`); unresolved++; }

// Deployment Protection intercepts requests before our handler runs, so a 401/403
// here means Stripe's webhooks are being bounced at the edge. Every genuine Vercel
// response carries x-vercel-id; without it the response came from something else
// (corporate proxy, DNS, WAF) and says nothing about Deployment Protection.
async function checkProtection(): Promise<void> {
  console.log(`\nDeployment Protection — POST ${baseUrl}${WEBHOOK_PATH}`);

  let res: Response;
  try {
    res = await fetch(`${baseUrl}${WEBHOOK_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
      redirect: "manual",
    });
  } catch (err) {
    fail(`Could not reach the endpoint: ${(err as Error).message}`);
    return;
  }

  const fromVercel = res.headers.has("x-vercel-id");
  const location = res.headers.get("location") ?? "";
  const body = (await res.text()).slice(0, 2000);
  const looksLikeSso = /vercel\.com\/sso|_vercel\/sso|_vercel_sso_nonce|Authentication Required/i.test(body + location);

  if (!fromVercel) {
    warn(`${res.status} with no x-vercel-id header — this response did not come from Vercel.`);
    console.log(`        Something between you and the deployment (proxy, VPN, DNS, WAF) answered instead,`);
    console.log(`        so this check is inconclusive. Re-run from an unrestricted network.`);
    return;
  }

  if (res.status === 400) {
    pass(`400 from the handler — the request reaches our code (signature rejected, as expected).`);
  } else if (res.status === 401 || res.status === 403 || looksLikeSso) {
    fail(`${res.status} from Vercel — Deployment Protection is blocking this endpoint. Stripe will never reach the handler.`);
    console.log(`        Fix: Vercel → Settings → Deployment Protection → set Vercel Authentication`);
    console.log(`        to "Standard Protection" or "Only Preview Deployments", and point Stripe at`);
    console.log(`        your custom production domain (generated *.vercel.app URLs stay protected).`);
  } else if (res.status === 404) {
    fail(`404 — no handler at ${WEBHOOK_PATH}. Is this the right deployment?`);
  } else {
    warn(`Unexpected ${res.status}. Expected 400 "Invalid signature". Body: ${body.slice(0, 200)}`);
  }
}

async function checkStripeEndpoint(): Promise<void> {
  console.log(`\nStripe webhook registration`);

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    skip("STRIPE_SECRET_KEY not set — cannot verify the registered endpoint.");
    return;
  }
  const isTestKey = key.startsWith("sk_test_");
  if (isTestKey) {
    warn("STRIPE_SECRET_KEY is a test key — this can only see test-mode endpoints.");
    console.log(`        Your live-mode endpoints are NOT checked. Re-run with the live key`);
    console.log(`        (STRIPE_SECRET_KEY=sk_live_... npm run prelaunch -- ${baseUrl}) before launch.`);
  }

  const stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia", typescript: true });
  const expected = `${baseUrl}${WEBHOOK_PATH}`;

  const { data: endpoints } = await stripe.webhookEndpoints.list({ limit: 100 });
  const match = endpoints.find((e) => e.url.replace(/\/$/, "") === expected);

  if (!match) {
    const mode = isTestKey ? "test" : "live";
    const msg = `No ${mode}-mode Stripe endpoint registered for ${expected}`;
    if (isTestKey) warn(`${msg} — expected if you only test against preview.`);
    else fail(msg);
    if (endpoints.length) {
      console.log(`        Registered in ${mode} mode: ${endpoints.map((e) => e.url).join(", ")}`);
    }
    return;
  }

  pass(`Endpoint registered: ${match.url}`);

  if (match.status !== "enabled") {
    fail(`Endpoint status is "${match.status}" — Stripe is not delivering to it.`);
  } else {
    pass(`Endpoint is enabled.`);
  }

  if (match.enabled_events.includes(REQUIRED_EVENT) || match.enabled_events.includes("*")) {
    pass(`Subscribed to ${REQUIRED_EVENT}.`);
  } else {
    fail(`Not subscribed to ${REQUIRED_EVENT} — purchases will never grant access.`);
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    fail("STRIPE_WEBHOOK_SECRET is not set — every delivery will fail signature verification.");
  } else {
    pass("STRIPE_WEBHOOK_SECRET is set.");
  }
}

function checkUrls(): void {
  console.log(`\nURL configuration`);

  if (new URL(baseUrl).hostname.endsWith(".vercel.app")) {
    warn(`${baseUrl} is a generated Vercel domain. Under Standard Protection these stay`);
    console.log(`        gated even in production — use your custom domain for the live site.`);
  } else {
    pass(`${baseUrl} is a custom domain.`);
  }

  // success_url, cancel_url and the welcome email link are all built from NEXTAUTH_URL.
  // Run locally this reads .env.local, which is the dev value and says nothing about
  // what Vercel serves in production — so only treat it as evidence when it isn't local.
  const nextAuthUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  const isLocal = !!nextAuthUrl && /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(nextAuthUrl);

  if (!nextAuthUrl) {
    skip("NEXTAUTH_URL not set here — check it in Vercel → Settings → Environment Variables (Production).");
  } else if (isLocal) {
    skip(`NEXTAUTH_URL is ${nextAuthUrl} — your local dev value, as expected.`);
    console.log(`        Production's value cannot be read from here; confirm it in Vercel →`);
    console.log(`        Settings → Environment Variables (Production) is ${baseUrl}`);
  } else if (nextAuthUrl !== baseUrl) {
    fail(`NEXTAUTH_URL (${nextAuthUrl}) does not match ${baseUrl} — customers will be redirected off-domain after paying.`);
  } else {
    pass(`NEXTAUTH_URL matches.`);
  }
}

// Best-effort probe of what the *deployed* app thinks its own URL is. NextAuth builds
// these from the server's resolved auth URL, so an off-domain value here is real.
async function checkDeployedAuthUrl(): Promise<void> {
  console.log(`\nDeployed auth URLs`);

  let urls: string[];
  try {
    const res = await fetch(`${baseUrl}/api/auth/providers`, { redirect: "manual" });
    const providers = await res.json() as Record<string, { signinUrl?: string; callbackUrl?: string }>;
    urls = Object.values(providers).flatMap((p) => [p.signinUrl, p.callbackUrl]).filter((u): u is string => !!u);
  } catch {
    skip("Could not read /api/auth/providers — skipping.");
    return;
  }

  if (!urls.length) {
    skip("No provider URLs returned — skipping.");
    return;
  }

  const offDomain = urls.filter((u) => !u.startsWith(`${baseUrl}/`));
  if (offDomain.length) {
    fail(`The deployment builds auth URLs off-domain: ${offDomain.join(", ")}`);
  } else {
    pass(`Deployment builds auth URLs on ${baseUrl}.`);
  }
}

async function main() {
  if (!baseUrl) {
    console.error("Usage: npm run prelaunch -- https://your-domain.com");
    process.exit(2);
  }

  console.log(`Pre-launch check — ${baseUrl}`);

  checkUrls();
  await checkProtection();
  await checkDeployedAuthUrl();
  await checkStripeEndpoint();

  if (failed) {
    console.log(`\nFAILED — do not launch until the above are resolved.`);
    process.exit(1);
  }
  if (unresolved) {
    console.log(`\nINCONCLUSIVE — ${unresolved} check(s) could not be verified. Not safe to treat as a green light.`);
    process.exit(2);
  }
  console.log(`\nAll checks passed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
