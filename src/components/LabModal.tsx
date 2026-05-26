import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LabProject } from '../data/projects'

interface LabModalProps {
  project: LabProject | null
  onClose: () => void
}

export default function LabModal({ project, onClose }: LabModalProps) {
  const [activeImage, setActiveImage] = useState(0)

  // Reset active image when project changes
  useEffect(() => {
    setActiveImage(0)
  }, [project?.id])

  // Escape key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (!project) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [project])

  const images = project?.images && project.images.length > 0 ? project.images : [project?.coverImage ?? '']

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10,10,10,0.72)',
              backdropFilter: 'blur(5px)',
              zIndex: 200,
              cursor: 'pointer',
            }}
          />

          {/* Drawer panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36, mass: 1 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(580px, 92vw)',
              background: '#F8F8F6',
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {/* Top bar */}
            <div style={{
              position: 'sticky',
              top: 0,
              background: '#F8F8F6',
              zIndex: 10,
              borderBottom: '1px solid #D0D0D0',
              padding: '16px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.22em', color: '#0047FF' }}>
                {project.category.toUpperCase()} — {project.year}
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: '1px solid #D0D0D0',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 8,
                  letterSpacing: '0.2em',
                  color: '#8C8C8C',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#0047FF'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#0047FF'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#D0D0D0'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#8C8C8C'
                }}
              >
                CLOSE ✕
              </button>
            </div>

            {/* Main image */}
            <div style={{
              position: 'relative',
              background: '#0A0A0A',
              flexShrink: 0,
              overflow: 'hidden',
            }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={project.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: '100%',
                    aspectRatio: '16/10',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0' }}
                />
              </AnimatePresence>

              {/* Image counter */}
              {images.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 14,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 8,
                  letterSpacing: '0.15em',
                  color: '#fff',
                  background: 'rgba(10,10,10,0.6)',
                  padding: '3px 8px',
                }}>
                  {String(activeImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div style={{
                display: 'flex',
                gap: 3,
                padding: '10px 28px',
                borderBottom: '1px solid #D0D0D0',
                flexShrink: 0,
                overflowX: 'auto',
              }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      flexShrink: 0,
                      width: 56,
                      height: 40,
                      background: '#0A0A0A',
                      border: i === activeImage ? '1.5px solid #0047FF' : '1.5px solid transparent',
                      cursor: 'pointer',
                      padding: 0,
                      overflow: 'hidden',
                      opacity: i === activeImage ? 1 : 0.5,
                      transition: 'opacity 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (i !== activeImage) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'
                    }}
                    onMouseLeave={e => {
                      if (i !== activeImage) (e.currentTarget as HTMLButtonElement).style.opacity = '0.5'
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            <div style={{ padding: '28px 28px 48px', flex: 1 }}>
              {/* Title block */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  color: '#0A0A0A',
                  margin: '0 0 5px',
                  lineHeight: 1,
                }}>
                  {project.title}
                </h2>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  color: '#8C8C8C',
                  letterSpacing: '0.05em',
                }}>
                  {project.subtitle}
                </div>
              </div>

              {/* Meta row */}
              <div style={{
                display: 'flex',
                gap: 0,
                borderTop: '1px solid #D0D0D0',
                borderBottom: '1px solid #D0D0D0',
                marginBottom: 24,
              }}>
                {[
                  { label: 'YEAR', value: project.year },
                  { label: 'TYPE', value: project.category },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    flex: 1,
                    padding: '12px 0',
                    borderRight: label === 'YEAR' ? '1px solid #D0D0D0' : 'none',
                    paddingLeft: label !== 'YEAR' ? 16 : 0,
                  }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.25em', color: '#8C8C8C', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#0A0A0A', letterSpacing: '0.05em' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {project.longDescription && (
                <p style={{
                  fontSize: 13,
                  lineHeight: 1.8,
                  color: '#444',
                  margin: '0 0 24px',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {project.longDescription}
                </p>
              )}

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: project.link ? 28 : 0 }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 8,
                    letterSpacing: '0.15em',
                    color: '#0047FF',
                    border: '1px solid #0047FF',
                    padding: '3px 10px',
                    textTransform: 'uppercase',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* External link */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    marginTop: 24,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 9,
                    letterSpacing: '0.2em',
                    color: '#0A0A0A',
                    textDecoration: 'none',
                    border: '1px solid #0A0A0A',
                    padding: '10px 20px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = '#0047FF'
                    el.style.borderColor = '#0047FF'
                    el.style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'transparent'
                    el.style.borderColor = '#0A0A0A'
                    el.style.color = '#0A0A0A'
                  }}
                >
                  OPEN →
                </a>
              )}
            </div>

            {/* Bottom accent line */}
            <div style={{ height: 2, background: '#0047FF', flexShrink: 0 }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
