import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiMenuLine, RiCloseLine, RiArrowRightLine, RiUserLine, RiShieldUserLine, RiLogoutBoxRLine } from 'react-icons/ri'

const navLinks = [
  { label: 'Home',            href: '/' },
  { label: 'About',           href: '/about' },
  { label: 'Classes',         href: '/classes' },
  { label: 'Trainers',        href: '/trainers' },
  { label: 'Facilities',      href: '/facilities' },
  { label: 'Transformations', href: '/transformation' },
  { label: 'Membership',      href: '/membership' },
]

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(() => {
    return !!localStorage.getItem('adminToken')
  })
  const [isMember, setIsMember] = useState(() => {
    return !!localStorage.getItem('memberSession')
  })
  const [memberName, setMemberName] = useState(() => {
    const memberSession = localStorage.getItem('memberSession')
    if (memberSession) {
      try {
        const parsed = JSON.parse(memberSession)
        return parsed.name || 'Member'
      } catch {
        return ''
      }
    }
    return ''
  })
  const location = useLocation()

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem('adminToken')
      const memberSession = localStorage.getItem('memberSession')
      
      setIsAdmin(!!adminToken)
      setIsMember(!!memberSession)
      
      if (memberSession) {
        try {
          const parsed = JSON.parse(memberSession)
          setMemberName(parsed.name || 'Member')
        } catch {
          setMemberName('Member')
        }
      } else {
        setMemberName('')
      }
    }

    // Listen for custom login/logout events
    window.addEventListener('authChange', checkAuth)
    return () => window.removeEventListener('authChange', checkAuth)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('memberSession')
    window.dispatchEvent(new Event('authChange'))
  }

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-100' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-sky flex items-center justify-center shadow-btn">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className={`font-display font-extrabold text-xl transition-colors ${
              scrolled ? 'text-slate-900' : 'text-white'
            }`}>
              Sam <span className="text-primary-400">Fitness</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-155 ${
                  location.pathname === link.href
                    ? 'text-primary-600 bg-primary-50'
                    : scrolled
                      ? 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {isAdmin ? (
              <>
                <Link to="/admin" className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  scrolled ? 'text-secondary-600 hover:text-slate-900' : 'text-secondary-300 hover:text-white'
                }`}>
                  <RiShieldUserLine className="text-lg" /> Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold flex items-center gap-1"
                >
                  <RiLogoutBoxRLine /> Sign Out
                </button>
              </>
            ) : isMember ? (
              <>
                <Link to="/dashboard" className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${
                  scrolled ? 'text-primary-600 hover:text-slate-900' : 'text-primary-300 hover:text-white'
                }`}>
                  <RiUserLine className="text-lg" /> {memberName.split(' ')[0]}'s Portal
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold flex items-center gap-1"
                >
                  <RiLogoutBoxRLine /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-semibold transition-colors ${
                  scrolled ? 'text-slate-600 hover:text-primary-600' : 'text-white/90 hover:text-white'
                }`}>
                  Sign In
                </Link>
                <Link to="/membership" className="btn-primary text-sm px-5 py-2.5 rounded-xl">
                  Join Now <RiArrowRightLine />
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {open ? <RiCloseLine className="text-2xl" /> : <RiMenuLine className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="container-custom py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-slate-100 my-2 pt-2 space-y-2">
                {isAdmin ? (
                  <>
                    <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-secondary-600 hover:bg-slate-50">
                      <RiShieldUserLine className="text-lg" /> Admin Panel
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setOpen(false) }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 text-left"
                    >
                      <RiLogoutBoxRLine className="text-lg" /> Sign Out
                    </button>
                  </>
                ) : isMember ? (
                  <>
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-primary-600 hover:bg-slate-50">
                      <RiUserLine className="text-lg" /> {memberName}'s Portal
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setOpen(false) }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 text-left"
                    >
                      <RiLogoutBoxRLine className="text-lg" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="block text-center px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">
                      Sign In
                    </Link>
                    <Link to="/membership" onClick={() => setOpen(false)} className="btn-primary w-full text-center block">
                      Join Now — Free Trial
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
