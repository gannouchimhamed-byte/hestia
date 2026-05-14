import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' }
  const colors = { success: 'bg-emerald-600', error: 'bg-red-600', warning: 'bg-amber-500', info: 'bg-gray-800' }

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-24 right-4 z-[9999] flex flex-col gap-2 pointer-events-none sm:bottom-6 sm:right-6">
        {toasts.map(t => (
          <div key={t.id} className={`${colors[t.type]} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium animate-fade-up max-w-xs sm:max-w-sm`}>
            <i className={`fas ${icons[t.type]} flex-shrink-0`} />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
