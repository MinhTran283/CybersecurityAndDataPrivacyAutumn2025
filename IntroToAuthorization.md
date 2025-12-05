> [!NOTE]
> The material was created with the help of ChatGPT and Copilot.

# 🔐 Introduction to Authorization

Authorization answers the question: **“What are you allowed to do?”**

If **authentication** is *showing your ID card* 🚪🪪 → proving who you are → then **authorization** is the **security guard deciding where you can go** 🔑.

Think of a university building:

* You identify yourself at the door (not visibly, but by surveillance cameras and the lobby staff) → *authentication*
* You (or teacher) swipe your card to open certain rooms → *authorization*
* Some doors stay locked for you because you lack privileges → *access control*

Or imagine a hotel 🏨:

* Every guest logs in at reception → *authentication*
* Each room card opens only **your** room, not someone else’s → *authorization*
* Staff cards access more areas → *role-based access*

And a restaurant analogy 🍽️:

* Anyone may enter the restaurant → **public access**
* Only staff can enter the kitchen → **restricted access**
* Only the chef can open the ingredient storage → **high-privilege access**

These metaphors highlight the same principle we use in information systems:
**users must only access what they are explicitly allowed to access**.

---

## 🎯 Why Authorization Matters

Authorization forms the backbone of secure system behavior:

* Prevents unauthorized operations (e.g., deleting users, reading sensitive data)
* Reduces attack surfaces and blast radius
* Enforces privacy and compliance (GDPR, HIPAA, PCI-DSS)
* Supports clear separation of duties
* Helps implement the *Principle of Least Privilege (PoLP)*

A system without proper authorization is like a hotel where *any room card opens every room* 🚨 → even if authentication works perfectly.

---

# 🏛️ Models and Approaches to Authorization

## 👤➡️🔑 Role-Based Access Control (RBAC) 

Users are grouped into **roles**, and each role grants specific permissions.

Analogy:

* Teacher → can access classroom and teacher’s lounge
* Student → can access classroom but not the lounge
* Administrator → access everywhere

RBAC works best in organizations with stable roles.

---

## 🧩 Attribute-Based Access Control (ABAC) 

Permissions depend on **user attributes**, **resource attributes**, and **context**.
Example:

* *“Allow access only if user is a nurse AND shift = active AND patient = assigned.”*
* Context: Time of day, location, device security level

ABAC is flexible and expressive → like giving access only when certain *conditions* are met.

---

## 📜⚙️ Rule-Based Access Control 

Access is granted based on **explicit rules**, e.g.:

* “Admins can always delete comments.”
* “Users may edit only their own profile.”

A bit like traffic laws 🚦:
everyone follows the same rules, regardless of personal characteristics.

---

## 🎛️ Discretionary Access Control (DAC) 

The owner of a resource decides who is allowed to access it.
Comparable to lending your apartment keys to a friend 🔑 → *you decide*, not the building.

---

## 🛡️ Mandatory Access Control (MAC) 

Used in high-security environments (military, intelligence).
Data has classifications such as *Confidential, Secret, Top Secret*.

Users must meet the clearance level → like a movie production set 🎥 where only authorized staff enter restricted scenes.

---

# 🔒 Authorization in Web Applications

Authorization often happens after successful **authentication**.

Key question: **“Is this user allowed to perform this specific action?”**

Modern apps usually combine multiple strategies:

**✔️ Endpoint-level checks**

E.g.,

```
/admin/delete-user → allowed only for role admin
```

---

**✔️ Resource ownership**

E.g.,

```
User A cannot modify User B’s data
```

---

**✔️ Session or token-based authorization**

* JWT tokens store roles and claims
* Server-side sessions include user privileges

If these checks fail, the system must respond with:

* **403 Forbidden** 🚫 (authenticated but not allowed)
* **401 Unauthorized** 🔑 (authentication missing or invalid)

---

## 🧱 Common Authorization Vulnerabilities

**Broken Access Control (OWASP A01) 🚨**

When authorization fails, attackers may:

* Access data belonging to other users
* Escalate privileges
* Manipulate sensitive operations
* Enumerate system resources

**Example:**

A user changes their profile URL from:

```
/profile?id=123
```

to

```
/profile?id=124
```

… and unexpectedly gains access.
This is like trying random hotel room numbers until one opens → a catastrophic failure.

---

## 💡 The Principle of Least Privilege (PoLP)

Users should have **only the permissions they absolutely need**, nothing more.
This reduces damage if accounts are compromised.

**Analogy:** You give your friend the *mailbox key* 🗳️ when they house-sit → not your *entire keychain*.

---

## 🧰 Implementing Authorization → Tips

**🔑 Use centralized authorization logic**

Avoid scattered permission checks. Use middleware, policy engines, or access control modules.

---

**🧩 Consider future maintainability**

Access rules change over time. Keep the model easy to update.

---

**🛡️ Log unauthorized attempts**

Failed access attempts may reveal attacks.

---

**🔍 Validate both `frontend and backend`**

Frontend restrictions are cosmetic. Backend is the real gatekeeper.

---

**🧪 Test authorization thoroughly**

Use role-switching tests, session tampering tests, and fuzzing techniques.

---

## 🚀 Summary

Authorization is about **controlled access** → deciding *who can do what* in a secure, predictable, and auditable way.

Through real-life metaphors (hotels, restaurants, universities), the core idea becomes clear:

> 🔒 **Authentication proves your identity; authorization defines your power.**
>
> Without strong authorization, even perfect authentication cannot protect a system.

---

# 🔐 Authorization in Web Environments at the code level

In web environments, authorization refers to managing a user's rights and access permissions after they have been identified (authenticated). Various methods and techniques are often used for authorization.

## 🎛️ Common Authorization Methods

### 👥 Role-Based Access Control (RBAC)
- Users are assigned roles (e.g., `admin`, `user`, `guest`), and access rights are based on these roles.
- Example: `Admin` can modify data, `User` can read and update, `Guest` can only read.
- Example in code:
  ```json
  {
    "username": "ville",
    "role": "admin"
  }
  ```
- **Use Cases:** Web services with clear roles.

---

### 🚪 Permission-Based Access Control (PBAC)
- Access rights are defined as individual permissions (e.g., `read_reports`, `edit_users`, `delete_posts`), which can be assigned to roles or individual users.
- More flexible than `RBAC` as permissions are not tightly bound to roles.
- Example in code:
  ```json
  {
    "username": "ville",
    "permissions": ["read_reports", "edit_users"]
  }
  ```
- **Use Cases:** Applications where user permissions change frequently.

---

### 🏷️Attribute-Based Access Control (ABAC)
- Access rights are based on attributes of the user, resource, or environment (e.g., `age`, `department`, `location`, `time`).
- Example: `HR department employees can view employee data only during work hours and only for their department`.
- Useful in complex systems.
- Example in code:
  ```json
  {
    "username": "ville",
    "department": "HR",
    "access_time": "08:00-18:00"
  }
  ```
- **Use Cases:** Large enterprises and dynamic information systems.

---

### 🪙 Token-Based Authorization
- Tokens (e.g., `JWT`, `OAuth 2.0`, `OpenID Connect`) allow managing access rights without continuous logins.
- `JSON Web Token (JWT)` → contains user information and rights, sent with each request.
- `OAuth 2.0` → used for API call authorization (e.g., logging in with Google or Facebook).
- `OpenID Connect (OIDC)` → an extension of OAuth 2.0 that also enables user authentication.
- **Use Cases:** API interfaces.

---

### 🚪 Context-Based Authorization
- Access is granted based on the situation (e.g., `IP address`, `device`, `location`, `behavior pattern`).
- Example: `If a user tries to log in from an unknown device, they must verify their identity with an additional credential`.
- Used in `Google Workspace Security` and `Zero Trust` architectures.
- **Example:** Only users in Finland can log in.

---

### 🎛️ Hierarchical and Multi-Level Authorization**
- In more complex applications, authorization can be hierarchical, e.g., `managers can view their employees' data but not data from other teams`.
- Often combines `RBAC` and `ABAC` methods.

---

### 📂 Access Control Lists (ACL)
- Each resource has a list of users and their rights (e.g., `read`, `write`, `execute`).
- Often used in file systems and web servers but not always scalable in large systems.

---

### 🤝 Delegated Authorization
- A user can grant access to their resources to another user or application (e.g., `OAuth 2.0 Delegation`).
- Example: `Google Drive allows users to choose who can view, comment, or edit a file`.

**Which method is best suited?**  

✅ **Small applications:** RBAC + JWT  
✅ **Large enterprise systems:** ABAC + OAuth 2.0  
✅ **API usage:** OAuth 2.0 or API keys  
✅ **High-security applications:** Zero Trust approach (including context-based authorization)

---

## 🕒 Using Sessions

### ➜ How Sessions Work in Authorization
1. **User logs in:**
   - User provides username and password.
   - Application verifies credentials and creates a session.
   
2. **Session creation:**
   - Server creates a `session ID` and stores it with user information (e.g., user role, access rights).
   - Session ID is sent to the user as a `cookie`.

3. **Session follows the user:**
   - In each request, the browser sends the session ID as a cookie back to the server.
   - The server checks the session from the database or memory (e.g., Redis) and grants access only if the user is authorized.

4. **Session ends:**
   - When the user `logs out` or the session expires (e.g., 30 minutes of inactivity).
   - The server deletes the session information, and the cookie becomes invalid.

> [!NOTE]  
> ✅ A session can be short-lived and last only as long as the user is active on the website.  
> ✅ A session can continue even if the user closes the browser and returns later if session information is stored in cookies.  
> ✅ A session is a broader concept that covers the entire user's visit to the website. It can include multiple sessions.  

### 🔎 Session Storage Options

**Sessions can be stored in various ways:**

**→ In server memory:**
- Fast but not scalable (if there are multiple servers, the session does not persist between them).
- Use: **small applications**.

**→ In a database (e.g., MySQL, PostgreSQL, MongoDB):**
- Scalable, but the database can slow down with a large number of users.
- Use: **multi-user environments**.

**→ In Redis or Memcached memory store:**
- Fast and scalable solution, suitable for large systems.
- Use: **session management for large applications**.

---

### 🌐 Session-Based Authorization in Practice (Node.js + Express)
Here's an example of how sessions can be used on a `Node.js` server with `Express.js` and the `express-session` library:

```javascript
const express = require('express');
const session = require('express-session');
const app = express();

// Session settings
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 30 * 60 * 1000 } // 30 min
}));

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === "admin" && password === "password") {
    req.session.user = { username, role: "admin" };
    res.send("Login successful!");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Protected route
app.get('/admin', (req, res) => {
  if (req.session.user && req.session.user.role === "admin") {
    res.send("Welcome to the admin page!");
  } else {
    res.status(403).send("Access denied!");
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send("Logged out!");
});

app.listen(3000, () => console.log('Server running'));
```

---

### 🧠 Session Security
- **HttpOnly cookies:** Cookies cannot be read by JavaScript, reducing the risk of XSS.
  ```javascript
  cookie: { httpOnly: true, secure: true }
  ```
- **Secure flag:** Cookies are sent only over HTTPS.
- **SameSite flag:** Prevents CSRF attacks by restricting cookie sending from different domains.
  ```javascript
  cookie: { sameSite: 'Strict' }
  ```
- **Session timeout and automatic expiration:**
  - The user's session is automatically closed after inactivity.
- **Session regeneration after authentication:**
  - Reduces the risk of session hijacking.

---

### ☝️ When to Use Sessions? 
✅ **Traditional web applications** where the user remains logged in for a long time.  
✅ **Applications with complex access control** (e.g., role-based access).  
✅ **When the server wants to maintain control over sessions**, for example, for security reasons.  

---

## 📦 JWT (JSON Web Token)

[JWT (JSON Web Token)](https://jwt.io/) is a **lightweight and secure** way to implement authentication and authorization in web applications. It is **stateless**, meaning it does not require a session stored in the server's memory (like sessions), but all information is included in the token itself.

### 🪙 Structure of JWT
JWT consists of three parts separated by dots `.`:
```
header.payload.signature
```

---

**Header**
- Contains information about the algorithm used to sign the token.
- Example in code:
  ```json
  {
    "alg": "HS256",
    "typ": "JWT"
  }
  ```

---

**Payload**
- Contains user information and access rights.
- Example in code:
  ```json
  {
    "sub": "1234567890",
    "name": "Ville Heikkiniemi",
    "role": "admin",
    "exp": 1711881600
  }
  ```
  - `sub`: user identifier
  - `role`: user role
  - `exp`: expiration time (UNIX time)

---

**Signature**
- The server signs the token to ensure its authenticity.
- For example, using the **HMAC SHA256** algorithm:
  ```
  HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
  ```

---

### 🛡️ Using JWT

1. **User logs in**
    - The user provides credentials.
    - The server verifies them and creates a JWT.

2. **JWT is sent to the client**
    - The token is returned in the response (e.g., in JSON format).
    - The browser stores the token either in **localStorage** or **HTTP-only cookie**.

3. **User makes a secure request**
    - In each API request, the user sends the token in the HTTP header:
      ```
      Authorization: Bearer eyJhbGciOiJIUzI1...
      ```
    - The server **does not need session information**, but can verify the token's content.

4. **Server verifies the JWT**
  - The server opens the token, verifies its signature, and checks the access rights.

---

### 🌐 JWT in Practice (Node.js + Express)

Install the necessary packages:
```bash
npm install express jsonwebtoken dotenv
```

Create the server and JWT authentication:
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "secretkey";

// Login and create JWT
app.post('/login', (req, res) => {
    const { username } = req.body;

    if (!username) return res.status(400).json({ message: "Username required" });

    const token = jwt.sign({ username, role: "user" }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
});

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

// JWT verification middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

### ✨ JWT vs. Session-Based Authentication
| **Feature** | **JWT** | **Sessions** |
| :---- |:----|:----|
| **Stateless?** | ✅ Yes | ❌ No |
| **Requires server storage?** | ❌ No | ✅ Yes |
| **Scalable?** | ✅ Yes | ❌ Not well |
| **Security risks?** | Token leakage | Session management |
| **API-friendly?** | ✅ Yes | ❌ No |
| **Easy invalidation?** | ❌ No (requires blacklist) | ✅ Yes |

---

**When to use JWT?**  

✅ API interfaces (e.g., microservices)  
✅ Distributed systems  
✅ Single Sign-On (SSO)  

**When to use sessions?**  

✅ Traditional web applications  
✅ High-security applications  

---

### 🛡️ JWT Security
1. Do not store JWT in localStorage (vulnerable to XSS attacks).  
   - Use `HttpOnly cookie`, if possible.  
2. Use a short expiration time (`exp`) and refresh the token as needed.  
3. Do not include sensitive information in JWT, as it can be decoded without encryption.  
4. What to do if the token is stolen?*
   - Use a `blacklist` on the server (e.g., Redis).  

---

### 🚪 Summary
✅ JWT is a lightweight and scalable way to implement authentication and authorization.  
✅ A good alternative to sessions in API-based applications.  
✅ Requires additional security measures, especially in token handling.  
✅ It is not easy to invalidate a single token without a separate blacklist.  

---

## 🔐 Authorization Methods and Sessions

### 👤 Role-Based Access Control (RBAC) + Sessions
**How does it work?**
- The user's role (e.g., `admin`, `user`, `guest`) is stored in the session.
- In each request, the session is checked to see if the user belongs to the correct role.

**Example in code:**
  ```javascript
  if (req.session.user && req.session.user.role === 'admin') {
      res.send("Welcome to the admin page!");
  } else {
      res.status(403).send("Access denied!");
  }
  ```
**Well suited for:**

✅ Web applications with clear and rarely changing user roles.  
✅ Intranets, admin panels, online stores.

---

### 📋 Permission-Based Access Control (PBAC) + Sessions
**How does it work?**
- Instead of storing only the role in the session, individual permissions (e.g., `"can_edit_users": true`) are stored.
- In each request, it is checked whether the user has the right to perform the action.

**Example in code:**
  ```javascript
  if (req.session.user && req.session.user.permissions.includes("edit_users")) {
      res.send("You can edit users!");
  } else {
      res.status(403).send("Access denied!");
  }
  ```
**Well suited for:**

✅ Large applications where user permissions can change frequently.

---

### 👥 Attribute-Based Access Control (ABAC) + Sessions
**How does it work?**
- User attributes (e.g., department, location, working hours) are stored in the session.
- Access is granted only if the user's attributes meet the requirements.

**Example in code:**
  ```javascript
  if (req.session.user && req.session.user.department === "HR" && withinBusinessHours()) {
      res.send("You can view employee data!");
  } else {
      res.status(403).send("Access denied!");
  }
  ```

**Well suited for:**

✅ Enterprise use where access rights depend on context.

---

### 🪙 Token-Based Authorization (JWT, OAuth 2.0) + Sessions
**How does it work?**
- The token can be `stored in the session` instead of being stored in the browser's cookie or localStorage.
- This allows combining session-based and token-based approaches.

**Example in code:**
  ```javascript
  req.session.token = "eyJhbGciOiJIUzI1...";
  ```
  - In each request, the server uses the token to verify the user's rights.

**Well suited for:**

✅ Applications that need a combination of session and token management.

---

### 🌍 Context-Based Authorization + Sessions
**How does it work?**
- Information about the user's device, IP address, or location is stored in the session.
- If the context changes suspiciously (e.g., logging in from a different country), additional verification may be required.

**Example in code:**
  ```javascript
  if (req.session.user && req.session.user.ip === req.ip) {
      res.send("Access granted");
  } else {
      res.status(403).send("Suspicious login, please verify your identity.");
  }
  ```

**Well suited for:**

✅ Security-critical applications (banks, enterprise applications).

---

### 🛡️ Access Control List (ACL) + Sessions
**How does it work?**
  - User rights to specific resources (e.g., "can edit only own files") are stored in the session.
  - In each request, the ACL is checked to see if the user can access the resource.

**Example in code:**
  ```javascript
  if (req.session.user && acl.check(req.session.user.id, req.params.fileId, "read")) {
      res.send("File content");
  } else {
      res.status(403).send("Access denied!");
  }
  ```

**Well suited for:**

✅ File services, project management systems.

---

### 🤝 Delegated Authorization (OAuth 2.0 Delegation) + Sessions
**How does it work?**
- The user's OAuth 2.0 authorization is stored in the session, and requests are made on behalf of the user.

**Example in code:**
  ```javascript
  req.session.oauthToken = "ya29.a0ARrda...";
  ```

**Well suited for:**

✅ Third-party services (Google Drive, Facebook API).

---

### 🎯 Summary: When to Combine Sessions with Authorization Methods?
| Authorization Method | Can it be used with sessions? | Good combination? |
|:----|:----:|:----|
| `RBAC` (role-based) | ✅ | Yes, simple and effective. |
| `PBAC` (permission-based) | ✅ | Suitable if there are many permissions and they change frequently. |
| `ABAC` (attribute-based) | ✅ | Practical, but may require a more complex session structure. |
| Token-based (`JWT`, `OAuth`) | ⚠️ | Tokens are usually stateless, but can be stored in sessions. |
| Context-based (`Zero Trust`) | ✅ | Suitable for security-critical systems. |
| `ACL` (access control list) | ✅ | Good if rights are related to individual resources. |
| Delegated (`OAuth 2.0 Delegation`) | ✅ | Used when the application makes requests on behalf of the user. |

---

**💡Considerations**

✅ Using sessions is useful when you want to keep the user's state managed on the server side.  
✅ Most authorization methods can be combined with sessions, but a token-based approach may be better for API-based systems.  
✅ The choice depends on the application's needs: if the user's state needs to be maintained on the server side, sessions are useful. If a scalable and distributed solution is needed, a token-based approach may be better.

---

## 🔐 Authorization Methods and JWT

### 👤 Role-Based Access Control (RBAC) + JWT
- JWT contains the user's role in the payload.
- In each request, the server checks if the user has the required role.

**Example in code: JWT payload for RBAC**
```json
{
  "sub": "1234567890",
  "name": "Ville Heikkiniemi",
  "role": "admin",
  "exp": 1711881600
}
```

**Example in code: RBAC check on an Express.js server**
```javascript
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send("Access denied!");
        }
        next();
    };
}

// Protected admin route
app.get('/admin', authenticateToken, authorizeRole("admin"), (req, res) => {
    res.send("Welcome to the admin page!");
});
```

---

### 🚪 Permission-Based Access Control (PBAC) + JWT
- JWT can store individual permissions.
- In each request, it is checked whether the user has the right to perform the action.

**Example in code: JWT payload for PBAC**
```json
{
  "sub": "1234567890",
  "permissions": ["read_reports", "edit_users"],
  "exp": 1711881600
}
```

**Example in code: Permission check on an Express.js server**
```javascript
function authorizePermission(permission) {
    return (req, res, next) => {
        if (!req.user.permissions.includes(permission)) {
            return res.status(403).send("Access denied!");
        }
        next();
    };
}

// Protected route: Only users with "edit_users" permission
app.get('/edit-user', authenticateToken, authorizePermission("edit_users"), (req, res) => {
    res.send("You can edit users!");
});
```

---

### 🏷️ Attribute-Based Access Control (ABAC) + JWT
- JWT contains user attributes (e.g., department, location, working hours).
- The server checks if the attributes meet the access requirements.

**Example in code: JWT payload for ABAC**
```json
{
  "sub": "1234567890",
  "department": "HR",
  "location": "Helsinki",
  "exp": 1711881600
}
```

**Example in code: Attribute-based check**
```javascript
function authorizeByDepartment(department) {
    return (req, res, next) => {
        if (req.user.department !== department) {
            return res.status(403).send("Access denied!");
        }
        next();
    };
}

// Only HR department employees can access this route
app.get('/hr-dashboard', authenticateToken, authorizeByDepartment("HR"), (req, res) => {
    res.send("Welcome to the HR panel!");
});
```

---

### 🚫 Context-Based Authorization (Zero Trust) + JWT
- JWT contains information about the user's login method, IP address, or device.
- If the context changes, the server can reject the request.

**Example in code: JWT payload for Zero Trust model**
```json
{
  "sub": "1234567890",
  "ip": "192.168.1.1",
  "device": "MacBookPro",
  "exp": 1711881600
}
```

---

**Example in code: Context verification**
```javascript
function verifyContext(req, res, next) {
    if (req.user.ip !== req.ip) {
        return res.status(403).send("Suspicious login!");
    }
    next();
}

app.get('/secure-data', authenticateToken, verifyContext, (req, res) => {
    res.send("This is secure data.");
});
```

---

### 🤝 Delegated Authorization (OAuth 2.0) + JWT
- JWT is used in OAuth 2.0 to prove authorization.
- The user grants a third party access to their resources.

**Example in code: OAuth 2.0-based JWT**
```json
{
  "sub": "1234567890",
  "scope": "read:user write:posts",
  "exp": 1711881600
}
```

**Example in code: OAuth scope check**
```javascript
function authorizeScope(requiredScope) {
    return (req, res, next) => {
        if (!req.user.scope.includes(requiredScope)) {
            return res.status(403).send("No permission for this action!");
        }
        next();
    };
}

app.get('/user-profile', authenticateToken, authorizeScope("read:user"), (req, res) => {
    res.send("Here is your user profile.");
});
```

---

### 📌 JWT vs. Session-Based Authorization
| Authorization Method | JWT | Session |
|:-----|:----|:----|
| `RBAC` (role-based) | ✅ Included in token | ✅ Stored on the server |
| `PBAC` (permission-based) | ✅ Included in token | ✅ Stored in session |
| `ABAC` (attribute-based) | ✅ Included in token | ✅ Stored in session |
| `Zero Trust` | ✅ Includes IP and device tracking | ✅ Server-managed |
| `OAuth 2.0` | ✅ Used in API requests | ❌ Not used with sessions |

---

### 🎯 Summary
✅ **JWT is well-suited for API-based systems** because it is **stateless** and does not require a session stored on the server.  
✅ **Session-based authorization is suitable for traditional web applications** where the user's state needs to be maintained in the server's memory.  
✅ **A combination of JWT + sessions can be beneficial** if scalability is desired, but also the ability to invalidate individual user sessions.  
✅ **The choice depends on the application's needs**:  
  - **If you want scalability and an API-friendly solution → use JWT.**  
  - **If you need more control and secure session management → use sessions.**