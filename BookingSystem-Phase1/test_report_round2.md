# Booking System – Phase 1 Part 2 Penetration Test Report (Round 2)

## 1️⃣ Introduction

**Tester(s):**
Name: Minh Tran

**Purpose:**
Re-test the updated Booking System (Phase 1 / Part 2) registration flow, verify whether previous findings were fixed, identify remaining vulnerabilities, and assess GDPR/privacy compliance.

**Scope:**
**Tested components:** Registration form (updated version), input validation, backend responses, password policy, date validation, security behaviors.
**Exclusions:** Login flow, reservation logic, admin panel, resource management.

**Test approach:** Gray-box testing

**Test environment & dates:**
**Start:** 2025-11-29
**End:** 2025-12-2
**Environment:** Windows 11, Docker containers for Phase1-Part2 (web + PostgreSQL), Browser: Chrome.

**Assumptions & constraints:**

* No access to backend code.
* Only registration page available.
* ZAP tests performed in baseline mode.

---

## 2️⃣ Executive Summary

**Summary:**
Several validation improvements were successfully implemented in Part 2. Email validation and basic password rules now function server-side. However, some issues remain — notably date-of-birth validation still accepts invalid values, and other minor inconsistencies persist.

**Overall risk level:** **Medium**

**Top 5 immediate actions:**

1. Enforce server-side **date-of-birth validation** (reject invalid or future dates).
2. Strengthen password policy (symbols, uppercase, deny common passwords).
3. Improve backend-level sanitization to avoid bypass cases.
4. Add clearer user feedback for all validation errors.
5. Implement rate-limiting and anti-automation checks.

---

## 3️⃣ Severity Scale & Definitions

| Severity      | Description                                             | Recommended Action |
| ------------- | ------------------------------------------------------- | ------------------ |
| 🔴 **High**   | Direct risk of account compromise or data breach.       | Fix immediately    |
| 🟠 **Medium** | Vulnerability requiring specific conditions to exploit. | Fix soon           |
| 🟡 **Low**    | Minor issues or weak validation.                        | Fix in next update |
| 🔵 **Info**   | No direct risk; informational.                          | Optional fix       |

---

## 4️⃣ Findings (Round 2)

Screenshots are taken from the folder `BookingSystem-Phase1/Screenshots_round2/`.

| ID       | Severity  | Finding                                                | Description                                                                                                                                                                      | Evidence                                                                                                                                                                                                                                                                                                                                                                                                          |   |   |
| -------- | --------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | - | - |
| **F-01** | 🟡 Low    | Missing Required Field Validation (Still Browser Only) | Form still relies on browser validation for empty fields; backend does not enforce "required" when bypassed.                                                                     | BookingSystem-Phase1/Screenshots_round2/testcase1.png                                                                                                                                                                                                                                                                                                                                                             |   |   |
| **F-02** | 🔵 Info   | Email Validation Improved                              | Previously accepted invalid emails like `123@1`. Now backend returns: *"Invalid email address"*.                                                                                 | BookingSystem-Phase1/Screenshots_round2/testcase2.png                                                                                                                                                                                                                                                                                                                                                             |   |   |
| **F-03** | 🔵 Info   | Valid Registration Works                               | Form processes correct inputs successfully, returning confirmation page.                                                                                                         | BookingSystem-Phase1/Screenshots_round2/testcase3.png                                                                                                                                                                                                                                                                                                                                                             |   |   |
| **F-04** | 🟠 Medium | SQL-like Input Partially Blocked but Still Reachable   | Adding `novalidate` and injecting SQL-like strings (e.g., `' OR '1'='1`) no longer bypasses backend email validation, but input still reaches backend → sanitization incomplete. | BookingSystem-Phase1/Screenshots_round2/testcase4.1.png BookingSystem-Phase1/Screenshots_round2/testcase4.2.png                                                                                                                                                                                                                                                                                                   |   |   |
| **F-05** | 🟡 Low    | Date-of-Birth Validation Missing                       | Invalid dates (e.g., `99/99/9999`) or unrealistic birthdays are accepted, registration still succeeds.                                                                           | BookingSystem-Phase1/Screenshots_round2/testcase5.png BookingSystem-Phase1/Screenshots_round2/testcase5.1.1.png BookingSystem-Phase1/Screenshots_round2/testcase5.1.2.png BookingSystem-Phase1/Screenshots_round2/testcase5.2.1.png BookingSystem-Phase1/Screenshots_round2/testcase5.2.2.png BookingSystem-Phase1/Screenshots_round2/testcase5.3.1.png BookingSystem-Phase1/Screenshots_round2/testcase5.3.2.png |   |   |

## 5️⃣ OWASP ZAP Report (Round 2 Attachment)

The full ZAP automated scan report (Round 2) is stored as:
**`ZAP/zap_report_round2.md`**

Link: `./ZAP/zap_report_round2.md`

---

## 6️⃣ Conclusion

The Part 2 release demonstrates clear improvements — email validation and password rules are now enforced server-side. However, backend validation is still incomplete, particularly for the birthdate field. SQL injection attempts are sanitized, but deeper backend validation is still recommended.

### **Remaining Risks:**

* Birthdate validation absent.
* Potential backend sanitization gaps.
* No anti-bot/rate limiting.

### **Recommendations:**

* Implement backend validation for **ALL** fields.
* Add rate limiting & CAPTCHA.
* Improve error message consistency.
* Harden sanitization across all inputs.

---

## 7️⃣ Appendix – Executed Test Cases (Round 2)

| Test Case | Input                            | Expected                       | Actual Result                                                   |
| --------- | -------------------------------- | ------------------------------ | --------------------------------------------------------------- |
| TC‑01     | Empty fields                     | Validation error               | Browser blocks input; backend untested unless bypassed          |
| TC‑02     | Invalid email                    | Should reject                  | Proper server-side error shown                                  |
| TC‑03     | Valid registration               | Success                        | Works as expected                                               |
| TC‑04     | SQL-like input, using novalidate | Should be sanitized & rejected | Backend rejects email format, but payload still reaches backend |
| TC‑05     | Invalid birthdate                | Should reject                  | **Accepted → security/privacy weakness**                        |

---

**End of Round 2 Report**
