import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiMailLine, RiArrowRightLine, RiCheckboxCircleFill, RiLoader4Line, RiCloseLine } from 'react-icons/ri'
import { subscribeNewsletter } from '../../lib/api'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await subscribeNewsletter({ email, name })
      setMsg(res.message)
      setStatus('success')
    } catch (err) {
      setMsg(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-secondary-400/20 blur-3xl" />
        <div className="absolute inset-0 grid-pattern opacity-10" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/30 text-white/90 text-sm font-semibold mb-6">
              <RiMailLine className="text-base" />
              Weekly Fitness Insights
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
              Get Exclusive Tips &{' '}
              <span className="text-accent">Member Offers</span>
            </h2>
            <p className="text-white/65 text-base sm:text-lg mb-10 leading-relaxed">
              Join 12,000+ subscribers who receive weekly workout plans, nutrition advice,
              and exclusive member discounts. No spam — ever.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center">
                  <RiCheckboxCircleFill className="text-4xl text-green-300" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl mb-1">You're in! 🎉</p>
                  <p className="text-white/70 text-sm">{msg}</p>
                </div>
                <button
                  onClick={() => { setStatus('idle'); setEmail(''); setName('') }}
                  className="text-white/60 hover:text-white text-sm underline transition-colors"
                >
                  Subscribe another email
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  placeholder="Your first name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="flex-[0.8] px-4 py-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors"
                />
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                  className="flex-1 px-4 py-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-primary-700 font-bold text-sm hover:bg-primary-50 transition-colors disabled:opacity-70 whitespace-nowrap"
                >
                  {status === 'loading' ? (
                    <><RiLoader4Line className="animate-spin" /> Subscribing…</>
                  ) : (
                    <>Subscribe <RiArrowRightLine /></>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-300 text-sm mt-3 flex items-center justify-center gap-1.5"
            >
              <RiCloseLine /> {msg}
            </motion.p>
          )}

          <p className="text-white/40 text-xs mt-5">
            By subscribing you agree to receive Sam Fitness marketing emails. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
