> [!NOTE]
> The material was created with the help of ChatGPT and Copilot.

# 🔐 Authentication Methods → Ensuring Secure Access

## 🧭 Introduction to Authentication

**Authentication** means verifying *who you are* before the system grants access.

🔑 **Authentication vs Authorization**

* **Authentication:** Who are you?
* **Authorization:** What are you allowed to do?

---

**⭐ Why It Matters**

* Prevents **unauthorized access**
* Protects **confidentiality**, **integrity**, and **availability** → **CIA**
* Reduces **identity theft**
* Required by regulations (GDPR, HIPAA, PCI-DSS)

> Reference: CISA glossary
> [https://niccs.cisa.gov/cybersecurity-career-resources/vocabulary#letter-a](https://niccs.cisa.gov/cybersecurity-career-resources/vocabulary#letter-a)

---

## 🕰️ History of Authentication

**📜 Early Stage**

* Physical keys
* PIN codes
* Simple passwords

---

**💻 Digital Transformation**

* Challenge–response mechanisms
* Password databases
* First biometrics & tokens

---

**🤖 Modern Era**

* Multi-Factor Authentication (MFA)
* AI-assisted behavioral authentication
* Risk-based authentication
* Passwordless technologies (FIDO2, WebAuthn)

---

## 🔑 Password-Based Authentication

> ✏️ **User provides a *username + password*.**

---

**⭐ Advantages**

* Easy to use
* No extra hardware needed

---

**⚠️ Challenges**

* Weak passwords & reuse
* Vulnerable to phishing, brute force, leaks
* Human memory limits security

---

**🔍 NIST Guidelines**

Passwords should be long and user-friendly—not complex to memorize:
[https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver](https://pages.nist.gov/800-63-4/sp800-63b.html#passwordver)

---

## 🔐 Multi-Factor Authentication (MFA)

> **✏️ MFA uses *two* or *more* independent verification methods.**

---

**🔢 MFA Factors**

* **Something you know:** Password, PIN
* **Something you have:** Token, smart card, authenticator app
* **Something you are:** Biometrics

---

**⚙️ Examples**

* Password + SMS code
* Password + fingerprint
* Password + FIDO2 key

---

**⭐ Advantages**

* Greatly improves security compared to passwords alone.

---

## 🧬 Biometric Authentication

> **✏️ Uses unique *biological* traits.**

---

**🔍 Examples**

* Fingerprint readers
* Face ID / facial recognition
* Iris & retina scanning

---

**⭐ Advantages**

* Hard to replicate
* Convenient & fast
* No passwords to remember

---

**⚠️ Challenges**

* Sensitive personal data
* Privacy/GDPR concerns
* Deepfake-based spoofing risks

---

## 🔑 Token-Based Authentication

> **✏️ Access is granted using *cryptographic tokens* instead of passwords.**

**🔧 How It Works**

1. User logs in
2. System issues a token (JWT, opaque token, session token)
3. Token is used for subsequent requests

---

**⭐ Advantages**

* Stateless authentication (excellent for APIs)
* No need to re-enter username/password constantly

---

## 📜 Certificate-Based Authentication

> **✏️ Uses *digital certificates* issued by a Certificate Authority (CA).**

**🔍 Use Cases**

* HTTPS
* VPN connections
* Smart card access

---

**⭐ Advantages**

* Very strong authentication
* Reduces phishing risks

---

**⚠️ Challenges**

* Certificate lifecycle management
* Revocation lists & trust chains

---

## 🔁 Single Sign-On (SSO)

> **✏️ One login grants access to multiple services.**

**🔧 How It Works**

* Log in once (identity provider: Google, Microsoft, Azure AD)
* Receive authentication token
* Automatically log in to connected apps

---

**⭐ Advantages**

* Reduces password fatigue
* Centralizes security controls

---

## 🔗 OAuth 2.0

> **✏️ An open standard for *delegated access* without sharing passwords.**

**🔍 Use Cases**

* “Log in with Google/Facebook”
* Granting API access (e.g., allowing an app to read your calendar)

---

**⭐ Advantages**

* Limits access scope
* Users retain control
* No password sharing

---

## 💳 Smart Card Authentication

> **✏️ A chip-based physical card storing authentication data.**

**🔍 Use Cases**

* Corporate access cards
* Government/military ID
* Banking (EMV cards)

---

**⭐ Advantages**

* Highly secure
* Resistant to phishing

---

**⚠️ Challenges**

* Must be physically carried
* Can be lost or stolen

---

## 📊 Comparison of Authentication Methods

| Method                | Convenience | Security    | Notes                     |
| --------------------- | ----------- | ----------- | ------------------------- |
| 🔑 **Password-Based** | High        | Low         | Weakest method alone      |
| 🔐 **MFA**            | Medium      | Very High   | Strongest everyday method |
| 🧬 **Biometrics**     | High        | High        | Privacy concerns          |
| 🪙 **Token-Based**    | High        | High        | Ideal for APIs & SPAs     |
| 📜 **Certificates**   | Low         | Very High   | Complex to manage         |
| 🔁 **SSO**            | High        | Medium–High | Improves usability        |
| 🔗 **OAuth**          | High        | Medium–High | Common in web apps        |

---

## 🧭 Best Practices for Strong Authentication

✔️ Use long, unique passwords  
✔️ Enable MFA everywhere  
✔️ Never store passwords in plaintext  
✔️ Use password managers  
✔️ Apply rate limiting & brute-force protections  
✔️ Hash passwords using modern algorithms (Argon2, bcrypt, scrypt)  
✔️ Rotate credentials when needed  
✔️ Use HTTPS everywhere  

---

## 🚀 Future Trends in Authentication

**🤖 AI & Machine Learning**

* Detect abnormal login behavior
* Risk-based authentication

---

**👣 Behavioral Biometrics**

* Typing rhythm
* Mouse movement
* Voice characteristics

---

**🪙 Passwordless Authentication**

* WebAuthn
* FIDO2 keys
* Passkeys (Apple, Google, Microsoft)

---

**🔗 Decentralized Identity (DID)**

* Blockchain-based authentication
* User-owned identity wallets

---

# ⚠️ The Weakest Link in Authentication: “You Always Authenticate *Against Something*"

Even though authentication tries to answer *“Who are you?”*, in reality the system can only determine:

> **“Does what you provided match what I already have stored?”**

This means that authentication is not proof of identity in an absolute sense. Authentication is only a **comparison process**. The **stored identifier** is therefore the critical part of the chain, and also the **weakest link**.

---

## 🧩 Authentication Always Compares Two Things

**Fundamental logic:**

> **User presents a credential → System compares it → System checks whether it matches the stored credential**

In other words, authentication does not confirm who you *truly are*. It simply checks whether:

> **The identifier you provide**  → *matches*  →  **The identifier stored in the system**.

Because of this, the stored identifier becomes:

* a primary target for attackers 🎯
* the most valuable component to protect
* the weakest part of the entire authentication process

---

## 🔓 If the Stored Identifier Is Stolen, It Can Be Used

> **🎭 Identity Theft = Identifier Theft**

If an attacker obtains the credential that authentication is based on, they can impersonate the user.

They do **not** need to:

* guess the password
* break a cryptographic algorithm
* bypass biometric sensors

They only need to **copy** the stored credential and present it to the system.

This is why authentication stores are **the number 1 attack target**.

---

## 🧪 Examples of “Authentication Against Something” Weak Points

Below are practical cases showing how stored identifiers become the weak link.

---

### 🧰 **Example 1: Password-Based Authentication**

> Authentication compares: **user-entered password** ⇄ **stored password hash**

If the database containing password hashes is stolen:

* attackers can perform offline cracking
* credential stuffing becomes possible
* weak hashing algorithms (MD5, SHA1) collapse instantly

**If the stored hash is compromised, the authentication process is broken.**

---

### 🪙 **Example 2: Token-Based Authentication (JWT, access tokens, session tokens)**

> Authentication compares: **submitted token** ⇄ **stored or validated token**

If an attacker obtains a valid token:

* they can attach it to HTTP requests
* the server accepts it because the token is *cryptographically valid*
* no password is needed at all

**A token means “I already authenticated earlier.” → If stolen → attacker becomes the user.**

---

### 🧬 **Example 3: Biometric Authentication**

> Authentication compares: **captured biometric template** ⇄ **stored biometric template**

If a biometric template is stolen:

* it can be used to generate synthetic fingerprints or facial models
* deepfake-based spoofing becomes possible
* the user cannot simply “reset” their fingerprint or face

**Biometrics are strong, but the stored templates are extremely sensitive.**

---

## 📦 Stored Authentication Data Is the Prime Target

To attackers, authentication stores are:

* **central treasure chests**
* **identity gold mines**
* **the easiest route to total account takeover**

Valuable stored identifiers include:

* password hashes
* session identifiers
* JWT signing keys
* OAuth refresh tokens
* biometric templates

Compromise of any of these = **identity compromise**.

---

## 🛡️ Protecting “What We Authenticate Against”

**🔐 Secure stored credentials**

* Use strong hashing (Argon2, bcrypt)
* Never store plaintext passwords
* Protect logs from leaking secrets
* Harden session stores

---

**🚫 Mitigate replay attacks**

* Use nonces and timestamps
* Short-lived tokens
* Token rotation

---

**🔐 Secure cryptographic keys**

* Use secret vaults
* Apply key rotation
* Use HSMs or cloud KMS

---

**🛑 Reduce the value of stolen identifiers**

* Context-aware authentication
* Device binding
* MFA or step-up authentication
* Strong session management

---

## 🧠 Takeaway

> **Authentication is always a comparison process.** → A system never knows who the user truly is. The system only checks whether the user can present something that matches what the system has stored.

Therefore, the **stored counterpart** of authentication (hash, token, key, certificate, template) is the **true weak point**. If that stored identifier is stolen, the attacker effectively *becomes* the user → The entire authentication process collapses.

---

Alla on **täysin uudistettu, paranneltu ja laajennettu Markdown-versio** tekemästäsi materiaalista.
Mukana on **emojeita**, paremmat selitykset, päivitettyjä esimerkkejä, turvallisuusnäkökulmia ja moderni ulkoasu.
Perustuu liitetiedostoon **Password_Cracking_Protection.pptx** 

---

# 🔐 Password Cracking & Protection

## 🧭 Introduction

Passwords remain the most widely used authentication method.
Unfortunately, weak password practices and outdated hashing make them highly vulnerable.

Attackers typically approach password cracking in two fundamentally different ways:

1. **Cracking password hashes**
   → Case: attacker has access to the password **database**

2. **Cracking via the web interface**
   → Case: attacker **only interacts** with the login page

---

## 💥 Cracking Password Hashes

When a system stores a password, it should store only a **cryptographic hash**, not the password itself.

**🧂 Common Hash Algorithms**

| Algorithm | Strength      | Notes                                        |
| --------- | ------------- | -------------------------------------------- |
| MD5       | ❌ Weak        | Broken, never use                            |
| SHA-1     | ❌ Weak        | Collision attacks                            |
| SHA-256   | ⚠️ Better     | Needs salting; still not ideal for passwords |
| bcrypt    | ✅ Strong      | Slow-by-design                               |
| scrypt    | ✅ Strong      | Memory-hard                                  |
| Argon2    | ⭐ Recommended | Best modern option (Argon2id)                |

Hash cracking methods include:

* 📚 **Dictionary attacks**
* 🧨 **Brute-force attacks**
* 🌈 **Rainbow tables** (not covered here)
* 🧠 **Hybrid attacks** (dictionary + rules)

---

## 🧪 Attack Example: Dictionary / Brute-force (Offline)

When the attacker has **stolen password hashes**, they compare them against:

* “RockYou” wordlist (default in Kali Linux)
* “Have I Been Pwned” datasets
* Custom password lists

**🔧 Tool Example: Hashcat**

```bash
hashcat -m 1000 -a 0 hashfile.txt wordlist.txt
```

> This tries each word, hashes it, and compares it to the stored hash.

---

## 🧪 Attack Example: Non-Dictionary / Pure Brute-force

The attacker tries **every possible combination** of characters.

**🔤 Built-in Hashcat Charsets:**

* `?l` → lowercase
* `?u` → uppercase
* `?d` → digits
* `?s` → symbols
* `?a` → all above
* `?b` → all bytes (0x00–0xff)

**🔧 Example:**

```bash
hashcat -m 1000 -a 3 hashfile.txt ?a?a?a?a?a?a
```

> 6 characters of **any type** → billions of combinations

---

## 🌐 Web Interface Attacks

When the attacker **cannot access the database**, they attack the login page:

**Attack Types**

* 📚 **Dictionary attacks** (Hydra, Burp Suite)
* 🧨 **Brute-force attacks** (Hydra)
* 🔁 **Credential stuffing** (Sentry MBA, Snipr)
  *(Not covered in this slide, but extremely common)*

---

### 🧪 Web Attack Example: Dictionary / Brute-force

**🔧 Hydra Example:**

```bash
hydra -l admin -P wordlist.txt http://target.com/login \
http-form-post "/login:username=^USER^&password=^PASS^:F=incorrect"
```

**🔧 Another example with real-world syntax:**

```bash
hydra -l user@example.com -P /usr/share/wordlists/rockyou.txt \
-R -t 64 -w 2 -s 8000 localhost \
http-post-form "/login:username=^USER^&password=^PASS^:F=Invalid email or password" -V
```

---

### 🧪 Web Attack Example: Non-Dictionary / Pure Brute-force

**🔧 Example: trying all combinations between 6 and 8 characters:**

```bash
hydra -l admin -x 6:8:a http://target.com/login \
http-form-post "/login:username=^USER^&password=^PASS^:F=incorrect"
```

**🔧Generating custom wordlists:**

```bash
crunch 12 12 -t iamveng@@@@@ -o passlist.txt
```

**🔧Using the generated list:**

```bash
hydra -l user@gotham.com -P passlist.txt -t 64 -w 2 -s 8000 localhost \
http-post-form "/login:username=^USER^&password=^PASS^:F=Invalid email or password" -V
```

---

## 🛡️ Protection: The Database

**✔️ Use Modern Password Hashing**

* 🔐 **bcrypt**
* 🔐 **scrypt**
* ⭐ **Argon2id (recommended)**

---

**✔️ Always Salt Passwords**

* Unique salt per user
* Long and random

---

**✔️ Restrict Access**

* Least privilege
* Strong DB authentication
* Audit logs

---

**✔️ Monitor for Attacks**

* Alert on large hash dumps
* Check for data breaches
* Use “Have I Been Pwned” for password checking

---

## 🛡️ Protection: The Web Interface

**✔️ Limit Login Attempts**

* Example: 5 failed attempts per 15 minutes

---

**✔️ Use CAPTCHA**

* Prevents automated tools

---

**✔️ Enable MFA**

* Makes password cracking almost useless

---

**✔️ Detect Credential Stuffing**

* Check if passwords appear in known breaches
* Block IPs with abusive patterns

---

**✔️ Log Everything Important**

* Failed logins
* Suspicious IPs
* Unexpected user agents

---

## 🖥️ Securing System Access

✔️ Restrict administrator privileges  
✔️ Use firewalls  
✔️ Enable intrusion detection (IDS/IPS)  
✔️ Apply Role-Based Access Control (RBAC)  
✔️ Patch and update regularly  
✔️ Disable unneeded services  

---

## 💻 Example Code: Enforcing Strong Hashing (bcrypt, Node.js)

```javascript
const bcrypt = require('bcrypt');
const saltRounds = 12;

const password = "userPassword";

bcrypt.hash(password, saltRounds, function(err, hash) {
    console.log("Hashed password:", hash);
});
```

---

## 🚦 Example Code: Rate Limit Login Attempts (Node.js / Express)

```javascript
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,                    // limit each IP
    message: "Too many login attempts, please try again later."
});

app.use("/login", loginLimiter);
```

---

## 🔢 Implementing MFA with TOTP (Node.js)

```bash
npm install speakeasy qrcode
```

```javascript
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const secret = speakeasy.generateSecret({ length: 20 });

qrcode.toDataURL(secret.otpauth_url, function(err, data_url) {
    console.log("Scan this QR code in your authentication app:", data_url);
});
```

---

## 🧾 Summary

* Password attacks are widespread and increasingly automated
* Strong hashing, login throttling, and MFA dramatically reduce risk
* Security is not a one-time task — it is a continuous process
* 🔒 **Stay safe. Protect your credentials. Protect your users.** 🔒