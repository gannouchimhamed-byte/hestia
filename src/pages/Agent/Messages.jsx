import { useState } from 'react'
import { MESSAGES } from '../../hooks/useAgentData'

export default function AgentMessages() {
  const [msgs, setMsgs]   = useState(MESSAGES)
  const [active, setActive] = useState(msgs[0])
  const [text, setText]   = useState('')
  const [conv, setConv]   = useState({
    1: [{ from:'them', text:'Can we schedule a viewing for Saturday?', time:'09:32' }, { from:'them', text:'I am very interested in the property.', time:'09:33' }],
    2: [{ from:'them', text:'What is the final price after negotiation?', time:'08:15' }],
    3: [{ from:'them', text:'I would like to move forward with the offer.', time:'Yesterday' }],
    4: [{ from:'them', text:'Please send the contract documents.', time:'Yesterday' }],
  })

  function send() {
    if (!text.trim() || !active) return
    const msg = { from:'me', text: text.trim(), time: new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}) }
    setConv(c => ({ ...c, [active.id]: [...(c[active.id]||[]), msg] }))
    setText('')
    setMsgs(m => m.map(x => x.id === active.id ? { ...x, unread:0, msg:text.trim() } : x))
  }

  function markRead(m) {
    setActive(m)
    setMsgs(prev => prev.map(x => x.id === m.id ? {...x, unread:0} : x))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-400 text-sm mt-0.5">{msgs.filter(m=>m.unread>0).length} unread conversations</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex" style={{height:'calc(100vh - 220px)', minHeight:480}}>
        {/* Conversation list */}
        <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input placeholder="Search..." className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {msgs.map(m => (
              <div key={m.id} onClick={() => markRead(m)}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors
                  ${active?.id === m.id ? 'bg-primary-soft/40 border-r-2 border-r-primary' : ''}`}>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {m.avatar}
                  </div>
                  {m.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {m.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm ${m.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{m.name}</span>
                    <span className="text-xs text-gray-400">{m.time}</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate">{m.msg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {active ? (
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">{active.avatar}</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{active.name}</div>
                <div className="text-xs text-gray-400">{active.phone}</div>
              </div>
              <div className="ml-auto flex gap-2">
                <a href={`tel:${active.phone}`} className="w-8 h-8 rounded-xl bg-primary-soft text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <i className="fas fa-phone text-xs" />
                </a>
                <a href={`https://wa.me/${active.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-[#25d366] text-white flex items-center justify-center hover:bg-[#128c7e] transition-colors">
                  <i className="fab fa-whatsapp text-xs" />
                </a>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {(conv[active.id]||[]).map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                    msg.from === 'me'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <input value={text} onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && send()}
                  placeholder={`Message ${active.name}...`}
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary" />
                <button onClick={send} disabled={!text.trim()}
                  className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50">
                  <i className="fas fa-paper-plane text-sm" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-300 flex-col gap-3">
            <i className="fas fa-comment-dots text-4xl" />
            <p className="text-sm font-semibold">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  )
}
