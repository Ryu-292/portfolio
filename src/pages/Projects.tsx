import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import CarouselScene from '../components/CarouselScene'
import { mainProjects } from '../data/projects'

export default function Projects() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hoveredProject = hoveredId ? mainProjects.find(p => p.id === hoveredId) : null

  // Lock body scroll — wheel events belong to the carousel only
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <PageWrapper>
      {/* calc(100vh - 64px) fills exactly the space below the fixed navbar
          that PageWrapper reserves with paddingTop: 64px */}
      <div style={{
        height: 'calc(100vh - 64px)',
        background: '#F8F8F6',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,71,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,71,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Top-left header */}
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, padding: '48px 64px 0', pointerEvents: 'none' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.25em', color: '#0047FF', marginBottom: 10 }}>
              SELECTED WORKS — 2023–2025
            </div>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(44px, 5.5vw, 76px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#0A0A0A',
              lineHeight: 0.9,
              margin: 0,
            }}>
              Projects
            </h1>
          </motion.div>
        </div>

        {/* Carousel — fills entire viewport */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <CarouselScene onHoverChange={setHoveredId} />
        </div>

        {/* Bottom info bar */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          zIndex: 10,
          padding: '28px 64px 52px',
          borderTop: '1px solid rgba(208,208,208,0.5)',
          background: 'linear-gradient(to top, rgba(248,248,246,0.96) 60%, transparent)',
          pointerEvents: 'none',
        }}>
          <AnimatePresence mode="wait">
            {hoveredProject ? (
              <motion.div
                key={hoveredProject.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}
              >
                <div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 9,
                    letterSpacing: '0.22em',
                    color: '#0047FF',
                    marginBottom: 8,
                  }}>
                    {hoveredProject.index} — {hoveredProject.category.toUpperCase()} — CLICK TO VIEW →
                  </div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(20px, 2.3vw, 32px)',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    color: '#0A0A0A',
                    lineHeight: 1,
                  }}>
                    {hoveredProject.title}
                  </div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10,
                    color: '#8C8C8C',
                    marginTop: 6,
                    letterSpacing: '0.04em',
                  }}>
                    {hoveredProject.subtitle}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 320, flexShrink: 0 }}>
                  {hoveredProject.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 8,
                      letterSpacing: '0.1em',
                      color: '#0047FF',
                      border: '1px solid #0047FF',
                      padding: '3px 8px',
                      textTransform: 'uppercase',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16 }}
              >
                <div style={{ width: 28, height: 1, background: '#D0D0D0', flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  color: '#8C8C8C',
                }}>
                  DRAG OR SCROLL TO EXPLORE — HOVER TO PREVIEW — CLICK TO OPEN
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  )
}
