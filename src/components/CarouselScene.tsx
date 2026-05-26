import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { mainProjects } from '../data/projects'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const PANEL_HEIGHT = 1.4
const GAP = 0.55

interface Props {
  onHoverChange: (id: string | null) => void
}

export default function CarouselScene({ onHoverChange }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)
  const onHoverRef = useRef(onHoverChange)

  useEffect(() => { navigateRef.current = navigate }, [navigate])
  useEffect(() => { onHoverRef.current = onHoverChange }, [onHoverChange])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const items = mainProjects.map(p => ({
      src: p.coverImage,
      id: p.id,
      href: `/projects/${p.id}`,
    }))

    // --- scene setup --------------------------------------------------------
    const scene = new THREE.Scene()
    const ringGroup = new THREE.Group()
    scene.add(ringGroup)
    const ringPanels: THREE.Group[] = []

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const getSize = () => ({ w: mount.clientWidth || 800, h: mount.clientHeight || 600 })
    const { w, h } = getSize()
    renderer.setSize(w, h)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.cursor = 'grab'

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.01, 2000)
    camera.position.set(0, 0, 6)

    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(2, 4, 5)
    scene.add(dir)

    // --- post-processing: outline pass --------------------------------------
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))

    const outlinePass = new OutlinePass(new THREE.Vector2(w, h), scene, camera)
    outlinePass.edgeStrength = 4
    outlinePass.edgeGlow = 0.5
    outlinePass.edgeThickness = 2
    outlinePass.visibleEdgeColor.set('#0055ff')
    outlinePass.hiddenEdgeColor.set('#001a66')
    composer.addPass(outlinePass)
    composer.addPass(new OutputPass())

    // --- async: load textures & build carousel ------------------------------
    let running = true
    let innerCleanup: (() => void) | null = null

    const loader = new THREE.TextureLoader()
    const loadAsync = (url: string) =>
      new Promise<THREE.Texture>((res, rej) => loader.load(url, res, undefined, rej))

    ;(async () => {
      try {
        const textures = await Promise.all(items.map(i => loadAsync(i.src)))
        if (!running) return

        textures.forEach(t => {
          t.colorSpace = THREE.SRGBColorSpace
          t.anisotropy = renderer.capabilities.getMaxAnisotropy()
          t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
        })

        const widths = textures.map(t => {
          const img = t.image as { naturalWidth?: number; naturalHeight?: number; width: number; height: number }
          const iw = img.naturalWidth ?? img.width
          const ih = img.naturalHeight ?? img.height
          return PANEL_HEIGHT * ((iw / ih) || 1)
        })

        const N = items.length
        const totalLinear = widths.reduce((a, b) => a + b, 0) + N * GAP
        const radius = totalLinear / (Math.PI * 2)

        // fit camera to ring
        const ringDiameter = 2 * radius + PANEL_HEIGHT
        const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5)
        const dist = Math.max(
          (ringDiameter * 0.5) / Math.tan(halfFov),
          (ringDiameter * 0.5) / (Math.tan(halfFov) * camera.aspect)
        ) * 1.15
        camera.position.set(0, 0, dist)
        camera.near = Math.max(0.01, dist / 100)
        camera.far = dist * 100
        camera.updateProjectionMatrix()

        // build panels
        const pickTargets: THREE.Mesh[] = []
        let thetaCursor = 0

        for (let i = 0; i < N; i++) {
          const panelWidth = widths[i]
          const thetaLen = panelWidth / radius

          const geom = new THREE.CylinderGeometry(
            radius, radius, PANEL_HEIGHT,
            64, 1, true,
            thetaCursor, thetaLen
          )

          const mesh = new THREE.Mesh(
            geom,
            new THREE.MeshBasicMaterial({
              side: THREE.DoubleSide,
              map: textures[i],
            })
          )

          const group = new THREE.Group()
          group.add(mesh)
          group.userData = { href: items[i].href, id: items[i].id }
          ringGroup.add(group)
          pickTargets.push(mesh)
          ringPanels.push(group)

          thetaCursor += thetaLen + GAP / radius
        }

        // slight tilt for editorial feel
        scene.rotation.z = THREE.MathUtils.degToRad(10)

        // --- interaction state --------------------------------------------
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()
        let hoveredGroup: THREE.Group | null = null
        let isDragging = false
        let hasDragged = false
        let previousMouseX = 0
        let dragDelta = 0
        let scrollDelta = 0
        const DRAG_SENSITIVITY = 0.006
        const SCROLL_SENSITIVITY = 0.0018
        const SMOOTHNESS = 0.09

        const setMouse = (clientX: number, clientY: number) => {
          const rect = renderer.domElement.getBoundingClientRect()
          mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1
          mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1
        }

        const updateHover = () => {
          raycaster.setFromCamera(mouse, camera)
          const hits = raycaster.intersectObjects(pickTargets, false)
          const hit = hits[0]?.object as THREE.Mesh | undefined
          const newGroup = hit ? (hit.parent as THREE.Group) : null
          if (newGroup !== hoveredGroup) {
            hoveredGroup = newGroup
            renderer.domElement.style.cursor = hoveredGroup ? 'pointer' : 'grab'
            onHoverRef.current(hoveredGroup?.userData.id ?? null)
            outlinePass.selectedObjects = hoveredGroup ? [hoveredGroup] : []
          }
        }

        // mouse events
        const onPointerMove = (e: MouseEvent) => {
          if (isDragging) {
            const dx = e.clientX - previousMouseX
            if (Math.abs(dx) > 2) hasDragged = true
            dragDelta += dx * DRAG_SENSITIVITY
            previousMouseX = e.clientX
          } else {
            setMouse(e.clientX, e.clientY)
            updateHover()
          }
        }

        const onMouseDown = (e: MouseEvent) => {
          isDragging = true
          hasDragged = false
          previousMouseX = e.clientX
          renderer.domElement.style.cursor = 'grabbing'
        }

        const onMouseUp = () => {
          isDragging = false
          renderer.domElement.style.cursor = hoveredGroup ? 'pointer' : 'grab'
        }

        const onClick = (e: MouseEvent) => {
          if (hasDragged) { hasDragged = false; return }
          setMouse(e.clientX, e.clientY)
          raycaster.setFromCamera(mouse, camera)
          const hits = raycaster.intersectObjects(pickTargets, false)
          const hit = hits[0]?.object as THREE.Mesh | undefined
          if (hit) {
            const href = (hit.parent as THREE.Group).userData.href as string
            if (href) navigateRef.current(href)
          }
        }

        const onWheel = (e: WheelEvent) => {
          e.preventDefault()
          scrollDelta += e.deltaY * SCROLL_SENSITIVITY
        }

        // touch events
        let isTouching = false
        let prevTouchX = 0
        let touchStartPos = { x: 0, y: 0 }
        let touchMoved = false

        const onTouchStart = (e: TouchEvent) => {
          e.preventDefault()
          isTouching = true
          touchMoved = false
          prevTouchX = e.touches[0].clientX
          touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }

        const onTouchMove = (e: TouchEvent) => {
          if (!isTouching) return
          e.preventDefault()
          const dx = e.touches[0].clientX - prevTouchX
          const dist2 = Math.hypot(
            e.touches[0].clientX - touchStartPos.x,
            e.touches[0].clientY - touchStartPos.y
          )
          if (dist2 > 8) { touchMoved = true; dragDelta += dx * DRAG_SENSITIVITY }
          prevTouchX = e.touches[0].clientX
        }

        const onTouchEnd = (e: TouchEvent) => {
          if (!touchMoved) {
            const t = e.changedTouches[0]
            setMouse(t.clientX, t.clientY)
            raycaster.setFromCamera(mouse, camera)
            const hits = raycaster.intersectObjects(pickTargets, false)
            const hit = hits[0]?.object as THREE.Mesh | undefined
            if (hit) {
              const href = (hit.parent as THREE.Group).userData.href as string
              if (href) navigateRef.current(href)
            }
          }
          isTouching = false
          touchMoved = false
        }

        const el = renderer.domElement
        el.addEventListener('pointermove', onPointerMove)
        el.addEventListener('mousedown', onMouseDown)
        el.addEventListener('mouseup', onMouseUp)
        el.addEventListener('mouseleave', onMouseUp)
        el.addEventListener('click', onClick)
        el.addEventListener('wheel', onWheel, { passive: false })
        el.addEventListener('touchstart', onTouchStart, { passive: false })
        el.addEventListener('touchmove', onTouchMove, { passive: false })
        el.addEventListener('touchend', onTouchEnd, { passive: false })

        const onResize = () => {
          const { w: nw, h: nh } = getSize()
          renderer.setSize(nw, nh)
          composer.setSize(nw, nh)
          camera.aspect = nw / nh
          camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', onResize)

        // --- load-in spin deceleration ------------------------------------
        const loadStart = Date.now()
        const DEC_DURATION = 3200
        const MAX_SPEED = 0.016
        const BASE_SPEED = 0.0006

        renderer.setAnimationLoop(() => {
          const elapsed = Date.now() - loadStart
          const t = Math.min(elapsed / DEC_DURATION, 1)
          const loadSpeed = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * Math.exp(-5 * t)

          ringGroup.rotation.y += loadSpeed + dragDelta * SMOOTHNESS + scrollDelta * SMOOTHNESS
          dragDelta *= (1 - SMOOTHNESS)
          scrollDelta *= (1 - SMOOTHNESS)

          for (const g of ringPanels) {
            const target = g === hoveredGroup ? 1.07 : 1.0
            const s = g.scale.x + (target - g.scale.x) * 0.12
            g.scale.setScalar(s)
          }

          composer.render()
        })

        innerCleanup = () => {
          renderer.setAnimationLoop(null)
          window.removeEventListener('resize', onResize)
          el.removeEventListener('pointermove', onPointerMove)
          el.removeEventListener('mousedown', onMouseDown)
          el.removeEventListener('mouseup', onMouseUp)
          el.removeEventListener('mouseleave', onMouseUp)
          el.removeEventListener('click', onClick)
          el.removeEventListener('wheel', onWheel as EventListener)
          el.removeEventListener('touchstart', onTouchStart as EventListener)
          el.removeEventListener('touchmove', onTouchMove as EventListener)
          el.removeEventListener('touchend', onTouchEnd as EventListener)
          ringPanels.forEach(g =>
            g.children.forEach(c => {
              const m = c as THREE.Mesh
              ;(m.material as THREE.Material).dispose()
              m.geometry.dispose()
            })
          )
          textures.forEach(t => t.dispose())
        }
      } catch (err) {
        console.error('CarouselScene error:', err)
      }
    })()

    return () => {
      running = false
      innerCleanup?.()
      renderer.setAnimationLoop(null)
      renderer.dispose()
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
