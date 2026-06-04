import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiInstagramLine, RiYoutubeLine, RiFacebookCircleLine, RiTwitterLine, RiArrowRightLine, RiMapPinLine, RiPhoneLine, RiMailLine, RiLoader4Line, RiCheckLine } from 'react-icons/ri'
import { subscribeNewsletter } from '../../lib/api'

const footerLinks = {
  Company:  [{ label: 'About Us', href: '/about' }, { label: 'Our Story', href: '/about' }, { label: 'Careers', href: '/contact' }, { label: 'Press', href: '/contact' }],
  Programs: [{ label: 'Membership', href: '/membership' }, { label: 'Classes', href: '/classes' }, { label: 'Personal Training', href: '/trainers' }, { label: 'Goal Finder', href: '/goal-finder' }],
  Explore:  [{ label: 'Facilities', href: '/facilities' }, { label: 'Trainers', href: '/trainers' }, { label: 'Transformations', href: '/transformation' }, { label: 'BMI Calculator', href: '/bmi-calculator' }],
}

const socials = [
  { icon: RiInstagramLine, href: '#', label: 'Instagram' },
  { icon: RiYoutubeLine,   href: '#', label: 'YouTube' },
  { icon: RiFacebookCircleLine, href: '#', label: 'Facebook' },
  { icon: RiTwitterLine,   href: '#', label: 'X/Twitter' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [msg, setMsg] = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setMsg('')
    try {
      const res = await subscribeNewsletter({ email, name: '' })
      setMsg(res.message || 'Subscribed successfully!')
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      setMsg(err.message || 'Something went wrong.')
      setStatus('error')
    }
  }
  return (
    <footer className="bg-slate-900 text-white">
      {/* CTA Band */}
      <div className="bg-gradient-sky">
        <div className="container-custom py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-2xl text-white mb-1">Ready to transform your life?</h3>
            <p className="text-white/80 text-sm">Start your 7-day free trial. No credit card required.</p>
          </div>
          <Link to="/membership" className="btn-outline whitespace-nowrap flex-shrink-0">
            Get Started Free <RiArrowRightLine />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-sky flex items-center justify-center">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="font-display font-extrabold text-xl text-white">
                Sam <span className="text-primary-400">Fitness</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Where elite performance meets modern wellness. India's most premium fitness destination since 2018.
            </p>

            {/* Contact */}
            <div className="space-y-3 mb-6">
              {[
                { icon: RiMapPinLine, text: '42 Fitness Avenue, Bandra West, Mumbai 400050' },
                { icon: RiPhoneLine,  text: '+91 98765 43210' },
                { icon: RiMailLine,   text: 'hello@samfitness.in' },
              ].map((item, i) => {
                const IconComponent = item.icon.default || item.icon
                return (
                  <div key={i} className="flex items-start gap-3">
                    <IconComponent className="text-primary-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-400 text-sm">{item.text}</span>
                  </div>
                )
              })}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(s => {
                const IconComponent = s.icon.default || s.icon
                return (
                  <a key={s.label} href={s.href} aria-label={s.label}
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400
                               hover:bg-primary-600 hover:text-white transition-all duration-200">
                    <IconComponent className="text-lg" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href}
                      className="text-slate-400 text-sm hover:text-primary-400 transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Get fitness tips & exclusive offers</h4>
              <p className="text-slate-500 text-sm">No spam. Unsubscribe anytime.</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex gap-3 w-full" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  placeholder={status === 'success' ? 'Subscribed!' : 'Enter your email'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700
                             text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500
                             transition-colors disabled:opacity-50"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="btn-primary text-sm whitespace-nowrap min-w-[100px]"
                >
                  {status === 'loading' ? (
                    <RiLoader4Line className="animate-spin mx-auto text-lg" />
                  ) : status === 'success' ? (
                    <RiCheckLine className="mx-auto text-lg text-green-400" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
              {status === 'error' && (
                <p className="text-rose-400 text-xs mt-2">{msg}</p>
              )}
              {status === 'success' && (
                <p className="text-green-400 text-xs mt-2">{msg}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Sam Fitness Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" className="text-slate-500 text-xs hover:text-slate-300 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
