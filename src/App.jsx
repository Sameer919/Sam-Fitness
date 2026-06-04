import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, lazy, Suspense } from 'react'
import ErrorBoundary from './components/ui/ErrorBoundary'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AIAssistant from './components/ai/AIAssistant'


// Lazy-load all pages
const Home           = lazy(() => import('./pages/Home'))
const About          = lazy(() => import('./pages/About'))
const Membership     = lazy(() => import('./pages/Membership'))
const Classes        = lazy(() => import('./pages/Classes'))
const Trainers       = lazy(() => import('./pages/Trainers'))
const Facilities     = lazy(() => import('./pages/Facilities'))
const Transformation = lazy(() => import('./pages/Transformation'))
const GoalFinder     = lazy(() => import('./pages/GoalFinder'))
const BMICalculator  = lazy(() => import('./pages/BMICalculator'))
const Contact        = lazy(() => import('./pages/Contact'))
const Login          = lazy(() => import('./pages/Login'))
const Dashboard      = lazy(() => import('./pages/Dashboard'))
const Admin          = lazy(() => import('./pages/Admin'))
const Signup         = lazy(() => import('./pages/Signup'))

// Full-page loading spinner
function PageLoader() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-slate-100 border-t-primary-600 animate-spin" />
      <p className="text-slate-400 text-sm font-medium">Loading…</p>
    </div>
  )
}

// Page transition wrapper
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Route Protectors
function AdminRoute({ children }) {
  const token = localStorage.getItem('adminToken')
  return token ? children : <Navigate to="/login" replace />
}

function MemberRoute({ children }) {
  const session = localStorage.getItem('memberSession')
  return session ? children : <Navigate to="/login" replace />
}

// Floating WhatsApp button
function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20Sam Fitness."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-13 h-13 flex items-center justify-center
                 bg-green-500 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl
                 transition-all duration-200"
      aria-label="Chat on WhatsApp"
      style={{ width: 52, height: 52 }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppContent() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-white">
      <ErrorBoundary>
        <Navbar />
      </ErrorBoundary>

      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"               element={<ErrorBoundary><PageTransition><Home /></PageTransition></ErrorBoundary>} />
            <Route path="/about"          element={<ErrorBoundary><PageTransition><About /></PageTransition></ErrorBoundary>} />
            <Route path="/membership"     element={<ErrorBoundary><PageTransition><Membership /></PageTransition></ErrorBoundary>} />
            <Route path="/classes"        element={<ErrorBoundary><PageTransition><Classes /></PageTransition></ErrorBoundary>} />
            <Route path="/trainers"       element={<ErrorBoundary><PageTransition><Trainers /></PageTransition></ErrorBoundary>} />
            <Route path="/facilities"     element={<ErrorBoundary><PageTransition><Facilities /></PageTransition></ErrorBoundary>} />
            <Route path="/transformation" element={<ErrorBoundary><PageTransition><Transformation /></PageTransition></ErrorBoundary>} />
            <Route path="/goal-finder"    element={<ErrorBoundary><PageTransition><GoalFinder /></PageTransition></ErrorBoundary>} />
            <Route path="/bmi-calculator" element={<ErrorBoundary><PageTransition><BMICalculator /></PageTransition></ErrorBoundary>} />
            <Route path="/contact"        element={<ErrorBoundary><PageTransition><Contact /></PageTransition></ErrorBoundary>} />
            
            <Route path="/login"          element={<ErrorBoundary><PageTransition><Login /></PageTransition></ErrorBoundary>} />
            <Route path="/signup"         element={<ErrorBoundary><PageTransition><Signup /></PageTransition></ErrorBoundary>} />
            <Route path="/dashboard"      element={<ErrorBoundary><MemberRoute><PageTransition><Dashboard /></PageTransition></MemberRoute></ErrorBoundary>} />
            <Route path="/admin"          element={<ErrorBoundary><AdminRoute><PageTransition><Admin /></PageTransition></AdminRoute></ErrorBoundary>} />
            
            <Route path="*"               element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>

      <WhatsAppFloat />

      <ErrorBoundary>
        <AIAssistant />
      </ErrorBoundary>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}
