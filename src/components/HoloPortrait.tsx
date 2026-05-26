import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  imageSrc?: string
  className?: string
  style?: React.CSSProperties
}

export default function HoloPortrait({
  imageSrc = '/images/portrait1.png',
  className,
  style,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let running = true

    // --- Renderer -----------------------------------------------------------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    const getSize = () => ({
      w: mount.clientWidth || window.innerWidth,
      h: mount.clientHeight || window.innerHeight,
    })
    let { w, h } = getSize()
    renderer.setSize(w, h)
    mount.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, {
      width: '100%',
      height: '100%',
      display: 'block',
      // CSS bloom substitute — no EffectComposer needed
      filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.35)) drop-shadow(0 0 22px rgba(0,229,255,0.15))',
    })

    // --- Scene & Camera -----------------------------------------------------
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.set(0, 0, 4.2)
    scene.add(camera)

    // --- Feathered base image shader ----------------------------------------
    const fadeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: null as THREE.Texture | null },
        uEdgeSoftness: { value: 0.15 },
      },
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTex;
        uniform float uEdgeSoftness;
        void main(){
          vec4 color = texture2D(uTex, vUv);
          // Exposure boost — lift before holographic overlay
          color.rgb = clamp(color.rgb * 1.28 + 0.04, 0.0, 1.0);
          float left   = smoothstep(0.0, uEdgeSoftness, vUv.x);
          float right  = 1.0 - smoothstep(1.0 - uEdgeSoftness, 1.0, vUv.x);
          float bottom = smoothstep(0.0, uEdgeSoftness, vUv.y);
          float top    = 1.0 - smoothstep(1.0 - uEdgeSoftness, 1.0, vUv.y);
          color.a *= left * right * bottom * top;
          gl_FragColor = color;
        }
      `,
    })

    // --- Holographic scanline shader ----------------------------------------
    const scanMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.26 },
        uTintA: { value: new THREE.Color(0x00e5ff) },
        uTintB: { value: new THREE.Color(0xff2959) },
        uTex: { value: null as THREE.Texture | null },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uTintA;
        uniform vec3 uTintB;
        uniform sampler2D uTex;

        float hash(float n){ return fract(sin(n)*43758.5453123); }

        void main(){
          vec4 portrait = texture2D(uTex, vUv);
          float alpha = portrait.a;
          if (alpha < 0.02) discard;

          float line  = step(0.95, fract(vUv.y*220.0));
          float sweep = smoothstep(0.0,1.0,sin(uTime*1.3 + vUv.y*10.0)*0.5+0.5);
          float band  = step(0.97, fract(vUv.y*12.0 + floor(uTime*0.8)));
          float flicker = 0.65 + 0.35*hash(floor(uTime*60.0));

          float r = line * (0.45 + 0.55*sweep);
          float g = line * 0.33 * flicker;
          float b = line * 0.6  * (1.0-sweep);

          vec3 tint = mix(uTintA, uTintB, 0.5 + 0.5*sin(uTime*0.5));
          vec3 col  = tint * vec3(r,g,b);
          col += tint * band * 0.25;

          gl_FragColor = vec4(col, alpha * uOpacity);
        }
      `,
    })

    // --- Load image ---------------------------------------------------------
    let base: THREE.Mesh | null = null
    let scan: THREE.Mesh | null = null

    const loader = new THREE.TextureLoader()
    loader.load(
      imageSrc,
      (t) => {
        if (!running) return
        t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)

        const iw = (t.image as HTMLImageElement).naturalWidth ?? (t.image as HTMLImageElement).width ?? 1
        const ih = (t.image as HTMLImageElement).naturalHeight ?? (t.image as HTMLImageElement).height ?? 1
        const aspect = iw / ih || 1

        const targetH = 2.65
        const geo = new THREE.PlaneGeometry(targetH * aspect, targetH)

        fadeMat.uniforms.uTex.value = t
        base = new THREE.Mesh(geo, fadeMat)
        scene.add(base)

        scanMat.uniforms.uTex.value = t
        scan = new THREE.Mesh(geo.clone(), scanMat)
        scan.position.z = 0.002
        scene.add(scan)
      },
      undefined,
      (e) => console.error('HoloPortrait texture error:', e)
    )

    // --- Interaction --------------------------------------------------------
    let targetRX = 0, targetRY = 0
    const onPointerMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      targetRY = ((e.clientX - cx) / cx) * 0.18
      targetRX = ((e.clientY - cy) / cy) * 0.18
    }
    window.addEventListener('pointermove', onPointerMove)

    // --- Animation loop -----------------------------------------------------
    const clock = new THREE.Clock()
    let time = 0
    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta()
      time += dt
      const floatY = Math.sin(time * 1.2) * 0.06

      if (base) {
        base.position.y = floatY
        base.rotation.x += (targetRX - base.rotation.x) * 0.06
        base.rotation.y += (targetRY - base.rotation.y) * 0.06
      }
      if (scan && base) {
        scan.position.y = floatY
        scan.rotation.copy(base.rotation)
        scanMat.uniforms.uTime.value = time
      }

      renderer.render(scene, camera)
    })

    // --- Resize -------------------------------------------------------------
    const onResize = () => {
      const size = getSize()
      w = size.w; h = size.h
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    // --- Cleanup ------------------------------------------------------------
    return () => {
      running = false
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      renderer.setAnimationLoop(null)
      base?.geometry.dispose()
      ;(base?.material as THREE.Material)?.dispose()
      scan?.geometry.dispose()
      ;(scan?.material as THREE.Material)?.dispose()
      fadeMat.dispose()
      scanMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement)
      }
    }
  }, [imageSrc])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  )
}
