import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';

// --- 1. الـ 3D Background Engine ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const bgContainer = document.getElementById('bg3d');

if (bgContainer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    bgContainer.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const count = 8000; // عدد جزيئات متوازن للأداء
    const posArray = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 12;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({ size: 0.005, color: 0x78a0ff, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 3;

    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 2. نظام الـ Navigation (شغال في كل الصفحات) ---
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
        navMobile.classList.toggle('is-open');
    });
    // إغلاق المنيو عند الضغط على أي رابط
    navMobile.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navMobile.classList.remove('is-open'));
    });
}

// --- 3. تأثير الـ Tilt العالمي (Event Delegation) ---
// ده هيخلي الكروت اللي بتظهر في صفحة الشهادات والمشاريع تميل معاك تلقائياً
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

document.addEventListener('mousemove', (e) => {
    const target = e.target.closest('.tilt');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rx = clamp((0.5 - y) * 10, -8, 8);
    const ry = clamp((x - 0.5) * 12, -10, 10);

    target.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
});

document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('.tilt');
    if (target) {
        target.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
    }
});

// --- 4. تحديث السنة تلقائياً ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- 5. تأثير الظهور التدريجي (Scroll Reveal) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
