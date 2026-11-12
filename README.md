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

The current preview uses the Worker named `nps-hub` at https://hub-preview.nickspianoservices.com/. The production domain still serves the older hub.

## Deployment status

Source was published to GitHub on November 12, 2026. Deployment currently uses the Cloudflare API. GitHub push-to-deploy has not been configured.

Admin and viewer login, remembered sessions, role visibility, logout, and admin session revocation passed live HTTP checks using temporary test credentials. Permanent credentials and an owner browser login remain pending before production cutover.
