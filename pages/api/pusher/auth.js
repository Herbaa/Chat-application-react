import { pusherServer } from "../../../lib/pusher"

export default async function handler(req, res) {
  const { socket_id, channel_name, username } = req.body

  const data = {
    user_id: socket_id,
    user_info: { username },
  }

  const auth = pusherServer.authorizeChannel(
    socket_id,
    channel_name,
    data
  )

  return res.status(200).json(auth)
}