import { useState } from 'react'
import { submitContact } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiSendPlaneLine,
  RiCheckLine,
  RiInstagramLine,
  RiYoutubeLine,
  RiFacebookCircleLine,
  RiTwitterLine,
  RiLinkedinBoxLine,
  RiWhatsappLine,
  RiTimeLine,
  RiArrowRightLine,
  RiLoader4Line,
  RiCalendarLine,
  RiCheckboxCircleFill,
  RiQuestionLine,
  RiArrowRightSLine,
} from 'react-icons/ri'

/* ─── Animation Variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ─── Static Data ────────────────────────────────────────────────────── */
const contactCards = [
  {
    icon: RiPhoneLine,
    label: 'Call Us',
    value: '+91 98765 43210',
    detail: 'Monday – Saturday · 6 AM – 10 PM',
    href: 'tel:+919876543210',
    cta: 'Call Now',
    color: 'primary',
  },
  {
    icon: RiMailLine,
    label: 'Email Us',
    value: 'hello@Sam Fitness.in',
    detail: 'We reply within 2 working hours',
    href: 'mailto:hello@Sam Fitness.in',
    cta: 'Send Email',
    color: 'secondary',
  },
  {
    icon: RiMapPinLine,
    label: 'Visit Us',
    value: '42 Fitness Avenue, Bandra West',
    detail: 'Mumbai 400050, Maharashtra',
    href: 'https://maps.google.com/?q=Bandra+West+Mumbai',
    cta: 'Get Directions',
    color: 'cyan',
  },
]

const subjectOptions = [
  'General Inquiry',
  'Membership Plans',
  'Personal Training',
  'Corporate Wellness',
  'Media / PR',
  'Other',
]

const interestOptions = [
  { id: 'gym', label: 'Gym Access' },
  { id: 'pt', label: 'Personal Training' },
  { id: 'nutrition', label: 'Nutrition Coaching' },
  { id: 'group', label: 'Group Classes' },
  { id: 'corporate', label: 'Corporate Package' },
]

const hoursData = [
  { day: 'Monday – Friday', hours: '5:00 AM – 11:00 PM' },
  { day: 'Saturday', hours: '6:00 AM – 10:00 PM' },
  { day: 'Sunday', hours: '7:00 AM – 9:00 PM' },
  { day: 'Public Holidays', hours: '8:00 AM – 8:00 PM' },
]

const nearbyAreas = [
  'Bandra East', 'Khar West', 'Santacruz West', 'Linking Road', 'Carter Road',
]

const socialLinks = [
  {
    icon: RiInstagramLine,
    platform: 'Instagram',
    handle: '@Sam Fitness.in',
    href: 'https://instagram.com/Sam Fitness.in',
    followers: '84K',
    color: 'from-pink-500 to-orange-400',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-100',
  },
  {
    icon: RiYoutubeLine,
    platform: 'YouTube',
    handle: 'Sam Fitness Official',
    href: 'https://youtube.com/@Sam Fitness',
    followers: '210K',
    color: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-100',
  },
  {
    icon: RiFacebookCircleLine,
    platform: 'Facebook',
    handle: 'Sam Fitness India',
    href: 'https://facebook.com/Sam Fitnessindia',
    followers: '52K',
    color: 'from-blue-600 to-blue-700',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
  },
  {
    icon: RiTwitterLine,
    platform: 'Twitter / X',
    handle: '@Sam Fitness_in',
    href: 'https://twitter.com/Sam Fitness_in',
    followers: '31K',
    color: 'from-slate-700 to-slate-900',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  {
    icon: RiLinkedinBoxLine,
    platform: 'LinkedIn',
    handle: 'Sam Fitness Fitness',
    href: 'https://linkedin.com/company/Sam Fitness',
    followers: '18K',
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-100',
  },
  {
    icon: RiWhatsappLine,
    platform: 'WhatsApp',
    handle: '+91 98765 43210',
    href: 'https://wa.me/919876543210',
    followers: 'Chat Now',
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-100',
  },
]

const branches = [
  {
    city: 'Mumbai',
    tag: 'Headquarters',
    address: '42 Fitness Avenue, Bandra West, Mumbai – 400050',
    phone: '+91 98765 43210',
    email: 'mumbai@Sam Fitness.in',
    hours: 'Mon–Fri 5AM–11PM · Sat–Sun 6AM–10PM',
    mapHref: 'https://maps.google.com/?q=Bandra+West+Mumbai',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  },
  {
    city: 'Pune',
    tag: 'Coming Soon',
    address: '18 Koregaon Park Road, Pune – 411001',
    phone: '+91 91234 56789',
    email: 'pune@Sam Fitness.in',
    hours: 'Mon–Fri 5:30AM–10PM · Sat–Sun 7AM–9PM',
    mapHref: 'https://maps.google.com/?q=Koregaon+Park+Pune',
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
  },
  {
    city: 'Bengaluru',
    tag: 'Coming Soon',
    address: '9 Indiranagar 100 ft Road, Bengaluru – 560038',
    phone: '+91 99887 76655',
    email: 'bengaluru@Sam Fitness.in',
    hours: 'Mon–Fri 5AM–11PM · Sat–Sun 6AM–10PM',
    mapHref: 'https://maps.google.com/?q=Indiranagar+Bangalore',
    img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80',
  },
]

const faqs = [
  {
    q: 'Is parking available at the gym?',
    a: 'Yes! We offer complimentary 3-hour parking for all members in our dedicated basement lot. Valet parking is also available on weekends.',
  },
  {
    q: 'How do I book a free trial session?',
    a: 'Simply fill out the contact form on this page or call us directly. We will schedule a 1-hour guided tour and trial workout within 24 hours.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards, UPI (GPay, PhonePe, Paytm), net banking, and EMI options via Bajaj Finserv & HDFC Bank.',
  },
  {
    q: 'Is there a dedicated women\'s section?',
    a: 'Absolutely! Sam Fitness has a fully equipped, private women\'s zone with dedicated equipment, certified female trainers, and separate locker rooms.',
  },
]

/* ─── Contact Page Component ─────────────────────────────────────────── */
export default function Contact() {
  /* Form state */
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    interests: [],
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errorMsg) setErrorMsg('')
  }

  const handleInterest = (id) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await submitContact(form)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    }
  }

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '', interests: [] })
    setStatus('idle')
    setErrorMsg('')
  }

  return (
    <div className="bg-white">

      {/* ══════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white mesh-bg pt-28 pb-20 lg:pt-36 lg:pb-28">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-100/40 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-secondary-100/40 blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="mb-5"
            >
              <span className="badge">
                <RiMailLine className="text-primary-500" />
                Get In Touch
              </span>
            </motion.div>

            <motion.h1
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight mb-6"
            >
              We'd Love to{' '}
              <span className="text-gradient">Hear From You</span>
            </motion.h1>

            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto"
            >
              Whether you're curious about memberships, personal training, or corporate
              wellness — our team responds within{' '}
              <span className="text-primary-600 font-semibold">24 hours</span>, guaranteed.
            </motion.p>

            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400"
            >
              {['Fast Response', '24/7 WhatsApp Support', 'No Spam — Ever'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <RiCheckLine className="text-green-500 text-base" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. CONTACT CARDS ROW
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 -mt-6 pb-0">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactCards.map((card, i) => {
              const Icon = card.icon.default || card.icon
              const colorMap = {
                primary: {
                  iconBg: 'bg-primary-50',
                  iconText: 'text-primary-600',
                  ring: 'hover:border-primary-200',
                  ctaText: 'text-primary-600',
                },
                secondary: {
                  iconBg: 'bg-secondary-50',
                  iconText: 'text-secondary-600',
                  ring: 'hover:border-secondary-200',
                  ctaText: 'text-secondary-600',
                },
                cyan: {
                  iconBg: 'bg-cyan-50',
                  iconText: 'text-cyan-600',
                  ring: 'hover:border-cyan-200',
                  ctaText: 'text-cyan-600',
                },
              }
              const c = colorMap[card.color]

              return (
                <motion.a
                  key={card.label}
                  href={card.href}
                  target={card.color === 'cyan' ? '_blank' : undefined}
                  rel="noreferrer"
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className={`card p-7 flex flex-col gap-4 cursor-pointer border border-slate-100 ${c.ring} transition-all duration-300`}
                >
                  <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`text-xl ${c.iconText}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                      {card.label}
                    </p>
                    <p className="text-base font-bold text-slate-800 leading-snug">{card.value}</p>
                    <p className="text-sm text-slate-500 mt-1">{card.detail}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${c.ctaText} mt-auto`}>
                    {card.cta} <RiArrowRightLine />
                  </div>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. MAIN SECTION — FORM + LOCATION
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 xl:gap-16">

            {/* ── LEFT: Contact Form ──────────────────────────── */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <span className="section-label">Send a Message</span>
                <h2 className="text-3xl font-display font-bold text-slate-900 mt-2">
                  Start the Conversation
                </h2>
                <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                  Fill out the form below and a Sam Fitness specialist will reach out personally.
                  No bots, no generic replies.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  /* Success State */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="card p-12 flex flex-col items-center justify-center text-center gap-5"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                      <RiCheckboxCircleFill className="text-green-500 text-4xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent! 🎉</h3>
                      <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                        Thank you for reaching out. Our team will get back to you at{' '}
                        <span className="font-semibold text-primary-600">{form.email || 'your email'}</span>{' '}
                        within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={resetForm}
                      className="btn-secondary mt-2 text-sm"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  /* Form State */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card p-8 space-y-6"
                  >
                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                          First Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          required
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          placeholder="Arjun"
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                          Last Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          required
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          placeholder="Sharma"
                          className="input"
                        />
                      </div>
                    </div>

                    {/* Email + Phone Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="arjun@example.com"
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="input"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <select
                        required
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="input appearance-none bg-no-repeat"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%2394A3B8' stroke-width='2' d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundPosition: 'right 1rem center', backgroundSize: '1rem', paddingRight: '2.5rem' }}
                      >
                        <option value="" disabled>Select a subject…</option>
                        {subjectOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                        Your Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        required
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about your goals, questions, or how we can help you…"
                        className="input resize-none leading-relaxed"
                      />
                    </div>

                    {/* Interests */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                        I'm Interested In
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {interestOptions.map((opt) => {
                          const active = form.interests.includes(opt.id)
                          return (
                            <button
                              type="button"
                              key={opt.id}
                              onClick={() => handleInterest(opt.id)}
                              className={`
                                flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                                ${active
                                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
                                }
                              `}
                            >
                              {active && <RiCheckLine className="text-sm" />}
                              {opt.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="divider" />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary-lg w-full"
                    >
                      {status === 'loading' ? (
                        <>
                          <RiLoader4Line className="text-lg animate-spin" />
                          Sending Message…
                        </>
                      ) : (
                        <>
                          <RiSendPlaneLine className="text-lg" />
                          Send Message
                          <RiArrowRightLine />
                        </>
                      )}
                    </button>

                    {/* Error Message */}
                    {status === 'error' && errorMsg && (
                      <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <p className="text-center text-xs text-slate-400">
                      By submitting, you agree to our{' '}
                      <Link to="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>.
                      No spam, ever.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── RIGHT: Location Info ────────────────────────── */}
            <motion.div
              className="lg:col-span-2 flex flex-col gap-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >

              {/* Map Placeholder */}
              <div className="card overflow-hidden">
                <div
                  className="relative h-52 bg-gradient-to-br from-primary-50 via-sky-50 to-secondary-50 
                              flex flex-col items-center justify-center gap-3 border-b border-slate-100"
                >
                  {/* Decorative grid */}
                  <div className="absolute inset-0 grid-pattern opacity-60" />
                  {/* Pulsing pin */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary-400/20 animate-ping" />
                    <div className="relative w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                      <RiMapPinLine className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="text-center relative z-10">
                    <p className="font-bold text-slate-800 text-sm">42 Fitness Avenue</p>
                    <p className="text-slate-500 text-xs mt-0.5">Bandra West, Mumbai 400050</p>
                  </div>
                </div>

                {/* Hours Table */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <RiTimeLine className="text-primary-500 text-base" />
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Opening Hours</span>
                  </div>
                  <div className="space-y-2.5">
                    {hoursData.map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm py-2.5 border-b border-slate-50 last:border-0"
                      >
                        <span className="text-slate-600 font-medium">{row.day}</span>
                        <span className="font-bold text-slate-800 bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-lg text-xs">
                          {row.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <a
                href="https://maps.google.com/?q=Bandra+West+Mumbai"
                target="_blank"
                rel="noreferrer"
                className="btn-primary-lg w-full justify-center"
              >
                <RiMapPinLine className="text-lg" />
                Get Directions
                <RiArrowRightLine />
              </a>

              {/* Nearby Areas */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <RiCalendarLine className="text-secondary-500 text-base" />
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Nearby Areas</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {nearbyAreas.map((area) => (
                    <span key={area} className="tag-primary text-xs">
                      📍 {area}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  Easy access via Western Express Highway. 5 mins from Bandra (W) Station.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. SOCIAL LINKS
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="section-label">Follow Along</span>
            <h2 className="text-3xl font-display font-bold text-slate-900 mt-2">
              Connect With Sam Fitness
            </h2>
            <p className="text-slate-500 mt-3 text-sm max-w-md mx-auto">
              Stay inspired with daily workout tips, member transformations, and exclusive offers
              across our social channels.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {socialLinks.map((s, i) => {
              const Icon = s.icon.default || s.icon
              return (
                <motion.a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className={`card p-5 flex flex-col items-center gap-3 text-center border ${s.border} cursor-pointer`}
                >
                  <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`text-xl ${s.text}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{s.platform}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.handle}</p>
                  </div>
                  <span className={`text-xs font-bold ${s.text}`}>
                    {s.followers} {s.followers !== 'Chat Now' ? 'followers' : ''}
                  </span>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. BRANCH LOCATIONS
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-py">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="section-label">Our Locations</span>
            <h2 className="text-3xl font-display font-bold text-slate-900 mt-2">
              Sam Fitness Across India
            </h2>
            <p className="text-slate-500 mt-3 text-sm max-w-md mx-auto">
              Premium fitness infrastructure in India's most vibrant cities. More locations expanding in 2025.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {branches.map((branch, i) => (
              <motion.div
                key={branch.city}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card-hover overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={branch.img}
                    alt={`Sam Fitness ${branch.city}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <h3 className="text-white font-bold text-xl">{branch.city}</h3>
                    <span className={`
                      text-xs font-semibold px-2.5 py-1 rounded-full
                      ${branch.tag === 'Headquarters'
                        ? 'bg-primary-500 text-white'
                        : 'bg-amber-400 text-amber-900'}
                    `}>
                      {branch.tag}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 space-y-3.5">
                  <div className="flex gap-2.5 text-sm text-slate-600">
                    <RiMapPinLine className="text-primary-500 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{branch.address}</span>
                  </div>
                  <div className="flex gap-2.5 text-sm text-slate-600">
                    <RiPhoneLine className="text-primary-500 mt-0.5 shrink-0" />
                    <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="hover:text-primary-600 transition-colors">
                      {branch.phone}
                    </a>
                  </div>
                  <div className="flex gap-2.5 text-sm text-slate-600">
                    <RiMailLine className="text-primary-500 mt-0.5 shrink-0" />
                    <a href={`mailto:${branch.email}`} className="hover:text-primary-600 transition-colors">
                      {branch.email}
                    </a>
                  </div>
                  <div className="flex gap-2.5 text-sm text-slate-600">
                    <RiTimeLine className="text-primary-500 mt-0.5 shrink-0" />
                    <span>{branch.hours}</span>
                  </div>

                  <div className="pt-2">
                    <a
                      href={branch.mapHref}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary w-full text-sm justify-center"
                    >
                      <RiMapPinLine />
                      Get Directions
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. FAQ STRIP
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="section-label">Quick Answers</span>
            <h2 className="text-3xl font-display font-bold text-slate-900 mt-2">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = expandedFaq === i
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="card border border-slate-100 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-slate-50 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                        <RiQuestionLine className="text-primary-600 text-sm" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{faq.q}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0"
                    >
                      <RiArrowRightSLine className="text-slate-400 text-lg" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pl-[3.75rem]">
                          <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-slate-500 text-sm mb-4">
              Still have questions? Our team is ready to help.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="tel:+919876543210" className="btn-primary">
                <RiPhoneLine />
                Call Us Now
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <RiWhatsappLine className="text-green-600" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
