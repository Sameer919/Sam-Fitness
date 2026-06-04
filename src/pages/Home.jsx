import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import {
  RiArrowRightLine, RiPlayCircleLine, RiCheckLine, RiStarFill,
  RiFlashlightLine, RiHeartPulseLine,
  RiTeamLine, RiTrophyLine, RiShieldCheckLine,
  RiAwardLine, RiGlobalLine, RiLeafLine, RiBrainLine,
} from 'react-icons/ri'
import SectionHeader from '../components/ui/SectionHeader'
import NewsletterSection from '../components/ui/NewsletterSection'
import MembershipModal from '../components/ui/MembershipModal'

const CountUpComponent = CountUp.default || CountUp

/* ── Animated Counter ─────────────────────────────────────────────── */
function StatItem({ value, suffix, label, icon: Icon }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 })
  const IconComponent = Icon && Icon.default ? Icon.default : Icon
  return (
    <div ref={ref} className="text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        {IconComponent && <IconComponent className="text-primary-400 text-xl" />}
        <span className="font-display font-black text-3xl sm:text-4xl text-white">
          {inView ? <CountUpComponent end={value} duration={2.2} separator="," /> : '0'}{suffix}
        </span>
      </div>
      <p className="text-white/60 text-sm font-medium">{label}</p>
    </div>
  )
}

/* ── Hero words rotator ───────────────────────────────────────────── */
const heroWords = ['Stronger', 'Healthier', 'Confident', 'Unstoppable']
function RotatingWord() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % heroWords.length), 2500)
    return () => clearInterval(t)
  }, [])
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={idx}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="inline-block text-accent"
      >
        {heroWords[idx]}
      </motion.span>
    </AnimatePresence>
  )
}

/* ── Data ─────────────────────────────────────────────────────────── */
const stats = [
  { value: 5000, suffix: '+', label: 'Active Members',     icon: RiTeamLine },
  { value: 12,   suffix: '+', label: 'Years of Excellence', icon: RiAwardLine },
  { value: 60,   suffix: '+', label: 'Expert Trainers',    icon: RiTrophyLine },
  { value: 98,   suffix: '%', label: 'Success Rate',       icon: RiShieldCheckLine },
]

const features = [
  { icon: RiBrainLine,      title: 'AI-Powered Coaching',    desc: 'Personalised plans built on biomechanics, recovery data and real-time feedback.', color: 'primary' },
  { icon: RiHeartPulseLine, title: 'Medical-Grade Equipment', desc: '500+ ISO-certified machines across strength, cardio and functional training zones.', color: 'secondary' },
  { icon: RiLeafLine,       title: 'Nutrition Science',      desc: 'Registered dietitians craft meal plans aligned with your training programme.', color: 'primary' },
  { icon: RiTeamLine,       title: 'Elite Trainer Team',     desc: '60+ NSCA, ACE and CrossFit L3 certified coaches with proven transformation records.', color: 'secondary' },
  { icon: RiGlobalLine,     title: '24/7 Facility Access',   desc: 'Round-the-clock access to all floors, studios and recovery suites — on your schedule.', color: 'primary' },
  { icon: RiFlashlightLine, title: 'Fast Results Guarantee', desc: 'See measurable results in 30 days or we extend your membership free — no questions.', color: 'secondary' },
]

const facilities = [
  { name: 'Strength Training',  tag: '200+ Machines', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
  { name: 'Cardio Zone',        tag: '80 Stations',   img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80' },
  { name: 'Yoga & Mindfulness', tag: '6 Studios',     img: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80' },
  { name: 'Aqua Recovery',      tag: 'Olympic Pool',  img: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&q=80' },
  { name: 'CrossFit Arena',     tag: 'Elite Zone',    img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80' },
  { name: 'Spa & Recovery',     tag: 'Members Only',  img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
]

const plans = [
  {
    name: 'Starter',
    price: { monthly: 2999, annual: 2399 },
    color: 'border-slate-200',
    badge: null,
    features: ['Full Gym Access', '2 Group Classes/week', 'Locker Room', 'Mobile App'],
  },
  {
    name: 'Pro',
    price: { monthly: 5499, annual: 4399 },
    color: 'border-primary-400',
    badge: 'Most Popular',
    features: ['Everything in Starter', 'Unlimited Classes', '2 PT Sessions/month', 'Nutrition Guidance', 'Recovery Suite'],
  },
  {
    name: 'Elite',
    price: { monthly: 8999, annual: 7199 },
    color: 'border-secondary-400',
    badge: 'Best Value',
    features: ['Everything in Pro', 'Daily PT Sessions', 'Body Composition Scan', '24/7 Access', 'VIP Lounge'],
  },
]

const trainers = [
  { name: 'Aryan Kapoor',  role: 'Strength & Conditioning', cert: 'NSCA-CSCS', exp: '8 yrs', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80' },
  { name: 'Priya Sharma',  role: 'Yoga & Mobility',         cert: 'RYT-500',   exp: '10 yrs', img: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=600&q=80' },
  { name: 'Dev Malhotra',  role: 'CrossFit & HIIT',         cert: 'CF Level 3', exp: '7 yrs', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' },
]

const testimonials = [
  { name: 'Rahul Verma',   role: 'Software Engineer',   result: '-22 kg', rating: 5, text: 'Sam Fitness completely changed my relationship with fitness. Lost 22 kg in 5 months — the trainers are world-class and the nutrition guidance is spot on.', img: 'https://i.pravatar.cc/80?img=33' },
  { name: 'Sneha Patel',   role: 'Entrepreneur',        result: '+8 kg Muscle', rating: 5, text: 'I tried 4 gyms in Mumbai before Sam Fitness. Nothing comes close. The AI coaching feature is genuinely impressive and the community is incredible.', img: 'https://i.pravatar.cc/80?img=47' },
  { name: 'Vikram Singh',  role: 'Marketing Director',  result: '6-Pack', rating: 5, text: 'The body composition scan alone is worth the membership fee. Finally a gym that uses science, not guesswork. Remarkable transformation in 4 months.', img: 'https://i.pravatar.cc/80?img=22' },
  { name: 'Meera Joshi',   role: 'Doctor, MBBS',        result: 'Peak Health', rating: 5, text: 'As a medical professional I value evidence-based fitness. Sam Fitness is the only gym I\'ve seen that matches clinical standards. Outstanding!', img: 'https://i.pravatar.cc/80?img=16' },
]

const classes = [
  { name: 'HIIT Blast',    time: '6:00 AM', duration: '45 min', intensity: 'High',   instructor: 'Dev M.', spots: 4, emoji: '⚡' },
  { name: 'Power Yoga',    time: '7:00 AM', duration: '60 min', intensity: 'Medium', instructor: 'Priya S.', spots: 8, emoji: '🧘' },
  { name: 'Strength Forge',time: '8:00 AM', duration: '50 min', intensity: 'High',   instructor: 'Aryan K.', spots: 6, emoji: '💪' },
  { name: 'Zumba Energy',  time: '9:00 AM', duration: '55 min', intensity: 'Medium', instructor: 'Priya S.', spots: 12, emoji: '💃' },
  { name: 'CrossFit Open', time: '6:30 PM', duration: '60 min', intensity: 'Elite',  instructor: 'Dev M.',  spots: 2, emoji: '🏋️' },
  { name: 'Boxing Basics', time: '7:30 PM', duration: '45 min', intensity: 'High',   instructor: 'Aryan K.', spots: 9, emoji: '🥊' },
]

/* ── Page ─────────────────────────────────────────────────────────── */
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const [billing, setBilling] = useState('monthly')
  const [selectedPlan, setSelectedPlan] = useState(null)

  return (
    <div className="bg-white overflow-x-hidden">

      {/* Membership Modal */}
      {selectedPlan && <MembershipModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}

      {/* ═══════════════════════════════════════ HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" id="hero">
        {/* Background image with parallax */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=85"
            alt="Premium fitness facility"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </motion.div>

        {/* Subtle grid */}
        <div className="absolute inset-0 grid-pattern opacity-20" />

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="container-custom pt-24 pb-16">
            <div className="max-w-4xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm
                           border border-white/30 text-white text-sm font-medium mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                India's #1 Premium Fitness Studio
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
                className="font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-none text-white mb-6"
              >
                Become<br />
                <RotatingWord />
                <br />Every Day
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-white/75 text-lg sm:text-xl max-w-xl leading-relaxed mb-10"
              >
                World-class trainers. Science-backed programmes. Luxury facilities. 
                Join 5,000+ members who chose a smarter way to transform.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 mb-16"
              >
                <Link to="/membership" className="btn-primary-lg">
                  Start Free Trial <RiArrowRightLine className="text-lg" />
                </Link>
                <Link to="/goal-finder"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/15 backdrop-blur-sm
                             border border-white/40 text-white font-bold text-base hover:bg-white/25 transition-all duration-200"
                >
                  <RiPlayCircleLine className="text-lg" /> Find My Programme
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center gap-6"
              >
                {[
                  { icon: RiShieldCheckLine, text: 'Certified Trainers' },
                  { icon: RiAwardLine,       text: 'ISO Certified' },
                  { icon: RiHeartPulseLine,  text: 'Medical Equipment' },
                ].map((item, i) => {
                  const IconComponent = item.icon.default || item.icon
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <IconComponent className="text-accent text-lg" />
                      <span className="text-white/80 text-sm font-medium">{item.text}</span>
                    </div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <RiArrowRightLine className="rotate-90 text-lg" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════ STATS */}
      <section className="bg-gradient-sky py-16" id="stats">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <StatItem {...s} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ WHY CHOOSE US */}
      <section className="section-py bg-white" id="why-us">
        <div className="container-custom">
          <SectionHeader
            label="The Sam Fitness Difference"
            title={<>Not just a gym.<br /><span className="text-gradient">A complete transformation system.</span></>}
            subtitle="We combine elite training expertise, cutting-edge technology, and evidence-based nutrition to deliver results that last."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="card-hover p-7 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300
                  ${f.color === 'primary' ? 'bg-primary-50 group-hover:bg-primary-100' : 'bg-secondary-50 group-hover:bg-secondary-100'}`}>
                  {(() => {
                    const IconComponent = f.icon.default || f.icon
                    return <IconComponent className={`text-2xl ${f.color === 'primary' ? 'text-primary-600' : 'text-secondary-600'}`} />
                  })()}
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                <div className={`mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full
                  ${f.color === 'primary' ? 'bg-gradient-sky' : 'bg-gradient-to-r from-secondary-400 to-accent'}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FACILITIES */}
      <section className="section-py bg-slate-50" id="facilities">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <SectionHeader
              label="World-Class Facilities"
              title={<>Every space built<br />for <span className="text-gradient">peak performance.</span></>}
              center={false}
            />
            <Link to="/facilities" className="btn-secondary shrink-0">
              Tour Facilities <RiArrowRightLine />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {facilities.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${i === 0 || i === 3 ? 'row-span-1' : ''}`}
                style={{ height: i === 0 ? '320px' : '240px' }}
              >
                <img
                  src={f.img}
                  alt={f.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-primary-500/20 backdrop-blur-sm
                                   border border-primary-400/30 text-primary-200 text-xs font-semibold mb-2">
                    {f.tag}
                  </span>
                  <h3 className="text-white font-display font-bold text-lg">{f.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ MEMBERSHIP PREVIEW */}
      <section className="section-py bg-white" id="membership">
        <div className="container-custom">
          <SectionHeader
            label="Membership Plans"
            title={<>Choose your path to <span className="text-gradient">transformation.</span></>}
            subtitle="Flexible plans with no long-term contracts. Start with a 7-day free trial."
          />

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {['monthly', 'annual'].map(b => (
              <button key={b} onClick={() => setBilling(b)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  billing === b
                    ? 'bg-primary-600 text-white shadow-btn'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b === 'monthly' ? 'Monthly' : 'Annual'}{b === 'annual' && <span className="ml-1.5 text-xs bg-accent text-primary-900 px-1.5 py-0.5 rounded-full font-bold">-20%</span>}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`relative card border-2 ${plan.color} p-8 ${plan.badge ? 'shadow-card-lg scale-105' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-gradient-sky text-white text-xs font-bold shadow-btn">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-slate-400 text-sm font-medium">₹</span>
                  <span className="font-display font-black text-4xl text-slate-900">
                    {(billing === 'annual' ? plan.price.annual : plan.price.monthly).toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-400 text-sm pb-1">/mo</span>
                </div>
                {billing === 'annual' && (
                  <p className="text-primary-600 text-xs font-semibold mb-4">
                    Save ₹{((plan.price.monthly - plan.price.annual) * 12).toLocaleString('en-IN')}/year
                  </p>
                )}
                <ul className={`space-y-2.5 ${billing === 'annual' ? 'mt-0' : 'mt-4'} mb-8`}>
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <RiCheckLine className="text-primary-500 flex-shrink-0 text-base" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.name === 'Starter' ? 'basic' : plan.name.toLowerCase())}
                  className={`block text-center w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.badge
                      ? 'bg-gradient-sky text-white shadow-btn hover:shadow-btn-lg hover:-translate-y-0.5'
                      : 'border-2 border-slate-200 text-slate-700 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {plan.badge ? 'Get Started' : 'Choose Plan'} <RiArrowRightLine className="inline ml-1" />
                </button>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-slate-400 text-sm mt-8">
            No credit card required for free trial. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════ TRAINERS */}
      <section className="section-py bg-slate-50" id="trainers">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <SectionHeader
              label="Expert Team"
              title={<>Train with the<br /><span className="text-gradient">best in the game.</span></>}
              center={false}
            />
            <Link to="/trainers" className="btn-secondary shrink-0">
              All Trainers <RiArrowRightLine />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainers.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="card-hover overflow-hidden group"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 text-primary-700 text-xs font-bold">
                    {t.cert}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-0.5">{t.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{t.role}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{t.exp} experience</span>
                    <Link to="/trainers" className="text-primary-600 text-sm font-semibold hover:text-primary-700 flex items-center gap-1">
                      View Profile <RiArrowRightLine />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ CLASSES PREVIEW */}
      <section className="section-py bg-white" id="classes">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <SectionHeader
              label="Today's Classes"
              title={<>120+ weekly classes.<br /><span className="text-gradient">Find yours.</span></>}
              center={false}
            />
            <Link to="/classes" className="btn-secondary shrink-0">
              Full Schedule <RiArrowRightLine />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card p-5 flex items-center gap-4 hover:shadow-card-md transition-all duration-300 group cursor-pointer"
              >
                <div className="text-3xl">{cls.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-slate-900 text-sm mb-0.5">{cls.name}</h4>
                  <p className="text-slate-400 text-xs">{cls.instructor} · {cls.duration}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-primary-600 font-bold text-sm">{cls.time}</p>
                  <span className={`text-xs font-semibold ${
                    cls.intensity === 'Elite' ? 'text-rose-500' :
                    cls.intensity === 'High' ? 'text-orange-500' : 'text-emerald-500'
                  }`}>
                    {cls.intensity}
                  </span>
                </div>
                <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${
                  cls.spots <= 3 ? 'bg-rose-400' : cls.spots <= 6 ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ TESTIMONIALS */}
      <section className="section-py bg-slate-50 overflow-hidden" id="testimonials">
        <div className="container-custom">
          <SectionHeader
            label="Member Stories"
            title={<>Real people. <span className="text-gradient">Real results.</span></>}
            subtitle="Thousands have transformed their lives at Sam Fitness. Here are a few of their stories."
          />

          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={24}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className="pb-12"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="card p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                      <div>
                        <p className="font-display font-bold text-slate-900 text-sm">{t.name}</p>
                        <p className="text-slate-400 text-xs">{t.role}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold border border-primary-100">
                      {t.result}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <RiStarFill key={j} className="text-amber-400 text-sm" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">"{t.text}"</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ═══════════════════════════════════════ NEWSLETTER */}
      <NewsletterSection />

      {/* ═══════════════════════════════════════ FREE TRIAL CTA */}
      <section className="relative overflow-hidden" id="cta">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
            alt="Training CTA"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 to-primary-700/90" />
        </div>
        <div className="relative z-10 container-custom py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="badge-cyan text-secondary-300 border-secondary-700/50 bg-secondary-900/30 mb-6 inline-flex"
            >
              Limited Spots Available
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight"
            >
              Your transformation<br />starts <span className="text-accent">today.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-lg mb-10 max-w-xl mx-auto"
            >
              Get 7 days of full Pro-tier access — unlimited classes, 2 PT sessions, and nutrition consultation. No card needed.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/membership" className="btn-primary-lg">
                Claim Free Trial 🎯
              </Link>
              <Link to="/goal-finder"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40
                           text-white font-bold text-base hover:bg-white/10 transition-all"
              >
                Find My Plan <RiArrowRightLine />
              </Link>
            </motion.div>
            <p className="text-white/40 text-sm mt-8">No commitment. Cancel anytime. 100% satisfaction guaranteed.</p>
          </div>
        </div>
      </section>

    </div>
  )
}
