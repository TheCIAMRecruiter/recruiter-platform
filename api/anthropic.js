export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set in environment variables" });

  let rawText = "";
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: req.body.max_tokens || 1000,
        messages: req.body.messages,
      }),
    });

    rawText = await response.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(500).json({ error: "Anthropic returned invalid JSON: " + rawText.slice(0, 200) });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Anthropic error: " + JSON.stringify(data) });
    }

    const text = data.content?.[0]?.text || "";
    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    return res.status(500).json({ error: "Fetch failed: " + err.message + (rawText ? " | Raw: " + rawText.slice(0, 200) : "") });
  }
}
