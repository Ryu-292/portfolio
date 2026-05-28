import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

/* ─── Breakpoint hook ──────────────────────────────────────── */

function useIsMobile(bp = 1024): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < bp : false
  )
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < bp)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [bp])
  return mobile
}

/* ─── Sticker data ─────────────────────────────────────────── */

interface StickerData {
  id: string
  src: string
  alt: string
  to: string
  // Desktop
  left: number
  top: number
  width: number
  rotation: number
  delay: number
  zIndex: number
  // Mobile
  mWidth: number
  mRotation: number
  mMarginTop: number
}

const STICKERS: StickerData[] = [
  {
    id: 'neuroportals',
    src: '/images/NeuroPortals/neuro_sticker.png',
    alt: 'NeuroPortals — Brain-Computer Interface Installation',
    to: '/projects/neuroportals',
    left: 0, top: 88, width: 395, rotation: -4,
    delay: 0, zIndex: 2,
    mWidth: 178, mRotation: -3, mMarginTop: 14,
  },
  {
    id: 'terubot',
    src: '/images/Terubot/terubot_sticker.png',
    alt: 'TeruBot — Expressive Robot Companion',
    to: '/projects/terubot',
    left: 248, top: 10, width: 268, rotation: 8,
    delay: 0.1, zIndex: 4,
    mWidth: 172, mRotation: 6, mMarginTop: -10,
  },
  {
    id: 'elastup',
    src: '/images/Elastup/elastup_sticker.png',
    alt: 'Elastup — Holographic Wearable Prototype',
    to: '/projects/elastup',
    left: 400, top: 112, width: 295, rotation: -6,
    delay: 0.15, zIndex: 3,
    mWidth: 178, mRotation: -4, mMarginTop: 18,
  },
  {
    id: 'sakekagami',
    src: '/images/Sakekagami/Sake_sticker.png',
    alt: 'Sakekagami — Interactive Sake Mirror Installation',
    to: '/projects/sakekagami',
    left: 562, top: 26, width: 248, rotation: 6,
    delay: 0.2, zIndex: 2,
    mWidth: 160, mRotation: 4, mMarginTop: -14,
  },
]

/* ─── Magnetic sticker (desktop) ──────────────────────────── */

function DesktopSticker({ data }: { data: StickerData }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hov, setHov] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 280, damping: 22 })
  const smy = useSpring(my, { stiffness: 280, damping: 22 })

  const entryRot = data.rotation + (data.rotation >= 0 ? -9 : 9)

  return (
    <motion.div
      ref={ref}
      style={{
        position: 'absolute',
        left: data.left,
        top: data.top,
        width: data.width,
        x: smx,
        y: smy,
        zIndex: hov ? 20 : data.zIndex,
        willChange: 'transform',
        cursor: 'pointer',
      }}
      initial={{ opacity: 0, y: 36, rotate: entryRot }}
      animate={inView ? { opacity: 1, y: 0, rotate: data.rotation } : {}}
      whileHover={{ scale: 1.08 }}
      transition={{
        opacity: { duration: 0.55, delay: data.delay },
        y: { duration: 0.95, delay: data.delay, ease: [0.16, 1, 0.3, 1] },
        rotate: { duration: 0.95, delay: data.delay, ease: [0.16, 1, 0.3, 1] },
        scale: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      onMouseMove={e => {
        if (!ref.current) return
        const r = ref.current.getBoundingClientRect()
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.12)
        my.set((e.clientY - (r.top + r.height / 2)) * 0.12)
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { mx.set(0); my.set(0); setHov(false) }}
    >
      <Link
        to={data.to}
        aria-label={data.alt}
        style={{ display: 'block', textDecoration: 'none' }}
      >
        <img
          src={data.src}
          alt={data.alt}
          draggable={false}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: hov
              ? 'drop-shadow(0 18px 36px rgba(0,0,0,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.16))'
              : 'drop-shadow(0 4px 14px rgba(0,0,0,0.18)) drop-shadow(0 1px 3px rgba(0,0,0,0.1))',
            transition: 'filter 0.4s ease',
            userSelect: 'none',
            WebkitUserDrag: 'none' as React.CSSProperties['WebkitUserDrag'],
          } as React.CSSProperties}
        />
      </Link>
    </motion.div>
  )
}

/* ─── Mobile sticker (touch-friendly) ─────────────────────── */

function MobileSticker({ data, col }: { data: StickerData; col: 0 | 1 }) {
  return (
    <motion.div
      style={{
        width: data.mWidth,
        marginTop: data.mMarginTop,
        justifySelf: col === 0 ? 'start' : 'end',
        zIndex: col === 1 ? 2 : 1,
        cursor: 'pointer',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.55, delay: (col === 1 ? 0.06 : 0), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={data.to}
        aria-label={data.alt}
        style={{ display: 'block', textDecoration: 'none' }}
      >
        <img
          src={data.src}
          alt={data.alt}
          draggable={false}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            transform: `rotate(${data.mRotation}deg)`,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))',
            userSelect: 'none',
          }}
        />
      </Link>
    </motion.div>
  )
}

/* ─── Main export ──────────────────────────────────────────── */

export default function StickerCollage() {
  const isMobile = useIsMobile(1024)

  /* ── Mobile: 2-column grid, staggered ── */
  if (isMobile) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        padding: '8px 24px 56px',
        alignItems: 'start',
        rowGap: 4,
      }}>
        {STICKERS.map((s, i) => (
          <MobileSticker key={s.id} data={s} col={(i % 2) as 0 | 1} />
        ))}
      </div>
    )
  }

  /* ── Desktop: absolute collage ── */
  return (
    <div style={{
      position: 'relative',
      height: 540,
      margin: '0 clamp(40px, 6vw, 100px)',
    }}>
      {STICKERS.map(s => (
        <DesktopSticker key={s.id} data={s} />
      ))}
    </div>
  )
}
