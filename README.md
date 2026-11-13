# NPS Hub

Independent hub for Nick’s Piano Services, built directly as a Cloudflare Worker.

## Application

`worker.mjs` serves the login page and tool dashboard. It verifies admin and viewer passwords using Cloudflare secrets and stores hashed session tokens in D1.

Trusted browsers receive a secure, HttpOnly cookie lasting 30 days. Other sessions use a browser-session cookie with a 12-hour server expiry. Admins can revoke every admin session through Manage sign-ins.

The dashboard currently carries forward the original tool links. Some destinations still run on Lovable. The hub itself has no Lovable or Supabase runtime dependency.

## Cloudflare setup

Deploy `worker.mjs` as the module entry point with compatibility date `2026-11-12`.

Required bindings are listed below.

| Binding | Type | Configuration |
| --- | --- | --- |
| SESSIONS | D1 | Apply schema.sql to the database |
| LOGIN_LIMIT | Rate limit | 8 attempts per 60 seconds, dedicated namespace |
| HUB_ADMIN_PASSWORD | Secret | Owner password |
| HUB_VIEWER_PASSWORD | Secret | Viewer password |

Configure secrets directly in Cloudflare. Enable Worker logs and traces. The repository contains no credentials.

The current preview uses the Worker named `nps-hub` at https://hub-preview.nickspianoservices.com/. The main domain https://hub.nickspianoservices.com/ was assigned to this Worker on November 13, 2026. DNS caches may temporarily serve the previous site.

## Deployment status

Source was published to GitHub on November 12, 2026. Deployment uses the Cloudflare API. Run `node scripts/deploy.mjs` with Node.js 22 or newer, `CLOUDFLARE_ACCOUNT_ID`, and a scoped `CLOUDFLARE_API_TOKEN`. The script preserves the existing password secret bindings.

Cloudflare Builds can use `node --check worker.mjs` as the build command and `node scripts/deploy.mjs` as the deploy command, with repository root `/` and branch `main`. Automatic GitHub deployment remains pending. After authorization, the build-token list was empty and the repository connection API returned HTTP 500 on two attempts. Direct API deployment is available.

The owner password was replaced with explicit approval on November 13, 2026 and verified on the preview. The value is held in a Cloudflare secret and supplied privately to the owner.

Admin and viewer login, remembered sessions, role visibility, logout, and admin session revocation passed live HTTP checks using temporary test credentials. The permanent owner password and 30-day session cookie were verified through live HTTP requests on the preview on November 13. The main-domain route is configured. End-to-end checks through the current network still encounter cached DNS for the former host.
