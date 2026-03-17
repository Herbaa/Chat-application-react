import { prisma } from "../../lib/prisma"
import { pusherServer } from "../../lib/pusher"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не поддерживается" })
  }

  const { username, text } = req.body

  if (!username?.trim() || !text?.trim()) {
    return res.status(400).json({ error: "Имя и текст обязательны" })
  }

  const message = await prisma.message.create({
    data: {
      username: username.trim().toLowerCase(),
      text: text.trim(),
    },
  })

  await pusherServer.trigger("chat-channel", "new-message", message)

  return res.status(200).json(message)
}