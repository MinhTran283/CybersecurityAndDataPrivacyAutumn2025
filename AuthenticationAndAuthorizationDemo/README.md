# 🔐 Authentication Architecture Variants

This document describes **three common authentication architectures** used in modern web applications. All three approaches can be implemented using **Deno**, **Tailwind-based HTML frontends**, and similar routing/layout logic — but the *security properties differ significantly*.

The purpose of this document is to help students and developers understand **when and why** to choose one pattern over another.

---

# 1. 🟦 JWT-Based Authentication (Client-Side Token)

### ✔️ Overview

In this model:

* The server issues a **JWT (JSON Web Token)** after login.
* The browser stores the token in:

  * `localStorage`, or
  * an accessible cookie (**not** recommended for production).

The client can **decode** the JWT since it is only *signed*, not encrypted.
The signature prevents tampering, but **anyone can read the payload**.

### ✔️ Typical Workflow

1. User logs in.
2. Server signs JWT with HS256 key:

   ```json
   {
     "sub": "alice",
     "role": "admin",
     "exp": 1699999999
   }
   ```
3. Browser stores token.
4. Each protected request includes:

   ```
   Authorization: Bearer <token>
   ```
5. Client-side JS can decode and display payload.

### ✔️ Strengths

* Stateless — server does **not store sessions**.
* Easy horizontal scaling.
* Very flexible for SPAs and API-heavy systems.
* Client can inspect payload — great for demo use.

### ❌ Weaknesses

* Token remains valid until expiration unless revoked externally.
* Sensitive data must **never** be stored in JWT payload.
* If stored in localStorage → vulnerable to XSS.
* Token leakage grants full access until expiry.

### 📝 Use When

* Building APIs or microservices.
* Stateless architectures.
* You want the **client to inspect the token** (good for education).

---

# 2. 🟩 Session + Cookie Authentication (Readable Session Endpoint)

### ✔️ Overview

This architecture uses:

* A server-side **session store**
* A `session_id` cookie used to reference session data
* A `/api/session` endpoint that **returns session info** to the client

This feels similar to JWT-demo in the UI, because the frontend can *display* session details.

**BUT:** The token itself is not exposed — the session ID is a random UUID.

### ✔️ Typical Workflow

1. User logs in.
2. Server creates:

   ```json
   {
     "sessionId": "UUID",
     "username": "alice",
     "role": "user",
     "createdAt": "..."
   }
   ```
3. Server sets cookie:

   ```
   Set-Cookie: session_id=<UUID>; HttpOnly; SameSite=Lax; Path=/;
   ```
4. Client requests:

   ```
   GET /api/session
   ```
5. Server *returns* session details (not cookie value).

### ✔️ Strengths

* More secure than storing JWT in localStorage.
* Server controls session lifecycle → easy logout.
* Full control of session invalidation.
* **Safer than JWT for typical web apps**, unless SPA is required.

### ❌ Weaknesses

* Still slightly depends on a readable `/api/session` endpoint.
* Server must maintain session store (stateful).
* Scaling requires shared session storage (Redis etc.)

### 📝 Use When

* You want a **beginner-friendly demo** similar to JWT flow.
* You want server-side logout.
* You want safer behavior than localStorage JWTs.
* You want to *show* session info visually in UI.

---

# 3. 🟥 Secure HttpOnly Session Cookies (Production-Grade)

### ✔️ Overview

This is the **standard approach** used by:

* Django
* Rails
* Spring
* ASP.NET
* Express (with secure config)
* Most real enterprise web systems

The difference from variant #2 is:

> **The browser cannot read or decode the session cookie — ever.**
>
> No JS access. No decoding.
> Only the server knows the session contents.

This is the **most secure and recommended** option for traditional websites.

### ✔️ Typical Workflow

1. User logs in.
2. Server creates session in memory/database.
3. Server sends cookie:

```
Set-Cookie: session_id=UUID;
    HttpOnly;
    Secure;
    SameSite=Strict;
    Path=/;
```

4. Browser automatically sends cookie on each request.
5. Client cannot fetch session content.
6. Protected pages require server-side checks:

   ```
   /api/check?resource=admin
   ```

### ✔️ Strengths

* **Best protection against XSS** (JavaScript cannot read cookies).
* Server fully controls session lifetime.
* Easy invalidation + forced logout.
* No token leakage to browser storage.
* Industry-standard for monolithic or SSR web apps.

### ❌ Weaknesses

* Cannot display session payload in client UI.
* Requires stateful session store.
* Not ideal for pure API backend unless combined with CSRF.

### 📝 Use When

* Security is important → **default choice**.
* Building traditional web apps.
* Building admin panels or dashboards.
* You need strong XSS defense.

---

# Comparison Table

| Feature                         | JWT         | Session + Cookie                                   | Secure HttpOnly Session Cookie |
| ------------------------------- | ----------- | -------------------------------------------------- | ------------------------------ |
| Server stores session?          | ❌ No        | ✔️ Yes                                             | ✔️ Yes                         |
| Token readable by JS?           | ✔️ Yes      | ❌ Cookie no, but `/api/session` can reveal details | ❌ No                           |
| Best protection vs XSS          | ❌ Weak      | ➖ Moderate                                         | ✔️ Strong                      |
| Stateless?                      | ✔️ Yes      | ❌ No                                               | ❌ No                           |
| Logout immediate?               | ❌ Hard      | ✔️ Easy                                            | ✔️ Easy                        |
| Good for APIs?                  | ✔️ Yes      | ❌ Mostly no                                        | ❌ Mostly no                    |
| Good for classic web apps?      | ➖ Sometimes | ✔️ Good                                            | ⭐ Excellent                    |
| Can user inspect identity info? | ✔️ Yes      | ✔️ Yes (via API)                                   | ❌ No                           |

---

# Which Should we Learn?

| Learning Goal                         | Recommended Variant     |
| ------------------------------------- | ----------------------- |
| Understand token structure            | JWT                     |
| Understand client vs server trust     | JWT + Sessions          |
| Understand production security        | HttpOnly Secure Cookies |
| Demonstrate role-based access control | All                     |
| Demonstrate security pitfalls         | JWT in localStorage     |

---

# Suggested Folder Structure

```text
demo-auth/
│
├─ jwt-demo/
│  ├─ app.js
│  ├─ index.html
│  ├─ users.html
│  └─ admin.html
│
├─ session-readable/
│  ├─ app.js
│  ├─ index.html
│  ├─ users.html
│  └─ admin.html
│
└─ session-secure/
   ├─ app.js
   ├─ index.html
   ├─ public.html
   ├─ users.html
   └─ admin.html
```

Each demo has the **same UI layout**, making differences easy to compare.

---

# 📝 HTML Forms & CSRF Protection — Overview

Modern web applications frequently use **HTML forms** to submit data to the server.
A form can look like this:

```html
<form action="/api/contact" method="POST">
  <input type="text" name="message" />
  <button type="submit">Send</button>
</form>
```

When the user clicks **Submit**, the browser automatically sends:

* the form data
* all cookies for that site (including session cookies)

This automatic behaviour is important, but it also creates a major security issue called **Cross-Site Request Forgery (CSRF)**.

---

## ⚠️ What is CSRF and Why Is It Dangerous?

CSRF is an attack where:

1. The user is logged into your site (has a valid session cookie).
2. An attacker tricks the user into visiting a malicious page.
3. The malicious page silently sends a POST request to your application.
4. The browser includes the user’s **real session cookies** automatically.
5. Your server thinks *the user* made the request.

Example attack scenario:

* A logged-in user visits an attacker’s site.

* The attacker has a hidden form that submits a POST request to:

  ```
  POST /api/delete-account
  ```

* The browser attaches the victim’s **session_id** cookie automatically.

* If the server does not check for CSRF tokens, it cannot distinguish the attacker’s request from the real user’s request.

👉 **CSRF exploits the browser’s automatic cookie behavior.**

---

## 🔒 CSRF Protection: Core Principles

To defend against CSRF, web frameworks follow three universal principles:

### 1. The server generates a unique CSRF token

A cryptographically random value tied to a session or issued anonymously.

### 2. The token is sent to the client *outside* cookies

For example:

```json
{ "csrfToken": "123e..." }
```

Or inside HTML:

```html
<input type="hidden" name="csrf" value="123e..." />
```

### 3. The client must send the token back explicitly

The token **must not** be sent automatically by the browser.

Common methods:

* Hidden field:

  ```html
  <input type="hidden" name="csrf" value="...">
  ```
* Custom header:

  ```js
  fetch("/api/submit", {
    method: "POST",
    headers: { "X-CSRF-Token": csrfToken },
    body: ...
  });
  ```

### 4. The server validates the token

When receiving the request, the server checks:

* Does the token from the header or form match
* the token stored in the session or cookie?

If not → `403 Forbidden`.

This ensures that:

👉 Only pages that legitimately received the token from your server
👉 can successfully perform state-changing actions.

---

## 🟦 CSRF in the Demo Architecture

Your demos implement CSRF in two ways:

### Demo 2 (Secure Session Model)

* Logged-in users receive a CSRF token tied to their session.
* They must include this token in any POST request.
* The server validates it before performing actions.

### Anonymous CSRF-Protected Form

A separate public page uses the **double-submit cookie pattern**:

1. Backend issues a `csrf_anon` cookie.
2. Backend also returns the same token in JSON.
3. The frontend must add the token in a custom header:

   ```
   X-CSRF-Token: <token>
   ```
4. Server checks:

   ```
   cookie.csrf_anon === header.X-CSRF-Token
   ```

If they don’t match → reject request.

This protects anonymous forms (contact forms, newsletter signups, etc.) even **without sessions**.

---

## ✔️ Why CSRF Protection Matters with Sessions

Session cookies (especially HttpOnly cookies) are:

* automatically attached by the browser
* invisible to JavaScript
* **still vulnerable** to CSRF without a token

Therefore:

> **Session-based authentication requires CSRF protection for any POST/PUT/PATCH/DELETE request.**

This is why your secure demo includes a CSRF flow:
It models real frameworks (Django, Rails, Spring Security, Laravel), which *all* require CSRF tokens for state-changing requests.

---

## 🎯 Summary

| Feature                                   | Purpose                                                 |
| ----------------------------------------- | ------------------------------------------------------- |
| **HTML Form**                             | Sends user input + automatically attaches all cookies   |
| **CSRF Attack**                           | Abuse of automatic cookie sending from a malicious site |
| **CSRF Token**                            | A secret value the attacker cannot obtain               |
| **Validation**                            | Server rejects any request missing a valid CSRF token   |
| **Anonymous CSRF (double-submit cookie)** | Protects public forms without requiring login           |

---

# 😕 *Does CSRF always require the use of sessions?"*

**No**, CSRF protection does **not always require sessions**, but sessions are the most common and convenient way to store and validate tokens. Here’s why and what alternatives exist:

## ⚡ Why Sessions Are Common

*   Sessions provide a secure, server-side storage mechanism tied to a user.
*   The CSRF token can be stored in the session and compared when the form is submitted.
*   This avoids exposing the token in places attackers can easily access.

---

## 🎓 Alternatives to Sessions

If you don’t want to use sessions, you can still implement CSRF protection using other approaches:

### 👍 Stateless Token Approach

*   Generate a token that encodes user-specific data (e.g., user ID, timestamp) and sign it with a secret key.
*   Example: Use an HMAC or JWT.
*   The server validates the signature instead of looking up a session.
*   This works well for APIs or stateless architectures.

### 👉 Double-Submit Cookie Pattern

*   Send a CSRF token in a cookie and also include it in the form as a hidden field.
*   On submission, the server checks if the token in the form matches the token in the cookie.
*   Important: The cookie must be **HTTP-only disabled** for the token to be readable by JavaScript, but the main session cookie should remain HTTP-only.
*   This method does not require server-side storage.

---

## 🎯 Trade-offs

*   **Session-based tokens**: Simple, secure, but require session management.
*   **Stateless tokens**: Good for distributed systems, but slightly more complex.
*   **Double-submit cookies**: Avoids sessions, but requires careful handling of cookies and HTTPS.

---
