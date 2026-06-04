import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiCloseLine, RiArrowRightLine, RiLoader4Line,
  RiCheckboxCircleFill, RiVipCrownFill, RiStarFill, RiShieldLine,
  RiFileCopyLine, RiCheckDoubleLine, RiQrCodeLine, RiSecurePaymentLine
} from 'react-icons/ri'
import { submitMembership } from '../../lib/api'

const planMeta = {
  basic:  { label: 'Basic',  icon: RiShieldLine,      color: '#06B6D4', price: '₹2,999/mo',  tagline: 'Perfect for beginners' },
  pro:    { label: 'Pro',    icon: RiStarFill,        color: '#0284C7', price: '₹5,499/mo',  tagline: 'Our most popular plan' },
  elite:  { label: 'Elite',  icon: RiVipCrownFill,    color: '#4F46E5', price: '₹8,999/mo',  tagline: 'The complete experience' },
}

export default function MembershipModal({ plan, onClose }) {
  const meta = planMeta[plan] || planMeta.pro
  const PlanIcon = meta.icon.default || meta.icon

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    billing: 'monthly', goal: '',
  })
  
  const [createdLeadId, setCreatedLeadId] = useState(null)
  const [transactionId, setTransactionId] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | checkout | verifying-payment | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errorMsg) setErrorMsg('')
  }

  // Calculate pricing numbers
  const getPlanPriceNumber = () => {
    const prices = {
      basic: { monthly: 2999, annual: 28790 },
      pro: { monthly: 5499, annual: 52790 },
      elite: { monthly: 8999, annual: 86390 }
    }
    const current = prices[plan] || prices.pro
    return form.billing === 'annual' ? current.annual : current.monthly
  }

  // Build scanner variables
  const priceAmount = getPlanPriceNumber()
  const upiId = '8050455546@ybl'
  const upiUrl = `upi://pay?pa=${upiId}&pn=Sam Fitness%20Gym&am=${priceAmount}&cu=INR&tn=Sam Fitness%20${meta.label}%20Membership`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const resData = await submitMembership({ ...form, plan })
      setCreatedLeadId(resData.id)
      setStatus('checkout')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    }
  }

  // Confirm Payment Verification via Backend
  const handleVerifyPayment = async (e) => {
    e.preventDefault()
    if (!transactionId.trim() || transactionId.trim().length < 5) {
      setErrorMsg('Please enter a valid UPI transaction reference number.')
      return
    }

    setStatus('verifying-payment')
    setErrorMsg('')

    try {
      const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const response = await fetch(`${BASE}/api/membership/${createdLeadId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      })

      const json = await response.json()
      if (!response.ok) throw new Error(json.message || 'Payment confirmation failed')

      // Short delay for visual immersion
      setTimeout(() => {
        setStatus('success')
      }, 2000)
    } catch (err) {
      setStatus('checkout')
      setErrorMsg(err.message || 'Could not verify transaction. Please check the ID and try again.')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
        style={{ backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 my-8"
          onClick={e => e.stopPropagation()}
        >
          {/* Style block for laser scanner visual */}
          <style>{`
            @keyframes scan {
              0% { top: 0%; opacity: 0.3; }
              50% { top: 100%; opacity: 1; }
              100% { top: 0%; opacity: 0.3; }
            }
            .laser-scanner-line {
              animation: scan 2.5s linear infinite;
            }
          `}</style>

          {/* Header */}
          <div className="relative p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${meta.color}18`, border: `1.5px solid ${meta.color}30` }}
              >
                <PlanIcon className="text-xl" style={{ color: meta.color }} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {status === 'checkout' || status === 'verifying-payment' ? 'Access Gate Setup' : 'Join Sam Fitness Gym'}
                </p>
                <h2 className="text-xl font-display font-black text-slate-900">
                  {meta.label} Membership
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {form.billing === 'annual' ? 'Annual Subscription (Save 20%)' : 'Monthly Subscription'} · <span className="font-bold" style={{ color: meta.color }}>₹{priceAmount.toLocaleString('en-IN')}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={status === 'verifying-payment'}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RiCloseLine className="text-lg" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* STATUS: SUCCESS SCREEN */}
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-8 gap-4"
                >
                  <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                    <RiCheckboxCircleFill className="text-emerald-500 text-4xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black text-slate-900 mb-2">Gate Access Unlocked! 🔑</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                      Thank you, <span className="font-bold text-slate-900">{form.firstName}</span>! Your payment of <strong>₹{priceAmount.toLocaleString('en-IN')}</strong> is confirmed.
                    </p>
                    <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-mono text-slate-500 max-w-xs mx-auto">
                      <p>TXN REF: {transactionId}</p>
                      <p className="mt-1 text-emerald-600 font-bold uppercase tracking-wider">Status: Active Member</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="w-full max-w-xs mt-4 py-3 rounded-2xl bg-slate-900 text-white font-semibold text-xs tracking-wider uppercase hover:bg-slate-800 transition-all cursor-pointer">
                    Enter Dashboard
                  </button>
                </motion.div>
              ) : 

              /* STATUS: LOADER SPINNER FOR PAYMENT VERIFICATION */
              status === 'verifying-payment' ? (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 gap-4 text-center"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-cyan-500 animate-spin" />
                    <RiSecurePaymentLine className="absolute inset-0 m-auto text-xl text-cyan-500 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-slate-900 text-base">Validating Transaction Ref</h4>
                    <p className="text-slate-400 text-xs mt-1">Contacting UPI bank network nodes to secure credentials...</p>
                  </div>
                </motion.div>
              ) :

              /* STATUS: HIGH-TECH UPI QR SCANNER PAGE */
              status === 'checkout' ? (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-inner text-center relative overflow-hidden">
                    <div className="flex items-center justify-center gap-1 text-[9px] uppercase tracking-widest text-cyan-400 font-extrabold mb-3">
                      <RiSecurePaymentLine /> Sam Fitness Access Terminal
                    </div>

                    {/* Styled Scanner QR Image Box */}
                    <div className="relative w-[180px] h-[180px] mx-auto bg-white p-2.5 rounded-xl border-2 border-cyan-500 shadow-lg shadow-cyan-950/20 overflow-hidden flex items-center justify-center">
                      <img 
                        src={qrCodeUrl} 
                        alt="UPI Payment QR Code Scanner"
                        className="w-full h-full object-contain"
                      />
                      {/* Laser sweep line overlay */}
                      <div className="laser-scanner-line absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee] pointer-events-none" />
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Amount Due</p>
                      <h3 className="text-2xl font-display font-black text-white">₹{priceAmount.toLocaleString('en-IN')}</h3>
                    </div>
                  </div>

                  {/* UPI Handle Details */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wide">UPI Address</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{upiId}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUPI}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      {copied ? (
                        <><RiCheckDoubleLine className="text-emerald-500" /> Copied</>
                      ) : (
                        <><RiFileCopyLine /> Copy Address</>
                      )}
                    </button>
                  </div>

                  {/* Input form for Transaction Reference */}
                  <form onSubmit={handleVerifyPayment} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 mb-1.5 uppercase tracking-wide">
                        Enter UPI Transaction Ref ID <span className="text-red-400">*</span>
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 12-digit transaction number" 
                        className="input font-medium font-mono text-center tracking-wider text-slate-950 placeholder:text-slate-300 placeholder:font-sans" 
                      />
                      <p className="text-[9px] text-slate-400 mt-1 text-center select-none font-medium">
                        Paste the reference ID / UTR generated on Google Pay, PhonePe, or Paytm after sending.
                      </p>
                    </div>

                    {/* Inline error alerts */}
                    {errorMsg && (
                      <div className="flex items-start gap-2 p-3.5 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-700 font-semibold">
                        <RiCloseLine className="flex-shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStatus('idle')}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-cyan-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RiQrCodeLine /> Verify Transfer
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : 

              /* STATUS: DEFAULT ENQUIRY REGISTRATION FORM */
              (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 mb-1.5 uppercase tracking-wide">
                        First Name <span className="text-red-400">*</span>
                      </label>
                      <input required name="firstName" value={form.firstName} onChange={handleChange}
                        placeholder="Arjun" className="input" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 mb-1.5 uppercase tracking-wide">
                        Last Name <span className="text-red-400">*</span>
                      </label>
                      <input required name="lastName" value={form.lastName} onChange={handleChange}
                        placeholder="Sharma" className="input" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 mb-1.5 uppercase tracking-wide">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="arjun@example.com" className="input" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 mb-1.5 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+91 98765 43210" className="input" />
                  </div>

                  {/* Billing toggle */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 mb-2 uppercase tracking-wide">
                      Billing Preference
                    </label>
                    <div className="flex gap-3">
                      {['monthly', 'annual'].map(b => (
                        <button
                          key={b} type="button"
                          onClick={() => setForm(p => ({ ...p, billing: b }))}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                            form.billing === b
                              ? 'border-cyan-500 bg-cyan-50/50 text-cyan-800'
                              : 'border-slate-200 text-slate-500 hover:border-slate-350'
                          }`}
                        >
                          {b === 'monthly' ? 'Monthly' : 'Annual (Save 20%)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 mb-1.5 uppercase tracking-wide">
                      Your Fitness Goal
                    </label>
                    <textarea name="goal" value={form.goal} onChange={handleChange} rows={2}
                      placeholder="e.g. Lose 10 kg, build muscle, improve endurance…"
                      className="input resize-none leading-relaxed" />
                  </div>

                  {/* Error alerts */}
                  {status === 'error' && errorMsg && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 font-semibold">
                      <RiCloseLine className="flex-shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3.5 rounded-2xl text-white font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${meta.color}, #06B6D4)` }}
                  >
                    {status === 'loading' ? (
                      <><RiLoader4Line className="animate-spin text-lg" /> Processing…</>
                    ) : (
                      <>Initialize Membership Setup <RiArrowRightLine /></>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
