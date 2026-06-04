import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiCalendarCheckLine,
  RiTimeLine,
  RiTrophyLine,
  RiStarFill,
  RiRocketLine,
  RiUserLine,
  RiBarChartLine,
  RiShieldCheckLine,
} from 'react-icons/ri'

/* ─── Data ─────────────────────────────────────────── */
const GOALS = [
  {
    id: 'weight-loss',
    emoji: '🔥',
    label: 'Weight Loss',
    desc: 'Burn fat, boost metabolism & feel confident',
    color: 'from-orange-50 to-red-50',
    border: 'border-orange-300',
    badge: 'Most Popular',
  },
  {
    id: 'muscle-gain',
    emoji: '💪',
    label: 'Muscle Gain',
    desc: 'Build lean muscle mass & increase size',
    color: 'from-blue-50 to-primary-50',
    border: 'border-primary-400',
    badge: '',
  },
  {
    id: 'strength',
    emoji: '⚡',
    label: 'Strength Building',
    desc: 'Get stronger, lift heavier, perform better',
    color: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-400',
    badge: '',
  },
  {
    id: 'general',
    emoji: '🏃',
    label: 'General Fitness',
    desc: 'Improve health, energy & overall wellbeing',
    color: 'from-green-50 to-teal-50',
    border: 'border-green-400',
    badge: '',
  },
]

const LEVELS = [
  {
    id: 'beginner',
    emoji: '🌱',
    label: 'Beginner',
    range: '0 – 6 months',
    desc: "You're just getting started or returning after a long break. We'll build your foundation safely.",
  },
  {
    id: 'intermediate',
    emoji: '🔆',
    label: 'Intermediate',
    range: '6 months – 2 years',
    desc: "You train regularly with good form. Time to level up intensity and break plateaus.",
  },
  {
    id: 'advanced',
    emoji: '🏆',
    label: 'Advanced',
    range: '2+ years',
    desc: "You're experienced and ready for elite programming, periodisation and peak performance.",
  },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIMES = [
  { id: 'morning', label: 'Morning', emoji: '🌅', time: '5am – 11am' },
  { id: 'afternoon', label: 'Afternoon', emoji: '☀️', time: '11am – 5pm' },
  { id: 'evening', label: 'Evening', emoji: '🌙', time: '5pm – 10pm' },
]

const STEP_LABELS = ['Goal', 'Level', 'Schedule', 'Profile', 'Results']

/* ─── Programme recommendations ────────────────────── */
const PROGRAMMES = {
  'weight-loss-beginner': {
    name: 'Fat Burn Starter',
    description:
      'A gentle but effective mix of cardio circuits and functional training designed to kickstart your metabolism. You will build base fitness while burning fat through enjoyable, sustainable sessions.',
    classes: ['Zumba Fitness', 'Aqua Aerobics', 'HIIT Basics', 'Morning Walk Club'],
    color: 'from-orange-500 to-red-500',
    emoji: '🔥',
  },
  'weight-loss-intermediate': {
    name: 'Shred & Tone',
    description:
      'A high-intensity programme combining HIIT, resistance training, and metabolic conditioning. Strategically designed macronutrient guidance included to accelerate fat loss while preserving lean muscle.',
    classes: ['Power HIIT', 'Bootcamp', 'Spin Cycling', 'Core Blaster'],
    color: 'from-orange-500 to-yellow-500',
    emoji: '⚡',
  },
  'weight-loss-advanced': {
    name: 'Elite Transformation',
    description:
      'Periodised fat loss protocol with progressive overload, metabolic conditioning blocks, and strategic refeed days. For those who want peak physique without sacrificing performance.',
    classes: ['CrossFit WOD', 'Olympic Lifting', 'Metabolic Conditioning', 'Sports Performance'],
    color: 'from-red-500 to-pink-500',
    emoji: '🏆',
  },
  'muscle-gain-beginner': {
    name: 'Mass Builder Foundation',
    description:
      'Learn the fundamental compound lifts with perfect form. Progressive overload principles introduced gradually so you gain muscle without risking injury. Ideal for true beginners.',
    classes: ['Strength Fundamentals', 'Functional Fitness', 'Yoga for Lifters', 'Nutrition 101'],
    color: 'from-blue-500 to-primary-600',
    emoji: '💪',
  },
  'muscle-gain-intermediate': {
    name: 'Hypertrophy Pro',
    description:
      'Evidence-based hypertrophy programming using PPL (Push/Pull/Legs) split. Targeted volume, proper rest periods, and progressive overload to maximise muscle protein synthesis.',
    classes: ['Heavy Lifting', 'Powerbuilding', 'Mobility & Recovery', 'Sports Nutrition'],
    color: 'from-primary-500 to-secondary-500',
    emoji: '💥',
  },
  'muscle-gain-advanced': {
    name: 'Elite Hypertrophy',
    description:
      'Advanced periodisation with DUP (Daily Undulating Periodisation), specialisation phases, and targeted lagging muscle protocols. Includes body composition scans every 4 weeks.',
    classes: ['Advanced Powerbuilding', 'Weak Point Training', 'Peak Week Protocol', 'Body Analysis'],
    color: 'from-indigo-500 to-blue-600',
    emoji: '🦾',
  },
  'strength-beginner': {
    name: 'Starting Strength',
    description:
      'Master the big 3: Squat, Bench, Deadlift. Linear progression model that adds weight every session. You will be surprised how fast you gain strength in the first 3 months.',
    classes: ['Barbell Basics', 'Powerlifting Intro', 'Core & Stability', 'Flexibility'],
    color: 'from-yellow-500 to-amber-500',
    emoji: '⚡',
  },
  'strength-intermediate': {
    name: 'Power Surge',
    description:
      'Texas Method or 5/3/1 style programming with volume, intensity, and deload phases. Accessory work to eliminate weak points and push your total higher every cycle.',
    classes: ['Powerlifting', 'Olympic Weightlifting', 'Core Power', 'Active Recovery'],
    color: 'from-amber-500 to-orange-500',
    emoji: '🏋️',
  },
  'strength-advanced': {
    name: 'Elite Powerlifting',
    description:
      'Competition-ready programming with conjugate or block periodisation. Individualised macros, RPE-based training, equipped and raw variations, and meet preparation support.',
    classes: ['Conjugate Method', 'Max Effort Training', 'Dynamic Effort', 'Meet Prep'],
    color: 'from-yellow-600 to-red-500',
    emoji: '🥇',
  },
  'general-beginner': {
    name: 'Healthy Start',
    description:
      'A balanced, fun, and sustainable programme covering cardiovascular fitness, basic strength, flexibility, and stress relief. The perfect introduction to an active lifestyle.',
    classes: ['Yoga Flow', 'Group Cardio', 'Functional Fitness', 'Meditation & Breathwork'],
    color: 'from-green-500 to-teal-500',
    emoji: '🌿',
  },
  'general-intermediate': {
    name: 'Active Lifestyle Pro',
    description:
      'Varied training with strength, cardio, yoga, and sports elements to keep you engaged and consistently improving. Great for maintaining high energy levels and long-term health.',
    classes: ['Circuit Training', 'Aqua Fitness', 'Pilates', 'Weekend Warriors'],
    color: 'from-teal-500 to-secondary-500',
    emoji: '🌟',
  },
  'general-advanced': {
    name: 'Peak Performance',
    description:
      'Advanced multi-modal training combining strength, endurance, mobility, and mental conditioning. Designed for those who want to perform at their best in all aspects of life.',
    classes: ['Athletic Performance', 'Obstacle Training', 'Advanced Yoga', 'Sports Conditioning'],
    color: 'from-secondary-500 to-blue-500',
    emoji: '🚀',
  },
}

/* ─── Helpers ───────────────────────────────────────── */
function getTimeline(currentWeight, targetWeight, goal) {
  const diff = Math.abs(currentWeight - targetWeight)
  if (!diff || diff < 1) return '4 – 8 weeks (maintenance & toning)'
  if (goal === 'muscle-gain') {
    const months = Math.ceil(diff / 1.5) // ~1.5 kg muscle per month
    return `${months} – ${months + 2} months`
  }
  const weeks = Math.ceil(diff / 0.75) // ~0.75 kg fat loss per week
  return `${weeks} – ${weeks + 4} weeks`
}

function getProgramme(goal, level) {
  const key = `${goal}-${level}`
  return PROGRAMMES[key] || PROGRAMMES['general-beginner']
}

/* ─── SliderInput ────────────────────────────────────── */
function SliderInput({ label, value, min, max, unit, onChange, step = 1 }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-primary-600 font-bold text-lg">
          {value} <span className="text-sm font-normal text-slate-500">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full bg-slate-200 appearance-none cursor-pointer accent-primary-600"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────── */
export default function GoalFinder() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState({
    goal: '',
    level: '',
    days: [],
    time: '',
    sessions: 3,
    age: 28,
    weight: 75,
    targetWeight: 65,
    height: 170,
  })

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }))

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }))
  }

  const goNext = () => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, 4))
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }

  const canProceed = () => {
    if (step === 0) return !!formData.goal
    if (step === 1) return !!formData.level
    if (step === 2) return formData.days.length > 0 && !!formData.time
    return true
  }

  const programme = getProgramme(formData.goal || 'general', formData.level || 'beginner')
  const timeline = getTimeline(formData.weight, formData.targetWeight, formData.goal)

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 mesh-bg">
      {/* ── Top Hero Banner ── */}
      <section className="pt-24 pb-8 bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge mb-4" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              🎯 Free Goal Analysis
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
              Find Your Perfect Programme
            </h1>
            <p className="text-primary-100 text-lg max-w-xl mx-auto">
              Answer 5 quick questions and get a personalised fitness roadmap crafted for your body and lifestyle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Wizard Card ── */}
      <section className="section-py">
        <div className="container-custom max-w-3xl">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Step dots */}
            <div className="flex items-center justify-between mb-3 relative">
              <div
                className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-0"
                style={{ left: '2.5rem', right: '2.5rem' }}
              />
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-1.5 z-10">
                  <motion.div
                    animate={{
                      backgroundColor: i < step ? '#0284C7' : i === step ? '#0284C7' : '#E2E8F0',
                      scale: i === step ? 1.15 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
                    style={{ color: i <= step ? '#fff' : '#94A3B8' }}
                  >
                    {i < step ? <RiCheckLine size={14} /> : i + 1}
                  </motion.div>
                  <span
                    className={`text-xs font-medium transition-colors duration-300 ${
                      i <= step ? 'text-primary-600' : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress fill bar */}
            <div className="progress-track mt-2">
              <motion.div
                className="progress-fill"
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          {/* Step Card */}
          <div className="card p-6 md:p-10 shadow-card-lg overflow-hidden min-h-[480px] flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
              {/* ── STEP 0: Goal ── */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex-1 flex flex-col"
                >
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
                    What's your primary goal?
                  </h2>
                  <p className="text-slate-500 mb-8">
                    This helps us build the right programme for you from day one.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    {GOALS.map((g) => (
                      <motion.button
                        key={g.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateField('goal', g.id)}
                        className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 bg-gradient-to-br ${g.color} ${
                          formData.goal === g.id
                            ? `${g.border} shadow-md ring-2 ring-offset-1 ring-primary-200`
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {g.badge && (
                          <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                            {g.badge}
                          </span>
                        )}
                        {formData.goal === g.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 left-3 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center"
                          >
                            <RiCheckLine size={12} className="text-white" />
                          </motion.div>
                        )}
                        <div className="text-4xl mb-3">{g.emoji}</div>
                        <div className="font-bold text-slate-900 text-lg mb-1">{g.label}</div>
                        <div className="text-slate-600 text-sm">{g.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 1: Level ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex-1 flex flex-col"
                >
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
                    What's your fitness level?
                  </h2>
                  <p className="text-slate-500 mb-8">
                    Be honest — we'll use this to calibrate the programme intensity.
                  </p>
                  <div className="space-y-4 flex-1">
                    {LEVELS.map((lvl) => (
                      <motion.button
                        key={lvl.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => updateField('level', lvl.id)}
                        className={`w-full text-left p-5 rounded-2xl border-2 flex items-start gap-4 transition-all duration-200 ${
                          formData.level === lvl.id
                            ? 'border-primary-400 bg-primary-50 shadow-md ring-2 ring-primary-100'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-3xl flex-shrink-0">{lvl.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-slate-900 text-lg">{lvl.label}</span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                              {lvl.range}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm">{lvl.desc}</p>
                        </div>
                        {formData.level === lvl.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center"
                          >
                            <RiCheckLine size={14} className="text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Schedule ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex-1 flex flex-col"
                >
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
                    When can you train?
                  </h2>
                  <p className="text-slate-500 mb-8">
                    We'll schedule your classes around your life — not the other way around.
                  </p>

                  {/* Day picker */}
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">
                      Select your available days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map((day) => (
                        <motion.button
                          key={day}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => toggleDay(day)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                            formData.days.includes(day)
                              ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-primary-300'
                          }`}
                        >
                          {day}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred time */}
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">
                      Preferred training time
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {TIMES.map((t) => (
                        <motion.button
                          key={t.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateField('time', t.id)}
                          className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                            formData.time === t.id
                              ? 'border-primary-400 bg-primary-50 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{t.emoji}</div>
                          <div className="text-sm font-bold text-slate-900">{t.label}</div>
                          <div className="text-xs text-slate-500">{t.time}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Sessions per week slider */}
                  <div className="card-surface p-5">
                    <SliderInput
                      label="Sessions per week"
                      value={formData.sessions}
                      min={2}
                      max={6}
                      unit="days"
                      onChange={(v) => updateField('sessions', v)}
                    />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Profile ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex-1 flex flex-col"
                >
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
                    Tell us about yourself
                  </h2>
                  <p className="text-slate-500 mb-8">
                    Your body metrics help us personalise nutrition and training intensity.
                  </p>
                  <div className="space-y-6 flex-1">
                    <div className="card-surface p-5">
                      <SliderInput
                        label="Age"
                        value={formData.age}
                        min={16}
                        max={75}
                        unit="yrs"
                        onChange={(v) => updateField('age', v)}
                      />
                    </div>
                    <div className="card-surface p-5">
                      <SliderInput
                        label="Height"
                        value={formData.height}
                        min={140}
                        max={220}
                        unit="cm"
                        onChange={(v) => updateField('height', v)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                          Current Weight
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => updateField('weight', Number(e.target.value))}
                            className="input pr-12"
                            min={30}
                            max={250}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                            kg
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                          Target Weight
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.targetWeight}
                            onChange={(e) => updateField('targetWeight', Number(e.target.value))}
                            className="input pr-12"
                            min={30}
                            max={250}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                            kg
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* BMI Preview */}
                    {formData.height > 0 && formData.weight > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                          <RiBarChartLine size={20} />
                        </div>
                        <div>
                          <div className="text-xs text-primary-600 font-semibold uppercase tracking-wide">
                            Current BMI
                          </div>
                          <div className="text-xl font-bold text-primary-700">
                            {(formData.weight / ((formData.height / 100) ** 2)).toFixed(1)}
                          </div>
                        </div>
                        <div className="ml-auto text-sm text-primary-600 font-medium">
                          {(() => {
                            const bmi = formData.weight / ((formData.height / 100) ** 2)
                            if (bmi < 18.5) return 'Underweight'
                            if (bmi < 25) return 'Normal'
                            if (bmi < 30) return 'Overweight'
                            return 'Obese'
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Results ── */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex-1 flex flex-col"
                >
                  {/* Confetti-like header */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-8"
                  >
                    <div className="text-5xl mb-3">{programme.emoji}</div>
                    <div className="section-label mb-2">Your Personalised Plan</div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
                      {programme.name}
                    </h2>
                    <p className="text-slate-600 max-w-lg mx-auto">{programme.description}</p>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-5 mb-6">
                    {/* Recommended Classes */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="card-surface p-5"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <RiCalendarCheckLine className="text-primary-600" size={20} />
                        <span className="font-bold text-slate-800">Suggested Classes</span>
                      </div>
                      <div className="space-y-2">
                        {programme.classes.map((cls, i) => (
                          <motion.div
                            key={cls}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + i * 0.07 }}
                            className="flex items-center gap-2 text-sm text-slate-700"
                          >
                            <RiCheckLine className="text-primary-500 flex-shrink-0" size={16} />
                            {cls}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Timeline & Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="card-surface p-5"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <RiTimeLine className="text-primary-600" size={20} />
                        <span className="font-bold text-slate-800">Your Plan Details</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Goal</span>
                          <span className="font-semibold text-slate-800 capitalize">
                            {formData.goal?.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Level</span>
                          <span className="font-semibold text-slate-800 capitalize">{formData.level}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Sessions/Week</span>
                          <span className="font-semibold text-slate-800">{formData.sessions} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Preferred Time</span>
                          <span className="font-semibold text-slate-800 capitalize">{formData.time}</span>
                        </div>
                        <div className="h-px bg-slate-200" />
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Est. Timeline</span>
                          <span className="font-bold text-primary-600">{timeline}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Weekly Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 rounded-2xl p-5 mb-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <RiCalendarCheckLine className="text-primary-600" size={20} />
                      <span className="font-bold text-slate-800">Weekly Schedule Preview</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map((day) => {
                        const isSelected = formData.days.includes(day)
                        const classIdx = formData.days.indexOf(day)
                        return (
                          <div
                            key={day}
                            className={`flex-1 min-w-[60px] rounded-xl p-2 text-center ${
                              isSelected
                                ? 'bg-primary-600 text-white'
                                : 'bg-white/60 text-slate-400'
                            }`}
                          >
                            <div className="text-xs font-bold mb-1">{day}</div>
                            {isSelected && classIdx < programme.classes.length && (
                              <div className="text-[9px] leading-tight opacity-90">
                                {programme.classes[classIdx % programme.classes.length].split(' ')[0]}
                              </div>
                            )}
                            {!isSelected && <div className="text-xs">—</div>}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-3 gap-3 mb-7"
                  >
                    {[
                      { icon: <RiTrophyLine size={18} />, text: 'Expert Trainers' },
                      { icon: <RiShieldCheckLine size={18} />, text: 'Safe & Effective' },
                      { icon: <RiStarFill size={18} />, text: 'Proven Results' },
                    ].map((item) => (
                      <div
                        key={item.text}
                        className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-slate-100 text-center"
                      >
                        <div className="text-primary-600">{item.icon}</div>
                        <div className="text-xs font-semibold text-slate-700">{item.text}</div>
                      </div>
                    ))}
                  </motion.div>

                  {/* CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <Link to="/membership" className="btn-primary-lg flex-1 justify-center">
                      <RiRocketLine size={20} />
                      Start This Programme
                    </Link>
                    <Link to="/contact" className="btn-secondary flex-1 justify-center">
                      <RiUserLine size={18} />
                      Book Free Consultation
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Navigation Buttons ── */}
            {step < 4 && (
              <div className="flex justify-between items-center pt-8 mt-auto border-t border-slate-100">
                <motion.button
                  onClick={goBack}
                  disabled={step === 0}
                  whileHover={{ scale: step === 0 ? 1 : 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    step === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <RiArrowLeftLine size={18} />
                  Back
                </motion.button>

                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === step ? 'w-6 bg-primary-600' : i < step ? 'w-3 bg-primary-300' : 'w-3 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={goNext}
                  disabled={!canProceed()}
                  whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    canProceed()
                      ? 'bg-primary-600 text-white shadow-btn hover:bg-primary-700'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {step === 3 ? 'See My Plan' : 'Next'}
                  <RiArrowRightLine size={18} />
                </motion.button>
              </div>
            )}

            {/* Restart on results */}
            {step === 4 && (
              <div className="pt-6 border-t border-slate-100 mt-4 text-center">
                <button
                  onClick={() => {
                    setDirection(-1)
                    setStep(0)
                    setFormData({
                      goal: '',
                      level: '',
                      days: [],
                      time: '',
                      sessions: 3,
                      age: 28,
                      weight: 75,
                      targetWeight: 65,
                      height: 170,
                    })
                  }}
                  className="text-sm text-slate-500 hover:text-primary-600 font-medium transition-colors"
                >
                  ← Start Over with Different Goals
                </button>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-center"
          >
            {[
              { label: '12,000+ Members Matched', emoji: '👥' },
              { label: '98% Satisfaction Rate', emoji: '⭐' },
              { label: 'Free & No Obligation', emoji: '🎁' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
