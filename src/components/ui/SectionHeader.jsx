import { motion } from 'framer-motion'

export default function SectionHeader({ label, title, subtitle, center = true, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${center ? 'text-center' : ''}`}
    >
      {label && (
        <span className={`section-label block mb-3 ${light ? 'text-primary-300' : ''}`}>
          {label}
        </span>
      )}
      <h2 className={`font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 ${
        light ? 'text-white' : 'text-slate-900'
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl leading-relaxed ${center ? 'mx-auto' : ''} ${
          light ? 'text-white/70' : 'text-slate-500'
        }`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
