const sections = {
  "Main Site": [
    {
      "title": "Nick's Piano Services",
      "url": "https://www.nickspianoservices.com",
      "description": "Main public website"
    }
  ],
  "Admin Tools": [
    {
      "title": "Workshop",
      "url": "https://pianorenovationlog.lovable.app",
      "description": "Piano restoration management"
    },
    {
      "title": "CRM",
      "url": "https://piano-pulse-crm.lovable.app/",
      "description": "Client pipeline"
    },
    {
      "title": "Clear Focus",
      "url": "https://nickscleartask.lovable.app",
      "description": "Tasks, focus, daily work"
    },
    {
      "title": "NPS Pulse",
      "url": "https://piano-pulse.lovable.app/",
      "description": "Piano telemetry diagnostics"
    },
    {
      "title": "The Field",
      "url": "https://the-field.lovable.app/",
      "description": "Research archive"
    },
    {
      "title": "Piano Books / Finance",
      "url": "https://piano-ledger.lovable.app/",
      "description": "Bookkeeping and publications"
    },
    {
      "title": "Scoop (Admin)",
      "url": "https://financial-banana-split-ai.lovable.app/admin",
      "description": "Scoop admin panel"
    }
  ],
  "Shared Tools": [
    {
      "title": "Scoop / FBS",
      "url": "https://financial-banana-split-ai.lovable.app/",
      "description": "Financial Banana Split AI"
    },
    {
      "title": "Sensor Field Monitor",
      "url": "https://sense-truth-matrix.lovable.app/dashboard",
      "description": "Sound and frequency sensor"
    },
    {
      "title": "Collab Hub",
      "url": "https://nps-collab-hub.lovable.app",
      "description": "Content creator workspace"
    },
    {
      "title": "The Rosetta Key",
      "url": "https://therosettakey.com",
      "description": "Music notation translator"
    }
  ]
};

const cookieName = "__Host-nps-hub";
const normalSeconds = 12 * 60 * 60;
const trustedSeconds = 30 * 24 * 60 * 60;
const maxFormBytes = 8192;

const style = `
  :root { color-scheme: dark; --bg:#0d0d0d; --surface:#1a1a1a; --line:#2a2a2a;
    --text:#f5f0e8; --muted:#9ca3af; --gold:#c8952a; }
  * { box-sizing:border-box }
  body { margin:0; background:var(--bg); color:var(--text); font:1rem system-ui,sans-serif }
  h1,h2,h3 { font-family:Georgia,serif; margin:0 }
  a { color:inherit; text-decoration:none }
  button,input { font:inherit }
  button { cursor:pointer }
  a:focus-visible,input:focus-visible,button:focus-visible { outline:2px solid var(--gold); outline-offset:4px }
  .login { min-height:90svh; display:grid; place-items:center; padding:1.5rem }
  .panel { width:min(100%,28rem); border:1px solid var(--line); border-radius:.8rem;
    background:var(--surface); padding:clamp(1.5rem,6vw,2.5rem); box-shadow:0 16px 50px #0008 }
  .panel h1 { text-align:center; font-size:3.75rem }
  .eyebrow { color:var(--gold); font: .75rem ui-monospace,monospace; letter-spacing:.18em; text-transform:uppercase }
  .center { text-align:center }
  .subtitle { color:var(--muted); font:italic 1rem Georgia,serif; margin-bottom:2rem }
  label { display:block }
  input[type=password] { width:100%; background:var(--bg); border:1px solid var(--line);
    border-radius:.4rem; color:var(--text); padding:.75rem; margin:.4rem 0 1rem }
  .remember { display:flex; align-items:center; gap:.6rem; line-height:1.4; font-size:.9rem }
  .remember input { accent-color:var(--gold); width:1.05rem; height:1.05rem; flex:none }
  .primary { margin-top:1.1rem; background:var(--gold); color:var(--bg); font-weight:700;
    border:0; border-radius:.4rem; padding:.75rem; width:100% }
  .error { color:#ff9a8a; margin:0 0 1rem; font-size:.9rem }
  header { border-bottom:1px solid var(--line) }
  .bar, .hub { width:min(100% - 3rem,72rem); margin:auto }
  .bar { display:flex; justify-content:space-between; align-items:center; gap:.75rem; padding:1rem 0 }
  .bar h1 { font-size:1.65rem; color:var(--gold) }
  .actions { display:flex; align-items:center; flex-wrap:wrap; justify-content:flex-end; gap:.65rem }
  .role { color:var(--gold); border:1px solid var(--gold); border-radius:.3rem; padding:.25rem .5rem;
    text-transform:uppercase; font: .72rem ui-monospace,monospace; letter-spacing:.08em }
  .quiet { color:var(--text); background:transparent; border:1px solid var(--line);
    border-radius:.4rem; padding:.5rem .65rem; font-size:.85rem }
  .quiet:hover { background:var(--surface) }
  .hub { padding:2rem 0 1rem }
  section { margin-bottom:2.2rem }
  h2 { color:var(--gold); margin-bottom:1rem; font-size:1.35rem }
  .tiles { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr)); gap:1rem }
  .tile { position:relative; display:block; border:1px solid var(--line); border-radius:.6rem;
    background:var(--surface); padding:1.15rem 2.1rem 1.15rem 1.15rem; max-width:25rem }
  .tile:hover { border-color:var(--gold) }
  .tile h3 { font-size:1.1rem }
  .tile p { color:var(--muted); font-size:.9rem; margin:.4rem 0 0 }
  .tile span { position:absolute; right:1rem; top:1rem; color:var(--gold) }
  footer { text-align:center; color:var(--muted); padding:1rem 1.5rem 2rem; font-size:.75rem }
  @media (max-width:32rem) { .bar,.hub { width:calc(100% - 2rem) } .actions { gap:.35rem } }
`;

function escapeHtml(value) {
  const characters = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (character) => characters[character]);
}

function headers(extra = {}) {
  return {
    "Cache-Control": "private, no-store",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
    ...extra,
  };
}

function page(content, status = 200) {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>NPS Hub | Nick's Piano Services</title><style>${style}</style></head><body>
    ${content}<footer>© Nick’s Piano Services LLC</footer></body></html>`, {
    status,
    headers: headers({ "Content-Type": "text/html; charset=utf-8" }),
  });
}

function loginPage(message = "", status = 200, notice = "") {
  return page(`<main class="login"><div class="panel">
    <p class="eyebrow center">Nick’s Piano Services</p><h1>NPS</h1>
    <p class="subtitle center">Restoring Pianos. Continuing Music.</p>
    ${message ? `<p class="error" role="alert">${escapeHtml(message)}</p>` : ""}
    ${notice ? `<p role="status">${escapeHtml(notice)}</p>` : ""}
    <form method="post" action="/sign-in">
      <input type="hidden" name="username" value="nps-hub" autocomplete="username">
      <label for="password">Hub password</label>
      <input type="password" id="password" name="password" autocomplete="current-password" required maxlength="1024">
      <label class="remember"><input name="remember" type="checkbox" value="yes">
        Keep me signed in on this browser for 30 days
      </label>
      <button class="primary" type="submit">Sign in</button>
    </form></div></main>`, status);
}

function dashboard(tier) {
  const tiles = Object.entries(sections)
    .filter(([name]) => tier === "admin" || name !== "Admin Tools")
    .map(([name, links]) => `<section><h2>${escapeHtml(name)}</h2><div class="tiles">
      ${links.map(({ title, url, description }) => `<a class="tile" href="${escapeHtml(url)}"
        target="_blank" rel="noopener noreferrer"><h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p><span aria-hidden="true">↗</span></a>`).join("")}
      </div></section>`).join("");
  return page(`<header><div class="bar"><h1>NPS</h1><div class="actions">
    <span class="role">${tier}</span>
    <form method="post" action="/sign-out"><button class="quiet" type="submit">Sign out</button></form>
    ${tier === "admin" ? '<a class="quiet" href="/sessions">Manage sign-ins</a>' : ""}
    </div></div></header><main class="hub">${tiles}</main>`);
}

function sessionSettings() {
  return page(`<main class="login"><div class="panel"><h2>Manage sign-ins</h2>
    <p>Sign out all admin browsers, including this one. Use this if you lose a device.</p>
    <form method="post" action="/sign-out-all"><button class="primary" type="submit">Sign out all admin browsers</button></form>
    <p class="center"><a class="quiet" href="/">Back to hub</a></p></div></main>`);
}

function cookie(value, maxAge) {
  return `${cookieName}=${value}; Path=/; Secure; HttpOnly; SameSite=Lax${maxAge === undefined ? "" : `; Max-Age=${maxAge}`}`;
}

function redirect(location, sessionCookie) {
  return new Response(null, {
    status: 303,
    headers: headers({ Location: location, ...(sessionCookie ? { "Set-Cookie": sessionCookie } : {}) }),
  });
}

const hex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
const now = () => Math.floor(Date.now() / 1000);

async function tokenHash(token) {
  return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token))));
}

async function readSession(request, db) {
  const token = request.headers.get("Cookie")?.match(/(?:^|;\s*)__Host-nps-hub=([a-f0-9]{64})(?:;|$)/)?.[1];
  if (!token) return null;
  const hash = await tokenHash(token);
  const row = await db.prepare("SELECT tier FROM sessions WHERE token_hash = ? AND expires_at > ?")
    .bind(hash, now()).first();
  return row ? { tier: row.tier, hash } : null;
}

async function readForm(request) {
  const format = request.headers.get("Content-Type")?.split(";")[0].trim();
  if (format !== "application/x-www-form-urlencoded" || !request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let length = 0;
  let body = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxFormBytes) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(value, { stream: true });
  }
  return new URLSearchParams(body + decoder.decode());
}

async function verifyPassword(password, env) {
  const encoder = new TextEncoder();
  const digest = (value) => crypto.subtle.digest("SHA-256", encoder.encode(value));
  const [submitted, admin, viewer] = await Promise.all([
    digest(password), digest(env.HUB_ADMIN_PASSWORD ?? ""), digest(env.HUB_VIEWER_PASSWORD ?? ""),
  ]);
  const isAdmin = crypto.subtle.timingSafeEqual(submitted, admin) && Boolean(env.HUB_ADMIN_PASSWORD);
  const isViewer = crypto.subtle.timingSafeEqual(submitted, viewer) && Boolean(env.HUB_VIEWER_PASSWORD);
  if (isAdmin) return "admin";
  if (isViewer) return "viewer";
  return null;
}

async function signIn(request, env, session) {
  const { success } = await env.LOGIN_LIMIT.limit({ key: request.headers.get("CF-Connecting-IP") ?? "unknown" });
  if (!success) return loginPage("Too many attempts. Try again in a minute.", 429);
  const form = await readForm(request);
  const password = form?.get("password");
  if (!password || password.length > 1024) return loginPage("Enter your hub password.", 400);
  if (!env.HUB_ADMIN_PASSWORD) return loginPage("The preview password hasn’t been set yet.", 503);
  const tier = await verifyPassword(password, env);
  if (!tier) return loginPage("That password didn’t match.", 401);
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const hash = await tokenHash(token);
  const trusted = form.get("remember") === "yes";
  const timestamp = now();
  await env.SESSIONS.batch([
    env.SESSIONS.prepare("DELETE FROM sessions WHERE expires_at <= ? OR token_hash = ?").bind(timestamp, session?.hash ?? ""),
    env.SESSIONS.prepare("INSERT INTO sessions (token_hash, tier, expires_at) VALUES (?, ?, ?)")
      .bind(hash, tier, timestamp + (trusted ? trustedSeconds : normalSeconds)),
  ]);
  return redirect("/", cookie(token, trusted ? trustedSeconds : undefined));
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const { pathname, searchParams } = url;
      if (request.method === "POST" && request.headers.get("Origin") !== url.origin) {
        return new Response("Forbidden", { status: 403, headers: headers() });
      }
      const session = await readSession(request, env.SESSIONS);
      if (request.method === "GET" && pathname === "/") {
        if (session) return dashboard(session.tier);
        return loginPage("", 200, searchParams.has("signed-out") ? "Signed out." : "");
      }
      if (request.method === "GET" && pathname === "/sessions") {
        return session?.tier === "admin" ? sessionSettings() : redirect("/");
      }
      if (request.method === "POST" && pathname === "/sign-in") return await signIn(request, env, session);
      if (request.method === "POST" && pathname === "/sign-out") {
        if (session) {
          await env.SESSIONS.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(session.hash).run();
        }
        return redirect("/?signed-out", cookie("", 0));
      }
      if (request.method === "POST" && pathname === "/sign-out-all" && session?.tier === "admin") {
        await env.SESSIONS.prepare("DELETE FROM sessions WHERE tier = 'admin'").run();
        return redirect("/?signed-out", cookie("", 0));
      }
      return new Response("Not found", { status: 404, headers: headers() });
    } catch {
      return loginPage("Sign-in is temporarily unavailable. Try again in a moment.", 503);
    }
  },
};
