import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

// Fixed A-06 #1: no hardcoded fallback
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
if (!ADMIN_API_KEY) {
  throw new Error("ADMIN_API_KEY environment variable is required");
}

type Item = { id: number; name: string; secretNote: string };

const items: Item[] = [
  { id: 1, name: "Widget", secretNote: "internal-only" },
  { id: 2, name: "Gadget", secretNote: "do not expose" },
];

function requireAdminKey(req: Request, res: Response, next: () => void) {
  const key = req.headers["x-api-key"];
  if (key !== ADMIN_API_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/items", (_req, res) => {
  res.json(items.map(({ secretNote: _, ...publicFields }) => publicFields));
});

// Fixed A-06 #2: admin key required for internal data
app.get("/internal/items", requireAdminKey, (_req: Request, res: Response) => {
  res.json(items);
});

app.post("/items", requireAdminKey, (req: Request, res: Response) => {
  const name = String(req.body?.name ?? "unnamed");
  const item: Item = {
    id: items.length + 1,
    name,
    secretNote: "created via admin",
  };
  items.push(item);
  res.status(201).json(item);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`validate-demo listening on ${PORT}`);
});

export default app;
