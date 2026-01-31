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


const navLinks = Array.from(document.querySelectorAll(".nav-links .nav-link"))
const sectionIds = ["about","skills","projects","certs","contact"]
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean)

function setActiveNav(id){
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`))
}

if (sections.length){
  const navIo = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (visible && visible.target && visible.target.id) setActiveNav(visible.target.id)
  }, { threshold: [0.2, 0.35, 0.5, 0.65] })

  sections.forEach(s => navIo.observe(s))
}


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

  // ---- Particles Field (replaces knot + orb) ----
  const count = 12000
  const fieldPositions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++){
    const i3 = i * 3
    fieldPositions[i3 + 0] = (Math.random() - 0.5) * 18
    fieldPositions[i3 + 1] = (Math.random() - 0.5) * 10
    fieldPositions[i3 + 2] = (Math.random() - 0.5) * 18
  }

  const fieldGeo = new THREE.BufferGeometry()
  fieldGeo.setAttribute("position", new THREE.BufferAttribute(fieldPositions, 3))

  const fieldMat = new THREE.PointsMaterial({
    size: 0.02,
    transparent: true,
    opacity: 0.65
  })

  const field = new THREE.Points(fieldGeo, fieldMat)
  field.position.z = -3
  scene.add(field)

  // ---- Stars (keep) ----
  const starCount = 1800
  const starPositions = new Float32Array(starCount * 3)

  for (let i = 0; i < starCount; i++){
    const i3 = i * 3
    starPositions[i3 + 0] = (Math.random() - 0.5) * 22
    starPositions[i3 + 1] = (Math.random() - 0.5) * 14
    starPositions[i3 + 2] = -Math.random() * 40
  }

  const starsGeo = new THREE.BufferGeometry()
  starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))

  const starsMat = new THREE.PointsMaterial({
    color: 0xaac8ff,
    size: 0.02,
    transparent: true,
    opacity: 0.65
  })

  const stars = new THREE.Points(starsGeo, starsMat)
  scene.add(stars)

  // ---- Resize + Input ----
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

  // ---- Animate ----
  const animate = () => {
    t += 0.006

    const scrollFactor = clamp(scrollState.y / 1200, 0, 1)

    // particles motion
    field.rotation.y = t * 0.10
    field.rotation.x = t * 0.05
    field.position.x = mouse.x * 0.35
    field.position.y = mouse.y * 0.18
    field.position.z = -3 - scrollFactor * 1.2

    // camera subtle parallax
    camera.position.x = mouse.x * 0.18
    camera.position.y = 0.5 + mouse.y * 0.14

    // stars
    stars.rotation.y = t * 0.06
    stars.position.z = -scrollFactor * 6

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }

  animate()
}



(function () {
  const images = [
    "assets/feedback/feedback-01.jpg",
    "assets/feedback/feedback-02.jpg",
    "assets/feedback/feedback-03.jpg",
    "assets/feedback/feedback-04.jpg",
    "assets/feedback/feedback-05.jpg",
    "assets/feedback/feedback-06.jpg",
    "assets/feedback/feedback-07.jpg",
    "assets/feedback/feedback-08.jpg",
    "assets/feedback/feedback-09.jpg",
    "assets/feedback/feedback-10.jpg",
    "assets/feedback/feedback-11.jpg",
    "assets/feedback/feedback-12.jpg",
    "assets/feedback/feedback-13.jpg"
  ];

  const imgEl = document.getElementById("fbImg");
  const dotsEl = document.getElementById("fbDots");
  const prevBtn = document.querySelector(".fb-prev");
  const nextBtn = document.querySelector(".fb-next");

  if (!imgEl || !dotsEl || !prevBtn || !nextBtn) return;

  let i = 0;

  function renderDots() {
    dotsEl.innerHTML = "";
    images.forEach((_, idx) => {
      const d = document.createElement("span");
      d.className = "fb-dot" + (idx === i ? " is-active" : "");
      d.addEventListener("click", () => {
        i = idx;
        render();
      });
      dotsEl.appendChild(d);
    });
  }

  function render() {
    imgEl.src = images[i];
    renderDots();
  }

  function next() {
    i = (i + 1) % images.length;
    render();
  }

  function prev() {
    i = (i - 1 + images.length) % images.length;
    render();
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  let startX = 0;
  imgEl.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  imgEl.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if (Math.abs(dx) < 30) return;
    if (dx < 0) next();
    else prev();
  }, { passive: true });

  render();
})();
