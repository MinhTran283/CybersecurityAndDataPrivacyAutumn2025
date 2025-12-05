// app.js
// Secure-ish session demo with HttpOnly cookies (no client-side access to session cookie)
// + Anonymous CSRF-protected public form
// deno run --allow-net --allow-read --watch app.js

// In-memory session storage (for demo only)
const sessions = new Map(); // sessionId -> { username, role, csrfToken, createdAt }

// Hard-coded demo users
const users = [
  { username: "alice", password: "alice123", role: "user" },
  { username: "admin", password: "admin123", role: "admin" },
];

// ---------- Helper functions ----------

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function unauthorized(message = "Unauthorized") {
  return json({ error: message }, 401);
}

async function serveFile(path, contentType) {
  try {
    const data = await Deno.readFile(path);
    return new Response(data, {
      headers: { "content-type": contentType },
    });
  } catch {
    return new Response("File not found", { status: 404 });
  }
}

function parseCookies(req) {
  const header = req.headers.get("cookie") || "";
  const cookies = {};
  header.split(";").forEach((pair) => {
    const [name, ...rest] = pair.trim().split("=");
    if (!name) return;
    cookies[name] = decodeURIComponent(rest.join("="));
  });
  return cookies;
}

function createSession(username, role) {
  const sessionId = crypto.randomUUID();
  const csrfToken = crypto.randomUUID(); // CSRF tied to session

  const session = {
    username,
    role,
    csrfToken,
    createdAt: new Date().toISOString(),
  };
  sessions.set(sessionId, session);
  return { sessionId, session };
}

function destroySession(sessionId) {
  sessions.delete(sessionId);
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req);
  const sessionId = cookies["session_id"];
  if (!sessionId) return null;
  const session = sessions.get(sessionId);
  if (!session) return null;
  return { sessionId, session };
}

// ---------- Main server ----------

Deno.serve({ port: 9002 }, async (req) => {
  const url = new URL(req.url);

  // ---- Static pages ----
  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    return serveFile("index.html", "text/html; charset=utf-8");
  }
  if (req.method === "GET" && url.pathname === "/users.html") {
    return serveFile("users.html", "text/html; charset=utf-8");
  }
  if (req.method === "GET" && url.pathname === "/admin.html") {
    return serveFile("admin.html", "text/html; charset=utf-8");
  }
  // New anonymous page
  if (req.method === "GET" && url.pathname === "/public.html") {
    return serveFile("public.html", "text/html; charset=utf-8");
  }

  // ---- API: login ----
  if (req.method === "POST" && url.pathname === "/api/login") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const { username, password } = body;
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return unauthorized("Invalid username or password");
    }

    const { sessionId, session } = createSession(user.username, user.role);

    // NOTE:
    // In production you would add "Secure;" as well, but that requires HTTPS.
    const headers = {
      "Set-Cookie":
        `session_id=${encodeURIComponent(sessionId)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600`,
    };

    return json(
      { message: "Login successful", username: session.username, role: session.role },
      200,
      headers,
    );
  }

  // ---- API: logout ----
  if (req.method === "POST" && url.pathname === "/api/logout") {
    const cookies = parseCookies(req);
    const sessionId = cookies["session_id"];

    if (sessionId) {
      destroySession(sessionId);
    }

    const headers = {
      "Set-Cookie":
        "session_id=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
    };

    return json({ message: "Logged out" }, 200, headers);
  }

  // ---- API: simple status (for index page only) ----
  // Returns *minimal* info: loggedIn true/false and username if logged in.
  // Now also returns session-based CSRF token (for logged-in actions if needed).
  if (req.method === "GET" && url.pathname === "/api/status") {
    const sessionData = getSessionFromRequest(req);
    if (!sessionData) {
      return json({ loggedIn: false });
    }
    const { session } = sessionData;
    return json({
      loggedIn: true,
      username: session.username,
      role: session.role,
      csrf: session.csrfToken,
    });
  }

  // ---- API: access check for protected pages ----
  if (req.method === "GET" && url.pathname === "/api/check") {
    const resource = url.searchParams.get("resource") ?? "users";

    const sessionData = getSessionFromRequest(req);
    if (!sessionData) {
      return unauthorized("No valid session");
    }

    const { session } = sessionData;

    if (resource === "users") {
      if (session.role === "user" || session.role === "admin") {
        // return minimal info, not whole session object
        return json({ ok: true });
      }
      return unauthorized("Insufficient role");
    }

    if (resource === "admin") {
      if (session.role === "admin") {
        return json({ ok: true });
      }
      return unauthorized("Admin role required");
    }

    return json({ error: "Unknown resource" }, 400);
  }

  // ============================
  // Anonymous CSRF-protected API
  // ============================

  // 1) Issue anonymous CSRF token (no login required)
  if (req.method === "GET" && url.pathname === "/api/csrf-anon") {
    const csrfToken = crypto.randomUUID();

    // Double-submit cookie pattern: token in cookie + JSON body.
    // Cookie is NOT HttpOnly, so frontend could read it if needed,
    // but protection comes from the fact that attacker cannot set both
    // cookie and custom header from another origin.
    const headers = {
      "Set-Cookie":
        `csrf_anon=${encodeURIComponent(csrfToken)}; SameSite=Lax; Path=/; Max-Age=600`,
    };

    return json({ csrfToken }, 200, headers);
  }

  // 2) Anonymous POST endpoint that requires valid CSRF token
  if (req.method === "POST" && url.pathname === "/api/public-message") {
    const cookies = parseCookies(req);
    const cookieToken = cookies["csrf_anon"];
    const headerToken = req.headers.get("X-CSRF-Token");

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return new Response("Invalid CSRF token", { status: 403 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const { message } = body;

    // In a real app you might store the message to DB, send email, etc.
    console.log("Anonymous message received:", message);

    return json({ ok: true, message: "Thank you for your message!" });
  }

  return new Response("Not found", { status: 404 });
});
