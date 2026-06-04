import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import {
  RiUserStarLine,
  RiAwardLine,
  RiInstagramLine,
  RiTwitterLine,
  RiLinkedinBoxLine,
  RiArrowRightLine,
  RiCalendarCheckLine,
  RiShieldStarLine,
  RiFireLine,
  RiHeartPulseLine,
  RiMedalLine,
} from "react-icons/ri";

const trainers = [
  {
    id: 1,
    name: "Aryan Kapoor",
    specialty: "Strength",
    role: "Strength & Conditioning Coach",
    experience: "8 Years",
    certification: "NSCA-CSCS",
    img: "https://i.pravatar.cc/300?img=51",
    color: "#f59e0b",
    shadow: "rgba(245,158,11,0.15)",
    bio: "Aryan is a nationally certified strength coach who has trained over 200 athletes from amateur to professional levels. His methodology combines periodization science with practical real-world programming.",
    specializations: ["Olympic Lifting", "Hypertrophy", "Powerlifting", "Athletic Performance"],
    certifications: ["NSCA-CSCS", "NSCA-CPT", "FMS Level 2", "Precision Nutrition L1"],
    sessions: 340,
    rating: 4.9,
    availability: ["Mon", "Wed", "Fri", "Sat"],
  },
  {
    id: 2,
    name: "Maya Reddy",
    specialty: "Yoga",
    role: "Yoga & Mobility Specialist",
    experience: "10 Years",
    certification: "RYT-500",
    img: "https://i.pravatar.cc/300?img=44",
    color: "#8b5cf6",
    shadow: "rgba(139,92,246,0.15)",
    bio: "Maya studied under master teachers in Mysore, India and has spent a decade helping clients unlock their body's full potential. She blends Ashtanga discipline with restorative Yin practices.",
    specializations: ["Ashtanga", "Yin Yoga", "Pranayama", "Mindfulness Meditation"],
    certifications: ["RYT-500", "Yin Yoga Certified", "Myofascial Release", "Meditation Guide"],
    sessions: 520,
    rating: 5.0,
    availability: ["Mon", "Tue", "Thu", "Sat", "Sun"],
  },
  {
    id: 3,
    name: "Dev Malhotra",
    specialty: "CrossFit",
    role: "CrossFit & HIIT Specialist",
    experience: "6 Years",
    certification: "CrossFit L3",
    img: "https://i.pravatar.cc/300?img=54",
    color: "#ec4899",
    shadow: "rgba(236,72,153,0.15)",
    bio: "Dev is one of the youngest CrossFit L3 coaches in Asia. He competed at the CrossFit Regionals and brings elite-level programming to every athlete — whether they're picking up a barbell for the first time or chasing a Games qualification.",
    specializations: ["WOD Programming", "Gymnastics", "Olympic Lifting", "Competition Prep"],
    certifications: ["CrossFit Level 3", "USAW Sports Performance", "CSCS", "CPR/AED"],
    sessions: 280,
    rating: 4.8,
    availability: ["Mon", "Tue", "Thu", "Fri"],
  },
  {
    id: 4,
    name: "Zara Khan",
    specialty: "Boxing",
    role: "Boxing & Muay Thai Coach",
    experience: "7 Years",
    certification: "Thai Boxing L2",
    img: "https://i.pravatar.cc/300?img=45",
    color: "#ef4444",
    shadow: "rgba(239,68,68,0.15)",
    bio: "A former national-level boxer and Muay Thai competitor, Zara brings authentic combat sports experience to every session. She specializes in making martial arts accessible while building real fighting skill.",
    specializations: ["Technical Boxing", "Muay Thai", "Pad Work", "Conditioning"],
    certifications: ["Thai Boxing L2", "WAKO Coaching", "First Aid Sports", "WBC Instructor"],
    sessions: 310,
    rating: 4.9,
    availability: ["Tue", "Thu", "Fri", "Sat"],
  },
  {
    id: 5,
    name: "Rahul Nair",
    specialty: "Nutrition",
    role: "Sports Nutritionist",
    experience: "9 Years",
    certification: "ISSN-SNS",
    img: "https://i.pravatar.cc/300?img=57",
    color: "#10b981",
    shadow: "rgba(16,185,129,0.15)",
    bio: "Rahul holds advanced certifications in sports nutrition and has helped over 400 athletes optimize their fueling strategies. He believes food is the most powerful performance-enhancing tool available.",
    specializations: ["Body Recomposition", "Competition Cutting", "Metabolic Testing", "Supplement Science"],
    certifications: ["ISSN-SNS", "Precision Nutrition L2", "USAW Sports Nutrition", "ACE Fitness Nutrition"],
    sessions: 420,
    rating: 4.9,
    availability: ["Mon", "Wed", "Thu", "Sat"],
  },
  {
    id: 6,
    name: "Priya Sharma",
    specialty: "Yoga",
    role: "Dance & Zumba Instructor",
    experience: "5 Years",
    certification: "Zumba Certified",
    img: "https://i.pravatar.cc/300?img=43",
    color: "#00d4ff",
    shadow: "rgba(0,212,255,0.15)",
    bio: "Priya's infectious energy and love for movement has built one of the most popular class followings at Sam Fitness. Trained in classical Bharatanatyam and Latin dance, she brings cultural depth to every routine.",
    specializations: ["Zumba", "Bharatanatyam", "Salsa", "Dance Fitness"],
    certifications: ["Zumba Instructor", "AFAA Group Fitness", "Dance Masters Guild", "Piloxing Instructor"],
    sessions: 195,
    rating: 4.8,
    availability: ["Mon", "Wed", "Fri", "Sat", "Sun"],
  },
  {
    id: 7,
    name: "Aditya Bose",
    specialty: "Strength",
    role: "Powerlifting Coach",
    experience: "11 Years",
    certification: "IPF Coach",
    img: "https://i.pravatar.cc/300?img=60",
    color: "#f97316",
    shadow: "rgba(249,115,22,0.15)",
    bio: "A decorated national-level powerlifter with multiple IPF championship medals, Aditya has coached athletes to national and international podium finishes. His technical mastery of the squat, bench, and deadlift is unparalleled.",
    specializations: ["Squat", "Bench Press", "Deadlift", "Meet Preparation"],
    certifications: ["IPF Certified Coach", "NSCA-CSCS", "SBD Elite Coach", "Sports Psychology Diploma"],
    sessions: 580,
    rating: 5.0,
    availability: ["Mon", "Wed", "Fri"],
  },
  {
    id: 8,
    name: "Nisha Gupta",
    specialty: "Yoga",
    role: "Pilates & Mobility Coach",
    experience: "8 Years",
    certification: "STOTT Pilates",
    img: "https://i.pravatar.cc/300?img=46",
    color: "#a78bfa",
    shadow: "rgba(167,139,250,0.15)",
    bio: "Nisha integrates STOTT Pilates methodology with advanced mobility science. She works extensively with post-rehabilitation clients, helping them rebuild strength safely. Her sessions are transformative for posture, core stability, and overall quality of movement.",
    specializations: ["STOTT Pilates", "Corrective Exercise", "Pre/Post Natal", "Spinal Health"],
    certifications: ["STOTT Pilates Full Certification", "FRC Mobility Specialist", "Pre/Post Natal Fitness", "BASI Pilates"],
    sessions: 390,
    rating: 4.9,
    availability: ["Tue", "Thu", "Sat", "Sun"],
  },
];

const specialtyFilters = ["All", "Strength", "Yoga", "CrossFit", "Boxing", "Nutrition"];

function FlipCard({ trainer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        perspective: "1200px",
        height: 420,
        cursor: "pointer",
      }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="bg-white border border-slate-100 shadow-sm"
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {/* Photo */}
          <div style={{ position: "relative", height: 260, overflow: "hidden", backgroundColor: '#e2e8f0' }}>
            <img
              src={trainer.img}
              alt={trainer.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(0deg, rgba(255,255,255,0.95) 0%, transparent 60%)`,
              }}
            />
            {/* Specialty badge */}
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                padding: "4px 14px",
                borderRadius: 999,
                background: `rgba(255,255,255,0.9)`,
                border: `1px solid rgba(0,0,0,0.05)`,
                color: trainer.color,
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                backdropFilter: "blur(8px)",
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              {trainer.specialty}
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: "20px 24px 24px" }}>
            <h3
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 4,
              }}
            >
              {trainer.name}
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                color: trainer.color,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              {trainer.role}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {trainer.experience}
                  </div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Experience
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {trainer.sessions}+
                  </div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Sessions
                  </div>
                </div>
              </div>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 8,
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  color: "#475569",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                ⭐ {trainer.rating}
              </span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="bg-slate-50 border border-slate-100"
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 20,
            overflow: "hidden",
            padding: 28,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: `0 10px 30px ${trainer.shadow}`,
          }}
        >
          {/* Glow effect */}
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${trainer.color}15, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <img
                src={trainer.img}
                alt={trainer.name}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${trainer.color}`,
                }}
              />
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
                  {trainer.name}
                </div>
                <div
                  style={{ fontSize: "0.7rem", color: trainer.color, fontWeight: 600 }}
                >
                  {trainer.certification}
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: "0.78rem",
                color: "#475569",
                lineHeight: 1.65,
                marginBottom: 16,
              }}
            >
              {trainer.bio.length > 180 ? trainer.bio.slice(0, 180) + "..." : trainer.bio}
            </p>

            {/* Specializations */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {trainer.specializations.slice(0, 3).map((spec) => (
                <span
                  key={spec}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: `white`,
                    border: `1px solid #e2e8f0`,
                    color: "#475569",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                  }}
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              {[RiInstagramLine, RiTwitterLine, RiLinkedinBoxLine].map((Icon, i) => {
                const IconComponent = Icon.default || Icon
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.15, color: trainer.color, borderColor: trainer.color }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "white",
                      border: "1px solid #e2e8f0",
                      color: "#64748b",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.95rem",
                    }}
                  >
                    <IconComponent />
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Book button */}
          <Link
            to="/contact"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              background: trainer.color,
              border: "none",
              color: "white",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              letterSpacing: "0.04em",
              position: "relative",
              zIndex: 1,
              textAlign: 'center',
              boxShadow: `0 4px 12px ${trainer.shadow}`
            }}
          >
            Book Session
            <RiArrowRightLine />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Trainers() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? trainers
    : trainers.filter((t) => t.specialty === activeFilter);

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
      
      {/* ── HERO ── */}
      <section className="relative pt-28 pb-16 text-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Background grids */}
        <div
          style={{
            position: "absolute",
            top: "-5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 500,
            background:
              "radial-gradient(ellipse, rgba(2,132,199,0.08) 0%, rgba(6,182,212,0.04) 50%, transparent 70%)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />

        <div className="container-custom" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge border-primary-200 bg-primary-50 text-primary-700 inline-flex items-center gap-2 mb-6 px-5 py-2 text-sm font-semibold">
              <RiUserStarLine className="text-primary-600" />
              Meet The Experts
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-black text-slate-900 leading-tight mb-6"
          >
            World-Class <span className="text-gradient">Elite Coaches</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Our trainers aren't just coaches — they're champions, scientists, and movement artists dedicated to unlocking your absolute best. Hover to discover their story.
          </motion.p>

          {/* Hero stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center gap-12 flex-wrap"
          >
            {[
              { icon: <RiMedalLine />, value: "8", label: "Elite Trainers" },
              { icon: <RiAwardLine />, value: "30+", label: "Certifications" },
              { icon: <RiCalendarCheckLine />, value: "3000+", label: "Sessions Delivered" },
              { icon: <RiShieldStarLine />, value: "4.9★", label: "Avg Rating" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="text-xl text-primary-600">{stat.icon}</span>
                <span className="text-3xl font-display font-black text-slate-900">{stat.value}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2.5 justify-center"
          >
            {specialtyFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                  activeFilter === f
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-100'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRAINER FLIP CARDS ── */}
      <section className="py-16 bg-slate-50">
        <div className="container-custom">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((trainer, i) => (
                <motion.div
                  key={trainer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <FlipCard trainer={trainer} onBook={() => {}} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── WHY OUR TRAINERS ── */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4">
              The <span className="text-gradient">Sam Fitness Standard</span>
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
              Every trainer at Sam Fitness meets our uncompromising standards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <RiShieldStarLine />, title: "Certified Excellence", desc: "All coaches maintain top international accreditations such as NSCA-CSCS, ACE, or STOTT Pilates." },
              { icon: <RiFireLine />, title: "Results Mindset", desc: "Coaches construct periodized progressive training blocks fitted to your current metabolic threshold." },
              { icon: <RiHeartPulseLine />, title: "Biometric Intelligence", desc: "Integrate wearables and biometrics directly into programs for accurate stress and sleep recovery mapping." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center text-2xl mx-auto mb-5">
                  {item.icon}
                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-primary-700 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-4xl mb-4 block">🎯</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4">
              Book a Free Consultation
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Not sure which trainer is the best fit for your fitness goals? Book a complimentary 30-minute consultation with one of our master trainers to design a personalized strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-outline text-base px-8 py-4 inline-flex items-center gap-2 text-white border-white hover:bg-white/10">
                Talk to a Coach <RiArrowRightLine />
              </Link>
              <Link to="/classes" className="bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center gap-2 justify-center">
                Browse Classes <RiArrowRightLine />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
