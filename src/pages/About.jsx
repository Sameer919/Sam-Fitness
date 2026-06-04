import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import {
  RiArrowRightLine, RiTeamLine, RiAwardLine,
  RiGlobalLine, RiTrophyLine, RiStarFill,
} from 'react-icons/ri'
import SectionHeader from '../components/ui/SectionHeader'

const CountUpComponent = CountUp.default || CountUp

const timeline = [
  { year: '2012', title: 'Founded in Mumbai', desc: 'Sam Fitness opened its first studio in Bandra West — 8,000 sq ft of premium fitness space, 12 trainers, 200 founding members.', color: 'primary' },
  { year: '2015', title: 'AI Coaching Launched', desc: 'We became the first gym in India to integrate AI-powered personalised coaching, analysing biometrics and progress in real time.', color: 'secondary' },
  { year: '2018', title: 'Pune Expansion', desc: 'Our second facility opened in Koregaon Park, Pune — 15,000 sq ft with India\'s first 360° functional training arena.', color: 'primary' },
  { year: '2021', title: 'Bengaluru Opens', desc: 'Third location launched in Indiranagar, Bengaluru, home to our flagship Olympic pool and dedicated recovery wing.', color: 'secondary' },
  { year: '2024', title: 'India\'s #1 Rating', desc: 'Recognised by Fitness India Magazine as India\'s #1 Premium Fitness Studio for the third consecutive year. 5,000+ active members.', color: 'primary' },
]

const team = [
  { name: 'Vikram Anand',    title: 'Founder & CEO',           bio: '2x national powerlifting champion, IIM Ahmedabad MBA. Built Sam Fitness to make elite fitness accessible.', img: 'https://i.pravatar.cc/200?img=51' },
  { name: 'Dr. Riya Mehta',  title: 'Chief Wellness Officer',  bio: 'MBBS, Sports Medicine. Pioneered Sam Fitness\'s evidence-based programming and injury prevention protocols.', img: 'https://i.pravatar.cc/200?img=44' },
  { name: 'Karan Singh',     title: 'Head of Training',        bio: 'NSCA-CSCS, 15 years coaching elite athletes. Designed the progressive overload system used across all Sam Fitness programmes.', img: 'https://i.pravatar.cc/200?img=54' },
  { name: 'Pooja Sharma',    title: 'Director of Nutrition',   bio: 'Registered Dietitian, IHM Delhi. Created Sam Fitness\'s nutrition framework — the first evidence-based system in Indian gyms.', img: 'https://i.pravatar.cc/200?img=47' },
  { name: 'Rohit Desai',     title: 'Head of Technology',      bio: 'IIT Bombay. Built the AI coaching engine and wearable integration platform powering all member experiences.', img: 'https://i.pravatar.cc/200?img=33' },
  { name: 'Ananya Gupta',    title: 'Community Manager',       bio: 'Sam Fitness member since 2013. Leads our 5,000-member community, events, challenges and ambassador programme.', img: 'https://i.pravatar.cc/200?img=16' },
]

const values = [
  { emoji: '🎯', title: 'Integrity',  desc: 'We tell the truth about your progress. No inflated promises, only real science-backed results.' },
  { emoji: '🏆', title: 'Excellence', desc: 'Every square foot, every programme, every interaction is held to the highest standard.' },
  { emoji: '🤝', title: 'Community',  desc: 'Transformation is better together. Our members support, challenge and celebrate each other.' },
]

const awards = [
  'India\'s #1 Premium Gym 2024', 'Best Fitness Innovation Award', 'ISO 9001:2015 Certified',
  'NSCA Affiliate Partner', 'Times Health Award', 'Economic Times Best Brand',
]

function StatItem({ value, suffix, label, icon: Icon, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })
  const IconComponent = Icon && Icon.default ? Icon.default : Icon
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay }} className="text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        {IconComponent && <IconComponent className="text-primary-600 text-2xl" />}
        <span className="font-display font-black text-4xl text-slate-900">
          {inView ? <CountUpComponent end={value} duration={2} separator="," /> : 0}{suffix}
        </span>
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
    </motion.div>
  )
}

export default function About() {
  const [openYear, setOpenYear] = useState(null)

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80"
            alt="Sam Fitness story" className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80' }} />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 container-custom pt-24 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="badge border-white/30 bg-white/15 text-white mb-6 inline-flex">Since 2012</span>
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6 max-w-3xl">
              Our Story.<br />Our Mission.<br /><span className="text-accent">Your Transformation.</span>
            </h1>
            <p className="text-white/75 text-xl max-w-lg leading-relaxed">
              Built by athletes, for everyone. 12 years of turning ordinary people into extraordinary versions of themselves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="section-label block mb-3">Our Origin</span>
              <h2 className="font-display font-black text-4xl lg:text-5xl text-slate-900 mb-6 leading-tight">
                From a 2-room studio<br />to <span className="text-gradient">3 world-class locations.</span>
              </h2>
              <div className="space-y-4 text-slate-500 leading-relaxed">
                <p>Sam Fitness was founded in 2012 by Vikram Anand — a national powerlifting champion frustrated by the gap between what premium fitness looked like abroad and what was available in India. He wanted to create something different: a gym where science met luxury, where every member got the kind of coaching previously reserved for professional athletes.</p>
                <p>Starting with 12 trainers and 200 founding members in a 8,000 sq ft Bandra West studio, the vision was clear — evidence-based programmes, world-class equipment, and a community that genuinely cares about your outcomes.</p>
                <p>Today, Sam Fitness serves 5,000+ active members across Mumbai, Pune and Bengaluru. Every decision we make is guided by one question: <strong className="text-slate-900">"Does this make our members better?"</strong></p>
              </div>
              <div className="flex gap-4 mt-8">
                <Link to="/membership" className="btn-primary">Join Sam Fitness <RiArrowRightLine /></Link>
                <Link to="/contact" className="btn-secondary">Talk to Us</Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="relative rounded-3xl overflow-hidden shadow-card-lg aspect-[4/3]">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
                  alt="Sam Fitness facility" className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80' }} />
                <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="text-center"><p className="font-black text-2xl text-slate-900">5K+</p><p className="text-slate-500 text-xs">Members</p></div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="text-center"><p className="font-black text-2xl text-slate-900">3</p><p className="text-slate-500 text-xs">Cities</p></div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div className="text-center"><p className="font-black text-2xl text-slate-900">60+</p><p className="text-slate-500 text-xs">Trainers</p></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-py bg-slate-50">
        <div className="container-custom">
          <SectionHeader label="What drives us" title={<>Mission & <span className="text-gradient">Vision</span></>} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Mission', title: 'Democratise Elite Fitness', icon: '🎯',
                desc: 'Make the kind of science-backed, results-driven coaching previously available only to professional athletes accessible to every ambitious Indian.' },
              { label: 'Vision', title: 'South Asia\'s Most Trusted Wellness Brand', icon: '🌟',
                desc: 'Build a fitness ecosystem where every member has the tools, support and community to achieve their peak physical and mental health — for life.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="glass rounded-3xl p-8 border border-primary-100">
                <div className="text-5xl mb-5">{item.icon}</div>
                <span className="section-label block mb-2">{item.label}</span>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <StatItem value={3}    suffix=""   label="Locations"  icon={RiGlobalLine}     delay={0}    />
            <StatItem value={5000} suffix="+"  label="Members"    icon={RiTeamLine}       delay={0.1}  />
            <StatItem value={60}   suffix="+"  label="Trainers"   icon={RiAwardLine}      delay={0.2}  />
            <StatItem value={12}   suffix=" Yrs" label="Excellence" icon={RiTrophyLine}   delay={0.3}  />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-py bg-slate-50">
        <div className="container-custom">
          <SectionHeader label="Our Journey" title={<>12 years of <span className="text-gradient">milestones.</span></>} />
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />
              <div className="space-y-4">
                {timeline.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <button onClick={() => setOpenYear(openYear === i ? null : i)}
                      className="w-full flex items-start gap-6 text-left group">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 relative font-display font-black text-sm transition-all
                        ${openYear === i ? 'bg-primary-600 text-white shadow-btn' : 'bg-white text-primary-600 border-2 border-primary-200 group-hover:border-primary-400'}`}>
                        {item.year}
                      </div>
                      <div className={`flex-1 card p-6 transition-all ${openYear === i ? 'shadow-card-md' : ''}`}>
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-lg text-slate-900">{item.title}</h3>
                          <span className={`text-lg transition-transform ${openYear === i ? 'rotate-180' : ''}`}>⌄</span>
                        </div>
                        <AnimatePresence>
                          {openYear === i && (
                            <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                              className="text-slate-500 text-sm leading-relaxed mt-3 overflow-hidden">
                              {item.desc}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader label="What we stand for" title={<>Our <span className="text-gradient">core values.</span></>} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-hover p-10 text-center group">
                <div className="text-6xl mb-6">{v.emoji}</div>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-4">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-py bg-slate-50">
        <div className="container-custom">
          <SectionHeader label="Leadership" title={<>The team behind <span className="text-gradient">Sam Fitness.</span></>}
            subtitle="Industry veterans united by a single goal: delivering India's best fitness experience." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-hover p-6 flex gap-4">
                <img src={member.img} alt={member.name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-slate-900 mb-0.5">{member.name}</h3>
                  <p className="text-primary-600 text-sm font-semibold mb-2">{member.title}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container-custom">
          <p className="text-center section-label mb-8">Awards & Recognition</p>
          <div className="flex flex-wrap justify-center gap-3">
            {awards.map((award, i) => (
              <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="px-5 py-2.5 rounded-full border border-primary-200 bg-primary-50 text-primary-700 text-sm font-semibold flex items-center gap-2">
                <RiStarFill className="text-amber-400 text-xs" /> {award}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600&q=80"
            alt="Join Sam Fitness" className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 to-primary-700/85" />
        </div>
        <div className="relative z-10 container-custom py-24 text-center">
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="font-display font-black text-4xl sm:text-5xl text-white mb-6">
            Ready to become part<br />of the <span className="text-accent">Sam Fitness story?</span>
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/membership" className="btn-primary-lg">Start Free Trial <RiArrowRightLine /></Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-bold hover:bg-white/10 transition-all">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
