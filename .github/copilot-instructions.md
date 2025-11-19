Purpose
-------
Short, actionable guidance to help an AI coding agent be productive in this Finovo Next.js project.

Key facts (big picture)
-----------------------
- This is a Next.js 14 application using the app/ directory (server components by default). See `app/layout.tsx`, `app/page.tsx` and the nested routes under `app/`.
- Auth and persistent user data are handled via Supabase. Server-side helpers live in `lib/supabase/` (`server.ts`, `client.ts`, `middleware.ts`). Middleware for session refresh uses `middleware.ts` which calls `lib/supabase/middleware.updateSession`.
- AI features: streaming chat endpoint implemented at `app/api/ask-question/route.ts` using OpenAI/OpenAI SDK (server-side). Frontend pages call `/api/ask-question` (see `app/ai-assistant/page.tsx`).
- Payments: Razorpay integration. Server order creation at `app/api/razorpay/route.ts` and client component `components/RazorpayCheckout.tsx`. Verification endpoint exists at `app/api/razorpay/verify.ts`.

Important workflows & commands
----------------------------
- Local dev: `npm run dev` (uses `next dev`). Build: `npm run build`. Start prod server: `npm run start`.
- Lint: `npm run lint`.
- Environment: uses Next.js env vars. Critical env keys observed:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `OPENAI_API_KEY` (used by `app/api/ask-question/route.ts`)
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (used by Razorpay routes and client)

Project-specific patterns and gotchas
-----------------------------------
- App directory conventions: many server components call `createServerClient()` (see `lib/supabase/server.ts`) to query Supabase on the server. For client-side interactions use `lib/supabase/client.ts` -> `createClient()`.
- Middleware cookie handling: `lib/supabase/middleware.ts` carefully proxies Supabase cookies. Avoid calling supabase.auth.getUser() between client creation and cookie synchronization (see comments in the file).
- Razorpay: the client-side component expects the Razorpay checkout script to be present in the page head (the project adds it in admin layouts). If adding Razorpay to other pages, ensure you include
  <script src="https://checkout.razorpay.com/v1/checkout.js" />
  or add it to `app/layout.tsx`.
- AI streaming: `app/api/ask-question/route.ts` streams tokens to the client using the OpenAI SDK's streaming interface — preserve the streaming approach when adjusting the handler (do not convert to a simple non-streaming response unless intentionally simplifying behavior).
- Environment exposure: server routes use `process.env.OPENAI_API_KEY` and `RAZORPAY_KEY_SECRET` (do NOT leak these into browser bundles). Public Razorpay key uses NEXT_PUBLIC_* prefix.

Files to reference when making changes (examples)
----------------------------------------------
- Supabase server helpers: `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/middleware.ts`
- Middleware wiring: `middleware.ts`
- AI endpoint: `app/api/ask-question/route.ts` and the frontend caller `app/ai-assistant/page.tsx`
- Razorpay: `app/api/razorpay/route.ts`, `app/api/razorpay/verify.ts`, and `components/RazorpayCheckout.tsx`. Admin layouts already add the Razorpay script (see `app/admin/layout.tsx`).
- App entry points: `app/layout.tsx`, `app/page.tsx` (global CSS & analytics)

How to change API behavior safely
--------------------------------
- When modifying server API routes under `app/api/*` remember these are server-only. Use NextResponse/Response return types and avoid referencing browser-only globals (window, document).
- For streaming endpoints (ask-question), keep the ReadableStream pattern and TextEncoder usage. If you change model names or model configuration, update the client-side caller to match.

Quick debugging tips
--------------------
- To reproduce auth/session issues: check `middleware.ts` + `lib/supabase/middleware.ts` — missing cookie propagation is the usual cause.
- Razorpay order creation failures usually show in server logs; verify `RAZORPAY_KEY_SECRET` is set and that amounts are converted to the smallest currency unit (paise) — `app/api/razorpay/route.ts` already rounds amount * 100.
- For AI errors: check `OPENAI_API_KEY` and the model name in `app/api/ask-question/route.ts` (it uses `gpt-4o-mini` by default).

Notes for AI agents
-------------------
- Prefer editing files in place and preserve the app-dir server/client boundary. When converting a component to client-side code add `'use client'` at the top and ensure any server-only imports (supabase server helpers, fs, etc.) are removed.
- Use exact file paths when suggesting edits. Link to the files above when describing changes.
- Keep changes minimal and test with `npm run dev`; include env var guidance in any PR or commit message.

If anything is unclear
----------------------
Ask the repo owner for:
- the intended OpenAI model (if gpt-4o or different) and API quota expectations
- Supabase project credentials (for local dev .env.local guidance)
- whether Razorpay script should be promoted to the global `app/layout.tsx` for site-wide availability

---
If you want, I can open a PR that adds this file and include a short checklist for onboarding (env file template, seed steps from `scripts/`, and local Supabase guidance).
