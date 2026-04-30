export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ status: "FAIL", reason: "OPENAI_API_KEY is missing from environment" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 20,
        messages: [{ role: "user", content: "Say hello." }],
      }),
    });

    const raw = await response.text();

    return res.status(200).json({
      status: response.ok ? "OK" : "FAIL",
      http_status: response.status,
      key_prefix: apiKey.slice(0, 12) + "...",
      raw_response: raw.slice(0, 300),
    });
  } catch (err) {
    return res.status(200).json({ status: "FAIL", reason: err.message });
  }
}
