import { motion } from 'framer-motion'

export function GlassCard({ children, className = '', hoverEffect = true, style = {} }) {
  return (
    <motion.div
      className={`glass-card rounded-2xl ${hoverEffect ? 'card-hover' : ''} ${className}`}
      style={style}
      whileHover={hoverEffect ? { y: -6 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

export function NeonCard({ children, color = '#00d4ff', className = '' }) {
  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}10, rgba(0,0,0,0.5))`,
        border: `1px solid ${color}30`,
        boxShadow: `0 0 0 1px transparent`,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 30px ${color}20`
        e.currentTarget.style.borderColor = `${color}60`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 1px transparent'
        e.currentTarget.style.borderColor = `${color}30`
      }}
    >
      {children}
    </div>
  )
}

export function FeatureCard({ icon, title, description, color = '#00d4ff', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-card card-hover rounded-2xl p-6 group"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
      >
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      <div
        className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
    </motion.div>
  )
}

export function HeroSection({ badge, title, titleHighlight, subtitle, cta1, cta2, to1, to2 }) {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.06) 0%, transparent 60%)'
        }} />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>
      
      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="badge mb-6 mx-auto w-fit"
        >
          {badge}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-black text-5xl lg:text-7xl text-white mb-6 leading-tight"
        >
          {title} {titleHighlight && <span className="text-gradient">{titleHighlight}</span>}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto mb-8"
          >
            {subtitle}
          </motion.p>
        )}
        {(cta1 || cta2) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {cta1 && <a href={to1 || '#'} className="btn-primary text-white">{cta1}</a>}
            {cta2 && <a href={to2 || '#'} className="btn-outline">{cta2}</a>}
          </motion.div>
        )}
      </div>
    </section>
  )
}
