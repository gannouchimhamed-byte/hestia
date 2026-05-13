import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { ToastProvider } from './hooks/useToast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PropertyDetail from './pages/PropertyDetail'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/property/:id" element={<PropertyDetail />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
