import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  RiFireLine,
  RiAddLine,
  RiCloseLine,
  RiRefreshLine,
  RiHeartPulseLine,
  RiShieldCheckLine,
  RiLeafLine,
  RiRocketLine,
  RiBarChartLine,
  RiUserLine,
  RiSearch2Line,
  RiDropLine,
  RiBrainLine,
  RiTimeLine,
} from 'react-icons/ri'

/* ─── Indian Food Database ──────────────────────────── */
const FOOD_DB = [
  { name: 'Idli (2 pieces)', cal: 140, protein: 4, carbs: 28, fat: 1 },
  { name: 'Masala Dosa', cal: 206, protein: 5, carbs: 32, fat: 7 },
  { name: 'Poha (1 bowl)', cal: 244, protein: 4, carbs: 42, fat: 7 },
  { name: 'Upma (1 bowl)', cal: 230, protein: 5, carbs: 38, fat: 6 },
  { name: 'Dal Tadka (1 bowl)', cal: 148, protein: 9, carbs: 20, fat: 4 },
  { name: 'Rajma Chawal', cal: 350, protein: 15, carbs: 58, fat: 5 },
  { name: 'Paneer Tikka (100g)', cal: 265, protein: 18, carbs: 4, fat: 20 },
  { name: 'Chicken Curry (100g)', cal: 142, protein: 15, carbs: 4, fat: 7 },
  { name: 'Roti (1 piece)', cal: 71, protein: 3, carbs: 15, fat: 1 },
  { name: 'Brown Rice (1 cup)', cal: 216, protein: 5, carbs: 45, fat: 2 },
  { name: 'Chole Bhature', cal: 490, protein: 14, carbs: 65, fat: 20 },
  { name: 'Banana (1 medium)', cal: 89, protein: 1, carbs: 23, fat: 0 },
  { name: 'Mango (1 cup)', cal: 99, protein: 1, carbs: 25, fat: 1 },
  { name: 'Lassi (sweetened)', cal: 155, protein: 5, carbs: 28, fat: 3 },
  { name: 'Moong Dal Chilla', cal: 162, protein: 9, carbs: 24, fat: 4 },
  { name: 'Aloo Paratha (1)', cal: 302, protein: 6, carbs: 43, fat: 12 },
  { name: 'Sabudana Khichdi', cal: 295, protein: 4, carbs: 53, fat: 8 },
  { name: 'Boiled Eggs (2)', cal: 155, protein: 13, carbs: 1, fat: 11 },
  { name: 'Greek Yoghurt (100g)', cal: 59, protein: 10, carbs: 4, fat: 0 },
  { name: 'Palak Paneer (1 cup)', cal: 270, protein: 12, carbs: 9, fat: 19 },
  { name: 'Samosa (2 pieces)', cal: 308, protein: 6, carbs: 38, fat: 15 },
  { name: 'Sprouts Salad (1 bowl)', cal: 82, protein: 6, carbs: 14, fat: 0 },
  { name: 'Oats Porridge (1 bowl)', cal: 166, protein: 6, carbs: 28, fat: 3 },
  { name: 'Watermelon (1 cup)', cal: 46, protein: 1, carbs: 11, fat: 0 },
  { name: 'Peanut Butter (2 tbsp)', cal: 190, protein: 8, carbs: 6, fat: 16 },
]

/* ─── Health Facts ──────────────────────────────────── */
const HEALTH_FACTS = [
  {
    emoji: '💧',
    icon: <RiDropLine size={22} />,
    title: 'Hydration Matters',
    fact: 'Drinking 500ml of water before meals can reduce calorie intake by 13% and boost metabolism by 30% for 90 minutes.',
    color: 'from-blue-50 to-cyan-50',
    border: 'border-blue-100',
  },
  {
    emoji: '😴',
    icon: <RiTimeLine size={22} />,
    title: 'Sleep & Weight',
    fact: 'Sleeping less than 6 hours per night can increase hunger hormones by 28%, leading to ~385 extra calories consumed daily.',
    color: 'from-indigo-50 to-purple-50',
    border: 'border-indigo-100',
  },
  {
    emoji: '🧠',
    icon: <RiBrainLine size={22} />,
    title: 'Exercise & Brain',
    fact: 'Just 20 minutes of aerobic exercise increases BDNF (brain-derived neurotrophic factor), improving memory and focus for up to 2 hours.',
    color: 'from-pink-50 to-rose-50',
    border: 'border-pink-100',
  },
  {
    emoji: '🔥',
    icon: <RiFireLine size={22} />,
    title: 'Muscle Burns Fat',
    fact: 'Each kg of muscle burns approximately 13 kcal per day at rest — gaining 5 kg of muscle burns an extra 65 calories daily without exercise.',
    color: 'from-orange-50 to-amber-50',
    border: 'border-orange-100',
  },
  {
    emoji: '❤️',
    icon: <RiHeartPulseLine size={22} />,
    title: 'Heart Health',
    fact: 'Just 150 minutes of moderate exercise weekly reduces the risk of heart disease by 35% and type-2 diabetes by 50%.',
    color: 'from-red-50 to-pink-50',
    border: 'border-red-100',
  },
  {
    emoji: '🌿',
    icon: <RiLeafLine size={22} />,
    title: 'Protein Timing',
    fact: 'Consuming 20-40g of protein within 30 minutes post-workout maximises muscle protein synthesis by up to 50% compared to eating later.',
    color: 'from-green-50 to-teal-50',
    border: 'border-green-100',
  },
]

/* ─── BMI Category helper ───────────────────────────── */
function getBMICategory(bmi) {
  if (bmi < 18.5)
    return {
      label: 'Underweight',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      barColor: '#3B82F6',
      angle: 20,
      recommendation:
        'Your BMI indicates you may be underweight. Focus on nutrient-dense foods, strength training to build muscle mass, and consult our nutrition specialists for a personalised calorie surplus plan.',
    }
  if (bmi < 25)
    return {
      label: 'Normal Weight',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      barColor: '#10B981',
      angle: 90,
      recommendation:
        'Excellent! Your BMI is in the healthy range. Maintain this with a balanced diet, regular strength training 3-4x per week, and cardiovascular exercise. Focus on building lean muscle for long-term health.',
    }
  if (bmi < 30)
    return {
      label: 'Overweight',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      barColor: '#F59E0B',
      angle: 140,
      recommendation:
        'Your BMI indicates you are slightly overweight. A combination of a 300-500 kcal deficit, 150+ minutes of cardio per week, and 2-3 strength sessions will help you reach a healthy weight within 3-6 months.',
    }
  return {
    label: 'Obese',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    barColor: '#EF4444',
    angle: 165,
    recommendation:
      'Your BMI is in the obese range. We strongly recommend starting with low-impact exercise (walking, swimming, cycling), reducing processed foods, and booking a free consultation with our certified trainers and nutritionists.',
  }
}

/* ─── TDEE Activity multipliers ─────────────────────── */
const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', emoji: '🪑', multiplier: 1.2 },
  { id: 'light', label: 'Lightly Active', desc: '1-3 days/week', emoji: '🚶', multiplier: 1.375 },
  { id: 'moderate', label: 'Moderately Active', desc: '3-5 days/week', emoji: '🏃', multiplier: 1.55 },
  { id: 'active', label: 'Very Active', desc: '6-7 days/week', emoji: '🏋️', multiplier: 1.725 },
  { id: 'extreme', label: 'Extremely Active', desc: 'Athlete / 2x daily', emoji: '⚡', multiplier: 1.9 },
]

/* ─── Arc Gauge SVG ──────────────────────────────────── */
function BMIGauge({ bmi, category }) {
  const clampedBMI = Math.max(10, Math.min(45, bmi))
  // Map BMI 10-45 to angle 0-180 degrees on a semicircle
  const angleRatio = (clampedBMI - 10) / (45 - 10)

  const cx = 110
  const cy = 110
  const r = 85
  const strokeWidth = 18

  // Arc segments
  const segments = [
    { color: '#3B82F6', start: 180, end: 234 }, // Underweight
    { color: '#10B981', start: 234, end: 288 }, // Normal
    { color: '#F59E0B', start: 288, end: 324 }, // Overweight
    { color: '#EF4444', start: 324, end: 360 }, // Obese
  ]

  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    }
  }

  function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle)
    const end = polarToCartesian(cx, cy, r, startAngle)
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1'
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
  }

  // Needle calculation — maps 0-180 degrees across the bottom semicircle
  const needleDeg = 180 + angleRatio * 180 // 180 to 360 degrees (bottom half)
  const needleRad = ((needleDeg - 90) * Math.PI) / 180
  const needleLength = 68
  const nx = cx + needleLength * Math.cos(needleRad)
  const ny = cy + needleLength * Math.sin(needleRad)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 130" className="w-full max-w-[280px]">
        {/* Background arc */}
        <path
          d={describeArc(cx, cy, r, 180, 360)}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Coloured segments */}
        {segments.map((seg, i) => (
          <motion.path
            key={i}
            d={describeArc(cx, cy, r, seg.start, seg.end)}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.12 }}
          />
        ))}
        {/* Needle */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={category.barColor}
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        {/* Centre circle */}
        <circle cx={cx} cy={cy} r={6} fill={category.barColor} />
        <circle cx={cx} cy={cy} r={3} fill="white" />
        {/* Labels */}
        <text x="30" y="118" fontSize="8" fill="#94A3B8" textAnchor="middle">Underweight</text>
        <text x="90" y="30" fontSize="8" fill="#94A3B8" textAnchor="middle">Normal</text>
        <text x="155" y="50" fontSize="8" fill="#94A3B8" textAnchor="middle">Over</text>
        <text x="192" y="100" fontSize="8" fill="#94A3B8" textAnchor="middle">Obese</text>
      </svg>
      {/* BMI Number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="text-center -mt-2"
      >
        <div className={`text-5xl font-black ${category.color}`}>{bmi.toFixed(1)}</div>
        <div className={`text-sm font-bold px-3 py-1 rounded-full mt-1 ${category.bg} ${category.color} border ${category.border}`}>
          {category.label}
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────── */
export default function BMICalculator() {
  // ── BMI State ──
  const [unit, setUnit] = useState('metric') // metric | imperial
  const [heightCm, setHeightCm] = useState(170)
  const [heightFt, setHeightFt] = useState(5)
  const [heightIn, setHeightIn] = useState(7)
  const [weightKg, setWeightKg] = useState(70)
  const [weightLbs, setWeightLbs] = useState(154)
  const [age, setAge] = useState(28)
  const [gender, setGender] = useState('male')
  const [bmiResult, setBmiResult] = useState(null)
  const [showBMI, setShowBMI] = useState(false)

  // ── TDEE State ──
  const [activity, setActivity] = useState('moderate')
  const [tdeeBmi, setTdeeBmi] = useState(null) // compute from same inputs
  const [showTDEE, setShowTDEE] = useState(false)

  // ── Calorie Tracker ──
  const [searchQuery, setSearchQuery] = useState('')
  const [loggedFoods, setLoggedFoods] = useState([])
  const [dailyTarget, setDailyTarget] = useState(2000)

  const totalCalories = loggedFoods.reduce((sum, f) => sum + f.cal, 0)

  const filteredFoods = searchQuery.length >= 2
    ? FOOD_DB.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  function addFood(food) {
    setLoggedFoods((prev) => [...prev, { ...food, id: Date.now() + Math.random() }])
    setSearchQuery('')
  }

  function removeFood(id) {
    setLoggedFoods((prev) => prev.filter((f) => f.id !== id))
  }

  // ── BMR calculation (Mifflin-St Jeor) ──
  function calcBMR() {
    const wKg = unit === 'metric' ? weightKg : weightLbs * 0.453592
    const hCm = unit === 'metric' ? heightCm : heightFt * 30.48 + heightIn * 2.54
    if (gender === 'male') return 10 * wKg + 6.25 * hCm - 5 * age + 5
    return 10 * wKg + 6.25 * hCm - 5 * age - 161
  }

  function calcBMI() {
    const wKg = unit === 'metric' ? weightKg : weightLbs * 0.453592
    const hCm = unit === 'metric' ? heightCm : heightFt * 30.48 + heightIn * 2.54
    return wKg / ((hCm / 100) ** 2)
  }

  function handleCalculateBMI() {
    const bmi = calcBMI()
    setBmiResult(bmi)
    setShowBMI(true)
    const bmr = calcBMR()
    const mult = ACTIVITY_LEVELS.find((a) => a.id === activity)?.multiplier || 1.55
    setTdeeBmi({ bmr: Math.round(bmr), tdee: Math.round(bmr * mult) })
  }

  function handleCalculateTDEE() {
    const bmr = calcBMR()
    const mult = ACTIVITY_LEVELS.find((a) => a.id === activity)?.multiplier || 1.55
    setTdeeBmi({ bmr: Math.round(bmr), tdee: Math.round(bmr * mult) })
    setShowTDEE(true)
  }

  const bmiCategory = bmiResult ? getBMICategory(bmiResult) : null

  const calorieBarWidth = Math.min(100, (totalCalories / dailyTarget) * 100)
  const calorieColor =
    totalCalories < dailyTarget * 0.8
      ? 'bg-blue-400'
      : totalCalories <= dailyTarget * 1.05
      ? 'bg-emerald-500'
      : 'bg-red-500'
  const calorieStatus =
    totalCalories < dailyTarget * 0.8
      ? 'Under Target'
      : totalCalories <= dailyTarget * 1.05
      ? 'On Track 🎉'
      : 'Over Target'
  const calorieStatusColor =
    totalCalories < dailyTarget * 0.8
      ? 'text-blue-600'
      : totalCalories <= dailyTarget * 1.05
      ? 'text-emerald-600'
      : 'text-red-600'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ═══ 1. HERO ═══════════════════════════════════ */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-secondary-400/10 rounded-full blur-2xl" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="badge mb-5"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                🔬 Science-Based Tools
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-5 leading-tight">
                Know Your Numbers.{' '}
                <span className="text-secondary-300">Transform Your Health.</span>
              </h1>
              <p className="text-primary-100 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                Use clinically validated formulas to calculate your BMI, daily calorie needs, and track nutrition — then let Sam Fitness turn those numbers into a life-changing programme.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: '📊', text: 'BMI Calculator' },
                  { icon: '🔥', text: 'TDEE Calculator' },
                  { icon: '🥗', text: 'Calorie Tracker' },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold"
                  >
                    <span>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ═══ 2. BMI CALCULATOR ══════════════════════════ */}
      <section className="section-py bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-label mb-3 block">Body Mass Index</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              BMI Calculator
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              BMI is a widely used screening tool. For a complete picture, also check your body fat
              percentage and waist circumference.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-8">
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 card p-6 md:p-8"
            >
              {/* Unit Toggle */}
              <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  onClick={() => setUnit('metric')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    unit === 'metric'
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Metric (cm / kg)
                </button>
                <button
                  onClick={() => setUnit('imperial')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    unit === 'imperial'
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Imperial (ft / lbs)
                </button>
              </div>

              <div className="space-y-6">
                {/* Height */}
                {unit === 'metric' ? (
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-semibold text-slate-700">Height</label>
                      <span className="text-primary-600 font-bold">{heightCm} cm</span>
                    </div>
                    <input
                      type="range"
                      min={140}
                      max={220}
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full h-2 rounded-full bg-slate-200 appearance-none cursor-pointer accent-primary-600 mb-2"
                    />
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="input"
                      placeholder="Height in cm"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">Height</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          value={heightFt}
                          onChange={(e) => setHeightFt(Number(e.target.value))}
                          className="input"
                          placeholder="Feet"
                          min={3}
                          max={8}
                        />
                        <span className="text-xs text-slate-400 mt-1 block">Feet</span>
                      </div>
                      <div>
                        <input
                          type="number"
                          value={heightIn}
                          onChange={(e) => setHeightIn(Number(e.target.value))}
                          className="input"
                          placeholder="Inches"
                          min={0}
                          max={11}
                        />
                        <span className="text-xs text-slate-400 mt-1 block">Inches</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weight */}
                <div>
                  {unit === 'metric' ? (
                    <>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-sm font-semibold text-slate-700">Weight</label>
                        <span className="text-primary-600 font-bold">{weightKg} kg</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={200}
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-full h-2 rounded-full bg-slate-200 appearance-none cursor-pointer accent-primary-600 mb-2"
                      />
                      <input
                        type="number"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="input"
                        placeholder="Weight in kg"
                      />
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-sm font-semibold text-slate-700">Weight</label>
                        <span className="text-primary-600 font-bold">{weightLbs} lbs</span>
                      </div>
                      <input
                        type="range"
                        min={66}
                        max={440}
                        value={weightLbs}
                        onChange={(e) => setWeightLbs(Number(e.target.value))}
                        className="w-full h-2 rounded-full bg-slate-200 appearance-none cursor-pointer accent-primary-600 mb-2"
                      />
                      <input
                        type="number"
                        value={weightLbs}
                        onChange={(e) => setWeightLbs(Number(e.target.value))}
                        className="input"
                        placeholder="Weight in lbs"
                      />
                    </>
                  )}
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="input"
                      min={10}
                      max={100}
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1.5">Gender</label>
                    <div className="flex gap-2">
                      {['male', 'female'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 capitalize transition-all duration-200 ${
                            gender === g
                              ? 'border-primary-400 bg-primary-50 text-primary-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {g === 'male' ? '♂ Male' : '♀ Female'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCalculateBMI}
                  className="btn-primary-lg w-full justify-center"
                >
                  <RiBarChartLine size={20} />
                  Calculate My BMI
                </motion.button>
              </div>
            </motion.div>

            {/* Result Panel */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 flex flex-col gap-4"
            >
              <AnimatePresence mode="wait">
                {showBMI && bmiResult && bmiCategory ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="card p-6 flex-1"
                  >
                    <BMIGauge bmi={bmiResult} category={bmiCategory} />

                    {/* Scale reference */}
                    <div className="mt-5 space-y-2">
                      {[
                        { label: 'Underweight', range: '< 18.5', color: 'bg-blue-500' },
                        { label: 'Normal', range: '18.5 – 24.9', color: 'bg-emerald-500' },
                        { label: 'Overweight', range: '25 – 29.9', color: 'bg-amber-500' },
                        { label: 'Obese', range: '30+', color: 'bg-red-500' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-xs">
                          <div className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`} />
                          <span className="text-slate-600 font-medium w-20">{item.label}</span>
                          <span className="text-slate-400">{item.range}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card p-6 flex-1 flex flex-col items-center justify-center text-center min-h-[280px]"
                  >
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-slate-500 font-medium">
                      Enter your details and click Calculate to see your BMI result and health gauge.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recommendation Card */}
              <AnimatePresence>
                {showBMI && bmiCategory && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`card p-5 border-l-4 ${bmiCategory.border}`}
                    style={{ borderLeftColor: bmiCategory.barColor }}
                  >
                    <div className="flex items-start gap-3">
                      <RiShieldCheckLine className={bmiCategory.color} size={22} />
                      <div>
                        <div className="font-bold text-slate-800 mb-1">Recommendation</div>
                        <p className="text-sm text-slate-600 leading-relaxed">{bmiCategory.recommendation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 3. TDEE CALCULATOR ═════════════════════════ */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-label mb-3 block">Daily Calorie Needs</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              TDEE Calculator
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Total Daily Energy Expenditure — how many calories your body burns in a day. The foundation of any nutrition plan.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-6 md:p-8"
            >
              {/* Activity Level Selector */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 block mb-3">
                  Select your activity level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {ACTIVITY_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setActivity(level.id)}
                      className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                        activity === level.id
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{level.emoji}</div>
                      <div className="text-xs font-bold text-slate-800">{level.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-400 mb-4 italic">
                ℹ️ TDEE uses the same height, weight, age & gender from the BMI calculator above. Fill those fields first.
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCalculateTDEE}
                className="btn-primary-lg w-full justify-center mb-6"
              >
                <RiFireLine size={20} />
                Calculate My Daily Calories
              </motion.button>

              {/* Results */}
              <AnimatePresence>
                {showTDEE && tdeeBmi && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="border-t border-slate-100 pt-6">
                      <div className="text-center mb-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Your Basal Metabolic Rate
                        </div>
                        <div className="text-3xl font-black text-slate-800">
                          {tdeeBmi.bmr.toLocaleString()}{' '}
                          <span className="text-base font-normal text-slate-500">kcal/day</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Calories burned at complete rest</div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            label: 'Fat Loss',
                            desc: '500 kcal deficit',
                            value: tdeeBmi.tdee - 500,
                            color: 'from-blue-50 to-cyan-50',
                            border: 'border-blue-200',
                            textColor: 'text-blue-700',
                            emoji: '📉',
                          },
                          {
                            label: 'Maintenance',
                            desc: 'Keep current weight',
                            value: tdeeBmi.tdee,
                            color: 'from-emerald-50 to-green-50',
                            border: 'border-emerald-200',
                            textColor: 'text-emerald-700',
                            emoji: '⚖️',
                          },
                          {
                            label: 'Muscle Gain',
                            desc: '300 kcal surplus',
                            value: tdeeBmi.tdee + 300,
                            color: 'from-orange-50 to-amber-50',
                            border: 'border-orange-200',
                            textColor: 'text-orange-700',
                            emoji: '📈',
                          },
                        ].map((item) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-gradient-to-br ${item.color} border ${item.border} rounded-2xl p-4 text-center`}
                          >
                            <div className="text-2xl mb-2">{item.emoji}</div>
                            <div className={`text-2xl font-black ${item.textColor} mb-1`}>
                              {item.value.toLocaleString()}
                            </div>
                            <div className="text-xs font-bold text-slate-700">{item.label}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                        <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
                        <p className="text-xs text-amber-700">
                          <strong>Note:</strong> These are estimates based on the Mifflin-St Jeor equation. Individual results vary. For a precise nutrition plan, book a consultation with our registered dietitian.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 4. CALORIE TRACKER ═════════════════════════ */}
      <section className="section-py bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-label mb-3 block">Daily Nutrition Log</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Calorie Tracker
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Track your daily food intake with our curated Indian food database. Awareness is the first step to change.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* Daily Target & Status */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                <div>
                  <div className="text-sm font-semibold text-slate-500 mb-1">Daily Calorie Target</div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={dailyTarget}
                      onChange={(e) => setDailyTarget(Number(e.target.value))}
                      className="input w-32 text-center text-lg font-bold"
                      min={1000}
                      max={5000}
                    />
                    <span className="text-slate-500 font-medium">kcal</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-slate-900">{totalCalories}</div>
                  <div className={`text-sm font-bold ${calorieStatusColor}`}>{calorieStatus}</div>
                  <div className="text-xs text-slate-400">{Math.max(0, dailyTarget - totalCalories)} kcal remaining</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-track mb-3">
                <motion.div
                  className={`h-full rounded-full transition-all duration-500 ${calorieColor}`}
                  animate={{ width: `${calorieBarWidth}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ width: `${calorieBarWidth}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>0 kcal</span>
                <span>{dailyTarget} kcal target</span>
              </div>
            </motion.div>

            {/* Food Search */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <RiSearch2Line className="text-primary-600" size={20} />
                Add Food
              </h3>
              <div className="relative mb-3">
                <RiSearch2Line
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-11"
                  placeholder="Search Indian foods (e.g. Idli, Dal, Roti)..."
                />
              </div>

              {/* Search results dropdown */}
              <AnimatePresence>
                {filteredFoods.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="border border-slate-200 rounded-xl overflow-hidden mb-4 divide-y divide-slate-100"
                  >
                    {filteredFoods.slice(0, 6).map((food) => (
                      <button
                        key={food.name}
                        onClick={() => addFood(food)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary-50 transition-colors duration-150 text-left"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{food.name}</div>
                          <div className="text-xs text-slate-500">
                            P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm font-bold text-primary-600">{food.cal} kcal</span>
                          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                            <RiAddLine size={16} className="text-primary-600" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No results hint */}
              {searchQuery.length >= 2 && filteredFoods.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-2">
                  No foods found. Try 'roti', 'dal', 'paneer', 'idli'…
                </p>
              )}
              {searchQuery.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {['Idli', 'Roti', 'Dal', 'Paneer', 'Banana', 'Eggs'].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => setSearchQuery(hint)}
                      className="tag-primary text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-primary-100 transition-colors"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Logged Foods */}
            {loggedFoods.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Today's Log</h3>
                  <button
                    onClick={() => setLoggedFoods([])}
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <RiRefreshLine size={14} /> Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {loggedFoods.map((food) => (
                      <motion.div
                        key={food.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{food.name}</div>
                          <div className="text-xs text-slate-500">
                            P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-primary-600">{food.cal} kcal</span>
                          <button
                            onClick={() => removeFood(food.id)}
                            className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <RiCloseLine size={16} className="text-red-400" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Macro summary */}
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3">
                  {[
                    {
                      label: 'Protein',
                      value: loggedFoods.reduce((s, f) => s + f.protein, 0),
                      unit: 'g',
                      color: 'text-blue-600',
                      bg: 'bg-blue-50',
                    },
                    {
                      label: 'Carbs',
                      value: loggedFoods.reduce((s, f) => s + f.carbs, 0),
                      unit: 'g',
                      color: 'text-amber-600',
                      bg: 'bg-amber-50',
                    },
                    {
                      label: 'Fats',
                      value: loggedFoods.reduce((s, f) => s + f.fat, 0),
                      unit: 'g',
                      color: 'text-green-600',
                      bg: 'bg-green-50',
                    },
                  ].map((macro) => (
                    <div
                      key={macro.label}
                      className={`${macro.bg} rounded-xl p-3 text-center`}
                    >
                      <div className={`text-xl font-black ${macro.color}`}>
                        {macro.value}
                        <span className="text-sm font-normal">{macro.unit}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{macro.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 5. HEALTH FACTS ════════════════════════════ */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-label mb-3 block">Did You Know?</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              6 Health Facts That Will Surprise You
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Science-backed insights to help you make smarter choices about your fitness and nutrition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HEALTH_FACTS.map((fact, i) => (
              <motion.div
                key={fact.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`card-hover p-6 bg-gradient-to-br ${fact.color} border ${fact.border}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{fact.emoji}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{fact.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{fact.fact}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. CTA ═════════════════════════════════════ */}
      <section className="section-py bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-6">🚀</div>
            <span
              className="badge mb-5"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Next Step
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-5">
              Numbers don't lie.{' '}
              <br className="hidden md:block" />
              <span className="text-secondary-300">Your results are waiting.</span>
            </h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
              You know your BMI and calorie needs. Now let our expert trainers build a personalised programme around those exact numbers — and transform your health in 90 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/goal-finder" className="btn-primary-lg bg-white text-primary-700 hover:bg-primary-50">
                <RiRocketLine size={20} />
                Get a Personalised Programme
              </Link>
              <Link to="/contact" className="btn-outline">
                <RiUserLine size={18} />
                Talk to a Trainer
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-primary-100">
              {[
                { label: 'Calculators Completed', value: '48,000+' },
                { label: 'Members Transformed', value: '12,000+' },
                { label: 'Average BMI Reduction', value: '4.2 pts' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
