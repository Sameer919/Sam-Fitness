import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiUser3Line, RiShieldUserLine, RiLockPasswordLine, RiMailLine,
  RiArrowRightLine, RiLoader4Line, RiCloseCircleLine,
  RiEyeLine, RiEyeOffLine
} from 'react-icons/ri'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Login() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('rememberedRole') || 'member'
  })
  const [email, setEmail] = useState(() => {
    const savedRole = localStorage.getItem('rememberedRole') || 'member'
    if (savedRole === 'member') {
      return localStorage.getItem('rememberedEmail') || ''
    } else {
      return localStorage.getItem('rememberedAdmin') || ''
    }
  })
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(() => {
    const savedRole = localStorage.getItem('rememberedRole') || 'member'
    if (savedRole === 'member') {
      return !!localStorage.getItem('rememberedEmail')
    } else {
      return !!localStorage.getItem('rememberedAdmin')
    }
  })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [shake, setShake] = useState(false)
  
  const navigate = useNavigate()

  // Clear or load presets when role changes
  const handleRoleChange = (newRole) => {
    setRole(newRole)
    setErrorMsg('')
    setShowPassword(false)
    
    if (newRole === 'member') {
      const savedEmail = localStorage.getItem('rememberedEmail')
      if (savedEmail) {
        setEmail(savedEmail)
        setRememberMe(true)
      } else {
        setEmail('')
        setRememberMe(false)
      }
      setPassword('')
    } else {
      const savedAdmin = localStorage.getItem('rememberedAdmin')
      if (savedAdmin) {
        setEmail(savedAdmin)
        setRememberMe(true)
      } else {
        setEmail('')
        setRememberMe(false)
      }
      setPassword('')
    }
  }

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin')
    } else if (localStorage.getItem('memberSession')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setShake(false)

    try {
      if (role === 'member') {
        const res = await fetch(`${BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || 'Login failed')
        }

        // Store remember details
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email)
          localStorage.setItem('rememberedRole', 'member')
        } else {
          localStorage.removeItem('rememberedEmail')
        }

        localStorage.setItem('memberSession', JSON.stringify(data.user))
        localStorage.setItem('memberToken', data.token)
        window.dispatchEvent(new Event('authChange'))
        navigate('/dashboard')
      } else {
        const res = await fetch(`${BASE}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password })
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || 'Authentication failed')
        }

        // Store remember details
        if (rememberMe) {
          localStorage.setItem('rememberedAdmin', email)
          localStorage.setItem('rememberedRole', 'admin')
        } else {
          localStorage.removeItem('rememberedAdmin')
        }

        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', email)
        window.dispatchEvent(new Event('authChange'))
        navigate('/admin')
      }
    } catch (err) {
      setErrorMsg(err.message || 'Access denied. Please verify your credentials.')
      setShake(true)
      // Reset shake after animation completes
      setTimeout(() => setShake(false), 500)
    } finally {
      setLoading(false)
    }
  }

  // Calculate simple password strength feedback
  const getPasswordStrength = () => {
    if (!password) return null
    let score = 0
    if (password.length >= 6) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    
    if (score === 1) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' }
    if (score === 2) return { label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-500' }
    return { label: 'Strong & Secured', color: 'bg-emerald-500', text: 'text-emerald-500' }
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-28 pb-12 relative overflow-hidden">
      {/* Dynamic Background Layout */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-100/40 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary-100/40 blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute inset-0 grid-pattern opacity-10" />
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-card-xl relative overflow-hidden"
        >
          {/* Decorative Border Glow */}
          <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${
            role === 'admin' ? 'from-secondary-500 to-cyan-500' : 'from-primary-600 to-secondary-500'
          }`} />

          {/* Premium Logo Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white mb-4 shadow-md">
              <span className="font-display font-black text-xl bg-gradient-sky bg-clip-text text-transparent">S</span>
            </div>
            <h1 className="font-display font-black text-3xl text-slate-900 mb-1.5">Console Portal</h1>
            <p className="text-slate-500 text-xs">Verify credentials to initialize secure sessions</p>
          </div>

          {/* Role selector tab (Sliding background animation) */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 relative">
            <button
              type="button"
              onClick={() => handleRoleChange('member')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 relative z-10 ${
                role === 'member' ? 'text-primary-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <RiUser3Line className="text-sm" /> Member Access
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 relative z-10 ${
                role === 'admin' ? 'text-secondary-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <RiShieldUserLine className="text-sm" /> Admin Console
            </button>

            {/* Sliding Underline Background */}
            <motion.div
              layout
              className="absolute top-1 bottom-1 rounded-xl bg-white shadow-sm"
              style={{
                width: 'calc(50% - 4px)',
                left: role === 'member' ? '4px' : 'calc(50% + 0px)'
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                {role === 'member' ? 'Email Address' : 'Console Username'}
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  {role === 'member' ? <RiMailLine /> : <RiUser3Line />}
                </span>
                <input
                  type={role === 'member' ? 'email' : 'text'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'member' ? 'member@Sam Fitness.com' : 'admin'}
                  className={`input pl-11 focus:ring-2 focus:ring-opacity-40 ${
                    role === 'admin' ? 'focus:border-secondary-500 focus:ring-secondary-100' : 'focus:border-primary-500 focus:ring-primary-100'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                Secret Passcode
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <RiLockPasswordLine />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`input pl-11 pr-10 focus:ring-2 focus:ring-opacity-40 ${
                    role === 'admin' ? 'focus:border-secondary-500 focus:ring-secondary-100' : 'focus:border-primary-500 focus:ring-primary-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>

              {/* Password Strength Meter (Only for member typing) */}
              {role === 'member' && strength && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">Security Check:</span>
                    <span className={strength.text}>{strength.label}</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full flex-1 transition-all ${
                      strength.label === 'Weak' ? 'bg-rose-500' :
                      strength.label === 'Moderate' ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`} />
                    <div className={`h-full flex-1 transition-all ${
                      strength.label === 'Moderate' ? 'bg-amber-500' :
                      strength.label === 'Strong & Secured' ? 'bg-emerald-500' :
                      'bg-slate-100'
                    }`} />
                    <div className={`h-full flex-1 transition-all ${
                      strength.label === 'Strong & Secured' ? 'bg-emerald-500' :
                      'bg-slate-100'
                    }`} />
                  </div>
                </div>
              )}
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center justify-between text-xs font-semibold select-none">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                />
                Remember user session
              </label>
            </div>

            {/* Error notifications */}
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-700"
                >
                  <RiCloseCircleLine className="text-base shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary-lg justify-center py-3.5 rounded-2xl text-sm font-bold shadow-md transition-all duration-300 ${
                role === 'admin' 
                  ? 'bg-secondary-600 hover:bg-secondary-700 shadow-secondary-200' 
                  : 'bg-primary-600 hover:bg-primary-700 shadow-primary-200'
              }`}
            >
              {loading ? (
                <><RiLoader4Line className="animate-spin text-lg" /> Opening Session…</>
              ) : (
                <>Sign In Securely <RiArrowRightLine /></>
              )}
            </button>
          </form>

          {/* Member Redirect to Signup */}
          {role === 'member' && (
            <div className="mt-6 text-center text-xs text-slate-500 font-medium">
              Join Sam Fitness for the first time?{' '}
              <Link to="/signup" className="text-primary-600 font-bold hover:underline">
                Create Member Account
              </Link>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  )
}
