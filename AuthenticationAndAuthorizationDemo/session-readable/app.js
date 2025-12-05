// app.js
// Deno server with simple session + cookie based authentication
// deno run --allow-net --allow-read --watch app.js

// In-memory session store (for demo only)
const sessions = new Map(); // sessionId -> { username, role, createdAt }

// Hard-coded users
const users = [
  { username: "alice", password: "alice123", role: "user" },
  { username: "admin", password: "admin123", role: "admin" },
];

// Helpers
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
  const session = {
    username,
    role,
    createdAt: new Date().toISOString(),
  };
  sessions.set(sessionId, session);
  return { sessionId, session };
}

function destroySession(sessionId) {
  sessions.delete(sessionId);
}

// ---------- Main server ----------

Deno.serve({ port: 9001 }, async (req) => {
  const url = new URL(req.url);

  // Static pages
  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    return serveFile("index.html", "text/html; charset=utf-8");
  }
  if (req.method === "GET" && url.pathname === "/users.html") {
    return serveFile("users.html", "text/html; charset=utf-8");
  }
  if (req.method === "GET" && url.pathname === "/admin.html") {
    return serveFile("admin.html", "text/html; charset=utf-8");
  }

  // -------- API: login --------
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

    // Set cookie for 1 hour
    const headers = {
      "Set-Cookie":
        `session_id=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`,
    };

    return json(
      { user: { username: session.username, role: session.role } },
      200,
      headers,
    );
  }

  // -------- API: logout --------
  if (req.method === "POST" && url.pathname === "/api/logout") {
    const cookies = parseCookies(req);
    const sessionId = cookies["session_id"];

    if (sessionId) {
      destroySession(sessionId);
    }

    // Invalidate cookie
    const headers = {
      "Set-Cookie":
        "session_id=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
    };

    return json({ ok: true, message: "Logged out" }, 200, headers);
  }

  // -------- API: session info (for demo) --------
  if (req.method === "GET" && url.pathname === "/api/session") {
    const cookies = parseCookies(req);
    const sessionId = cookies["session_id"];

    if (!sessionId) {
      return unauthorized("No session cookie");
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return unauthorized("Session not found or expired");
    }

    return json({
      sessionId,
      session,
    });
  }

  // -------- API: check access for resource --------
  if (req.method === "GET" && url.pathname === "/api/check") {
    const resource = url.searchParams.get("resource") ?? "users";
    const cookies = parseCookies(req);
    const sessionId = cookies["session_id"];

    if (!sessionId) {
      return unauthorized("No session cookie");
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return unauthorized("Session not found or expired");
    }

    const { role, username } = session;

    if (resource === "users") {
      if (role === "user" || role === "admin") {
        return json({ ok: true, username, role });
      }
      return unauthorized("Insufficient role");
    }

    if (resource === "admin") {
      if (role === "admin") {
        return json({ ok: true, username, role });
      }
      return unauthorized("Admin role required");
    }

    return json({ error: "Unknown resource" }, 400);
  }

  return new Response("Not found", { status: 404 });
});
