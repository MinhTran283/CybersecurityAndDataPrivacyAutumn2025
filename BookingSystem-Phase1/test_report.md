# Booking System – Phase 1 Penetration Test Report

## 1️⃣ Introduction

**Tester(s):**
Name: Minh Tran

**Purpose:**
Identify vulnerabilities and anomalies in the **registration functionality**, including validation, authentication flow behavior, and potential security flaws.

**Scope:**
**Tested components:** Registration form, client-side validation, server-side responses, SQL injection attempts, error handling.
**Exclusions:** Login, reservations, admin panel, resource management.

**Test approach:** Gray-box

**Test environment & dates:**
**Start:** 2025-11-28
**End:** 2025-11-28
**Environment details:** Windows 11, Docker environment running PostgreSQL + Booking Web App, Browsers: Brave.

**Assumptions & constraints:**

* No backend source code access.
* Only Phase 1 functionality enabled.
* Limited to user registration testing.

## 2️⃣ Executive Summary

**Short summary (1–2 sentences):**
The registration feature contains several validation weaknesses and inconsistent error handling. SQL injection attempts can partially bypass protection when client-side validation is disabled.

**Overall risk level:** **Medium**

**Top 5 immediate actions:**

1. Add strict **server-side validation** for all form fields.
2. Implement **input sanitization and parameterized queries** to prevent SQL injection.
3. Replace generic errors with **clear, non-sensitive error messages**.
4. Enforce backend-level **email format validation**.
5. Add logging for **failed or suspicious registration attempts**.

## 3️⃣ Severity Scale & Definitions

| Severity      | Description                                                                   | Recommended Action      |
| ------------- | ----------------------------------------------------------------------------- | ----------------------- |
| 🔴 **High**   | Leads to system compromise or data breach (e.g., SQL injection).              | Fix immediately         |
| 🟠 **Medium** | Significant issue requiring specific conditions (e.g., bypassing validation). | Fix as soon as possible |
| 🟡 **Low**    | Minor issue or misconfiguration.                                              | Fix in next update      |
| 🔵 **Info**   | No direct risk; helpful for improvement.                                      | Optional fix            |

---

## 4️⃣ Findings

Below table includes exactly **five (5)** findings as required:

| ID   | Severity  | Finding                                                         | Description                                                                                           | Evidence                                        |
| ---- | --------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| F-01 | 🟡 Low    | Missing Required Field Validation                               | Browser-only validation allows bypass using `novalidate`.                                             | Screenshot of browser message                   |
| F-02 | 🟡 Low    | Weak Email Format Validation                                    | Email format enforced only on client-side; backend accepts invalid formats.                           | Screenshot of invalid email warning             |
| F-03 | 🔵 Info   | Successful Registration with Valid Data                         | Registration works normally when valid data is provided.                                              | Redirect to homepage                            |
| F-04 | 🟠 Medium | SQL Injection Attempt Allowed (When Client Validation Disabled) | Removing HTML validation allows SQL meta-characters to reach backend; indicates missing sanitization. | Registration success after disabling validation |
| F-05 | 🟡 Low    | Generic Server Error Message                                    | System shows vague error: "Error during registration", giving no details and hiding failures.         | Screenshot of error page                        |

## 5️⃣ OWASP ZAP Report (Attachment)

The ZAP report was generated using automated scan at `http://localhost:8000`.

File name suggestion: **ZAP-Report-Phase1.md**

Please place the full ZAP markdown report in this folder and link it here:

```
[ZAP Report – Round 1](./ZAP-Report-Phase1.md)
```

---

## 6️⃣ Conclusion

The Booking System registration form relies too heavily on client-side validation. Once default browser validation is bypassed, malicious input (including SQL injection strings) can be submitted to the backend.

### **Key Risks:**

* Potential SQL injection exposure.
* Lack of backend validation.
* Weak error handling.
* Over-reliance on browser constraints.

### **Recommendation:**

Implement strict backend validation and sanitization immediately to ensure Phase 2 features (login, admin panels) remain secure.

---

## 7️⃣ Appendix: Test Cases Executed

| Test Case | Input                  | Expected                      | Actual Result                                          |
| --------- | ---------------------- | ----------------------------- | ------------------------------------------------------ |
| TC‑01     | Empty fields           | Validation errors             | Browser shows “Please fill out this field”             |
| TC‑02     | Invalid email (`abc`)  | Invalid email message         | “Please include an @ …”                                |
| TC‑03     | Valid registration     | Success + redirect            | Works as expected                                      |
| TC‑04     | SQL injection in email | Should be blocked server-side | Works only if validation disabled → backend vulnerable |
| TC‑05     | Random invalid input   | Error message                 | Shows generic “Error during registration”              |

---

**End of Report**
