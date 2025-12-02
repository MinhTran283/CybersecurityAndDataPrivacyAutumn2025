Booking System – Phase 1 / Part 2 Penetration Test Report (Round 2)
1️⃣ Introduction

Tester(s):
Name: Minh Tran

Purpose:
Re-test the updated Booking System (Phase 1 / Part 2) to verify whether the Top 5 findings from Round 1 have been fixed, and to identify new security or privacy issues in the updated registration flow.

Scope:
Tested components: Registration form, backend validation, sanitization, error handling, personal data processing behavior.
Exclusions: Login, reservations, admin panel, MFA, email verification.

Test approach: Gray-box

Environment & Dates:
Start: 2025-11-29
End: 2025-11-29
OS: Windows 11
Backend: Docker: PostgreSQL + BookingSystem Phase 1 Part 2
Browsers: Chrome
Tools: OWASP ZAP 2.14.0, DevTools

Assumptions & Constraints:

Backend code still not provided.

Only registration feature available.

Tester uses same machine and environment as Round 1.

2️⃣ Executive Summary

The updated system has fixed several validation flaws from Round 1, including email and password validation.
However, backend validation is still incomplete (e.g., birthdate not validated), and SQL injection injection is now blocked earlier but still relies heavily on frontend behavior.

Overall Risk Level: Medium

Top 5 Immediate Actions (Round 2)

Add server-side validation for birthdate (currently missing).

Add server-side input sanitization for all fields.

Add backend password policy enforcement (currently works but must be server-side).

Improve error messages to avoid leaking validation logic.

Add backend-level validation to prevent client-side bypass (no reliance on browser rules).

3️⃣ Severity Definitions
Severity	Description	Recommended Action
🔴 High	Major vulnerability → system compromise (e.g., SQLi)	Immediate fix
🟠 Medium	Significant issue (validation/injection risk)	Fix ASAP
🟡 Low	Minor flaw or privacy misalignment	Fix soon
🔵 Info	No direct risk	Optional
4️⃣ Findings (Round 2)

Below are the 5 findings for Round 2, each with screenshot evidence.

F-01 — Missing Required Field Validation Still Works (Partially Fixed)

Severity: 🟡 Low
Description:
System still relies partly on browser validation. When novalidate is forced, backend still accepts some fields incorrectly.

Screenshot: BookingSystem-Phase1/Screenshots_round2/testcase1.png


F-02 — Email Format Validation Now Correct (FIXED)

Severity: 🔵 Info
Description:
Backend now properly rejects invalid email formats. This was broken in Round 1 and is now confirmed fixed.

Screenshot: BookingSystem-Phase1/Screenshots_round2/testcase2.png


F-03 — Valid Registration Works (Expected Behavior)

Severity: 🔵 Info
Description:
System correctly registers user with valid data.

Screenshot: BookingSystem-Phase1/Screenshots_round2/testcase3.png


F-04 — SQL Injection Attempt Blocked by Email Validation (Partially FIXED)

Severity: 🟠 Medium
Description:
SQL injection using test@test.com' OR '1'='1 is now blocked because email validation rejects symbols after @.
However, this is still frontend & format-based blocking, not true backend sanitization.

Screenshots: BookingSystem-Phase1/Screenshots_round2/testcase4.1.png
BookingSystem-Phase1/Screenshots_round2/testcase4.2.png


F-05 — Birthdate Validation Still Weak (NOT FIXED)

Severity: 🟡 Low
Description:
Backend does not validate birthdate.
Weak or invalid birthdates (e.g., 99/99/9999) still result in successful registration.
This indicates lack of backend validation.

Screenshot: BookingSystem-Phase1/Screenshots_round2/testcase5.png
BookingSystem-Phase1/Screenshots_round2/testcase5.1.1.png
BookingSystem-Phase1/Screenshots_round2/testcase5.1.2.png
BookingSystem-Phase1/Screenshots_round2/testcase5.2.1.png
BookingSystem-Phase1/Screenshots_round2/testcase5.2.2.png
BookingSystem-Phase1/Screenshots_round2/testcase5.3.1.png
BookingSystem-Phase1/Screenshots_round2/testcase5.3.2.png

5️⃣ OWASP ZAP Report (Round 2)

Full automated ZAP scan results for Round 2 are stored in:

➡️ ZAP/zap_report_round2.md

Please refer to that file for the complete list of warnings, spider results, alerts, and passive scan output.

6️⃣ Conclusion

The updated system fixes several Round 1 issues, especially:

✔ Proper email validation
✔ Password strength validation
✔ SQL injection blocked due to improved filtering

However, the system still suffers from:

❌ Weak backend validation
❌ Improper birthdate validation
❌ Over-reliance on browser-side behavior
❌ Missing sanitization layers

Recommended Next Steps

Validate and sanitize everything on backend.

Add consistent validation for birthdate and role fields.

Implement uniform error structure for privacy safety.

Improve backend logging to detect malicious inputs.

7️⃣ Appendix — Test Cases Executed (Round 2)
Test Case	Input	Expected	Actual	Status
TC-01	Empty fields	Browser errors	Works as expected	✅
TC-02	Invalid email	Validation error	Correct error	Fixed
TC-03	Valid registration	Success	Success	✅
TC-04	SQL injection	Rejected	Blocked due to email check	⚠ Partially fixed
TC-05	Invalid birthdate	Should be rejected	Still accepted	❌ Not fixedgit branch
