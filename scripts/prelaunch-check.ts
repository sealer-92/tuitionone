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
  if (key.startsWith("sk_test_")) {
    warn("STRIPE_SECRET_KEY is a test key; this checks your test-mode endpoints, not live.");
  }

  const stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia", typescript: true });
  const expected = `${baseUrl}${WEBHOOK_PATH}`;

  const { data: endpoints } = await stripe.webhookEndpoints.list({ limit: 100 });
  const match = endpoints.find((e) => e.url.replace(/\/$/, "") === expected);

  if (!match) {
    fail(`No Stripe endpoint registered for ${expected}`);
    if (endpoints.length) {
      console.log(`        Registered instead: ${endpoints.map((e) => e.url).join(", ")}`);
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
  const nextAuthUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  if (!nextAuthUrl) {
    skip("NEXTAUTH_URL not set in this environment — verify it in Vercel's Production env vars.");
  } else if (nextAuthUrl !== baseUrl) {
    fail(`NEXTAUTH_URL (${nextAuthUrl}) does not match ${baseUrl} — customers will be redirected off-domain after paying.`);
  } else {
    pass(`NEXTAUTH_URL matches.`);
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
