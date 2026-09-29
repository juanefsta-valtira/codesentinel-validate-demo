# codesentinel-validate-demo

Minimal Express API with **exactly 2 intentional vulnerabilities** for testing **Validate / Rescan** (Track A-07) on a clean scan.

## Run

```bash
npm install
npm run dev
```

## Intentional issues (only 2)

| # | Issue | Location | CWE (typical) |
| --- | --- | --- | --- |
| 1 | Hardcoded `ADMIN_API_KEY` fallback | `src/server.ts:7` | CWE-798 |
| 2 | Unauthenticated `GET /internal/items` exposes `secretNote` | `src/server.ts:35` | CWE-200 / CWE-306 |

## QA flow

See **[QA.md](./QA.md)** for scan → fix → Validate → Rescan steps.
