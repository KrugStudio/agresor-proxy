export default async function handler(req, res) {
  // ✅ Handle preflight (CORS)
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    return res.status(200).end()
  }

  // ✅ Allow from any origin
  res.setHeader("Access-Control-Allow-Origin", "*")

  // ✅ Only POST allowed
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed")

  const { city, date, time, name, phone } = req.body

  const weekday = new Date(date).toLocaleDateString("sr-Latn-ME", {
    weekday: "long",
  })
  const d = new Date(date)
  const formatted = `${weekday} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`

  const message = `
🎲 *Nova prijava za AGRESOR*
🏙 Grad: *${city}*
📆 Datum: *${formatted}*
⏰ Vrijeme: *${time}h*
👤 Ime: *${name}*
📞 Broj: *${phone}*
  `

  const token = process.env.TELEGRAM_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  const telegramRes = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    }
  )

  if (!telegramRes.ok) {
    return res.status(500).json({ error: "Telegram API failed" })
  }

  return res.status(200).json({ success: true })
}
