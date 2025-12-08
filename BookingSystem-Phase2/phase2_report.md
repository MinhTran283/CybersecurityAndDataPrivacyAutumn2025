# Booking System – Phase 2 Penetration & Functionality Test Report

## 1️⃣ Introduction

**Tester:** Minh Tran
**Purpose:**
To evaluate the updated Booking System (Phase 2) authentication, registration, password handling, session behavior, and security controls. This round focuses on improvements after Phase 1 and identifies new risks introduced by authentication features.

**Scope:**

* Login page functionality & validation
* Registration page functionality & validation
* Password policy & authentication logic
* SQL injection re-testing
* Date-of-birth validation
* Rate limiting protections
* Session/cookie behavior (as applicable)

**Exclusions:** Admin features, reservation system, backend source code.

**Test Approach:** Gray-box, manual testing + ZAP scan.

**Environment:**

* Windows 11
* Docker Phase 2 (web + PostgreSQL)
* Browser: Brave
* URL tested: [http://localhost:8002](http://localhost:8002) (Phase 2 web app)

---

## 2️⃣ Executive Summary

Authentication and registration functions are significantly improved from previous versions. Password minimum-length checks are active, invalid dates and incorrect formats are properly rejected, and SQL injection attempts are no longer accepted—even when bypassing browser validations.

However, several issues remain:

* Rate limiting is **missing** → unlimited login attempts
* No session cookies visible → session handling unclear
* Email error messages vary depending on validation layer

**Overall Risk Level:** Medium

**Top 5 Immediate Actions:**

1. Implement backend rate limiting for login attempts.
2. Enforce consistent password policy (current minimum: 4 chars only).
3. Improve backend validation for ALL fields independent of browser behavior.
4. Validate all date-of-birth formats server-side.
5. Document or correct missing authentication/session cookies.

---

## 3️⃣ Severity Scale

* 🔴 High – Critical vulnerability (account compromise, data breach). Fix immediately.
* 🟠 Medium – Significant weakness requiring attention. Fix soon.
* 🟡 Low – Minor issue or inconsistency. Fix when possible.
* 🔵 Info – Informational only.

---

## 4️⃣ Findings (Manual Test Results)

Below are the findings based on your test case descriptions. Screenshots will be added by you.

### **F‑01 – Required field validation works correctly**

**Severity:** 🔵 Info
**Description:** Leaving any field empty in either Login or Register form triggers an appropriate error message. Validation works as expected.
**Evidence:** *testcase1.1.png*
*testcase1.2.png*
*testcase1.3.png*
*testcase1.4.png*

---

### **F‑02 – Invalid password always rejected during registration**

**Severity:** 🟡 Low
**Description:** Every password attempt triggers "Invalid password" unless the entire registration form is correct. Only when registration succeeds does the system allow login.
**Interpretation:** Password validation depends on more than password length alone (likely checks for matching password confirmation or backend format), but error messages are inconsistent.
**Evidence:** testcase2.png

---

### **F‑03 – Password minimum length enforced (4+ characters)**

**Severity:** 🟡 Low
**Description:** Passwords shorter than 4 characters are rejected. Any password of 4+ characters is accepted. Login only succeeds after successful registration.
**Risk:** Passwords of only 4 characters are too weak for real authentication standards (susceptible to brute force).
**Evidence:** *testcase3.1.png*
*testcase3.2.png*
*testcase3.3.png*

---

### **F‑04 – Date-of-birth validation improved (future dates & missing format rejected)**

**Severity:** 🔵 Info
**Description:** The system correctly rejects:

* Future dates
* Invalid date formats (e.g., missing year, empty fields)
  **Evidence:** *testcase4.1.png*
  *testcase4.2.png*
  *testcase4.3.png*

---

### **F‑05 – SQL injection attempts blocked (even with novalidate)**

**Severity:** 🟠 Medium (improved but backend still unclear)
**Description:** Entering email:

```
fake@fake.com' OR '1'='1
```

Triggers error: *"a part following @ should not contain the symbol '"*
Even with **novalidate** enabled, backend rejects the input and registration fails.
**Risk:** Backend rejection confirmed, but we cannot verify database sanitization without server logs.
**Evidence:** *testcase5.png*

---

### **F‑06 – No session cookies detected**

**Severity:** 🟠 Medium
**Description:** No cookies were created during login or registration.
**Implication:**

* System may not be maintaining authentication sessions, OR
* The browser failed to display them, OR
* Authentication is handled entirely server-side without cookies (unlikely).
  **Recommended:** Developer must verify session handling mechanism.
  **Evidence:** *testcase6.png*
  *testcase6.1.png*
  *testcase6.2.png*

---

### **F‑07 – Rate limiting missing (unlimited login attempts)**

**Severity:** 🔴 High
**Description:** You can enter incorrect passwords unlimited times without:

* Temporary lockout
* CAPTCHA
* Warning messages
  **Risk:** This enables brute-force and credential stuffing attacks.

---

### **F‑08 – Session handling could not be evaluated (due to no cookies)**

**Severity:** 🔵 Info
**Description:** Because no cookies were found (TC6), session fixation & replay tests could not be performed.
**Interpretation:** Not necessarily a bug—depends on implementation—but impossible to test further without session artifacts.

---

## 5️⃣ OWASP ZAP (Round 3) Report

Your ZAP scan has been saved as:
**Phase2_zap_report.md**

## 6️⃣ Conclusion

The Phase 2 system demonstrates meaningful improvements in validation and security handling. SQL injection is consistently rejected, date validation is strengthened, and registration/login flows operate correctly.

However, significant risks remain:

* **No rate limiting** → brute force possible
* **Weak password policy (4 characters minimum)**
* **Missing or invisible session cookies**
* **Inconsistent validation messages**

Addressing these before Phase 3 is highly recommended.

---

## 7️⃣ Appendix – Test Case Summary

| Test Case                  | Expected                 | Actual            | Status         |
| -------------------------- | ------------------------ | ----------------- | -------------  |
| TC1 – Missing fields       | Blocked                  | Blocked correctly | ✔️ Fixed      |
| TC2 – Invalid password     | Rejected                 | Always rejected   | ✔️ Improved   |
| TC3 – Password length      | <4 rejected              | Works correctly   | ✔️ Fixed      |
| TC4 – Invalid date formats | Rejected                 | Rejected          | ✔️ Fixed      |
| TC5 – SQL injection        | Blocked                  | Blocked           | ✔️ Fixed      |
| TC6 – Cookies              | Should exist             | None found        | ⚠️ Issue      |
| TC7 – Rate limiting        | Should limit brute force | No limit          | ❌ Not fixed  |
| TC8 – Session testing      | Depends on cookies       | Not testable      | ⚠️ Incomplete |

---

