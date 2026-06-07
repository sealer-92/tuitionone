# TuitionOne — Claude Onboarding Manual

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.
2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Code Style

Use comments sparingly. Only comment complex or non-obvious code.

## Commands

```bash
npm run dev          # Dev server (Turbopack) at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest test suite
npm run setup        # First-time setup: install + prisma generate + migrate
npm run db:reset     # Reset database (destructive)
```

To run a single test file:
```bash
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx
```

**Windows note:** Scripts use `cross-env` to set `NODE_OPTIONS="--require ./node-compat.cjs"` for Node.js compatibility. Do not remove this.

## Environment

- `ANTHROPIC_API_KEY` — If set, uses Claude claude-haiku-4-5 for real generation. If missing, falls back to `MockLanguageModel` (static demo output).
- `JWT_SECRET` — Defaults to `"development-secret-key"` if not set.

## Architecture

1. Simple Web Application where users can pay for one or many courses. They can also login and view videos and notes for the courses they have paid for. 
2. Vercel Postgres Database 
3. Prisma
4. Resend for emails
5. Stripe for Payments
6. CloudFlare R2 (file storage)
7. Upstash Redis (Rate Limiting)

### Data Flow
1. User logs in using secure MFA authentication. 
2. User views videos and notes for the courses they paid for. 


### Key Abstractions


### Database

Postgres via Vercel. The schema is defined in `prisma/schema.prisma` — reference it any time you need to understand the structure of stored data. Two models: `User` (email/password) and `Project` (name, userId, `messages` as JSON string, `data` as serialized VirtualFileSystem JSON). Run `npx prisma studio` to inspect data.

### Directory Structure



## Project Overview
<!-- Describe the project purpose, tech stack, and goals here -->

## Architecture
<!-- Outline the high-level architecture and key design decisions -->

## Development Workflow
<!-- Describe how to build, run, and test the project -->

## Key Conventions
<!-- List important coding standards and patterns Claude should follow -->

## Git 
NEVER commit .env.local to git.
