import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiUser3Line, RiMailLine, RiLockPasswordLine, RiArrowRightLine,
  RiLoader4Line, RiCloseCircleLine, RiCheckboxCircleFill
} from 'react-icons/ri'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  
  const navigate = useNavigate()

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

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong during signup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-28 pb-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary-100/40 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-secondary-100/40 blur-3xl" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-slate-100 rounded-3xl p-8 shadow-card-lg"
        >
          {success ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <RiCheckboxCircleFill className="text-green-500 text-4xl" />
              </div>
              <h2 className="font-display font-black text-2xl text-slate-900">Registration Complete! 🎉</h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">
                Welcome to Sam Fitness, <strong className="text-primary-600">{name}</strong>! Redirecting you to the login screen to sign in...
              </p>
              <div className="w-8 h-8 rounded-full border-2 border-slate-100 border-t-primary-600 animate-spin mx-auto" />
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="font-display font-black text-3xl text-slate-900 mb-2">Create Account</h1>
                <p className="text-slate-500 text-sm">Join Sam Fitness and customize your training program</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <RiUser3Line />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rahul Verma"
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <RiMailLine />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <RiLockPasswordLine />
                      </span>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        className="input pl-10 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Confirm
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <RiLockPasswordLine />
                      </span>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••"
                        className="input pl-10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700"
                  >
                    <RiCloseCircleLine className="text-base shrink-0" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary-lg justify-center py-3 rounded-xl text-sm font-bold mt-2"
                >
                  {loading ? (
                    <><RiLoader4Line className="animate-spin" /> Registering…</>
                  ) : (
                    <>Sign Up <RiArrowRightLine /></>
                  )}
                </button>
              </form>

              {/* Login option */}
              <div className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-bold hover:underline">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
