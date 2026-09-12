/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function themeInit() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored || (prefersLight ? 'light' : 'dark');

  root.setAttribute('data-theme', initial);
  toggle.setAttribute('aria-pressed', String(initial === 'light'));

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.setAttribute('aria-pressed', String(next === 'light'));
    if (window.__updateParticleColors) window.__updateParticleColors(next);
  });
})();

/* ============================================================
   MOBILE NAV
   ============================================================ */
(function navInit() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // scroll-spy
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-links a[data-nav]');
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navItems.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));
})();

/* ============================================================
   TYPEWRITER — hero terminal card
   ============================================================ */
(function typewriterInit() {
  const el = document.getElementById('typewriter');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const code = `const developer = {
  name: "Nguyễn Quốc Khánh",
  birthday: "12/05/2005",
  university: "HUFLIT",
  major: "Công nghệ thông tin",
  focus: ["Web", "Mobile"],
  status: "đang học & xây dựng"
};`;

  if (reduceMotion) {
    el.textContent = code;
    return;
  }

  let i = 0;
  function type() {
    if (i <= code.length) {
      el.textContent = code.slice(0, i);
      i += 2;
      setTimeout(type, 12);
    }
  }
  setTimeout(type, 500);
})();

/* ============================================================
   THREE.JS — ambient particle network background
   ============================================================ */
(function particleBackground() {
  const canvas = document.getElementById('bg-canvas');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 480;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const PARTICLE_COUNT = window.innerWidth < 720 ? 90 : 190;
  const SPREAD = 900;
  const LINK_DISTANCE = 110;

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * SPREAD;
    positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 0.6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD * 0.5;
    velocities.push({
      x: (Math.random() - 0.5) * 0.25,
      y: (Math.random() - 0.5) * 0.25,
      z: (Math.random() - 0.5) * 0.25,
    });
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  function colorFor(theme) {
    return theme === 'light' ? 0x0e9c90 : 0x5eead4;
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

  const pointsMat = new THREE.PointsMaterial({
    color: colorFor(currentTheme),
    size: 3.2,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  scene.add(points);

  const lineMat = new THREE.LineBasicMaterial({
    color: colorFor(currentTheme),
    transparent: true,
    opacity: 0.18,
  });
  const maxLineSegments = PARTICLE_COUNT * 8;
  const linePositions = new Float32Array(maxLineSegments * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  /* ---- floating 3D wireframe solids — the real WebGL centerpiece ---- */
  function colorForAccent2(theme) {
    return theme === 'light' ? 0x5b4fe0 : 0x7c6fff;
  }

  const wireGroup = new THREE.Group();

  const wireGeoA = new THREE.IcosahedronGeometry(95, 1);
  const wireMatA = new THREE.MeshBasicMaterial({
    color: colorFor(currentTheme), wireframe: true, transparent: true, opacity: 0.5,
  });
  const wireA = new THREE.Mesh(wireGeoA, wireMatA);
  wireA.position.set(150, 15, -60);
  wireGroup.add(wireA);

  const wireGeoB = new THREE.IcosahedronGeometry(48, 0);
  const wireMatB = new THREE.MeshBasicMaterial({
    color: colorForAccent2(currentTheme), wireframe: true, transparent: true, opacity: 0.42,
  });
  const wireB = new THREE.Mesh(wireGeoB, wireMatB);
  wireB.position.set(-195, -75, -30);
  wireGroup.add(wireB);

  scene.add(wireGroup);

  window.__updateParticleColors = function (theme) {
    pointsMat.color.setHex(colorFor(theme));
    lineMat.color.setHex(colorFor(theme));
    wireMatA.color.setHex(colorFor(theme));
    wireMatB.color.setHex(colorForAccent2(theme));
  };

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function updateLinks() {
    let idx = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < LINK_DISTANCE && idx < maxLineSegments) {
          linePositions[idx * 6] = positions[i * 3];
          linePositions[idx * 6 + 1] = positions[i * 3 + 1];
          linePositions[idx * 6 + 2] = positions[i * 3 + 2];
          linePositions[idx * 6 + 3] = positions[j * 3];
          linePositions[idx * 6 + 4] = positions[j * 3 + 1];
          linePositions[idx * 6 + 5] = positions[j * 3 + 2];
          idx++;
        }
      }
    }
    lineGeo.setDrawRange(0, idx * 2);
    lineGeo.attributes.position.needsUpdate = true;
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!reduceMotion) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        if (Math.abs(positions[i * 3]) > SPREAD / 2) velocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > SPREAD * 0.3) velocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > SPREAD * 0.25) velocities[i].z *= -1;
      }
      pointsGeo.attributes.position.needsUpdate = true;
      updateLinks();

      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollMax > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollMax)) : 0;
      wireA.rotation.x += 0.0021;
      wireA.rotation.y += 0.0031 + scrollProgress * 0.01;
      wireB.rotation.x -= 0.0017;
      wireB.rotation.y -= 0.0024 + scrollProgress * 0.008;
      wireGroup.position.y = -scrollProgress * 220;

      camera.position.x += (mouseX * 60 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 40 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    updateLinks();
    renderer.render(scene, camera);
  } else {
    animate();
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ============================================================
   CINEMATIC SCROLL LAYER
   Progressive enhancement: this IIFE is the only thing that ever
   adds the `js-ready` class. Every hiding/animating CSS rule in
   style.css is scoped under `.js-ready`, so if this script fails
   to load or run, the page simply stays fully visible and static.
   ============================================================ */
(function cinematicInit() {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('js-ready');

  /* ---- split a heading's text into maskable per-word spans ---- */
  function splitWords(el) {
    if (!el || el.dataset.split === 'done') return;
    el.dataset.split = 'done';
    Array.from(el.childNodes).forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const text = node.textContent;
      if (!text || !text.trim()) return;
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach((part) => {
        if (part === '') return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const line = document.createElement('span');
        line.className = 'split-line';
        const inner = document.createElement('span');
        inner.textContent = part;
        line.appendChild(inner);
        frag.appendChild(line);
      });
      el.replaceChild(frag, node);
    });
    el.querySelectorAll('.split-line > span').forEach((span, i) => {
      span.style.transitionDelay = (i * 0.045) + 's';
    });
  }

  document.querySelectorAll('.section .section-title').forEach(splitWords);
  const heroName = document.querySelector('.hero-name');
  if (heroName) splitWords(heroName);

  // Once each hero boot-in animation finishes, drop the class: fill-mode
  // "forwards" keeps holding the property afterwards (outranking any
  // inline style), which would otherwise silently block heroParallax
  // below from ever moving .hero-visual/.hero-text again.
  document.querySelectorAll('.boot-in').forEach((el) => {
    el.addEventListener('animationend', () => el.classList.remove('boot-in'), { once: true });
  });

  if (reduceMotion) {
    // Skip every scroll-linked / motion-based system entirely.
    // Content is revealed instantly via the CSS reduced-motion override.
    if (heroName) heroName.classList.add('split-in');
    return;
  }

  /* ---- hero headline mask-reveal, once on page load ---- */
  if (heroName) setTimeout(() => heroName.classList.add('split-in'), 260);

  /* ---- section wipe-in + content reveal, triggered once per section ---- */
  const sections = document.querySelectorAll('main .section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      sectionObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---- scroll progress rail + nav show/hide + back-to-top visibility ---- */
  const progressFill = document.getElementById('scroll-progress-fill');
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('back-to-top');
  let lastY = window.scrollY;
  let scrollTicking = false;

  function onScrollFrame() {
    scrollTicking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
    if (progressFill) progressFill.style.width = pct + '%';

    if (nav) {
      nav.classList.toggle('nav-scrolled', y > 8);
      if (y > lastY && y > 140) nav.classList.add('nav-hidden');
      else nav.classList.remove('nav-hidden');
    }
    if (backToTop) backToTop.classList.toggle('is-visible', y > window.innerHeight * 0.6);

    lastY = y;
  }
  window.addEventListener('scroll', () => {
    if (!scrollTicking) { requestAnimationFrame(onScrollFrame); scrollTicking = true; }
  }, { passive: true });
  onScrollFrame();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- desktop nav: sliding indicator follows the scroll-spy's active link ---- */
  const navLinksWrap = document.querySelector('.nav-links');
  const indicator = document.getElementById('nav-indicator');
  function moveIndicator() {
    if (!indicator || !navLinksWrap || window.innerWidth <= 720) {
      if (indicator) indicator.classList.remove('is-active');
      return;
    }
    const active = navLinksWrap.querySelector('a.active');
    if (!active) { indicator.classList.remove('is-active'); return; }
    const wrapRect = navLinksWrap.getBoundingClientRect();
    const linkRect = active.getBoundingClientRect();
    indicator.style.width = linkRect.width + 'px';
    indicator.style.transform = `translateX(${linkRect.left - wrapRect.left}px)`;
    indicator.classList.add('is-active');
  }
  if (navLinksWrap) {
    const indicatorMo = new MutationObserver(moveIndicator);
    navLinksWrap.querySelectorAll('a[data-nav]').forEach((a) => {
      indicatorMo.observe(a, { attributes: true, attributeFilter: ['class'] });
    });
  }
  window.addEventListener('resize', moveIndicator);
  setTimeout(moveIndicator, 400);

  /* ---- hero parallax depth ---- */
  const heroSection = document.querySelector('.hero');
  const heroText = document.querySelector('.hero-text');
  const heroVisual = document.querySelector('.hero-visual');
  if (heroSection && heroText && heroVisual) {
    let heroTicking = false;
    function heroParallax() {
      heroTicking = false;
      const rect = heroSection.getBoundingClientRect();
      const h = heroSection.offsetHeight || 1;
      const progress = Math.min(1, Math.max(0, -rect.top / h));
      heroText.style.transform = `translateY(${progress * 40}px)`;
      heroText.style.opacity = String(1 - progress * 0.9);
      heroVisual.style.transform = `translateY(${progress * 22}px)`;
      heroVisual.style.opacity = String(1 - progress * 0.75);
    }
    window.addEventListener('scroll', () => {
      if (!heroTicking) { requestAnimationFrame(heroParallax); heroTicking = true; }
    }, { passive: true });
    heroParallax();
  }

  /* ---- magnetic buttons + subtle panel tilt, fine-pointer devices only ---- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    document.querySelectorAll('.skill-card, .project-card, .edu-card, .terminal').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${py * -5}deg) rotateY(${px * 6}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }
})();
