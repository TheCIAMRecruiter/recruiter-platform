const GH_BASE = "https://harvest.greenhouse.io/v1";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: "Missing path" });

  const ghUrl = `${GH_BASE}/${Array.isArray(path) ? path.join("/") : path}`;
  const auth = Buffer.from(`${process.env.GREENHOUSE_API_KEY}:`).toString("base64");

  const headers = {
    "Authorization": `Basic ${auth}`,
    "Content-Type": "application/json",
    "On-Behalf-Of": process.env.GREENHOUSE_USER_ID,
  };

  try {
    const ghRes = await fetch(ghUrl, {
      method: req.method,
      headers,
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });
    const data = await ghRes.json();
    return res.status(ghRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
