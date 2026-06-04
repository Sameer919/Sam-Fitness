import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ClassBookingModal from '../components/ui/ClassBookingModal'
import {
  RiCalendarLine,
  RiTimeLine,
  RiTeamLine,
  RiArrowRightLine,
  RiCheckLine,
  RiFilterLine,
  RiMedalLine,
  RiShieldCheckLine,
} from 'react-icons/ri'

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = ['All', 'HIIT', 'Yoga', 'Strength', 'CrossFit', 'Boxing', 'Zumba', 'Swimming', 'Pilates']

const instructors = {
  'Dev M.': { photo: 'https://i.pravatar.cc/80?img=12', full: 'Dev Malhotra' },
  'Priya S.': { photo: 'https://i.pravatar.cc/80?img=47', full: 'Priya Sharma' },
  'Aryan K.': { photo: 'https://i.pravatar.cc/80?img=33', full: 'Aryan Kapoor' },
}

const intensityConfig = {
  Elite: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  High: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  Medium: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Low: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
}

const classData = [
  {
    id: 1,
    emoji: '⚡',
    name: 'HIIT Blast',
    category: 'HIIT',
    instructor: 'Dev M.',
    duration: '45 min',
    intensity: 'High',
    time: '6:00 AM',
    spots: 4,
    totalSpots: 20,
    description: 'High-intensity interval training that torches calories and builds cardiovascular endurance.',
    color: 'from-orange-400 to-rose-500',
  },
  {
    id: 2,
    emoji: '🧘',
    name: 'Power Yoga',
    category: 'Yoga',
    instructor: 'Priya S.',
    duration: '60 min',
    intensity: 'Medium',
    time: '7:00 AM',
    spots: 8,
    totalSpots: 15,
    description: 'Dynamic yoga flow that builds strength, flexibility and mindfulness simultaneously.',
    color: 'from-violet-400 to-purple-500',
  },
  {
    id: 3,
    emoji: '🏋️',
    name: 'Strength Forge',
    category: 'Strength',
    instructor: 'Aryan K.',
    duration: '50 min',
    intensity: 'High',
    time: '8:00 AM',
    spots: 6,
    totalSpots: 18,
    description: 'Progressive overload strength training focused on compound lifts and muscle building.',
    color: 'from-slate-600 to-slate-800',
  },
  {
    id: 4,
    emoji: '💃',
    name: 'Zumba Energy',
    category: 'Zumba',
    instructor: 'Priya S.',
    duration: '55 min',
    intensity: 'Medium',
    time: '9:00 AM',
    spots: 12,
    totalSpots: 25,
    description: 'High-energy Latin dance fitness class that makes working out feel like a party.',
    color: 'from-pink-400 to-fuchsia-500',
  },
  {
    id: 5,
    emoji: '🥊',
    name: 'CrossFit Open',
    category: 'CrossFit',
    instructor: 'Dev M.',
    duration: '60 min',
    intensity: 'Elite',
    time: '6:30 PM',
    spots: 2,
    totalSpots: 16,
    description: 'Elite-level CrossFit WODs pushing your limits with functional movements at high intensity.',
    color: 'from-rose-500 to-red-600',
  },
  {
    id: 6,
    emoji: '🥊',
    name: 'Boxing Fundamentals',
    category: 'Boxing',
    instructor: 'Aryan K.',
    duration: '45 min',
    intensity: 'High',
    time: '7:30 PM',
    spots: 9,
    totalSpots: 20,
    description: 'Learn proper boxing technique, footwork and combinations while getting fit.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 7,
    emoji: '🌿',
    name: 'Pilates Core',
    category: 'Pilates',
    instructor: 'Priya S.',
    duration: '50 min',
    intensity: 'Low',
    time: '10:00 AM',
    spots: 10,
    totalSpots: 12,
    description: 'Precision-based core conditioning that improves posture, alignment and body awareness.',
    color: 'from-teal-400 to-emerald-500',
  },
  {
    id: 8,
    emoji: '🏊',
    name: 'Aqua Cardio',
    category: 'Swimming',
    instructor: 'Dev M.',
    duration: '45 min',
    intensity: 'Medium',
    time: '11:00 AM',
    spots: 7,
    totalSpots: 18,
    description: 'Low-impact aqua aerobics that provides a full-body cardiovascular workout.',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 9,
    emoji: '⚡',
    name: 'Morning HIIT',
    category: 'HIIT',
    instructor: 'Aryan K.',
    duration: '30 min',
    intensity: 'High',
    time: '5:30 AM',
    spots: 5,
    totalSpots: 20,
    description: 'Quick, intense morning session to jumpstart your metabolism and energize your day.',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 10,
    emoji: '🧘',
    name: 'Yin Yoga',
    category: 'Yoga',
    instructor: 'Priya S.',
    duration: '75 min',
    intensity: 'Low',
    time: '8:00 PM',
    spots: 11,
    totalSpots: 15,
    description: 'Deep, meditative yoga targeting connective tissue with long-held passive poses.',
    color: 'from-indigo-400 to-violet-500',
  },
  {
    id: 11,
    emoji: '🏋️',
    name: 'Kettlebell Flow',
    category: 'Strength',
    instructor: 'Dev M.',
    duration: '45 min',
    intensity: 'High',
    time: '5:00 PM',
    spots: 3,
    totalSpots: 16,
    description: 'Functional kettlebell training combining strength, cardio and mobility work.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 12,
    emoji: '💃',
    name: 'Bachata Dance',
    category: 'Zumba',
    instructor: 'Priya S.',
    duration: '60 min',
    intensity: 'Medium',
    time: '8:30 PM',
    spots: 14,
    totalSpots: 22,
    description: 'Sensual Bachata dance fitness blending cardio with rhythm and grace.',
    color: 'from-rose-400 to-pink-500',
  },
]

// Weekly timetable data
const timetableData = {
  times: ['5:30 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '5:00 PM', '6:30 PM', '7:30 PM', '8:00 PM', '8:30 PM'],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  schedule: {
    '5:30 AM': { Mon: { name: 'Morning HIIT', cat: 'HIIT' }, Wed: { name: 'Morning HIIT', cat: 'HIIT' }, Fri: { name: 'Morning HIIT', cat: 'HIIT' } },
    '6:00 AM': { Tue: { name: 'HIIT Blast', cat: 'HIIT' }, Thu: { name: 'HIIT Blast', cat: 'HIIT' }, Sat: { name: 'HIIT Blast', cat: 'HIIT' } },
    '7:00 AM': { Mon: { name: 'Power Yoga', cat: 'Yoga' }, Wed: { name: 'Power Yoga', cat: 'Yoga' }, Fri: { name: 'Power Yoga', cat: 'Yoga' }, Sun: { name: 'Yin Yoga', cat: 'Yoga' } },
    '8:00 AM': { Tue: { name: 'Strength Forge', cat: 'Strength' }, Thu: { name: 'Strength Forge', cat: 'Strength' }, Sat: { name: 'Kettlebell Flow', cat: 'Strength' } },
    '9:00 AM': { Mon: { name: 'Zumba Energy', cat: 'Zumba' }, Wed: { name: 'Zumba Energy', cat: 'Zumba' }, Fri: { name: 'Bachata Dance', cat: 'Zumba' }, Sun: { name: 'Zumba Energy', cat: 'Zumba' } },
    '10:00 AM': { Tue: { name: 'Pilates Core', cat: 'Pilates' }, Thu: { name: 'Pilates Core', cat: 'Pilates' }, Sat: { name: 'Pilates Core', cat: 'Pilates' } },
    '11:00 AM': { Mon: { name: 'Aqua Cardio', cat: 'Swimming' }, Wed: { name: 'Aqua Cardio', cat: 'Swimming' }, Fri: { name: 'Aqua Cardio', cat: 'Swimming' }, Sun: { name: 'Aqua Cardio', cat: 'Swimming' } },
    '5:00 PM': { Tue: { name: 'Kettlebell Flow', cat: 'Strength' }, Thu: { name: 'Kettlebell Flow', cat: 'Strength' }, Sat: { name: 'Strength Forge', cat: 'Strength' } },
    '6:30 PM': { Mon: { name: 'CrossFit Open', cat: 'CrossFit' }, Wed: { name: 'CrossFit Open', cat: 'CrossFit' }, Fri: { name: 'CrossFit Open', cat: 'CrossFit' }, Sun: { name: 'CrossFit Open', cat: 'CrossFit' } },
    '7:30 PM': { Tue: { name: 'Boxing', cat: 'Boxing' }, Thu: { name: 'Boxing', cat: 'Boxing' }, Sat: { name: 'Boxing', cat: 'Boxing' } },
    '8:00 PM': { Mon: { name: 'Yin Yoga', cat: 'Yoga' }, Wed: { name: 'Yin Yoga', cat: 'Yoga' }, Fri: { name: 'Power Yoga', cat: 'Yoga' }, Sun: { name: 'Yin Yoga', cat: 'Yoga' } },
    '8:30 PM': { Tue: { name: 'Bachata Dance', cat: 'Zumba' }, Thu: { name: 'Bachata Dance', cat: 'Zumba' }, Sat: { name: 'Zumba Energy', cat: 'Zumba' } },
  },
}

const catColors = {
  HIIT: 'bg-orange-100 text-orange-700',
  Yoga: 'bg-violet-100 text-violet-700',
  Strength: 'bg-slate-100 text-slate-700',
  CrossFit: 'bg-rose-100 text-rose-700',
  Boxing: 'bg-amber-100 text-amber-700',
  Zumba: 'bg-pink-100 text-pink-700',
  Swimming: 'bg-cyan-100 text-cyan-700',
  Pilates: 'bg-teal-100 text-teal-700',
}

const benefits = [
  {
    icon: <RiMedalLine className="w-7 h-7" />,
    title: 'Expert Instructors',
    desc: 'All our coaches hold internationally recognized certifications and bring years of elite training experience.',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    icon: <RiTeamLine className="w-7 h-7" />,
    title: 'Small Batch Sizes',
    desc: 'Maximum 20 members per class ensures personalized attention, proper form correction and faster results.',
    color: 'text-secondary-600',
    bg: 'bg-secondary-50',
  },
  {
    icon: <RiShieldCheckLine className="w-7 h-7" />,
    title: 'Beginner Friendly',
    desc: 'Every class offers modifications for all fitness levels — from first-timers to seasoned athletes.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
]

// ─── Counter Component ───────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 1800
          const step = Math.ceil(target / (duration / 16))
          const timer = setInterval(() => {
            start += step
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(start)
            }
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, hasAnimated])

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  )
}

// ─── Class Card ──────────────────────────────────────────────────────────────

function ClassCard({ cls, index, onBook }) {
  const intensity = intensityConfig[cls.intensity]
  const instructor = instructors[cls.instructor] || { photo: 'https://i.pravatar.cc/80?img=10', full: cls.instructor || 'Instructor' }
  const spotsLeft = cls.spots
  const spotsPercent = (spotsLeft / cls.totalSpots) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
      className="card card-hover flex flex-col overflow-hidden group"
    >
      {/* Top gradient banner */}
      <div className={`h-2 w-full bg-gradient-to-r ${cls.color}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{cls.emoji}</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight">{cls.name}</h3>
              <span className="text-xs text-slate-500">{cls.category}</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${intensity.bg} ${intensity.text} ${intensity.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${intensity.dot}`} />
            {cls.intensity}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{cls.description}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-4">
          <span className="flex items-center gap-1">
            <RiTimeLine className="text-primary-500" /> {cls.duration}
          </span>
          <span className="flex items-center gap-1">
            <RiCalendarLine className="text-primary-500" /> {cls.time}
          </span>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <img src={instructor.photo} alt={instructor.full} className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow" />
          <span className="text-xs font-medium text-slate-700">{instructor.full}</span>
        </div>

        {/* Spots */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Spots remaining</span>
            <span className={`font-semibold ${spotsLeft <= 4 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {spotsLeft}/{cls.totalSpots}
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${spotsLeft <= 4 ? 'bg-rose-400' : 'bg-emerald-400'}`}
              style={{ width: `${spotsPercent}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onBook(cls)}
          className="btn-primary w-full text-sm py-2.5 group-hover:shadow-md transition-all"
        >
          Book Now <RiArrowRightLine className="inline ml-1" />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Classes() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [bookingClass, setBookingClass] = useState(null)

  const filtered = activeFilter === 'All'
    ? classData
    : classData.filter(c => c.category === activeFilter)

  return (
    <div className="min-h-screen bg-white">

      {/* Booking Modal */}
      {bookingClass && (
        <ClassBookingModal cls={bookingClass} onClose={() => setBookingClass(null)} />
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-500 py-28 lg:py-36">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary-400/20 blur-2xl" />
        <div className="grid-pattern absolute inset-0 opacity-10" />

        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge mb-4 bg-white/20 text-white border-white/30">
              120+ Weekly Classes
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            World-Class Classes<br />
            <span className="text-secondary-200">for Every Goal</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary-100 text-lg max-w-2xl mx-auto mb-12"
          >
            From high-intensity HIIT to calming Yin Yoga — find the perfect class to match your energy, goals and schedule.
          </motion.p>

          {/* Animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { value: 120, suffix: '+', label: 'Weekly Classes' },
              { value: 15, suffix: '+', label: 'Class Types' },
              { value: 25, suffix: 'K+', label: 'Happy Members' },
              { value: 98, suffix: '%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center border border-white/20 bg-white/10">
                <div className="text-3xl font-extrabold text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-primary-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FILTER BAR ───────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center gap-3">
            <RiFilterLine className="text-slate-400 shrink-0 text-lg" />
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 flex-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    activeFilter === cat
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="shrink-0 text-sm text-slate-400 font-medium hidden sm:block">
              {filtered.length} classes
            </span>
          </div>
        </div>
      </section>

      {/* ── CLASS CARDS GRID ─────────────────────────────────────────────── */}
      <section className="section-py bg-slate-50">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filtered.map((cls, i) => (
                  <ClassCard key={cls.id} cls={cls} index={i} onBook={setBookingClass} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <span className="text-5xl mb-4 block">🤔</span>
                <p className="text-slate-500 text-lg">No classes found for this category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── WEEKLY TIMETABLE ─────────────────────────────────────────────── */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="section-label">Schedule</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mt-3 mb-4">
              Weekly <span className="text-gradient">Class Timetable</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Plan your week ahead. All times are in IST. Book any class up to 7 days in advance.
            </p>
          </motion.div>

          {/* Category Legend */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {Object.entries(catColors).map(([cat, cls]) => (
              <span key={cat} className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
                {cat}
              </span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm"
          >
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="bg-primary-600 text-white sticky top-0 z-10">
                  <th className="px-4 py-4 text-left font-semibold w-28">Time</th>
                  {timetableData.days.map(day => (
                    <th key={day} className="px-3 py-4 text-center font-semibold">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timetableData.times.map((time, ti) => (
                  <tr
                    key={time}
                    className={`border-t border-slate-100 ${ti % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-primary-50/40 transition-colors`}
                  >
                    <td className="px-4 py-3 text-slate-500 font-medium text-xs whitespace-nowrap">{time}</td>
                    {timetableData.days.map(day => {
                      const cell = timetableData.schedule[time]?.[day]
                      return (
                        <td key={day} className="px-2 py-2 text-center">
                          {cell ? (
                            <span className={`inline-block px-2 py-1.5 rounded-lg text-xs font-semibold leading-tight cursor-pointer hover:opacity-80 transition-opacity ${catColors[cell.cat] || 'bg-slate-100 text-slate-600'}`}>
                              {cell.name}
                            </span>
                          ) : (
                            <span className="text-slate-200 text-xs">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <p className="text-center text-slate-400 text-xs mt-4">
            * Schedule subject to change on public holidays. Check the app for real-time availability.
          </p>
        </div>
      </section>

      {/* ── BENEFITS STRIP ───────────────────────────────────────────────── */}
      <section className="section-py mesh-bg">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="section-label">Why Our Classes</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mt-3">
              Designed for <span className="text-gradient">Real Results</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="card card-hover text-center p-8"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${b.bg} ${b.color} mb-5 mx-auto`}>
                  {b.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{b.title}</h3>
                <p className="text-slate-500 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section-py bg-gradient-to-br from-primary-700 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-4xl mb-4 block">🎯</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4">
              Book a Free Trial Class
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Not sure where to start? Try any class free for your first session. No commitment required — just show up and sweat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-outline text-base px-8 py-4 inline-flex items-center gap-2">
                Book Free Trial <RiArrowRightLine />
              </Link>
              <Link to="/membership" className="bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center gap-2">
                View Memberships <RiArrowRightLine />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-10 text-primary-200 text-sm">
              {['No credit card needed', 'Cancel anytime', 'All equipment provided'].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <RiCheckLine className="text-secondary-300" /> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
