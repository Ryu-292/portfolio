import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ryu-osada' },
  { label: 'GitHub', href: 'https://github.com/ryuosada' },
  { label: 'Instagram', href: 'https://instagram.com/ryu.osada' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#F8F8F6', borderTop: '1px solid #D0D0D0' }}>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: 0,
        padding: `clamp(36px, 4vw, 56px) clamp(40px, 6vw, 100px)`,
        borderBottom: '1px solid #D0D0D0',
      }}>

        {/* Col 1 — Headline + CTA */}
        <FadeUp delay={0}>
          <div style={{ paddingRight: 32 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.25em', color: '#0047FF', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0047FF', animation: 'pulse 2s ease-in-out infinite', flexShrink: 0 }} />
              AVAILABLE — 2025
            </div>
            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(22px, 2.8vw, 34px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#0A0A0A',
              marginBottom: 12,
            }}>
              Let's work<br />together.
            </div>
            <p style={{ fontSize: 11, lineHeight: 1.7, color: '#8C8C8C', marginBottom: 20, maxWidth: 240 }}>
              Open to projects, collaborations and freelance — installations, wearables, web.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a
                href="mailto:ryuosada12@gmail.com"
                style={{
                  textDecoration: 'none', padding: '9px 20px',
                  background: '#0047FF', color: '#fff',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.18em',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0033CC' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0047FF' }}
              >
                EMAIL ↗
              </a>
              <a
                href="/fichier/CV_RyuOSADA.pdf"
                target="_blank" rel="noopener noreferrer"
                style={{
                  textDecoration: 'none', padding: '9px 20px',
                  border: '1px solid #D0D0D0', color: '#0A0A0A',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.18em',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0047FF'; e.currentTarget.style.color = '#0047FF' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#D0D0D0'; e.currentTarget.style.color = '#0A0A0A' }}
              >
                CV PDF
              </a>
            </div>
          </div>
        </FadeUp>

        {/* Col 2 — Contact */}
        <FadeUp delay={0.07}>
          <div style={{ borderLeft: '1px solid #D0D0D0', paddingLeft: 28 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.3em', color: '#8C8C8C', marginBottom: 16 }}>
              CONTACT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.15em', color: '#C0C0C0', marginBottom: 3 }}>EMAIL</div>
                <a href="mailto:ryuosada12@gmail.com" style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#4A4A4A',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#0047FF' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4A4A4A' }}
                >
                  ryuosada12<br />@gmail.com
                </a>
              </div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.15em', color: '#C0C0C0', marginBottom: 3 }}>BASED IN</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#4A4A4A', lineHeight: 1.6 }}>
                  Paris, France<br />Tokyo, Japan
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Col 3 — Social */}
        <FadeUp delay={0.12}>
          <div style={{ borderLeft: '1px solid #D0D0D0', paddingLeft: 28 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.3em', color: '#8C8C8C', marginBottom: 16 }}>
              SOCIAL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SOCIALS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.12em',
                    color: '#8C8C8C', display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#0047FF' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#8C8C8C' }}
                >
                  <span style={{ width: 14, height: 1, background: 'currentColor', flexShrink: 0 }} />
                  {label} ↗
                </a>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Col 4 — Profile */}
        <FadeUp delay={0.17}>
          <div style={{ borderLeft: '1px solid #D0D0D0', paddingLeft: 28 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.3em', color: '#8C8C8C', marginBottom: 16 }}>
              PROFILE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['SCHOOL', 'ESILV Engineering'],
                ['FOCUS', 'Interaction Design'],
                ['STATUS', 'Open to Work'],
                ['LANGUAGES', 'FR / EN / JP'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.15em', color: '#C0C0C0', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#4A4A4A' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

      </div>

      {/* Bottom bar */}
      <div style={{
        padding: `12px clamp(40px, 6vw, 100px)`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6,
      }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.2em', color: '#C0C0C0' }}>
          RYU OSADA — DESIGNER + ENGINEER — PORTFOLIO 2025
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.15em', color: '#C0C0C0' }}>
          © 2025
        </div>
      </div>

    </footer>
  )
}
