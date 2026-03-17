import { prisma } from "../../lib/prisma"
import { pusherServer } from "../../lib/pusher"

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Метод не поддерживается" })
  }

  await prisma.message.deleteMany()

  await pusherServer.trigger("chat-channel", "chat-cleared", {})

  return res.status(200).json({ success: true })
}