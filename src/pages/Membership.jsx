import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import MembershipModal from '../components/ui/MembershipModal'
import {
  RiCheckLine,
  RiCloseLine,
  RiFlashlightLine,
  RiShieldLine,
  RiStarFill,
  RiArrowRightLine,
  RiQuestionLine,
  RiTimeLine,
  RiHeartPulseLine,
  RiTeamLine,
  RiTrophyLine,
  RiPlantLine,
  RiRefreshLine,
  RiVipCrownFill,
  RiCalendarCheckLine,
  RiBarChartLine,
  RiFireLine,
  RiLockLine,
  RiCpuLine,
  RiVipCrownLine,
} from 'react-icons/ri'

/* ─────────────────────────────────────────────
   Animation helpers
 ───────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

/* ─────────────────────────────────────────────
   Data
 ───────────────────────────────────────────── */
const plans = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Perfect for beginners',
    monthlyPrice: 2999,
    color: '#06B6D4',
    border: 'border-slate-200',
    glow: 'rgba(6,182,212,0.1)',
    popular: false,
    features: [
      'Full gym floor access',
      '2 group classes per week',
      'Dedicated locker & storage',
      'Basic fitness assessment',
      'Mobile app access',
      'Shower & changing facilities',
      'Parking access',
    ],
    excluded: [
      'Personal training sessions',
      'Nutrition guidance',
      'Recovery suite',
      'VIP lounge access',
      '24/7 access',
      'Body composition scan',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Our most popular plan',
    monthlyPrice: 5499,
    color: '#0284C7',
    border: 'border-sky-300',
    glow: 'rgba(2,132,199,0.15)',
    popular: true,
    features: [
      'Unlimited gym floor access',
      'Unlimited group classes',
      'Dedicated locker & storage',
      'Advanced fitness assessment',
      'Mobile app + AI coaching',
      '2 personal training sessions/month',
      'Nutrition & meal guidance',
      'Recovery suite access',
      'Shower & changing facilities',
      'Priority class booking',
      'Parking access',
      'Guest pass (1/month)',
    ],
    excluded: [
      'Daily PT sessions',
      'VIP lounge access',
      '24/7 access',
      'Body composition scan',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'The complete experience',
    monthlyPrice: 8999,
    color: '#4F46E5',
    border: 'border-indigo-255',
    glow: 'rgba(79,70,229,0.15)',
    popular: false,
    features: [
      'Unlimited gym floor access — 24/7',
      'Unlimited group classes',
      'Premium locker suite',
      'Comprehensive biometric assessment',
      'Mobile app + Elite AI coaching',
      'Daily personal training sessions',
      'Custom nutrition & supplement plan',
      'Unlimited recovery suite',
      'Full-body composition scan (weekly)',
      'VIP lounge & concierge service',
      'Priority class booking',
      'Unlimited guest passes',
      'Quarterly performance reviews',
      'Competition prep support',
    ],
    excluded: [],
  },
]

const comparisonFeatures = [
  { label: 'Gym Floor Access', basic: true, pro: true, elite: true },
  { label: 'Group Classes', basic: '2/week', pro: 'Unlimited', elite: 'Unlimited' },
  { label: 'Locker & Storage', basic: true, pro: true, elite: 'Premium Suite' },
  { label: 'Personal Training', basic: false, pro: '2x / Month', elite: 'Daily' },
  { label: 'AI Coaching App', basic: 'Basic', pro: 'Advanced', elite: 'Elite' },
  { label: 'Nutrition Guidance', basic: false, pro: true, elite: 'Custom Plan' },
  { label: 'Recovery Suite', basic: false, pro: true, elite: 'Unlimited' },
  { label: 'Body Composition Scan', basic: false, pro: false, elite: 'Weekly' },
  { label: 'VIP Lounge Access', basic: false, pro: false, elite: true },
  { label: '24/7 Access', basic: false, pro: false, elite: true },
  { label: 'Guest Passes', basic: false, pro: '1/month', elite: 'Unlimited' },
  { label: 'Competition Prep', basic: false, pro: false, elite: true },
]

const faqs = [
  {
    q: 'Can I freeze or pause my membership?',
    a: 'Yes! All members can freeze their membership for up to 3 months per year with no extra charge. Simply notify us 7 days before your next billing cycle through the app or front desk.',
  },
  {
    q: 'Is there a joining or registration fee?',
    a: 'There is a one-time registration fee of ₹999 for Basic, ₹499 for Pro, and zero for Elite members. This covers your welcome kit, biometric profile setup, and initial fitness assessment.',
  },
  {
    q: 'What happens to unused personal training sessions?',
    a: "PT sessions for Pro members roll over for up to 30 days. Elite members' daily PT sessions are scheduled by preference and never expire — your coach adapts around your schedule.",
  },
  {
    q: 'Can I upgrade or downgrade my plan anytime?',
    a: 'Absolutely. You can upgrade instantly via the Sam Fitness app. Downgrades take effect from the next billing cycle. Prorated credits are applied automatically for any pre-paid annual plans.',
  },
  {
    q: 'Are there any long-term contracts?',
    a: 'Monthly plans have zero contracts — cancel anytime. Annual plans require a 12-month commitment but save you up to 20% and include a 30-day satisfaction guarantee.',
  },
  {
    q: 'Do you offer student or corporate discounts?',
    a: 'Yes! We offer 15% off for verified students and 20% group discounts for companies enrolling 5+ employees. Contact our partnerships team for corporate wellness packages.',
  },
  {
    q: 'What is the free trial and how does it work?',
    a: "New members get a 7-day free trial with full Pro-level access — no credit card required. You'll get access to all facilities, two PT sessions, and a nutrition consultation before deciding.",
  },
  {
    q: 'How does the AI coaching feature work?',
    a: "Sam Fitness AI analyses your workout history, biometrics, sleep, and recovery data to generate personalised training plans. Elite members also receive real-time form correction via computer vision using the gym's camera network.",
  },
]

const benefits = [
  { icon: RiHeartPulseLine, title: 'Health Tracking', desc: 'Real-time biometric monitoring integrated with your wearable', color: '#06B6D4' },
  { icon: RiTeamLine, title: 'Elite Community', desc: 'Train alongside ambitious athletes who push each other forward', color: '#0284C7' },
  { icon: RiCpuLine, title: 'AI Personalisation', desc: 'Programs that adapt to your progress, sleep, and recovery data', color: '#4F46E5' },
  { icon: RiPlantLine, title: 'Nutrition Science', desc: 'Evidence-based dietary guidance crafted by registered dietitians', color: '#06B6D4' },
  { icon: RiTrophyLine, title: 'Competition Ready', desc: 'Structured periodisation for those targeting competitive events', color: '#0284C7' },
  { icon: RiCalendarCheckLine, title: 'Flexible Scheduling', desc: 'Book classes, PT sessions, and recovery slots via the app 24/7', color: '#4F46E5' },
]

/* ─────────────────────────────────────────────
   Cell renderer for comparison table
 ───────────────────────────────────────────── */
function CellValue({ val, color }) {
  if (val === true) return <RiCheckLine className="text-2xl mx-auto" style={{ color }} />
  if (val === false) return <RiCloseLine className="text-xl mx-auto text-slate-300" />
  return <span className="text-sm font-semibold text-slate-700" style={{ color }}>{val}</span>
}

/* ─────────────────────────────────────────────
   FAQ Item
 ───────────────────────────────────────────── */
function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      {...fadeUp(index * 0.06)}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:border-sky-300 transition-all duration-300"
    >
      <button
        className="w-full flex items-center justify-between p-6 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-slate-800 font-semibold text-lg leading-snug">{item.q}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100"
        >
          <RiQuestionLine
            className="text-lg text-slate-400"
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6">
              <div className="h-px w-full mb-4 bg-slate-100" />
              <p className="text-slate-500 leading-relaxed text-sm">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Main Component
 ───────────────────────────────────────────── */
export default function Membership() {
  const [annual, setAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const getPrice = (monthly) => {
    if (annual) return Math.round(monthly * 12 * 0.8)
    return monthly
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* Membership Enquiry Modal */}
      {selectedPlan && (
        <MembershipModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
      
      {/* ── HERO ── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#0284C7 1px, transparent 1px), linear-gradient(90deg, #0284C7 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="container-custom text-center relative z-10 px-4">
          <motion.div {...fadeUp(0)}>
            <span className="badge border-primary-200 bg-primary-50 text-primary-700 inline-flex items-center gap-2 mb-6 px-5 py-2 text-sm font-semibold">
              <RiVipCrownLine className="text-primary-600" />
              Membership Plans
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-slate-900 mb-6 leading-tight"
          >
            Choose Your <span className="text-gradient">Path</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Flexible membership tiers designed for every level of commitment. Start with a{' '}
            <span className="text-primary-600 font-semibold">7-day free trial</span> — no credit card, no contracts.
          </motion.p>

          {/* billing toggle */}
          <motion.div
            {...fadeUp(0.3)}
            className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 border border-slate-300/40"
          >
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                !annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Annual
              <span className="text-[10px] bg-primary-600 text-white px-2 py-0.5 rounded-full font-black">
                -20%
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="py-16 bg-white relative">
        <div className="container-custom px-4">
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                {...fadeUp(i * 0.15)}
                className={`bg-slate-50 rounded-3xl border border-slate-100 flex flex-col p-8 transition-all duration-300 hover:shadow-card-md hover:border-slate-200 relative ${
                  plan.popular ? 'lg:scale-[1.03] lg:-translate-y-2 ring-2 ring-primary-500 ring-offset-2' : ''
                }`}
              >
                {/* popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-gradient-to-r from-primary-600 to-cyan-500 text-white shadow-sm">
                    ⚡ Most Popular
                  </div>
                )}

                <div className="flex-1">
                  {/* plan header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${plan.color}15`, border: `1px solid ${plan.color}30` }}
                      >
                        {plan.id === 'basic' && <RiShieldLine style={{ color: plan.color }} className="text-xl" />}
                        {plan.id === 'pro' && <RiStarFill style={{ color: plan.color }} className="text-xl" />}
                        {plan.id === 'elite' && <RiVipCrownFill style={{ color: plan.color }} className="text-xl" />}
                      </div>
                      <h3 className="text-2xl font-display font-black text-slate-900">{plan.name}</h3>
                    </div>
                    <p className="text-slate-500 text-sm">{plan.tagline}</p>
                  </div>

                  {/* price */}
                  <div className="mb-8">
                    <div className="flex items-end gap-1">
                      <span className="text-slate-400 text-xl font-bold">₹</span>
                      <motion.span
                        key={`${plan.id}-${annual}`}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-display font-black text-slate-900"
                      >
                        {getPrice(plan.monthlyPrice).toLocaleString('en-IN')}
                      </motion.span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      {annual ? 'per year (billed annually)' : 'per month'}
                    </p>
                    {annual && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs mt-1 font-semibold"
                        style={{ color: plan.color }}
                      >
                        Save ₹{Math.round(plan.monthlyPrice * 12 * 0.2).toLocaleString('en-IN')} per year
                      </motion.p>
                    )}
                  </div>

                  {/* divider */}
                  <div className="h-px w-full mb-6 bg-slate-200/60" />

                  {/* features */}
                  <div className="space-y-3.5 mb-8">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <RiCheckLine
                          className="text-lg flex-shrink-0 mt-0.5 text-primary-600"
                        />
                        <span className="text-slate-600 text-sm leading-snug">{f}</span>
                      </div>
                    ))}
                    {plan.excluded.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <RiCloseLine className="text-lg flex-shrink-0 mt-0.5 text-slate-300" />
                        <span className="text-slate-400 text-sm leading-snug line-through">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3.5 rounded-xl font-bold text-center block text-sm transition-all duration-300 ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-200'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {plan.id === 'elite' ? '🏆 Go Elite' : plan.id === 'pro' ? '⚡ Go Pro' : 'Get Started'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100">
        <div className="container-custom px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <span className="badge border-primary-200 bg-primary-50 text-primary-700 inline-flex items-center gap-2 mb-4 px-5 py-2 text-sm font-semibold">
              <RiBarChartLine className="text-primary-600" />
              Compare Plans
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4">
              Side-by-Side <span className="text-gradient">Breakdown</span>
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp(0.2)}
            className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
          >
            {/* table header */}
            <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200/80">
              <div className="p-5 text-slate-500 text-xs font-bold uppercase tracking-wider">
                Feature
              </div>
              {plans.map((p) => (
                <div
                  key={p.id}
                  className="p-5 text-center border-l border-slate-200/80"
                >
                  <span className="text-base font-black text-slate-800">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>

            {/* rows */}
            {comparisonFeatures.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`grid grid-cols-4 border-b border-slate-100 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                }`}
              >
                <div className="p-4 text-slate-600 text-sm font-medium flex items-center">{row.label}</div>
                {[row.basic, row.pro, row.elite].map((val, j) => (
                  <div
                    key={j}
                    className="p-4 text-center flex items-center justify-center border-l border-slate-100"
                  >
                    <CellValue val={val} color={plans[j].color} />
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-20 bg-white">
        <div className="container-custom px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <span className="badge border-primary-200 bg-primary-50 text-primary-700 inline-flex items-center gap-2 mb-4 px-5 py-2 text-sm font-semibold">
              <RiFireLine className="text-primary-600" />
              Why Sam Fitness
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4">
              Every Plan Comes With <span className="text-gradient">Excellence</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Regardless of which tier you choose, every Sam Fitness member gets access to our core promise.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, i) => {
              const Icon = b.icon.default || b.icon
              return (
                <motion.div
                  key={b.title}
                  {...fadeUp(i * 0.08)}
                  className="bg-slate-50 border border-slate-100 p-8 rounded-2xl flex flex-col hover:shadow-card-md hover:border-slate-200 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      background: `${b.color}15`,
                      border: `1px solid ${b.color}25`,
                    }}
                  >
                    <Icon className="text-2xl" style={{ color: b.color }} />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-2">{b.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container-custom px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <span className="badge border-primary-200 bg-primary-50 text-primary-700 inline-flex items-center gap-2 mb-4 px-5 py-2 text-sm font-semibold">
              <RiQuestionLine className="text-primary-600" />
              Frequently Asked
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4">
              Got <span className="text-gradient">Questions?</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Everything you need to know before taking the plunge.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((item, i) => (
              <FAQItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden bg-slate-900">
        {/* bg image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80"
            alt="Gym CTA background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-primary-950/30 to-slate-950/95" />
        </div>

        <div className="container-custom px-4 relative z-10 text-center text-white">
          <motion.div {...fadeUp(0)}>
            <span className="badge border-white/20 bg-white/10 text-white inline-flex items-center gap-2 mb-6 px-5 py-2 text-sm font-semibold">
              <RiFlashlightLine className="text-primary-400" />
              Zero Risk, Maximum Gain
            </span>
          </motion.div>

          <motion.h2
            {...fadeUp(0.1)}
            className="text-4xl sm:text-6xl font-display font-black text-white mb-6 leading-tight"
          >
            Your First 7 Days<br />
            <span className="text-gradient-sky bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-sky-300">Are On Us.</span>
          </motion.h2>

          <motion.p
            {...fadeUp(0.2)}
            className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience Sam Fitness's full Pro-tier — unlimited classes, 2 PT sessions, nutrition consult, and every facility — completely free for 7 days. No card. No commitment.
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <Link to="/contact" className="btn-primary-lg">
              Start Free Trial <RiArrowRightLine className="text-xl" />
            </Link>
            <button
              onClick={() => setSelectedPlan('pro')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-bold hover:bg-white/10 transition-all"
            >
              Enquire Now
            </button>
          </motion.div>

          {/* trust badges */}
          <motion.div
            {...fadeUp(0.4)}
            className="flex flex-wrap justify-center gap-6"
          >
            {[
              { icon: RiLockLine, text: 'No Credit Card' },
              { icon: RiRefreshLine, text: 'Cancel Anytime' },
              { icon: RiTimeLine, text: '7 Days Free' },
              { icon: RiShieldLine, text: '30-Day Guarantee' },
            ].map((item) => {
              const Icon = item.icon.default || item.icon
              return (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-white/50 text-sm"
                >
                  <Icon className="text-primary-400" />
                  <span>{item.text}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
