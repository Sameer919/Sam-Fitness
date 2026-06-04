import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import {
  RiPlayCircleLine, RiCloseLine, RiCheckLine, RiArrowRightLine,
  RiMapPinLine
} from 'react-icons/ri'
import SectionHeader from '../components/ui/SectionHeader'

const CountUpComponent = CountUp.default || CountUp

const galleryItems = [
  {
    id: 1,
    category: 'Strength',
    name: 'Strength Arena',
    desc: 'Equipped with custom premium selectorized machines, plate-loaded stations, and extensive free weight zones.',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    equipment: '200+ Machines'
  },
  {
    id: 2,
    category: 'Cardio',
    name: 'Cardio Zone',
    desc: 'High-end treadmills, woodways, ellipticals, and climbers featuring personal media consoles and active ventilation.',
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    equipment: '80+ Stations'
  },
  {
    id: 3,
    category: 'Group Studios',
    name: 'Mind-Body Yoga Sanctuary',
    desc: 'Climate-controlled sanctuary with ambient acoustics and custom lighting for yoga and Pilates.',
    img: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    equipment: 'Mats & Props'
  },
  {
    id: 4,
    category: 'Aquatics',
    name: 'Olympic Lap Pool',
    desc: 'Temperature-regulated, multi-lane lap pool with advanced UV filtration for the cleanest swim.',
    img: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
    equipment: '25m Pool'
  },
  {
    id: 5,
    category: 'Strength',
    name: 'CrossFit & Functional Box',
    desc: 'Olympic lifting platforms, rogue rigs, kettlebells, and sled tracks for elite functional workouts.',
    img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    equipment: 'Elite Rigs'
  },
  {
    id: 6,
    category: 'Recovery',
    name: 'Cryotherapy & Recovery Suite',
    desc: 'Premium post-workout recovery chambers, compression gear, and expert physiotherapist-led care.',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    equipment: 'Spa & Cryo'
  },
  {
    id: 7,
    category: 'Strength',
    name: 'Athletic Conditioning Turf',
    desc: 'Indoor speed track and agility turf designed for high-performance athletic preparation.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    equipment: 'Turf & Sleds'
  },
  {
    id: 8,
    category: 'Group Studios',
    name: 'Championship Boxing Arena',
    desc: 'Full-size training ring, heavy bags, tear-drop bags, and speed bags for authentic fighting prep.',
    img: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1545816250-e12bedba42ba?auto=format&fit=crop&w=800&q=80',
    equipment: '15 Bags'
  },
  {
    id: 9,
    category: 'Group Studios',
    name: 'Dynamic Spin Studio',
    desc: 'Immersive lighting, concert-quality surround sound, and top-tier stage cycling rigs.',
    img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    equipment: '45 Bikes'
  },
  {
    id: 10,
    category: 'Recovery',
    name: 'Infrared Saunas',
    desc: 'Full-spectrum infrared heat saunas designed to promote deep cellular detox and speed muscle repair.',
    img: 'https://images.unsplash.com/photo-1554149378-7a58a8df5b38?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    equipment: '3 Rooms'
  },
  {
    id: 11,
    category: 'Locker Rooms',
    name: 'Executive Lounge & Nutrition Bar',
    desc: 'Relax post-session with cold-pressed juices, protein shakes, and gourmet healthy meals.',
    img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    equipment: 'Fresh Cafe'
  },
  {
    id: 12,
    category: 'Locker Rooms',
    name: 'Luxury Locker Chambers',
    desc: 'Spacious personal storage lockers, rain showers, premium toiletries, and clean towel service.',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
    equipment: '200+ Lockers'
  }
]

const categories = ['All', 'Strength', 'Cardio', 'Group Studios', 'Aquatics', 'Recovery', 'Locker Rooms']

const brands = [
  { name: 'Life Fitness', desc: 'Premium strength rigs' },
  { name: 'Technogym', desc: 'Connected digital cardio' },
  { name: 'Precor', desc: 'Ergonomic fitness systems' },
  { name: 'Rogue Fitness', desc: 'Championship lifting bars' },
  { name: 'Assault Fitness', desc: 'High-intensity conditioning' },
  { name: 'Concept2', desc: 'Gold standard rowing rigs' }
]

function StatCard({ value, suffix, label, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm"
    >
      <span className="font-display font-black text-4xl text-primary-600 block mb-2">
        {inView ? <CountUpComponent end={value} duration={2} separator="," /> : 0}{suffix}
      </span>
      <span className="text-slate-500 text-sm font-semibold">{label}</span>
    </motion.div>
  )
}

export default function Facilities() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeItem, setActiveItem] = useState(null)
  const [showVideo, setShowVideo] = useState(false)

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory)

  return (
    <div className="bg-white text-slate-800">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"
            alt="State-of-the-art Gym Facilities"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 container-custom pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="badge border-white/30 bg-white/10 text-white mb-6 inline-flex">World-Class Equipment</span>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl text-white leading-tight mb-6 max-w-4xl mx-auto">
              State-of-the-Art <span className="text-gradient-sky bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-sky-300">Facilities</span> Built for Champions
            </h1>
            <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Explore our luxury fitness footprint. 50,000 square feet of clean space, premium European equipment, and custom recovery lounges.
            </p>
            <div className="flex justify-center gap-4">
              <a href="#explore" className="btn-primary">Explore Spaces</a>
              <button onClick={() => setShowVideo(true)} className="btn-secondary flex items-center gap-2 border-white text-white hover:bg-white/10">
                <RiPlayCircleLine className="text-xl" /> Watch 3D Tour
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Category Filter & Grid Showcase */}
      <section id="explore" className="section-py bg-white">
        <div className="container-custom">
          <SectionHeader
            label="Sam Fitness Footprint"
            title={<>Explore Our <span className="text-gradient">Premium Spaces</span></>}
            subtitle="Select a category to inspect the elite gear and environments designed to maximize your efficiency."
          />

          {/* Filter tabs */}
          <div className="flex justify-start md:justify-center overflow-x-auto pb-4 mb-10 gap-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Layout (Masonry-like) */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setActiveItem(item)}
                  className="group cursor-pointer bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover:shadow-card-md transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-black px-3 py-1 rounded-full shadow-sm">
                      {item.category}
                    </span>
                    <span className="absolute bottom-4 right-4 bg-primary-600/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {item.equipment}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-black text-lg text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 3. Featured Facilities Highlight (Split Alternating) */}
      <section className="section-py bg-slate-50">
        <div className="container-custom">
          <SectionHeader
            label="Signature Offerings"
            title={<>The Sam Fitness <span className="text-gradient">Experience Elements</span></>}
            subtitle="Take a deeper look at the core sections that set our luxury club layout apart from standard facilities."
          />

          <div className="space-y-20">
            {/* Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-1"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-card-lg aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
                    alt="Strength Arena"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-2"
              >
                <span className="section-label mb-2 block">Heavy Loading & Precision</span>
                <h3 className="font-display font-black text-3xl text-slate-900 mb-6">
                  Strength Arena
                </h3>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  Engineered with customized biomechanics. Our strength zone spans over 18,000 sq ft, houses 200+ individual weight stacks, Olympic competition bars, and dedicated coaching platforms. It is optimized to prevent traffic so you never wait for a set.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Custom premium plate-loaded stations', 'Dumbbells up to 70kg in matching sets of four', 'Olympic power racks with safety spots', 'Specially designed rubber flooring to reduce impact'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <RiCheckLine className="text-primary-600 text-lg flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/classes" className="btn-primary">View Strength Classes</Link>
              </motion.div>
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-2"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-card-lg aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80"
                    alt="Group Studios"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <span className="section-label mb-2 block">Energy & Synergy</span>
                <h3 className="font-display font-black text-3xl text-slate-900 mb-6">
                  Immersive Group Studios
                </h3>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  We host 6 separate boutique studios catering to Yoga, Pilates, High-Intensity HIIT, Cycling, Boxing, and Dance. Each studio features custom environmental ventilation, acoustics, and color-tuned dynamic lighting systems that synchronize to the beat of the workout.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Concert-grade subwoofers & surround sound', 'Premium oak wood floors with rubber underlayment', 'Fully equipped cycling docks with live output trackers', 'Air purification systems cycling fresh air every 4 minutes'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <RiCheckLine className="text-primary-600 text-lg flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/classes" className="btn-primary">Browse Class Schedule</Link>
              </motion.div>
            </div>

            {/* Feature 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-1"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-card-lg aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
                    alt="Recovery Suite"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-2"
              >
                <span className="section-label mb-2 block">Detox & Restoration</span>
                <h3 className="font-display font-black text-3xl text-slate-900 mb-6">
                  Sam Recovery Suites
                </h3>
                <p className="text-slate-500 mb-6 leading-relaxed">
                  True fitness isn't just about output; it is about repair. Our recovery wing provides science-backed modalities, including infrared saunas, cryotherapy chambers, hot/cold plunge pools, and private massage rooms to speed muscle recovery and alleviate inflammation.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Multi-person custom dry saunas', 'Advanced cold compression therapy wraps', 'Hydrotherapy plunges kept at stable 8°C and 40°C', 'Certified on-site physiotherapists'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <RiCheckLine className="text-primary-600 text-lg flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-primary">Book Consultation</Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Equipment Brands Showcase */}
      <section className="py-16 bg-white overflow-hidden border-t border-b border-slate-100">
        <div className="container-custom">
          <p className="text-center section-label mb-8">Our Equipment Alliance</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center flex flex-col justify-center"
              >
                <h4 className="font-display font-black text-slate-800 text-lg">{brand.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{brand.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Stats Strip */}
      <section className="section-py bg-slate-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <StatCard value={50000} suffix=" sq ft" label="Clean Work Space" delay={0} />
            <StatCard value={500} suffix="+" label="Premium Machines" delay={0.1} />
            <StatCard value={6} suffix="" label="Country Branches" delay={0.2} />
            <StatCard value={24} suffix="/7" label="Member Access" delay={0.3} />
          </div>
        </div>
      </section>

      {/* 6. Virtual 360° Tour Showcase */}
      <section className="section-py bg-white">
        <div className="container-custom max-w-5xl">
          <div className="relative rounded-3xl overflow-hidden aspect-video shadow-card-lg bg-slate-900 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600&q=80"
              alt="Gym tour preview"
              className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
            />
            <div className="relative z-10 text-center p-8 max-w-xl">
              <span className="badge bg-primary-600 text-white mb-4">Interactive Experience</span>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
                Virtual 360° Walkthrough
              </h3>
              <p className="text-white/70 mb-8 text-sm sm:text-base leading-relaxed">
                Step inside our flagship Bandra location from anywhere. Inspect every rack, studio, and recovery bed in high definition.
              </p>
              <button
                onClick={() => setShowVideo(true)}
                className="w-16 h-16 rounded-full bg-white text-primary-600 flex items-center justify-center mx-auto shadow-btn hover:scale-105 transition-all duration-200 group"
              >
                <RiPlayCircleLine className="text-4xl group-hover:text-primary-700 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/10 text-slate-800 flex items-center justify-center hover:bg-slate-900/20 transition-all z-10"
              >
                <RiCloseLine className="text-xl" />
              </button>
              <div className="relative aspect-[16/10] bg-slate-200">
                <img
                  src={activeItem.img}
                  alt={activeItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-bold">
                    {activeItem.category}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    Active Setup: <strong className="text-slate-800">{activeItem.equipment}</strong>
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl text-slate-900 mb-3">
                  {activeItem.name}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  {activeItem.desc}
                </p>
                <div className="flex gap-4">
                  <Link
                    to="/contact"
                    onClick={() => setActiveItem(null)}
                    className="btn-primary flex-1 text-center justify-center"
                  >
                    Request a Private Tour <RiArrowRightLine />
                  </Link>
                  <button
                    onClick={() => setActiveItem(null)}
                    className="btn-secondary px-6 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. Virtual Tour Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative aspect-video"
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all z-10"
              >
                <RiCloseLine className="text-xl" />
              </button>
              {/* Using a placeholder high-end stock video or styled screen */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-950">
                <RiMapPinLine className="text-6xl text-primary-400 mb-4 animate-bounce" />
                <h3 className="font-display font-black text-2xl text-white mb-2">Sam Fitness 3D Virtual Tour</h3>
                <p className="text-white/60 text-sm max-w-md mb-6">
                  Interactive walk-through is loading. You can click on hotspots inside the viewport to view equipment metrics, class bookings, and facility rules.
                </p>
                <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-primary-500 animate-spin" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
