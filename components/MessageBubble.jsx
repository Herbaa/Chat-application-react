export default function MessageBubble({ message, isOwn }) {

  // время в формате чч:мм
  const time = new Date(message.createdAt).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className={`flex flex-col mb-4 ${isOwn ? "items-end" : "items-start"}`}>

      {!isOwn && ( // если мое соо - имя не показывается
        <span className="text-xs text-slate-500 mb-1 ml-1">
          {message.username}
        </span>
      )}

      <div className={`
        max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${isOwn
          ? "bg-indigo-600 text-white rounded-br-sm shadow-lg shadow-indigo-500/30"
          : "bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700"
        }
      `}>
        {message.text}
      </div>

      <span className={`text-xs text-slate-600 mt-1 ${isOwn ? "mr-1" : "ml-1"}`}>
        {time}
      </span>

    </div>
  )
}