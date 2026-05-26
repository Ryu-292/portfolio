import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Nav() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const navItems = [
    { to: '/', label: 'HOME' },
    { to: '/projects', label: 'PROJECTS' },
    { to: '/lab', label: 'MY LAB' },
  ]

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: scrolled ? '1px solid #D0D0D0' : '1px solid transparent',
        background: scrolled ? 'rgba(248,248,246,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/images/logo/Logo.png"
            alt="Ryu Osada"
            style={{ height: 36, width: 'auto', display: 'block' }}
          />
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: '#8C8C8C', lineHeight: 1 }}>RYU OSADA</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.15em', color: '#0047FF', lineHeight: 1.4 }}>DESIGNER + ENGINEER</div>
          </div>
        </NavLink>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                textDecoration: 'none',
                padding: '8px 16px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: isActive ? '#0047FF' : '#8C8C8C',
                position: 'relative',
                transition: 'color 0.2s',
                borderBottom: isActive ? '1.5px solid #0047FF' : '1.5px solid transparent',
              })}
            >
              {label}
              {location.pathname === to && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: 16,
                    right: 16,
                    height: 1.5,
                    background: '#0047FF',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </div>

        {/* Clock */}
        <div className="nav-clock" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', color: '#8C8C8C', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <span>{time}</span>
          <span style={{ color: '#D0D0D0' }}>TKY / JST</span>
        </div>
      </div>
    </motion.nav>
  )
}
