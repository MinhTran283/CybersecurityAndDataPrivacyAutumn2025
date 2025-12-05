// app.js
// Deno server with simple JWT-based authentication & role checks
// deno run --allow-net --allow-read --watch app.js
import {
  create,
  verify,
  getNumericDate,
} from "https://deno.land/x/djwt@v3.0.2/mod.ts";

// Hard-coded users for the demo
const users = [
  { username: "alice", password: "alice123", role: "user" },
  { username: "admin", password: "admin123", role: "admin" },
];

// HMAC key for signing/verification
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-256" },
  true,
  ["sign", "verify"],
);

// Helper: JSON response
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// Helper: 401 response
function unauthorized(message = "Unauthorized") {
  return json({ error: message }, 401);
}

// Helper: serve static files
async function serveFile(path, contentType) {
  try {
    const file = await Deno.readFile(path);
    return new Response(file, {
      headers: { "content-type": contentType },
    });
  } catch {
    return new Response("File not found", { status: 404 });
  }
}

// Main server
Deno.serve({ port: 9000 }, async (req) => {
  const url = new URL(req.url);

  // --- Static pages ---
  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    return serveFile("index.html", "text/html; charset=utf-8");
  }
  if (req.method === "GET" && url.pathname === "/users.html") {
    return serveFile("users.html", "text/html; charset=utf-8");
  }
  if (req.method === "GET" && url.pathname === "/admin.html") {
    return serveFile("admin.html", "text/html; charset=utf-8");
  }

  // --- API: login ---
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

    const payload = {
      sub: user.username,
      role: user.role,
      // token valid for 1 hour
      exp: getNumericDate(60 * 60),
    };

    const header = { alg: "HS256", typ: "JWT" };

    const token = await create(header, payload, key);

    return json({
      token,
      user: { username: user.username, role: user.role },
    });
  }

  // --- API: check access for a resource (users/admin) ---
  if (req.method === "GET" && url.pathname === "/api/check") {
    const resource = url.searchParams.get("resource") ?? "users";

    const auth = req.headers.get("authorization") ?? "";
    if (!auth.startsWith("Bearer ")) {
      return unauthorized("Missing or invalid Authorization header");
    }
    const token = auth.slice(7);

    let payload;
    try {
      payload = await verify(token, key);
    } catch {
      return unauthorized("Invalid or expired token");
    }

    const role = payload.role;

    if (resource === "users") {
      // users.html → both user and admin allowed
      if (role === "user" || role === "admin") {
        return json({ ok: true, payload });
      }
      return unauthorized("Insufficient role");
    }

    if (resource === "admin") {
      // admin.html → only admin allowed
      if (role === "admin") {
        return json({ ok: true, payload });
      }
      return unauthorized("Admin role required");
    }

    return json({ error: "Unknown resource" }, 400);
  }

  return new Response("Not found", { status: 404 });
});
