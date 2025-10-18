---
name: Bug report
about: Create a clear, reproducible bug report so we can fix problems quickly.
title: '[BUG] '
labels: bug
assignees: ''
---

**Short description**

A one-line summary of the problem (what broke):

```
e.g. Sending a message sometimes fails with 500 when attachments are present
```

**Steps to reproduce**

Please provide precise reproduction steps so we can reproduce locally. Include sample data where possible.

1. Go to `Chat` → open conversation with `User A`
2. Click the attachment button and select `large-image.png` (~5MB)
3. Click **Send**

**Expected behavior**

What you expected to happen.

**Actual behavior**

What actually happened (include error messages / stack traces / HTTP responses).

**Reproduction environment**

- App version: (e.g. `0.1.0`)
- Browser (name and version):
- OS: (Windows/macOS/Linux)
- Node version (if applicable):
- Backend / API version (if known):
- Relevant env settings (e.g. `VITE_API_URL` pointing to staging?)

**Logs & screenshots**

Attach logs, network traces, or screenshots. For network/API failures, include the failing request & response (status, body).

**Severity / priority** (helpful)

- P0 — production blocker (paying customers affected, data loss)
- P1 — high (major functionality broken)
- P2 — medium (minor UX or non-critical feature)
- P3 — low (trivial or cosmetic)

**Additional context**

Any other information that might help (related PRs, recent deploys, workarounds).
