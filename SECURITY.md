# Security Policy

## 🛡️ Supported Versions

We actively maintain and provide security updates for the following versions of omgovertime:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < 1.0.0 | :white_check_mark: |

---

## 🚨 Reporting a Vulnerability

We take the security of **omgovertime** and our users seriously. If you discover a security vulnerability, we appreciate your help in disclosing it to us responsibly.

### How to Report

Please **do not** open a public GitHub issue for security vulnerabilities. Instead:

1. Send an email to the repository owner or submit a private security advisory on GitHub via **[Security > Report a vulnerability](https://github.com/hasibul2hasan/omgovertime/security/advisories/new)**.
2. Include in your report:
   - A description of the vulnerability and its potential impact.
   - Detailed step-by-step instructions or proof-of-concept (PoC) to reproduce the issue.
   - Suggested mitigations or fixes, if known.

### Response Timeline

- **Initial Acknowledgment**: Within 48 hours of receiving the report.
- **Assessment & Fix**: We will assess the severity, work on a patch, and coordinate a release.
- **Public Disclosure**: After the fix has been deployed and verified.

---

## 🔒 Security Best Practices

omgovertime is a client-side web application built with privacy and security in mind:
- **No Private Data Stored**: All timer state and configuration are kept in the browser runtime/local storage.
- **Zero Tracking**: We do not collect personal identifying information (PII).
- **Web Audio API**: Sounds are generated locally using browser synthesis, minimizing external asset dependency risks.

Thank you for helping keep omgovertime and our community safe! 🛡️
