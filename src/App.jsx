import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { ToastProvider } from './hooks/useToast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PropertyDetail from './pages/PropertyDetail'
import Search from './pages/Search'
import AgentLayout from './layouts/AgentLayout'
import AdminLayout from './layouts/AdminLayout'
import AgentDashboard from './pages/Agent/Dashboard'
import AgentLeads from './pages/Agent/Leads'
const AgentListings = lazy(() => import('./pages/Agent/Listings'))
import AgentCalendar from './pages/Agent/Calendar'
import AgentCommission from './pages/Agent/Commission'
import AgentMessages from './pages/Agent/Messages'
const AgentInquiries = lazy(() => import('./pages/Agent/Inquiries'))
import AdminDashboard from './pages/Admin/Dashboard'
import AdminListings from './pages/Admin/Listings'
import { AdminAgents, AdminFlags, AdminHealth, AdminActivity, AdminBroadcast, AdminUsers } from './pages/Admin/Pages'
import { FavoritesProvider } from './hooks/FavoritesContext'
const Account = lazy(() => import('./pages/Account'))
import NotFound from './pages/NotFound'
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const About = lazy(() => import('./pages/About'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <FavoritesProvider>
          <Suspense fallback={<div className='min-h-screen flex items-center justify-center'><i className='fas fa-circle-notch fa-spin text-primary text-2xl' /></div>}>
          <Routes>
            {/* Client site */}
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/search" element={<><Navbar /><Search /></>} />
            <Route path="/account" element={<><Navbar /><Account /></>} />

            {/* Agent dashboard */}
            <Route path="/agent" element={<AgentLayout />}>
              <Route index element={<AgentDashboard />} />
              <Route path="leads"      element={<AgentLeads />} />
              <Route path="inquiries"  element={<AgentInquiries />} />
              <Route path="messages"   element={<AgentMessages />} />
              <Route path="calendar"   element={<AgentCalendar />} />
              <Route path="listings"   element={<AgentListings />} />
              <Route path="commission" element={<AgentCommission />} />
            </Route>

            {/* Admin panel */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index           element={<AdminDashboard />} />
              <Route path="listings" element={<AdminListings />} />
              <Route path="flags"    element={<AdminFlags />} />
              <Route path="agents"   element={<AdminAgents />} />
              <Route path="users"    element={<AdminUsers />} />
              <Route path="activity" element={<AdminActivity />} />
              <Route path="health"   element={<AdminHealth />} />
              <Route path="broadcast" element={<AdminBroadcast />} />
            </Route>
            <Route path="/about"    element={<><Navbar /><About /></>} />
            <Route path="/privacy" element={<><Navbar /><Privacy /></>} />
            <Route path="/terms"   element={<><Navbar /><Terms /></>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </FavoritesProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
