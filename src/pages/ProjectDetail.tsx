import { useParams, Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { mainProjects } from '../data/projects'

/* ─────────────────────── helpers ─────────────────────── */

function FadeIn({
  children, delay = 0, style, className,
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────── per-project content ─────────────────────── */

const CONTENT: Record<string, {
  paragraphs: string[]
  specs: [string, string][]
  process: { num: string; title: string; desc: string }[]
  heroImages: string[]     // [0] hero, [1] left-spread, [2] right-top, [3] right-bottom, [4] wide
  galleryImages: string[]  // rest for the bottom grid
  videos?: string[]        // optional video clips (auto-plays muted loop)
}> = {
  neuroportals: {
    paragraphs: [
      "Inspired by a childhood spent between Japanese tradition and European modernity, NeuroPortals asks a simple question: what if you could watch your own mind become a painting? Using shoji paper windows as the projection canvas — those quiet grid screens that filter light in Japanese homes — the installation turns EEG brainwave data into moving light, in real time. A collaboration with Fleuriane LAM, whose focus on art and creativity shaped the emotional core of the piece.",
      "We used the Muse 2 headset to capture raw EEG signals, then filtered them in Python into five frequency bands: Delta (0.5–4 Hz, deep sleep), Theta (4–8 Hz, meditation), Alpha (8–12 Hz, calm alertness), Beta (12–30 Hz, active focus), and Gamma (30–100 Hz, higher cognition). Each band was streamed via OSC to TouchDesigner, where it drove a different visual parameter — colour, intensity, motion speed, and texture grain — creating a continuous, expressive portrait of mental state.",
      "For the final installation we hand-built life-scale shoji doors from scratch: wooden battens, wood strips, calligraphy paper. Generative patterns were projected onto them in real time, with heartbeat data controlling animation speed. Dancers moved inside the space, their shadows blending with the light. The room breathed with the mind of whoever was wearing the headset.",
    ],
    specs: [
      ['EEG Device', 'Muse 2 Headset'],
      ['Software', 'TouchDesigner, Python'],
      ['Protocol', 'OSC port 5000'],
      ['Fabrication', 'Shoji-style doors'],
      ['Build Time', '3 months'],
      ['With', 'Fleuriane LAM'],
    ],
    process: [
      { num: '01', title: 'Research & Concept', desc: 'Explored Japanese shoji tradition, EEG hardware options, and how frequency-band data could map meaningfully to emotional and visual states.' },
      { num: '02', title: 'Signal Pipeline', desc: 'Built a Python pipeline reading Muse 2 data in real time, filtering into five brainwave bands and streaming via OSC into TouchDesigner.' },
      { num: '03', title: 'Visual System', desc: 'Designed a generative visual engine where each frequency band controlled a distinct visual parameter — colour, intensity, motion, texture.' },
      { num: '04', title: 'Fabrication & Performance', desc: 'Hand-built shoji projection doors from wood and calligraphy paper. Staged the final performance with live EEG, projection mapping, and dancers.' },
    ],
    heroImages: [
      '/images/NeuroPortals/neuroIntro.png',
      '/images/NeuroPortals/porteL.png',
      '/images/NeuroPortals/fab1.JPG',
      '/images/NeuroPortals/TouchDesigner1.png',
      '/images/NeuroPortals/final_porte1.jpg',
    ],
    galleryImages: [
      '/images/NeuroPortals/final_porte2.JPG',
      '/images/NeuroPortals/Image_vision.png',
      '/images/NeuroPortals/porteL2.png',
      '/images/NeuroPortals/fab2.JPG',
      '/images/NeuroPortals/proto.png',
      '/images/NeuroPortals/TouchDesigner2.png',
    ],
    videos: [
      '/images/NeuroPortals/M%C3%A9dia1.mp4',
      '/images/NeuroPortals/M%C3%A9dia2.mp4',
      '/images/NeuroPortals/M%C3%A9dia3.mp4',
    ],
  },

  elastup: {
    paragraphs: [
      'Elastup was born from a frustration with the fragmentation between our digital lives and our physical presence. Why carry a phone? Why look down at a screen that pulls you away from the world in front of you?',
      'The device is an elastic band embedded with a micro-projector and a gesture sensor array. Worn on the wrist, it projects interactive holographic interfaces onto the palm and fingers — menus, notifications, controls — activated by simple hand gestures.',
      'The aesthetic draws from sportswear and product design, keeping the form factor minimal and wearable. The holographic projection uses an angled micro-mirror array to create the illusion of floating UI elements suspended above the hand.',
    ],
    specs: [
      ['Category', 'Wearable Tech'],
      ['Projection', 'Micro-mirror array'],
      ['Sensors', 'IMU, Capacitive'],
      ['Material', 'Elastic composite'],
      ['Build Time', '2 months'],
      ['Status', 'Working Prototype'],
    ],
    process: [
      { num: '01', title: 'Market Research', desc: 'Surveyed AR wearable landscape, identified friction points in existing devices, and defined target interaction vocabulary.' },
      { num: '02', title: 'Form & Material', desc: 'Explored elastic materials, miniaturised optics, and gesture detection methods through rapid physical mockups.' },
      { num: '03', title: 'Prototype Build', desc: 'Assembled functional prototype using off-the-shelf micro-projector, custom PCB, and 3D-printed housing components.' },
      { num: '04', title: 'Presentation', desc: 'Developed the visual identity, demo UI, and product posters. Presented to a jury of industry designers and engineers.' },
    ],
    heroImages: [
      '/images/Elastup/ElastupHolo.png',
      '/images/Elastup/Elastup1.png',
      '/images/Elastup/design1.png',
      '/images/Elastup/Note1.png',
      '/images/Elastup/Poster1.jpg',
    ],
    galleryImages: [
      '/images/Elastup/Elastup2.JPG',
      '/images/Elastup/Colors.JPG',
      '/images/Elastup/Poster2.jpg',
      '/images/Elastup/Ipad1.JPG',
      '/images/Elastup/Recap.jpg',
    ],
  },

  sakekagami: {
    paragraphs: [
      "Sakekagami started with a question I couldn't shake during a stay in Kyoto: how can technology bring us closer to tradition rather than pull us away from it? Surrounded by Shinto shrines, seasonal ceremonies, and quiet gestures of devotion, one word kept returning to me — connection.",
      "The name fuses two ideas I found inseparable. Sake, the rice wine used in Shinto ritual as a bridge between the human and the divine — its fermentation invisible to the naked eye, believed by ancient Japanese to be the work of gods. And kagami, the mirror, a sacred Shinto symbol of truth and self-reflection. The Mizukagami, or water mirror, forms on still surfaces and was believed to act as a portal linking us to those who came before. I kept asking: what if a cup of sake could become that same kind of mirror?",
      "Each custom masu is embedded with a Raspberry Pi, a miniature camera, and a small display. Two cups communicate over a local network — the camera in each captures the user's face, processed in real time through TouchDesigner and StreamDiffusion to generate a living AI-diffused portrait. That image flows to the opposite cup, so when two people drink together across distance, they see each other refracted and transformed — somewhere between reflection and presence.",
    ],
    specs: [
      ['Concept', 'Sake + Mizukagami'],
      ['Hardware', 'Raspberry Pi, Camera'],
      ['Software', 'TouchDesigner, StreamDiffusion'],
      ['Object', 'Custom 3D-modelled Masu'],
      ['Build Time', '6 weeks'],
      ['Exhibited', 'ESILV Design Studio'],
    ],
    process: [
      { num: '01', title: 'Kyoto Research', desc: "Studied Shinto ritual, sake ceremony, and the cultural weight of the masu cup during a stay in Kyoto — the spiritual heart of Japan." },
      { num: '02', title: 'Concept & Form', desc: "Fused sake ritual and the Mizukagami (water mirror) into a single object: a custom masu that is simultaneously cup, camera, screen, and portal." },
      { num: '03', title: 'System Build', desc: "Embedded a Raspberry Pi, miniature camera, and display into each 3D-modelled masu cup, then built the two-cup real-time network pipeline." },
      { num: '04', title: 'AI Diffusion', desc: "Integrated StreamDiffusion via TouchDesigner to transform each face in real time into a shifting, living portrait — the water mirror made digital." },
    ],
    heroImages: [
      '/images/Sakekagami/sakekagamiPoster.png',
      '/images/Sakekagami/MasuB_Y.JPG',
      '/images/Sakekagami/MasuB1.JPG',
      '/images/Sakekagami/sketch1.png',
      '/images/Sakekagami/Poster.JPG',
    ],
    galleryImages: [
      '/images/Sakekagami/MasuB2.JPG',
      '/images/Sakekagami/sketch2.png',
      '/images/Sakekagami/sketch3.png',
    ],
  },

  terubot: {
    paragraphs: [
      'Terubot takes its name and spirit from the teru teru bozu — small white paper dolls hung to invite good weather in Japanese tradition. The robot inherits this charm: it is expressive, intuitive, and deeply endearing in the best possible way.',
      'The robot communicates entirely through physical behaviour: LED eyes that shift colour with emotional state, servo-driven head tilts and body sways, and a soft ambient hum that rises when it seeks attention. A custom lightweight AI model trained on emotional expression maps sensor input — microphone, camera, and touch — to a rich output vocabulary.',
      'The fabrication combines 3D-printed structural components with a soft fabric exterior that gives Terubot its characteristic marshmallow silhouette. The goal was to create something that feels genuinely alive and warm rather than mechanically reactive.',
    ],
    specs: [
      ['AI Model', 'Custom emotion classifier'],
      ['Actuation', 'Micro servo array (×6)'],
      ['Sensing', 'Mic, Camera, Touch pad'],
      ['MCU', 'Raspberry Pi 4'],
      ['Build Time', '10 weeks'],
      ['Status', 'Functional prototype'],
    ],
    process: [
      { num: '01', title: 'Character Design', desc: 'Developed the visual language and emotional vocabulary of Terubot — seven distinct states mapped to physical behaviours.' },
      { num: '02', title: 'AI Model', desc: 'Trained a lightweight emotion-recognition model on curated audiovisual datasets, optimised for Raspberry Pi inference.' },
      { num: '03', title: 'Servo Mapping', desc: 'Designed and calibrated the six-axis servo system controlling head, body, and eye movement with smooth interpolation.' },
      { num: '04', title: 'Final Build', desc: 'Integrated all systems, wrapped the chassis in custom fabric, and tested interaction quality with 20+ user sessions.' },
    ],
    heroImages: [
      '/images/Terubot/terubotposter2.png',
      '/images/Terubot/TERUTERUBOZU.png',
      '/images/Terubot/happy1.JPG',
      '/images/Terubot/TeruBot_App.jpeg',
      '/images/Terubot/application.png',
    ],
    galleryImages: [
      '/images/Terubot/mapping.png',
      '/images/Terubot/terubot_mapping.png',
      '/images/Terubot/terubot1.jpeg',
      '/images/Terubot/DSCF7529.JPG',
    ],
  },
}

/* ─────────────────────── main component ─────────────────────── */

export default function ProjectDetail() {
  const { id } = useParams()
  const project = mainProjects.find(p => p.id === id)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  if (!project) {
    return (
      <PageWrapper>
        <div style={{ padding: '120px 64px', fontFamily: 'JetBrains Mono, monospace', color: '#8C8C8C' }}>
          Project not found. <Link to="/projects" style={{ color: '#0047FF' }}>← Back</Link>
        </div>
      </PageWrapper>
    )
  }

  const content = CONTENT[project.id]
  const currentIndex = mainProjects.indexOf(project)
  const nextProject = mainProjects[(currentIndex + 1) % mainProjects.length]
  const [h0, h1, h2, h3, h4] = content.heroImages

  return (
    <PageWrapper>
      <div style={{ background: '#F8F8F6' }}>

        {/* ── Breadcrumb ── */}
        <div style={{
          padding: '0 clamp(40px,6vw,100px)',
          height: 52,
          display: 'flex', alignItems: 'center', gap: 14,
          borderBottom: '1px solid #D0D0D0',
        }}>
          <Link to="/projects" style={{
            textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9, letterSpacing: '0.2em', color: '#8C8C8C',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0047FF' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8C8C8C' }}
          >
            ← PROJECTS
          </Link>
          <span style={{ color: '#D0D0D0', fontFamily: 'JetBrains Mono, monospace', fontSize: 9 }}>/</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: '#0047FF' }}>
            {project.title.toUpperCase()}
          </span>
        </div>

        {/* ── HERO ── */}
        <div
          ref={heroRef}
          style={{ position: 'relative', height: '82vh', overflow: 'hidden', background: '#0A0A0A' }}
        >
          {/* Parallax image */}
          <motion.div style={{ y: heroImgY, position: 'absolute', inset: '-10% 0', height: '120%' }}>
            <motion.img
              src={h0}
              alt={project.title}
              initial={{ scale: 1.06, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.55) 70%, rgba(10,10,10,0.9) 100%)',
          }} />

          {/* Ghost index */}
          <div style={{
            position: 'absolute', bottom: 0, right: 'clamp(40px,6vw,100px)',
            fontFamily: 'Inter, sans-serif', fontSize: 'clamp(120px,18vw,220px)',
            fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 0.85,
            color: 'rgba(255,255,255,0.04)', userSelect: 'none', pointerEvents: 'none',
          }}>
            {project.index}
          </div>

          {/* Title block */}
          <motion.div
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, opacity: heroOpacity,
              padding: `0 clamp(40px,6vw,100px) clamp(36px,4vh,56px)` }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.3em',
                  color: '#0047FF', background: 'rgba(0,71,255,0.15)',
                  border: '1px solid rgba(0,71,255,0.4)', padding: '3px 10px',
                }}>
                  {project.index}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)' }}>
                  {project.category.toUpperCase()}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>
                  {project.year}
                </span>
              </div>
              <h1 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(48px,7vw,96px)',
                fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9,
                color: '#F8F8F6', margin: '0 0 10px',
              }}>
                {project.title}
              </h1>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>
                {project.subtitle}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── META STRIP ── */}
        <FadeIn>
          <div style={{
            borderBottom: '1px solid #D0D0D0',
            padding: `20px clamp(40px,6vw,100px)`,
            display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto',
          }}>
            {[
              project.index,
              project.category.toUpperCase(),
              project.year,
              ...project.tags,
              'COMPLETED',
            ].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.2em',
                  color: i === 0 ? '#0047FF' : '#8C8C8C', whiteSpace: 'nowrap',
                }}>
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ margin: '0 16px', color: '#D0D0D0', fontFamily: 'JetBrains Mono, monospace', fontSize: 8 }}>—</span>
                )}
              </span>
            ))}
          </div>
        </FadeIn>

        {/* ── LEAD ── */}
        <div style={{ padding: `clamp(56px,7vh,100px) clamp(40px,6vw,100px)`, borderBottom: '1px solid #D0D0D0' }}>
          <FadeIn>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(18px,2.2vw,26px)',
              fontWeight: 500, lineHeight: 1.75,
              color: '#0A0A0A',
              maxWidth: 760, margin: '0 auto',
              letterSpacing: '-0.01em',
            }}>
              {project.description}
            </p>
          </FadeIn>
        </div>

        {/* ── PARA 1 + LEFT-BLEED IMAGE ── */}
        <div style={{ overflow: 'hidden', borderBottom: '1px solid #D0D0D0' }}>
          <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 'clamp(340px,45vw,600px)' }}>
            {/* Image bleeds to left edge */}
            <FadeIn style={{ flexBasis: 'calc(52% + clamp(40px,6vw,100px))', flexShrink: 0, overflow: 'hidden', background: '#0A0A0A',
              marginLeft: 'calc(-1px)', /* flush to border */ }}>
              <motion.img
                src={h1}
                alt=""
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setLightboxImg(h1)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'zoom-in' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </FadeIn>
            {/* Text */}
            <FadeIn delay={0.12} style={{ flex: 1, padding: `clamp(40px,5vw,72px) clamp(40px,6vw,100px) clamp(40px,5vw,72px) clamp(36px,4vw,60px)`,
              display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.3em', color: '#0047FF', marginBottom: 20 }}>
                01 — CONTEXT
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.95, color: '#4A4A4A', margin: 0 }}>
                {content.paragraphs[0]}
              </p>
            </FadeIn>
          </div>
        </div>

        {/* ── PARA 2 CENTERED ── */}
        <FadeIn>
          <div style={{ padding: `clamp(56px,7vh,96px) clamp(40px,6vw,100px)`, borderBottom: '1px solid #D0D0D0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(32px,4vw,64px)', alignItems: 'start', maxWidth: 880, margin: '0 auto' }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.3em', color: '#0047FF', marginBottom: 12 }}>02 — CONCEPT</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: '#E8E8E8' }}>
                  {project.title}
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: '#4A4A4A', margin: 0 }}>
                {content.paragraphs[1]}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ── FULL-BLEED IMAGE ── */}
        {h4 && (
          <FadeIn>
            <div style={{ overflow: 'hidden', background: '#0A0A0A', cursor: 'zoom-in' }} onClick={() => setLightboxImg(h4)}>
              <motion.img
                src={h4}
                alt=""
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', height: 'clamp(280px,38vw,580px)', objectFit: 'cover', display: 'block' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          </FadeIn>
        )}

        {/* ── PARA 3 + RIGHT-BLEED IMAGE ── */}
        {content.paragraphs[2] && (
          <div style={{ overflow: 'hidden', borderTop: '1px solid #D0D0D0', borderBottom: '1px solid #D0D0D0' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 'clamp(300px,42vw,540px)' }}>
              {/* Text */}
              <FadeIn style={{ flex: 1, padding: `clamp(40px,5vw,72px) clamp(36px,4vw,60px) clamp(40px,5vw,72px) clamp(40px,6vw,100px)`,
                display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.3em', color: '#0047FF', marginBottom: 20 }}>
                  03 — EXECUTION
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.95, color: '#4A4A4A', margin: 0 }}>
                  {content.paragraphs[2]}
                </p>
              </FadeIn>
              {/* Image bleeds to right edge */}
              <FadeIn delay={0.12} style={{ flexBasis: 'calc(48% + clamp(40px,6vw,100px))', flexShrink: 0, overflow: 'hidden', background: '#0A0A0A' }}>
                <motion.img
                  src={h2}
                  alt=""
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setLightboxImg(h2)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'zoom-in' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              </FadeIn>
            </div>
          </div>
        )}

        {/* ── SPECS STRIP ── */}
        <FadeIn>
          <div style={{ borderBottom: '1px solid #D0D0D0', display: 'flex' }}>
            {content.specs.map(([label, value], i) => (
              <div key={label} style={{
                flex: 1, padding: `clamp(24px,3vh,36px) clamp(20px,2.5vw,36px)`,
                borderRight: i < content.specs.length - 1 ? '1px solid #D0D0D0' : 'none',
              }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, letterSpacing: '0.25em', color: '#B0B0B0', marginBottom: 8 }}>
                  {label}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.01em' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── VIDEOS ── */}
        {content.videos && content.videos.length > 0 && (
          <div style={{ borderBottom: '1px solid #D0D0D0' }}>
            <FadeIn>
              <div style={{
                padding: `clamp(28px,3.5vh,44px) clamp(40px,6vw,100px) 0`,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
                letterSpacing: '0.3em', color: '#8C8C8C', marginBottom: 20,
              }}>
                IN MOTION — {content.videos.length}
              </div>
            </FadeIn>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(content.videos.length, 3)}, 1fr)`,
              gap: 2, paddingBottom: 2,
            }}>
              {content.videos.map((vid, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <video
                    autoPlay muted loop playsInline
                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', background: '#0A0A0A' }}
                  >
                    <source src={vid} type="video/mp4" />
                  </video>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* ── PROCESS — VERTICAL TIMELINE ── */}
        <div style={{ padding: `clamp(56px,7vh,96px) clamp(40px,6vw,100px)`, borderBottom: '1px solid #D0D0D0' }}>
          <FadeIn>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.3em', color: '#0047FF', marginBottom: 48 }}>
              PROCESS
            </div>
          </FadeIn>
          <div style={{ position: 'relative', paddingLeft: 32 }}>
            {/* vertical line */}
            <div style={{ position: 'absolute', left: 4, top: 8, bottom: 8, width: 1, background: '#E0E0E0' }} />
            {content.process.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.1}>
                <div style={{ display: 'flex', gap: 'clamp(32px,5vw,80px)', alignItems: 'flex-start', marginBottom: i < content.process.length - 1 ? 'clamp(36px,5vw,60px)' : 0, position: 'relative' }}>
                  {/* dot */}
                  <div style={{
                    position: 'absolute', left: -28, top: 5,
                    width: 9, height: 9, borderRadius: '50%',
                    background: i === 0 ? '#0047FF' : '#fff',
                    border: `2px solid ${i === 0 ? '#0047FF' : '#D0D0D0'}`,
                    flexShrink: 0,
                  }} />
                  {/* number */}
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.1em', color: '#C0C0C0', flexShrink: 0, paddingTop: 2 }}>
                    {step.num}
                  </div>
                  {/* content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 800, letterSpacing: '-0.025em', color: '#0A0A0A', marginBottom: 8 }}>
                      {step.title}
                    </div>
                    <p style={{ fontSize: 12, lineHeight: 1.8, color: '#8C8C8C', margin: 0, maxWidth: 520 }}>
                      {step.desc}
                    </p>
                  </div>
                  {/* step image for even steps */}
                  {i % 2 === 1 && content.galleryImages[Math.floor(i / 2)] && (
                    <div style={{ flexShrink: 0, width: 'clamp(120px,18vw,220px)', aspectRatio: '4/3', overflow: 'hidden', background: '#0A0A0A', cursor: 'zoom-in' }}
                      onClick={() => setLightboxImg(content.galleryImages[Math.floor(i / 2)])}>
                      <motion.img
                        src={content.galleryImages[Math.floor(i / 2)]}
                        alt=""
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* ── REMAINING IMAGES ── */}
        {content.galleryImages.length > 0 && (
          <div style={{ borderBottom: '1px solid #D0D0D0' }}>
            <FadeIn>
              <div style={{ padding: `clamp(32px,4vh,48px) clamp(40px,6vw,100px) 0`, fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.3em', color: '#8C8C8C', marginBottom: 24 }}>
                IMAGES — {content.galleryImages.length + 1}
              </div>
            </FadeIn>
            {/* Asymmetric 3-up layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 2, padding: '0 0 2px' }}>
              <FadeIn style={{ gridRow: '1 / 3', overflow: 'hidden', background: '#0A0A0A', cursor: 'zoom-in' }}
                onClick={() => setLightboxImg(h3)}>
                <motion.img src={h3} alt="" whileHover={{ scale: 1.03 }} transition={{ duration: 0.7 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 300 }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  onClick={() => setLightboxImg(h3)} />
              </FadeIn>
              {content.galleryImages.slice(0, 2).map((img, i) => (
                <FadeIn key={i} delay={0.08 * (i + 1)} style={{ overflow: 'hidden', background: '#0A0A0A', cursor: 'zoom-in' }}>
                  <motion.img src={img} alt="" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                    onClick={() => setLightboxImg(img)}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                </FadeIn>
              ))}
            </div>
            {/* Remaining in a row */}
            {content.galleryImages.length > 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${content.galleryImages.slice(2).length}, 1fr)`, gap: 2, marginTop: 2 }}>
                {content.galleryImages.slice(2).map((img, i) => (
                  <FadeIn key={i} delay={i * 0.06} style={{ overflow: 'hidden', background: '#0A0A0A', cursor: 'zoom-in' }}>
                    <motion.img src={img} alt="" whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }}
                      style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                      onClick={() => setLightboxImg(img)}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── NEXT PROJECT ── */}
        <FadeIn>
          <Link to={`/projects/${nextProject.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div
              style={{
                position: 'relative',
                height: 'clamp(200px, 28vw, 340px)',
                overflow: 'hidden',
                background: '#0A0A0A',
              }}
            >
              <motion.img
                src={nextProject.coverImage}
                alt={nextProject.title}
                initial={false}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.28, display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.3) 100%)',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                padding: `0 clamp(40px,6vw,100px)`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                    NEXT PROJECT
                  </div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(28px, 4.5vw, 60px)',
                    fontWeight: 900, letterSpacing: '-0.04em',
                    color: '#F8F8F6', lineHeight: 0.95,
                  }}>
                    {nextProject.title}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 10 }}>
                    {nextProject.subtitle}
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ fontSize: 40, color: '#0047FF', flexShrink: 0 }}
                >
                  →
                </motion.div>
              </div>
            </div>
          </Link>
        </FadeIn>

      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightboxImg(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(10,10,10,0.94)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
            backdropFilter: 'blur(6px)',
          }}
        >
          <motion.img
            src={lightboxImg}
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              maxWidth: '90vw', maxHeight: '88vh',
              objectFit: 'contain', display: 'block',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxImg(null)}
            style={{
              position: 'absolute', top: 24, right: 32,
              background: 'none', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9, letterSpacing: '0.2em', padding: '6px 14px',
              cursor: 'pointer', transition: 'border-color 0.2s',
            }}
          >
            CLOSE ✕
          </button>
        </motion.div>
      )}
    </PageWrapper>
  )
}
