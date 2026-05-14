import { useState } from 'react'
import { CALENDAR_EVENTS } from '../../hooks/useAgentData'
import { useToast } from '../../hooks/useToast'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const TYPE_STYLE = {
  viewing: 'bg-primary-soft text-primary border-primary/20',
  call:    'bg-blue-50 text-blue-700 border-blue-200',
  meeting: 'bg-amber-50 text-amber-700 border-amber-200',
}

function makeICS(event, year, month) {
  const [h, m] = (event.time || '10:00').split(':').map(Number)
  const d = new Date(year, month, event.day, h, m)
  const end = new Date(d.getTime() + 3600000)
  const fmt = dt => dt.toISOString().replace(/[-:]/g,'').replace('.000','')
  return `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Hestia//EN\r\nBEGIN:VEVENT\r\nUID:${Date.now()}@hestia.tn\r\nDTSTAMP:${fmt(new Date())}Z\r\nDTSTART:${fmt(d)}\r\nDTEND:${fmt(end)}\r\nSUMMARY:${event.text}\r\nEND:VEVENT\r\nEND:VCALENDAR`
}

function getGCalLink(event, year, month) {
  const [h, m] = (event.time || '10:00').split(':').map(Number)
  const pad = n => String(n).padStart(2,'0')
  const base = `${year}${pad(month+1)}${pad(event.day)}T${pad(h)}${pad(m)}00`
  const endH = h + 1
  const endBase = `${year}${pad(month+1)}${pad(event.day)}T${pad(endH)}${pad(m)}00`
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${base}/${endBase}`
}

export default function AgentCalendar() {
  const toast = useToast()
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selected, setSel] = useState(null)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayDay = now.getDate()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  function prevMonth() { if (month === 0) { setYear(y => y-1); setMonth(11) } else setMonth(m => m-1) }
  function nextMonth() { if (month === 11) { setYear(y => y+1); setMonth(0) } else setMonth(m => m+1) }

  function downloadICS(event) {
    const ics = makeICS(event, year, month)
    const blob = new Blob([ics], { type:'text/calendar' })
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob)
    a.download=`hestia-${event.text.replace(/\s+/g,'-')}.ics`; a.click()
    toast('Calendar event downloaded', 'success')
  }

  function exportAll() {
    const all = CALENDAR_EVENTS.map(e => makeICS(e, year, month)).join('\r\n')
    const blob = new Blob([all], { type:'text/calendar' })
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob)
    a.download=`hestia-${MONTHS[month]}-${year}.ics`; a.click()
    toast('All events exported', 'success')
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-400 text-sm mt-0.5">{MONTHS[month]} {year}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportAll} className="btn-ghost text-sm">
            <i className="fas fa-calendar-plus" /> Export All (.ics)
          </button>
          <button onClick={prevMonth} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all">
            <i className="fas fa-chevron-left text-xs" />
          </button>
          <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()) }} className="btn-ghost text-sm">Today</button>
          <button onClick={nextMonth} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all">
            <i className="fas fa-chevron-right text-xs" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map(d => (
            <div key={d} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const events = day ? CALENDAR_EVENTS.filter(e => e.day === day) : []
            const isToday = isCurrentMonth && day === todayDay
            const isSelected = selected?.day === day
            return (
              <div key={i}
                className={`min-h-24 p-2 border-b border-r border-gray-100 last:border-r-0 cursor-pointer transition-colors
                  ${day ? 'hover:bg-gray-50' : 'bg-gray-50/50'}
                  ${isSelected ? 'bg-primary-soft/40' : ''}`}
                onClick={() => day && setSel(events.length ? { day, events } : null)}>
                {day && (
                  <>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mb-1 mx-auto
                      ${isToday ? 'bg-primary text-white' : 'text-gray-700'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {events.slice(0,2).map((e,j) => (
                        <div key={j} className={`text-xs px-1.5 py-0.5 rounded truncate border font-medium ${TYPE_STYLE[e.type] || TYPE_STYLE.meeting}`}>
                          {e.time} {e.text}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-xs text-gray-400 font-semibold px-1">+{events.length-2} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <i className="fas fa-clock text-primary text-sm" /> Upcoming Events
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {CALENDAR_EVENTS.sort((a,b) => a.day-b.day).map((e, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${e.type==='viewing'?'bg-primary':e.type==='call'?'bg-blue-500':'bg-amber-500'}`} />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800">{e.text}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {MONTHS[month].slice(0,3)} {e.day}, {year} · {e.time}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a href={getGCalLink(e, year, month)} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.6 2.2 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.8 6.1C12.3 13.1 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/><path fill="#FBBC05" d="M10.4 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.9-4.6L2.6 13.3A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.7-3.6-13.6-9.2l-7.8 6.1C6.6 42.6 14.6 48 24 48z"/></svg>
                  Google Cal
                </a>
                <button onClick={() => downloadICS(e)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <i className="fas fa-calendar-plus text-xs" /> .ics
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{MONTHS[month]} {selected.day}</h3>
              <button onClick={() => setSel(null)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400"><i className="fas fa-times text-sm" /></button>
            </div>
            <div className="space-y-3">
              {selected.events.map((e, i) => (
                <div key={i} className={`p-3 rounded-xl border ${TYPE_STYLE[e.type] || TYPE_STYLE.meeting}`}>
                  <div className="font-semibold text-sm">{e.text}</div>
                  <div className="text-xs mt-0.5 opacity-70">{e.time}</div>
                  <div className="flex gap-2 mt-2">
                    <a href={getGCalLink(e, year, month)} target="_blank" rel="noreferrer"
                      className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg bg-white/70 hover:bg-white transition-colors">
                      Add to Google Cal
                    </a>
                    <button onClick={() => downloadICS(e)} className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-white/70 hover:bg-white transition-colors">
                      Download .ics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
