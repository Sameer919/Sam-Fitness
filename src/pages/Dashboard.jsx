import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiTrophyLine, RiCalendarCheckLine, RiCalculatorLine,
  RiLogoutBoxRLine, RiShieldFlashLine, RiHeartPulseLine,
  RiSpeedLine, RiArrowRightSLine, RiShieldCheckLine
} from 'react-icons/ri'

export default function Dashboard() {
  const [user] = useState(() => {
    const session = localStorage.getItem('memberSession')
    return session ? JSON.parse(session) : null
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    localStorage.removeItem('memberSession')
    window.dispatchEvent(new Event('authChange'))
    navigate('/login')
  }

  if (!user) return null

  // Mocked dynamic info
  const metrics = [
    { label: 'Weekly Workouts', value: '4 / 5', suffix: ' sessions', icon: RiTrophyLine, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'BMI Score', value: user.bmi || '22.4', suffix: ' Healthy', icon: RiHeartPulseLine, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Calculated Calories', value: '2,450', suffix: ' kcal/day', icon: RiSpeedLine, color: 'text-primary-500', bg: 'bg-primary-50' }
  ]

  const classes = [
    { name: 'Strength Forge', time: 'Mon, 8:00 AM', trainer: 'Aryan Kapoor', category: 'Strength', spots: 'Confirmed' },
    { name: 'Power Yoga', time: 'Wed, 7:00 AM', trainer: 'Priya Sharma', category: 'Yoga', spots: 'Confirmed' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="container-custom">
        {/* Welcome row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                  Hey, {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                  <RiShieldCheckLine className="text-sm" /> Active
                </span>
              </div>
              <p className="text-slate-500 text-sm">{user.tier} · Joined {user.joined}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/bmi-calculator" className="btn-secondary py-2.5 text-xs flex items-center gap-1.5">
              <RiCalculatorLine /> Calculate BMI
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <RiLogoutBoxRLine /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main left content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metrics.map((m, i) => {
                const Icon = m.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-card transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center text-xl mb-4`}>
                      <Icon />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{m.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-black text-2xl text-slate-800">{m.value}</span>
                      <span className="text-slate-500 text-xs font-medium">{m.suffix}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Booked Classes */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-black text-lg text-slate-900">Your Booked Classes</h2>
                  <p className="text-slate-500 text-xs">Classes scheduled for this week</p>
                </div>
                <Link to="/classes" className="text-primary-600 text-xs font-bold hover:underline flex items-center">
                  Book More <RiArrowRightSLine />
                </Link>
              </div>

              <div className="space-y-4">
                {classes.map((cls, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-primary-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xl">
                        {cls.category === 'Strength' ? '💪' : '🧘'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{cls.name}</h4>
                        <p className="text-slate-500 text-xs">{cls.time} · Coach {cls.trainer}</p>
                      </div>
                    </div>
                    <span className="bg-green-50 border border-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {cls.spots}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-8">
            {/* Programme & Goal */}
            <div className="bg-gradient-to-br from-primary-600 to-secondary-500 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-4">
                  <RiShieldFlashLine /> Your Current Goal
                </span>
                <h3 className="font-display font-black text-xl mb-2">{user.goal || 'Fat Loss & Cardio Conditioning'}</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Maintain your BMI at {user.bmi || '22.4'} through clean progressive weight routines and cardio intervals.
                </p>
                <Link to="/goal-finder" className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-primary-700 font-bold text-xs hover:bg-slate-50 transition-colors w-full">
                  Take Goal Finder Quiz <RiCalendarCheckLine />
                </Link>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="font-display font-black text-base text-slate-900 mb-4">Today's Recommendations</h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-700 mb-0.5">Hydration Goal</p>
                  <p className="text-slate-500 text-xs">Drink 3.5 Litres of water today. Currently at 2.0L.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-700 mb-0.5">Active Recovery</p>
                  <p className="text-slate-500 text-xs">Perform 10 mins of hamstring dynamic stretching pre-workout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
