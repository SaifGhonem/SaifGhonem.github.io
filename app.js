import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js"

const yearEl = document.getElementById("year")
if (yearEl) yearEl.textContent = String(new Date().getFullYear())

const navToggle = document.getElementById("navToggle")
const navMobile = document.getElementById("navMobile")

if (navToggle && navMobile){
  navToggle.addEventListener("click", () => {
    navMobile.classList.toggle("is-open")
  })

  navMobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => navMobile.classList.remove("is-open"))
  })
}

const revealEls = Array.from(document.querySelectorAll(".reveal"))
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-visible")
  })
}, { threshold: 0.12 })

revealEls.forEach(el => io.observe(el))

const tiltEls = Array.from(document.querySelectorAll(".tilt"))
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

tiltEls.forEach(el => {
  el.addEventListener("mousemove", (ev) => {
    const r = el.getBoundingClientRect()
    const x = (ev.clientX - r.left) / r.width
    const y = (ev.clientY - r.top) / r.height

    const rx = clamp((0.5 - y) * 10, -8, 8)
    const ry = clamp((x - 0.5) * 12, -10, 10)

    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`
  })

  el.addEventListener("mouseleave", () => {
    el.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)"
  })
})

const mount = document.getElementById("bg3d")

const supportsReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
if (mount && !supportsReduceMotion){
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200)
  camera.position.set(0, 0.5, 5.5)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  mount.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0xffffff, 0.55)
  scene.add(ambient)

  const key = new THREE.DirectionalLight(0xffffff, 0.9)
  key.position.set(3, 3, 2)
  scene.add(key)

  const rim = new THREE.DirectionalLight(0x88ccff, 0.55)
  rim.position.set(-4, 1, -2)
  scene.add(rim)

  const geo = new THREE.TorusKnotGeometry(1, 0.32, 220, 18)
  const mat = new THREE.MeshStandardMaterial({
    color: 0x9bb8ff,
    metalness: 0.55,
    roughness: 0.22,
    emissive: 0x112244,
    emissiveIntensity: 0.7
  })
  const knot = new THREE.Mesh(geo, mat)
  knot.position.set(1.3, 0.2, -1.6)
  scene.add(knot)

  const sphereGeo = new THREE.SphereGeometry(0.55, 48, 48)
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x7fffd4,
    metalness: 0.35,
    roughness: 0.25,
    emissive: 0x063323,
    emissiveIntensity: 0.75
  })
  const orb = new THREE.Mesh(sphereGeo, sphereMat)
  orb.position.set(-1.7, -0.35, -2.4)
  scene.add(orb)

  const starCount = 1800
  const positions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++){
    const i3 = i * 3
    positions[i3 + 0] = (Math.random() - 0.5) * 22
    positions[i3 + 1] = (Math.random() - 0.5) * 14
    positions[i3 + 2] = -Math.random() * 40
  }

  const starsGeo = new THREE.BufferGeometry()
  starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  const starsMat = new THREE.PointsMaterial({ color: 0xaac8ff, size: 0.02, transparent: true, opacity: 0.65 })
  const stars = new THREE.Points(starsGeo, starsMat)
  scene.add(stars)

  let t = 0
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener("resize", onResize)

  const mouse = { x: 0, y: 0 }
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1
  })

  const scrollState = { y: 0 }
  window.addEventListener("scroll", () => {
    scrollState.y = window.scrollY || 0
  }, { passive: true })

  const animate = () => {
    t += 0.006

    const scrollFactor = clamp(scrollState.y / 1200, 0, 1)

    knot.rotation.x += 0.004
    knot.rotation.y += 0.006
    knot.position.y = 0.2 + Math.sin(t) * 0.18 - scrollFactor * 0.35

    orb.rotation.y -= 0.005
    orb.position.y = -0.35 + Math.cos(t * 1.2) * 0.16 - scrollFactor * 0.25

    camera.position.x = mouse.x * 0.22
    camera.position.y = 0.5 + mouse.y * 0.16

    stars.rotation.y = t * 0.06
    stars.position.z = -scrollFactor * 6

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }

  animate()
}
