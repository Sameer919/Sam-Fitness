import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Link } from 'react-router-dom';
import {
  RiFireLine,
  RiStarFill,
  RiTrophyLine,
  RiArrowRightLine,
  RiMedalLine,
  RiHeartPulseLine,
  RiBarChartBoxLine,
  RiUserSmileLine,
  RiTimeLine,
  RiFlashlightLine,
} from "react-icons/ri";

/* ─────────────────────────── ANIMATED COUNTER ─────────────────────────── */
function AnimatedCounter({ target, suffix = "", prefix = "", duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      onUpdate: (v) => setValue(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─────────────────────────── BEFORE/AFTER SLIDER ──────────────────────── */
function BeforeAfterSlider({ member }) {
  const containerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseMove = useCallback(
    (e) => handleMove(e.clientX),
    [handleMove]
  );
  const onTouchMove = useCallback(
    (e) => handleMove(e.touches[0].clientX),
    [handleMove]
  );
  const stopDrag = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchend", stopDrag);
    window.addEventListener("touchmove", onTouchMove);
    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchend", stopDrag);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [onMouseMove, onTouchMove, stopDrag]);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-card-md transition-all duration-300">
      {/* Slider visual */}
      <div
        ref={containerRef}
        className="relative h-72 cursor-col-resize select-none overflow-hidden"
        onMouseDown={() => (dragging.current = true)}
        onTouchStart={() => (dragging.current = true)}
      >
        {/* BEFORE */}
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-black text-slate-400 mb-2 tracking-widest uppercase">
              Before
            </div>
            <img
              src={member.beforeImg}
              alt="before"
              className="w-36 h-36 rounded-full mx-auto object-cover opacity-80 border-2 border-slate-200"
              style={{ filter: "grayscale(20%)" }}
            />
          </div>
        </div>

        {/* AFTER (clip) */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden bg-slate-50"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div className="text-center relative z-10">
            <div className="text-sm font-black text-primary-600 mb-2 tracking-widest uppercase">
              After
            </div>
            <img
              src={member.afterImg}
              alt="after"
              className="w-36 h-36 rounded-full mx-auto object-cover border-2 border-primary-500 shadow-md"
            />
          </div>
        </div>

        {/* Divider handle */}
        <div
          className="absolute top-0 bottom-0 w-1 z-20"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-0.5 h-full bg-primary-500" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-md bg-white border-primary-500"
          >
            <span className="text-xs font-bold text-primary-600">
              ◀▶
            </span>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-800 text-white shadow-sm">
            BEFORE
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-primary-600 text-white shadow-sm">
            AFTER
          </span>
        </div>
      </div>

      {/* Member Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-black text-slate-800 text-lg">{member.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <RiTimeLine />
              {member.duration}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600">
            {member.badge}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {member.stats.map((s, i) => (
            <div
              key={i}
              className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="font-display font-black text-primary-600 text-lg">
                {s.value}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── DATA ────────────────────────────────────── */
const transformations = [
  {
    name: "Marcus Reid",
    duration: "6 Months",
    badge: "Fat Loss Champion",
    beforeImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    afterImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80",
    stats: [
      { value: "−24kg", label: "Weight" },
      { value: "−9%", label: "Body Fat" },
      { value: "+18%", label: "Muscle" },
    ],
  },
  {
    name: "Priya Sharma",
    duration: "4 Months",
    badge: "Lean Rebuild",
    beforeImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    afterImg: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
    stats: [
      { value: "−16kg", label: "Weight" },
      { value: "−7%", label: "Body Fat" },
      { value: "+12%", label: "Muscle" },
    ],
  },
  {
    name: "Dev Malhotra",
    duration: "8 Months",
    badge: "Bulk & Cut Pro",
    beforeImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    afterImg: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&q=80",
    stats: [
      { value: "+11kg", label: "Muscle" },
      { value: "−5%", label: "Body Fat" },
      { value: "×2.1", label: "Strength" },
    ],
  },
  {
    name: "Sofia Mendes",
    duration: "5 Months",
    badge: "Total Body Recomp",
    beforeImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
    afterImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
    stats: [
      { value: "−19kg", label: "Weight" },
      { value: "−8%", label: "Body Fat" },
      { value: "+15%", label: "Endurance" },
    ],
  },
];

const testimonials = [
  {
    name: "James Thornton",
    img: "https://i.pravatar.cc/80?img=15",
    rating: 5,
    duration: "3 months",
    result: "Lost 18kg",
    quote:
      "Sam Fitness completely changed my relationship with fitness. The coaches pushed me beyond what I thought possible. I went from barely being able to jog 1km to running 10k in under 55 minutes.",
  },
  {
    name: "Ananya Patel",
    img: "https://i.pravatar.cc/80?img=47",
    rating: 5,
    duration: "6 months",
    result: "−22kg, −11% BF",
    quote:
      "I had tried every diet and gym out there. Sam Fitness was different — the personalized programming and nutrition guidance made the process feel sustainable and even enjoyable.",
  },
  {
    name: "Tyler Brooks",
    img: "https://i.pravatar.cc/80?img=33",
    rating: 5,
    duration: "4 months",
    result: "+9kg Muscle",
    quote:
      "Went from a skinny 68kg to a solid 77kg with much better definition. The hypertrophy program and meal plans here are elite-level. My friends couldn't believe the transformation.",
  },
  {
    name: "Mei-Lin Chang",
    img: "https://i.pravatar.cc/80?img=56",
    rating: 5,
    duration: "8 months",
    result: "Complete recomp",
    quote:
      "I never believed I could look and feel like this at 38. The community here keeps you accountable, and the trainers genuinely care. Best investment I've ever made.",
  },
  {
    name: "Rahul Verma",
    img: "https://i.pravatar.cc/80?img=19",
    rating: 5,
    duration: "5 months",
    result: "Lost 28kg",
    quote:
      "Dropped 28kg and reversed my pre-diabetic markers. My doctor was stunned. The structured approach at Sam Fitness turned what felt impossible into just another milestone.",
  },
  {
    name: "Elena Russo",
    img: "https://i.pravatar.cc/80?img=63",
    rating: 5,
    duration: "3 months",
    result: "+7kg Lean Mass",
    quote:
      "Coming from a yoga background I wanted to build real strength without losing flexibility. This gym gave me exactly that — stronger, leaner, and still mobile.",
  },
];

const metrics = [
  { icon: RiUserSmileLine, value: 5000, suffix: "+", label: "Transformations Completed", color: "#06B6D4" },
  { icon: RiHeartPulseLine, value: 12, suffix: "kg", prefix: "avg ", label: "Average Weight Lost", color: "#0284C7" },
  { icon: RiBarChartBoxLine, value: 94, suffix: "%", label: "Member Success Rate", color: "#4F46E5" },
  { icon: RiMedalLine, value: 3, suffix: "x", label: "Award-Winning Programs", color: "#0284C7" },
];

/* ───────────────────────────── PAGE ────────────────────────────────────── */
export default function Transformation() {
  return (
    <div className="bg-white text-slate-800 min-h-screen overflow-x-hidden">
      
      {/* ── HERO ── */}
      <section className="relative pt-28 pb-16 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(2,132,199,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge border-primary-200 bg-primary-50 text-primary-700 inline-flex items-center gap-2 mb-6 px-5 py-2 text-sm font-semibold">
              <RiFireLine className="text-primary-600 animate-pulse" />
              Transformation Stories
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-slate-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Real Results.<br />
            <span className="text-gradient">Real People.</span>
          </motion.h1>

          <motion.p
            className="text-slate-500 max-w-2xl mx-auto text-lg mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Over 5,000 members have transformed their lives at Sam Fitness. These aren't filters or photoshops — they're the result of dedication, expert coaching, and an evidence-based programming model.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/contact" className="btn-primary text-white flex items-center gap-2 px-8 py-3 rounded-full font-bold text-base">
              Start Your Journey <RiArrowRightLine />
            </Link>
            <a href="#sliders" className="btn-secondary flex items-center gap-2 px-8 py-3 rounded-full font-bold text-base border-slate-200 hover:bg-slate-50 text-slate-700">
              View Comparisons
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((m, i) => {
              const IconComponent = m.icon.default || m.icon
              return (
                <motion.div
                  key={i}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-card-md transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <IconComponent
                    className="mx-auto mb-3 text-3xl"
                    style={{ color: m.color }}
                  />
                <div
                  className="text-3xl font-display font-black mb-1"
                  style={{ color: m.color }}
                >
                  <AnimatedCounter
                    target={m.value}
                    suffix={m.suffix}
                    prefix={m.prefix || ""}
                  />
                </div>
                <p className="text-slate-500 text-xs font-semibold">{m.label}</p>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* ── BEFORE/AFTER SLIDERS ── */}
      <section id="sliders" className="py-20 bg-slate-50">
        <div className="container-custom">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge border-primary-200 bg-primary-50 text-primary-700 inline-flex items-center gap-2 mb-4 px-5 py-2 text-sm font-semibold">
              <RiFlashlightLine className="text-primary-600" /> Swipe to Compare
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4">
              Member <span className="text-gradient">Transformations</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Slide the divider horizontally to reveal the incredible results our members achieved through structured progressive plans.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {transformations.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <BeforeAfterSlider member={t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE JOURNEY / PROCESS ── */}
      <section className="py-20 bg-white border-t border-b border-slate-100">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge border-primary-200 bg-primary-50 text-primary-700 inline-flex items-center gap-2 mb-4 px-5 py-2 text-sm font-semibold">
              <RiTrophyLine className="text-primary-600" /> The Method
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4">
              The Sam Fitness <span className="text-gradient">Transformation Journey</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Our systematic, evidence-based approach that guarantees measurable progress for every single member.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              { num: "01", step: "Biometric Assessment", desc: "We track body composition, posture, and movement patterns." },
              { num: "02", step: "Goal Mapping", desc: "Design clean training blocks matching your current metabolic threshold." },
              { num: "03", step: "Custom Training", desc: "Execute progressive resistance plans managed by certified coaches." },
              { num: "04", step: "Nutrition Science", desc: "Enjoy dietitian-designed macronutrient schedules that fuel fat loss." },
              { num: "05", step: "Victory & Reset", desc: "Conduct biometric audits, celebrate milestones, and scale goals." }
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col relative"
              >
                <span className="font-display font-black text-3xl text-primary-200 mb-3">{p.num}</span>
                <h3 className="font-bold text-slate-800 text-base mb-2">{p.step}</h3>
                <p className="text-slate-500 text-xs leading-relaxed flex-1">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge border-primary-200 bg-primary-50 text-primary-700 inline-flex items-center gap-2 mb-4 px-5 py-2 text-sm font-semibold">
              <RiStarFill className="text-amber-400" /> Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 mb-4">
              Hear From Our <span className="text-gradient">Champions</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Read real feedback written by members who converted their dedication into life-long wellness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-card-md transition-all duration-300 flex flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <RiStarFill key={s} style={{ color: "#ffd700" }} />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-600 text-sm leading-relaxed flex-1">
                  "{t.quote}"
                </p>

                {/* Member */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-slate-800 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.duration}</div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600">
                    {t.result}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-primary-700 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-4xl mb-4 block">🔥</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4">
              Start Your Transformation
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Ready to write your own success story? Join today and work with our certified fitness experts, nutrition specialists, and AI coaching systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-outline text-base px-8 py-4 inline-flex items-center gap-2 text-white border-white hover:bg-white/10">
                Book a Free Consultation <RiArrowRightLine />
              </Link>
              <Link to="/membership" className="bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors inline-flex items-center gap-2 justify-center">
                Explore Memberships <RiArrowRightLine />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
