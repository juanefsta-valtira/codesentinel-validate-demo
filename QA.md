# QA — Validate demo (A-07 retest)

Use this repo when you want a **small scan** (expect ~2 main findings, not 20).

## Before scan

```bash
git rev-parse HEAD   # record as Commit SHA
```

## A-02 — Scan

1. **New Project** → `https://github.com/<you>/codesentinel-validate-demo`
2. All models (or at least Claude)
3. Record `scan_id` from URL `/dashboard/scans/{scan_id}`

## A-06 — Two fixes (only these)

### Fix 1 — Remove hardcoded API key (VULN 1)

Replace lines 7–8:

```ts
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "validate-demo-leaked-key-12345";
```

With:

```ts
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
if (!ADMIN_API_KEY) {
  throw new Error("ADMIN_API_KEY environment variable is required");
}
```

### Fix 2 — Protect `/internal/items` (VULN 2)

Replace the handler at ~line 35:

```ts
app.get("/internal/items", (_req: Request, res: Response) => {
  res.json(items);
});
```

With:

```ts
app.get("/internal/items", requireAdminKey, (_req: Request, res: Response) => {
  res.json(items);
});
```

```bash
git add src/server.ts
git commit -m "fix: require ADMIN_API_KEY and protect /internal/items"
git push
git rev-parse HEAD   # post-fix SHA
```

## A-07 — Validate

On the **same report** (before Rescan):

| Finding | After Validate |
| --- | --- |
| Hardcoded API key (~L7) | **fixed** (green) |
| Unauthenticated `/internal/items` (~L35) | **fixed** (green) |
| (optional) pick any other finding if scan finds extras | **still_present** if you did not fix it |

**FAIL** if remediated findings stay amber (`still_present`) with post-fix code on GitHub.

**PASS** if at least one fixed → green and one unchanged → amber, and **no new row**.

## A-08 — Rescan

**Rescan** on the project (not New Project). Same `scan_id`, count may drop, never grow, zero new fingerprints.
