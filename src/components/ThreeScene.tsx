import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface ThreeSceneProps {
  className?: string
  style?: React.CSSProperties
}

export default function ThreeScene({ className, style }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = null

    // Camera
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.set(0, 0, 4)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Grid geometry — a technical wireframe torus knot
    const geometry = new THREE.TorusKnotGeometry(1, 0.28, 120, 16)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0047ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })
    const solidMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.04,
    })
    const wireKnot = new THREE.Mesh(geometry, wireMat)
    const solidKnot = new THREE.Mesh(geometry, solidMat)
    scene.add(wireKnot, solidKnot)

    // Floating particles
    const particleCount = 300
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x0047ff,
      size: 0.02,
      transparent: true,
      opacity: 0.5,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // Outer ring — a technical frame
    const ringGeo = new THREE.RingGeometry(1.6, 1.62, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0047ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    scene.add(ring)

    // Second ring rotated
    const ring2Geo = new THREE.RingGeometry(1.9, 1.91, 64)
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x0047ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
    })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.x = Math.PI * 0.3
    scene.add(ring2)

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
      }
    }
    mount.addEventListener('mousemove', onMouseMove)
    // Also track globally for parallax
    window.addEventListener('mousemove', (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    })

    // Animation
    let frame = 0
    const animate = () => {
      frame++
      const t = frame * 0.005

      wireKnot.rotation.x = t * 0.3 + mouseRef.current.y * 0.15
      wireKnot.rotation.y = t * 0.5 + mouseRef.current.x * 0.15
      solidKnot.rotation.copy(wireKnot.rotation)

      ring.rotation.z = t * 0.2
      ring2.rotation.z = -t * 0.15
      ring2.rotation.y = t * 0.1 + mouseRef.current.x * 0.05

      particles.rotation.y = t * 0.05
      particles.rotation.x = t * 0.02

      // Subtle camera parallax
      camera.position.x += (mouseRef.current.x * 0.3 - camera.position.x) * 0.04
      camera.position.y += (mouseRef.current.y * 0.2 - camera.position.y) * 0.04
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    // Resize
    const onResize = () => {
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      mount.removeEventListener('mousemove', onMouseMove)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  )
}
