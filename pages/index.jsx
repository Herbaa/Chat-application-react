import { useState, useEffect, useRef } from "react"
import Head from "next/head"
import Pusher from "pusher-js"
import MessageBubble from "../components/MessageBubble"

export default function Home() {
  const [username, setUsername] = useState("")
  const [joined, setJoined] = useState(false)
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false) 
  const bottomRef = useRef(null);

  // загрузка истории чата
  useEffect(() => {
    if (!joined) return
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setMessages(data))
  }, [joined])

  useEffect(() => {
    if (!joined) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })

    const channel = pusher.subscribe("chat-channel")

    channel.bind("new-message", (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev // Защита от дублей
        return [...prev, msg]
      })
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe("chat-channel")
    }
  }, [joined])

  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, text }),
      })
      setText("");
    } finally {
      setSending(false);
    }
  }

  // страница входа
  if (!joined) {
    return (
      <>
        <Head><title>Chat</title></Head>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">

            <h1 className="text-3xl font-bold mb-2 text-slate-100">
              Chat
            </h1>

            <p className="text-slate-400 text-sm mb-6">
              Real-time чат на Next.js + Pusher + SQLite
            </p>

            <input
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors mb-3"
              placeholder="Введи свое имя..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-colors"
              disabled={!username.trim()}
              onClick={() => setJoined(true)}
            >
              Войти в чат
            </button>

          </div>
        </div>
      </>
    )
  }

  // страница с чатом
  return (
    <>
      <Head><title>Chat | {username}</title></Head>

      <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">

        <aside className="w-52 bg-slate-900 border-r border-slate-800 flex flex-col p-4 gap-4">

          <h1 className="text-xl font-bold text-slate-100">Chat</h1>

          {/* Иконка */}
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {username[0]?.toUpperCase()} 
            </div>
            <div>
              <div className="text-sm font-semibold">{username}</div>
              <div className="text-xs text-emerald-400">онлайн</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">
              Статистика
            </div>
              <div className="text-xs text-slate-300 font-semibold">Всего сообщений: {messages.length}</div>
          </div>

          <div className="mt-auto text-xs text-slate-600 text-center"> 
            Next.js + Pusher + SqLite
          </div>

        </aside>


        {/* сам чат */}
        <main className="flex-1 flex flex-col overflow-hidden">

          <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
            <div className="text-sm font-semibold text-slate-300">Чат</div>
            <div className="text-xs text-slate-500">Real-time чат</div>
          </header>

          {/* сообщения */}
          <div className="flex-1 overflow-y-auto p-6">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.username === username}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex gap-3"
          >
            <input
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 transition-colors"
              placeholder="Напишите сообщение..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl w-12 h-12 text-lg transition-colors flex items-center justify-center"
            >
              {sending ? "…" : "->"}
            </button>
          </form>

        </main>
      </div>
    </>
  )
}