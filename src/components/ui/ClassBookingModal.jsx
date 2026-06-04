import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiCloseLine, RiArrowRightLine, RiLoader4Line,
  RiCheckboxCircleFill, RiTimeLine, RiUserLine, RiCalendarLine,
} from 'react-icons/ri'
import { submitContact } from '../../lib/api'

export default function ClassBookingModal({ cls, onClose }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errorMsg) setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      // Submit as a contact form with subject = class booking
      await submitContact({
        ...form,
        subject: 'General Inquiry',
        message: `I'd like to book a spot in "${cls.name}" (${cls.time}, ${cls.duration}) with ${cls.instructor || cls.instructorName || 'the instructor'}. Please confirm my booking.`,
        interests: ['group'],
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-600 to-secondary-500 p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <RiCloseLine className="text-lg text-white" />
            </button>
            <div className="text-3xl mb-3">{cls.emoji || '🏋️'}</div>
            <h2 className="text-xl font-display font-black mb-1">{cls.name}</h2>
            <div className="flex flex-wrap gap-3 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <RiTimeLine className="text-white/60" /> {cls.time} · {cls.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <RiUserLine className="text-white/60" /> {cls.instructor || cls.instructorName || 'Expert Instructor'}
              </span>
              {cls.spots !== undefined && (
                <span className="flex items-center gap-1.5">
                  <RiCalendarLine className="text-white/60" />
                  <span className={cls.spots <= 4 ? 'text-red-300 font-bold' : 'text-green-300 font-bold'}>
                    {cls.spots} spots left
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6 gap-4"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <RiCheckboxCircleFill className="text-green-500 text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Request Sent! ✅</h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                      Great, <span className="font-semibold text-primary-600">{form.firstName}</span>! We'll confirm your spot in <strong>{cls.name}</strong> via email within 2 hours.
                    </p>
                  </div>
                  <button onClick={onClose} className="btn-secondary text-sm">Done</button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <p className="text-slate-500 text-sm">
                    Fill in your details and we'll reserve your spot and send you a confirmation.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                        First Name <span className="text-red-400">*</span>
                      </label>
                      <input required name="firstName" value={form.firstName} onChange={handleChange}
                        placeholder="Rahul" className="input" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                        Last Name <span className="text-red-400">*</span>
                      </label>
                      <input required name="lastName" value={form.lastName} onChange={handleChange}
                        placeholder="Verma" className="input" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="rahul@example.com" className="input" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Phone
                    </label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+91 98765 43210" className="input" />
                  </div>

                  {status === 'error' && errorMsg && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                      <RiCloseLine className="flex-shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary-lg w-full"
                  >
                    {status === 'loading' ? (
                      <><RiLoader4Line className="animate-spin text-lg" /> Booking…</>
                    ) : (
                      <>Reserve My Spot <RiArrowRightLine /></>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Free for trial members. Existing members: class booking is instant.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
