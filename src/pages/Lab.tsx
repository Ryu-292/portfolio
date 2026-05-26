import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import LabModal from '../components/LabModal'
import Footer from '../components/Footer'
import { labProjects } from '../data/projects'
import type { LabProject } from '../data/projects'

function FadeIn({ children, delay = 0, style }: { children: React.ReactNode, delay?: number, style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} style={style} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

export default function Lab() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [openProject, setOpenProject] = useState<LabProject | null>(null)

  return (
    <PageWrapper>
      <LabModal project={openProject} onClose={() => setOpenProject(null)} />
      <div style={{ background: '#F8F8F6', minHeight: '100vh' }}>
        {/* Header */}
        <div className="lab-header" style={{ padding: '48px 64px 48px', borderBottom: '1px solid #D0D0D0', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(0,71,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,71,255,0.02) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }} />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.25em', color: '#0047FF', marginBottom: 12 }}>
              EXPERIMENTS + EXPLORATIONS — 2022–2025
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(44px, 5.5vw, 76px)', fontWeight: 900, letterSpacing: '-0.04em', color: '#0A0A0A', lineHeight: 0.9, margin: 0 }}>
                My Lab
              </h1>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.15em', color: '#8C8C8C', textAlign: 'right' }}>
                <div>{labProjects.length} PROJECTS</div>
                <div style={{ color: '#D0D0D0', marginTop: 4 }}>ARCHIVE</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Intro text */}
        <div style={{ padding: '32px 64px', borderBottom: '1px solid #D0D0D0' }}>
          <p style={{ fontSize: 13, color: '#8C8C8C', maxWidth: 480, lineHeight: 1.8 }}>
            A collection of smaller experiments, explorations, and side projects —
            from physical computing to machine learning, photography, and generative art.
          </p>
        </div>

        {/* Grid */}
        <div className="lab-grid-wrap" style={{ padding: '48px 64px 100px' }}>
          <div className="lab-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
            {labProjects.map((project, i) => (
              <FadeIn key={project.id} delay={i * 0.05} style={{ height: '100%' }}>
                <div
                  onMouseEnter={() => setHovered(project.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setOpenProject(project)}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    border: hovered === project.id ? '1px solid #0047FF' : '1px solid #D0D0D0',
                    background: '#fff',
                    transition: 'border 0.2s ease, transform 0.3s ease',
                    transform: hovered === project.id ? 'translateY(-2px)' : 'translateY(0)',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', overflow: 'hidden', background: '#0A0A0A', aspectRatio: '4/3' }}>
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: hovered === project.id ? 0.9 : 0.7,
                        transform: hovered === project.id ? 'scale(1.06)' : 'scale(1)',
                        transition: 'opacity 0.4s ease, transform 0.6s ease',
                        display: 'block',
                      }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                    {/* Year badge */}
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      background: 'rgba(0,71,255,0.9)',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.1em',
                      color: '#fff', padding: '3px 8px',
                    }}>
                      {project.year}
                    </div>
                    {/* Overlay on hover */}
                    {hovered === project.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,71,255,0.1)' }}
                      />
                    )}
                  </div>

                  {/* Card content */}
                  <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Category */}
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.2em', color: '#8C8C8C', marginBottom: 6, textTransform: 'uppercase' }}>
                      {project.category}
                    </div>

                    {/* Title */}
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: '#0A0A0A', marginBottom: 4, lineHeight: 1.1 }}>
                      {project.title}
                    </div>

                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#8C8C8C', marginBottom: 10 }}>
                      {project.subtitle}
                    </div>

                    {/* Description — grows to fill remaining space */}
                    <p style={{ fontSize: 11, lineHeight: 1.6, color: '#6A6A6A', margin: 0, flex: 1 }}>
                      {project.description}
                    </p>

                    {/* Tags — always pinned to bottom */}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 16 }}>
                      {project.tags.map(tag => (
                        <span key={tag} style={{
                          fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.1em',
                          color: hovered === project.id ? '#0047FF' : '#8C8C8C',
                          border: `1px solid ${hovered === project.id ? '#0047FF' : '#D0D0D0'}`,
                          padding: '2px 6px', textTransform: 'uppercase',
                          transition: 'all 0.2s',
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom blue line — animated on hover */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0,
                    height: 2,
                    width: hovered === project.id ? '100%' : '0%',
                    background: '#0047FF',
                    transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  )
}
