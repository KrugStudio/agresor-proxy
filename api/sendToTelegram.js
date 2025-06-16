export default async function handler(req, res) {
  const { message } = req.body;

  const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  });

  if (response.ok) return res.status(200).json({ success: true });
  return res.status(500).json({ error: "Failed to send" });
}
