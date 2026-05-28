import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import HoloPortrait from '../components/HoloPortrait'
import Footer from '../components/Footer'
import StickerCollage from '../components/StickerCollage'

function FadeIn({ children, delay = 0, style }: { children: React.ReactNode, delay?: number, style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tickerRef.current
    if (!el) return
    let x = 0
    const speed = 0.4
    const tick = () => {
      x -= speed
      if (x < -el.scrollWidth / 2) x = 0
      el.style.transform = `translateX(${x}px)`
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])

  return (
    <PageWrapper>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-grid" style={{
        height: 'calc(100vh - 64px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        position: 'relative',
        overflow: 'hidden',
        background: '#F8F8F6',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,71,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,71,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Left — Identity */}
        <div className="hero-left" style={{
          paddingTop: 'clamp(32px, 4vh, 56px)',
          paddingBottom: 'clamp(48px, 6vh, 80px)',
          paddingLeft: 'clamp(40px, 6vw, 100px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', zIndex: 2,
        }}>
          <div>
            {/* Status label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}
            >
              <div style={{ width: 6, height: 6, background: '#0047FF', borderRadius: '50%', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: '#8C8C8C', textTransform: 'uppercase' }}>
                Available for projects — 2025
              </span>
            </motion.div>

            {/* Main title */}
            <div style={{ marginBottom: 32 }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(56px, 7vw, 96px)',
                  fontWeight: 900, letterSpacing: '-0.03em',
                  lineHeight: 0.9, color: '#0A0A0A', marginBottom: 4,
                }}>RYU</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(56px, 7vw, 96px)',
                  fontWeight: 900, letterSpacing: '-0.03em',
                  lineHeight: 0.9, color: '#0047FF',
                }}>OSADA</div>
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ marginBottom: 48 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 32, height: 1, background: '#0047FF' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.2em', color: '#0047FF', textTransform: 'uppercase' }}>
                  Designer + Engineer
                </span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4A4A4A', maxWidth: 360, fontWeight: 400 }}>
                Creating at the intersection of technology and sensory experience —
                from physical installations to wearable systems and interactive environments.
              </p>
            </motion.div>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 340 }}
            >
              {[
                ['BASED', 'Paris / Tokyo'],
                ['SCHOOL', 'ESILV Engineering'],
                ['FOCUS', 'Interaction Design'],
                ['STATUS', 'Open to Work'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.2em', color: '#8C8C8C', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#0A0A0A' }}>{value}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 56 }}
          >
            <Link to="/projects" style={{
              textDecoration: 'none', padding: '12px 28px',
              background: '#0047FF', color: '#fff',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              transition: 'background 0.2s ease', display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0033CC')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0047FF')}
            >
              View Projects
            </Link>
            <Link to="/lab" style={{
              textDecoration: 'none', padding: '12px 28px',
              border: '1px solid #0A0A0A', color: '#0A0A0A',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              transition: 'all 0.2s ease', display: 'inline-block',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0A0A0A'; e.currentTarget.style.color = '#F8F8F6' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0A0A0A' }}
            >
              My Lab
            </Link>
          </motion.div>
        </div>

        {/* Right — Holographic portrait */}
        <div className="hero-three" style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingLeft: 'clamp(40px, 6vw, 100px)',
          paddingRight: 'clamp(40px, 6vw, 100px)',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ position: 'relative', width: '100%', aspectRatio: '1', border: '1px solid #D0D0D0' }}
          >
            {[
              { top: -1, left: -1, borderTop: '2px solid #0047FF', borderLeft: '2px solid #0047FF' },
              { top: -1, right: -1, borderTop: '2px solid #0047FF', borderRight: '2px solid #0047FF' },
              { bottom: -1, left: -1, borderBottom: '2px solid #0047FF', borderLeft: '2px solid #0047FF' },
              { bottom: -1, right: -1, borderBottom: '2px solid #0047FF', borderRight: '2px solid #0047FF' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 16, height: 16, ...s }} />
            ))}
            <HoloPortrait style={{ width: '100%', height: '100%' }} />
          </motion.div>

          <div style={{
            position: 'absolute', right: 24, top: '50%',
            transform: 'translateY(-50%) rotate(90deg)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
            letterSpacing: '0.3em', color: '#D0D0D0', whiteSpace: 'nowrap',
          }}>
            PORTFOLIO — 2025 — RYU OSADA
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ position: 'absolute', bottom: 28, left: 'clamp(40px, 6vw, 100px)', display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <div style={{ width: 1, height: 28, background: '#D0D0D0', position: 'relative', overflow: 'hidden' }}>
            <motion.div
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 12, background: '#0047FF' }}
              animate={{ y: [0, 28, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.2em', color: '#8C8C8C', textTransform: 'uppercase' }}>
            Scroll
          </span>
        </motion.div>
      </section>

      {/* ── Ticker + Selected Works ───────────────────────── */}
      <div style={{ background: '#F8F8F6' }}>

        {/* Ticker */}
        <div style={{ background: '#0A0A0A', height: 40, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <div ref={tickerRef} style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', willChange: 'transform' }}>
            {Array(4).fill(null).map((_, i) => (
              <span key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.25em', color: '#F8F8F6', paddingRight: 80, opacity: 0.6 }}>
                DESIGNER — ENGINEER — INTERACTION — FABRICATION — THREE.JS — TOUCHDESIGNER — BCI — ROBOTICS — WEARABLES — INSTALLATION —&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* Selected Works section */}
        <section style={{
          paddingTop: 'clamp(44px, 5.5vh, 70px)',
          paddingBottom: 'clamp(60px, 8vh, 96px)',
        }}>

          {/* Section header */}
          <FadeIn style={{ padding: `0 clamp(40px, 6vw, 100px)`, marginBottom: 'clamp(32px, 4.5vh, 56px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9, letterSpacing: '0.25em',
                  color: '#0047FF', textTransform: 'uppercase',
                }}>
                  Selected Works
                </div>
              </div>
              <Link to="/projects" style={{
                textDecoration: 'none',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9, letterSpacing: '0.15em',
                color: '#0047FF',
                display: 'flex', alignItems: 'center', gap: 8,
                textTransform: 'uppercase',
              }}>
                All Projects <span style={{ fontSize: 14 }}>→</span>
              </Link>
            </div>
          </FadeIn>

          {/* The collage */}
          <StickerCollage />

        </section>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <Footer />

    </PageWrapper>
  )
}
