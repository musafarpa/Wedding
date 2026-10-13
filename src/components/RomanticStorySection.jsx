import React, { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { Sparkles, Heart } from 'lucide-react';
import './RomanticStorySection.css';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   CONFIG OBJECT (Top of file)
───────────────────────────────────────────────────────────────── */
export const STORY_CONFIG = {
  palette: {
    cream: '#F7F2E7',
    deepGreen: '#0F3B2E',
    gold: '#C9A24B',
    goldLight: '#E8D296',
    goldDark: '#8C6F2A',
  },
  marquee: {
    speed: 0.05,        // xPercent per frame idle
    velocityBoost: 0.003,
    skewMax: 6,
  },
  particleCount: {
    mobile: 8,
    desktop: 20,
  },
  durations: {
    fade: 500,
  },
};

/* ─────────────────────────────────────────────────────────────────
   CHAPTERS DATA
───────────────────────────────────────────────────────────────── */
const CHAPTERS = [
  {
    id: 'ch0',
    label: 'Chapter I',
    period: 'Spring 2023',
    year: '2023',
    title: 'First Glimpse by the Lake',
    location: 'Vembanad Backwaters, Kerala',
    text: 'Under the golden glow of a Kerala sunset, two wandering souls met by the tranquil backwaters. What began as a gentle glance blossomed into an unspoken connection written in the stars.',
    keywords: 'VEMBANAD BACKWATERS • SUNSET • FIRST GLANCE',
    accent: 'Traditional Kasavu Weave & Jasmine',
    image: '/frames/ezgif-frame-001.jpg',
    objectPosition: 'center 32%',
    textLeft: true,
  },
  {
    id: 'ch1',
    label: 'Chapter II',
    period: 'Monsoon 2024',
    year: '2024',
    title: 'The Jasmine Promise',
    location: 'The Heritage Courtyard',
    text: 'With a fragrant white blossom and hearts beating in sync, a heartfelt promise was exchanged. In the courtyard of ancient heritage, they vowed to walk through all seasons hand-in-hand.',
    keywords: 'JASMINE • COURTYARD • THE PROMISE',
    accent: 'A Promise of Sacred Devotion',
    image: '/frames/ezgif-frame-090.jpg',
    objectPosition: 'center 22%',
    textLeft: false,
  },
  {
    id: 'ch2',
    label: 'Chapter III',
    period: 'December 2026',
    year: '2026',
    title: 'Toward Sacred Forever',
    location: 'Kumarakom Lake Resort',
    text: 'Dressed in handwoven Kerala kasavu and golden ornaments, they prepare to step into the sacred circle around the nilavilakku, sealing two lifetimes into one eternal bond.',
    keywords: 'KASAVU • NILAVILAKKU • FOREVER',
    accent: 'Two Lifetimes Sealed into One',
    image: '/frames/ezgif-frame-180.jpg',
    objectPosition: 'center 28%',
    textLeft: true,
  },
];

/* ─────────────────────────────────────────────────────────────────
   AUSPICIOUS VECTOR SVGS (NO EMOJI GLYPHS)
───────────────────────────────────────────────────────────────── */
const NilavilakkuSVG = ({ size = 22, lit = false }) => (
  <svg
    width={size}
    height={size * 1.55}
    viewBox="0 0 32 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: 'visible', display: 'inline-block', verticalAlign: 'middle' }}
    aria-hidden="true"
  >
    <ellipse cx="16" cy="46" rx="9" ry="2.2" fill="#8C6F2A" />
    <path d="M8 46 Q16 43 24 46 L22 43 Q16 41 10 43Z" fill="#C9A24B" />
    <rect x="14.5" y="27" width="3" height="16" rx="1.5" fill="#A88432" />
    <ellipse cx="16" cy="27" rx="5" ry="1.6" fill="#C9A24B" />
    <ellipse cx="16" cy="36" rx="4" ry="1.3" fill="#E8D296" />
    <path d="M6 25 Q16 29 26 25 L24 22 Q16 24 8 22Z" fill="#C9A24B" />
    <ellipse cx="16" cy="22" rx="9.5" ry="2.2" fill="#E8D296" />
    <path d="M14.5 22 L16 15 L17.5 22Z" fill="#C9A24B" />
    <ellipse cx="16" cy="15" rx="1.8" ry="0.9" fill="#E8D296" />
    {lit && (
      <g>
        <ellipse cx="16" cy="10" rx="3.5" ry="6" fill="url(#nil_fg)" opacity="0.95" />
        <ellipse cx="16" cy="11" rx="1.5" ry="3.2" fill="#FFFDE8" />
      </g>
    )}
    <defs>
      <radialGradient id="nil_fg" cx="50%" cy="65%" r="55%">
        <stop offset="0%" stopColor="#FFF5A0" />
        <stop offset="45%" stopColor="#FFB020" />
        <stop offset="90%" stopColor="#E64000" stopOpacity="0.5" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

const LotusSVG = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: 'visible', display: 'inline-block', verticalAlign: 'middle' }}
    aria-hidden="true"
  >
    <path
      d="M16 4 C14 10 10 16 16 26 C22 16 18 10 16 4 Z"
      fill="#E8D296"
      stroke="#C9A24B"
      strokeWidth="1.2"
    />
    <path
      d="M16 14 C11 16 6 20 10 26 C15 26 16 20 16 14 Z"
      fill="#C9A24B"
      stroke="#8C6F2A"
      strokeWidth="1"
    />
    <path
      d="M16 14 C21 16 26 20 22 26 C17 26 16 20 16 14 Z"
      fill="#C9A24B"
      stroke="#8C6F2A"
      strokeWidth="1"
    />
    <path
      d="M16 18 C7 20 3 24 8 28 C14 28 16 24 16 18 Z"
      fill="#E8D296"
      opacity="0.85"
    />
    <path
      d="M16 18 C25 20 29 24 24 28 C18 28 16 24 16 18 Z"
      fill="#E8D296"
      opacity="0.85"
    />
  </svg>
);

export default function RomanticStorySection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const quoteRef = useRef(null);
  const marqueeRef = useRef(null);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);
  const pinRef = useRef(null);
  const stageRef = useRef(null);
  const chapterRefs = useRef([]);
  const photoRefs = useRef([]);
  const lineRef = useRef(null);
  const nodeRefs = useRef([]);
  const canvasRef = useRef(null);
  const endSentenceRef = useRef(null);

  // Measure dynamic navbar height and set --nav-h on :root
  useEffect(() => {
    const updateNavH = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        const h = nav.offsetHeight;
        document.documentElement.style.setProperty('--nav-h', `${h}px`);
      }
    };

    updateNavH();
    const nav = document.querySelector('nav');
    let ro;
    if (nav && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateNavH());
      ro.observe(nav);
    }
    window.addEventListener('resize', updateNavH);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateNavH);
    };
  }, []);

  // MAIN GSAP SCROLL ENGINE
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const isMobile = window.innerWidth <= 768;
    const getNavH = () => {
      const val = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      return isNaN(val) || val <= 0 ? 72 : val;
    };

    let tickerFn;
    let marqueeObs;

    // Use gsap.context to make the entire timeline safe under React StrictMode
    const ctx = gsap.context(() => {
      // ─────────────────────────────────────────────────────────────
      // 1. HEADER QUOTE REVEAL TRIGGER
      // ─────────────────────────────────────────────────────────────
      const quoteWords = quoteRef.current?.querySelectorAll('.story-quote-word');
      if (quoteWords && quoteWords.length > 0) {
        gsap.to(quoteWords, {
          scrollTrigger: {
            id: 'story-quote',
            trigger: quoteRef.current,
            start: 'top 85%',
            end: 'bottom 65%',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
          opacity: 1,
          color: '#0F3B2E',
          stagger: 0.05,
          onComplete: () => {
            const underline = quoteRef.current?.querySelector('.story-quote-underline');
            if (underline) underline.classList.add('active');
          },
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 2. MARQUEE SCROLLTRIGGER & TICKER LOOP
      // ─────────────────────────────────────────────────────────────
      const track1 = track1Ref.current;
      const track2 = track2Ref.current;
      let marqueeVisible = true;
      let pos1 = 0;
      let pos2 = 0;
      let currentSkew = 0;

      // Pause when marquee is off screen
      marqueeObs = new IntersectionObserver(
        ([entry]) => {
          marqueeVisible = entry.isIntersecting;
        },
        { threshold: 0.01 }
      );
      if (marqueeRef.current) marqueeObs.observe(marqueeRef.current);

      tickerFn = () => {
        try {
          if (!marqueeVisible || !track1 || !track2) return;

          // Read scroll velocity safely from lenis or 0
          const velocity = (window.lenis && typeof window.lenis.velocity === 'number') ? window.lenis.velocity : 0;

          // Idle drift + velocity contribution
          pos1 -= STORY_CONFIG.marquee.speed + velocity * STORY_CONFIG.marquee.velocityBoost;
          pos2 += STORY_CONFIG.marquee.speed + velocity * STORY_CONFIG.marquee.velocityBoost;

          // Seamless -50% to 0% wrap for duplicated track
          if (pos1 <= -50) pos1 += 50;
          if (pos1 > 0) pos1 -= 50;

          if (pos2 >= 0) pos2 -= 50;
          if (pos2 < -50) pos2 += 50;

          // Skew clamped between -6 and +6 degrees, eased back to 0
          const targetSkew = Math.max(-STORY_CONFIG.marquee.skewMax, Math.min(STORY_CONFIG.marquee.skewMax, velocity * 0.003));
          currentSkew += (targetSkew - currentSkew) * 0.12;

          gsap.set(track1, { xPercent: pos1, skewX: currentSkew });
          gsap.set(track2, { xPercent: pos2, skewX: -currentSkew });
        } catch {
          // Safeguard ticker
        }
      };

      gsap.ticker.add(tickerFn);

      // ─────────────────────────────────────────────────────────────
      // 3. PINNED MASTER TIMELINE (#story-main)
      // ─────────────────────────────────────────────────────────────
      const chs = chapterRefs.current.filter(Boolean);
      if (chs.length > 0 && pinRef.current) {
        // Initial state: Chapter 0 active, others invisible
        gsap.set(chs[0], { autoAlpha: 1, y: 0, zIndex: 2 });
        gsap.set(chs.slice(1), { autoAlpha: 0, y: 35, zIndex: 1 });

        // Timeline rail initial state
        if (nodeRefs.current[0]) gsap.set(nodeRefs.current[0], { opacity: 1, scale: 1.1 });
        if (nodeRefs.current[1]) gsap.set(nodeRefs.current[1], { opacity: 0.5, scale: 1 });
        if (nodeRefs.current[2]) gsap.set(nodeRefs.current[2], { opacity: 0.5, scale: 1 });
        if (lineRef.current) gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top center' });

        const ch0Words = chs[0]?.querySelectorAll('.ch-word');
        const ch1Words = chs[1]?.querySelectorAll('.ch-word');
        const ch2Words = chs[2]?.querySelectorAll('.ch-word');

        // Master Timeline pinned
        const master = gsap.timeline({
          scrollTrigger: {
            id: 'story-main',
            trigger: pinRef.current,
            start: () => `top top+=${getNavH()}`,
            end: isMobile ? '+=250%' : '+=300%',
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 3 Segment timeline (0 to 1, 1 to 2, 2 to 3)
        // HOLD PHASE: 0-15% enter, 15-85% hold, 85-100% exit
        const SEG = 1;

        /* === SEGMENT 1: CHAPTER I (0.00 → 1.00) === */
        master.addLabel('ch0-start', 0);
        if (photoRefs.current[0]) {
          master.to(photoRefs.current[0], { scale: 1.05, ease: 'none', duration: SEG }, 0);
        }
        if (ch0Words) {
          // 100% filled by 60% of chapter range
          master.to(ch0Words, { color: '#0F3B2E', stagger: 0.015, duration: 0.6, ease: 'none' }, 0);
        }
        if (lineRef.current) {
          master.to(lineRef.current, { scaleY: 0.5, ease: 'none', duration: SEG }, 0);
        }

        // Crossfade Chapter 0 → Chapter 1 (at 0.85 → 1.00)
        master
          .to(chs[0], { autoAlpha: 0, y: -30, duration: 0.15, ease: 'power2.in' }, 0.85)
          .set(chs[0], { zIndex: 1 }, 1.0)
          .set(chs[1], { zIndex: 2 }, 0.85)
          .to(chs[1], { autoAlpha: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.85);

        if (nodeRefs.current[0]) {
          master.to(nodeRefs.current[0], { opacity: 0.5, scale: 1, duration: 0.1 }, 0.9);
        }
        if (nodeRefs.current[1]) {
          master.to(nodeRefs.current[1], { opacity: 1, scale: 1.1, duration: 0.1 }, 0.9);
        }

        /* === SEGMENT 2: CHAPTER II (1.00 → 2.00) === */
        master.addLabel('ch1-start', 1);
        if (photoRefs.current[1]) {
          master.to(photoRefs.current[1], { scale: 1.05, ease: 'none', duration: SEG }, 1);
        }
        if (ch1Words) {
          master.to(ch1Words, { color: '#0F3B2E', stagger: 0.015, duration: 0.6, ease: 'none' }, 1);
        }
        if (lineRef.current) {
          master.to(lineRef.current, { scaleY: 1.0, ease: 'none', duration: SEG }, 1);
        }

        // Crossfade Chapter 1 → Chapter 2 (at 1.85 → 2.00)
        master
          .to(chs[1], { autoAlpha: 0, y: -30, duration: 0.15, ease: 'power2.in' }, 1.85)
          .set(chs[1], { zIndex: 1 }, 2.0)
          .set(chs[2], { zIndex: 2 }, 1.85)
          .to(chs[2], { autoAlpha: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 1.85);

        if (nodeRefs.current[1]) {
          master.to(nodeRefs.current[1], { opacity: 0.5, scale: 1, duration: 0.1 }, 1.9);
        }
        if (nodeRefs.current[2]) {
          master.to(nodeRefs.current[2], { opacity: 1, scale: 1.1, duration: 0.1 }, 1.9);
        }

        /* === SEGMENT 3: CHAPTER III (2.00 → 3.00) === */
        master.addLabel('ch2-start', 2);
        if (photoRefs.current[2]) {
          master.to(photoRefs.current[2], { scale: 1.05, ease: 'none', duration: SEG }, 2);
        }
        if (ch2Words) {
          master.to(ch2Words, { color: '#0F3B2E', stagger: 0.015, duration: 0.6, ease: 'none' }, 2);
        }
      }

      // ─────────────────────────────────────────────────────────────
      // 4. SECTION END SENTENCE REVEAL (Outside Pin)
      // ─────────────────────────────────────────────────────────────
      const endWords = endSentenceRef.current?.querySelectorAll('.story-end-word');
      if (endWords && endWords.length > 0) {
        gsap.to(endWords, {
          scrollTrigger: {
            id: 'story-end',
            trigger: endSentenceRef.current,
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
          opacity: 1,
          y: 0,
          color: '#0F3B2E',
          stagger: 0.06,
        });
      }
    }, sectionRef);

    // After mount, wait for fonts & chapter images to decode before calling refresh
    Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      ...CHAPTERS.map(
        (ch) =>
          new Promise((res) => {
            const img = new Image();
            img.src = ch.image;
            if (img.decode) {
              img.decode().then(res).catch(res);
            } else {
              img.onload = img.onerror = res;
            }
          })
      ),
    ]).then(() => {
      ScrollTrigger.refresh();
    });

    // Debounced window resize handler
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (tickerFn) gsap.ticker.remove(tickerFn);
      if (marqueeObs) marqueeObs.disconnect();
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, []);

  // Photo 3D Tilt handler
  const handleTilt = (e, idx) => {
    const wrap = photoRefs.current[idx]?.parentElement;
    if (!wrap || window.innerWidth < 992) return;
    const r = wrap.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
    gsap.to(wrap, { rotateX: rx, rotateY: ry, scale: 1.02, duration: 0.25, ease: 'power2.out', transformPerspective: 900 });
  };

  const resetTilt = (idx) => {
    const wrap = photoRefs.current[idx]?.parentElement;
    if (!wrap) return;
    gsap.to(wrap, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.45, ease: 'power3.out' });
  };

  // THREE.JS Ambient Canvas (Petals & Golden Fireflies)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;
    const N = isMobile ? STORY_CONFIG.particleCount.mobile : STORY_CONFIG.particleCount.desktop;

    let renderer, raf;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    cam.position.z = 24;

    const mkTex = (draw) => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d');
      draw(ctx);
      return new THREE.CanvasTexture(c);
    };

    const petalTex = mkTex((ctx) => {
      const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 28);
      g.addColorStop(0, 'rgba(255,255,255,0.95)');
      g.addColorStop(0.6, 'rgba(255,250,235,0.7)');
      g.addColorStop(1, 'rgba(255,245,220,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(32, 32, 28, 0, Math.PI * 2);
      ctx.fill();
    });

    const fireflyTex = mkTex((ctx) => {
      const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
      g.addColorStop(0, 'rgba(255,245,170,1)');
      g.addColorStop(0.4, 'rgba(201,162,75,0.6)');
      g.addColorStop(1, 'rgba(201,162,75,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fill();
    });

    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(N * 3);
    const pSpd = [];
    for (let i = 0; i < N; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 44;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      pSpd.push({
        vy: -(0.012 + Math.random() * 0.02),
        vx: (Math.random() - 0.5) * 0.008,
        sw: Math.random() * Math.PI * 2,
        ss: 0.01 + Math.random() * 0.02,
      });
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      map: petalTex,
      size: isMobile ? 0.4 : 0.6,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    const fN = Math.floor(N * 0.7);
    const fGeo = new THREE.BufferGeometry();
    const fPos = new Float32Array(fN * 3);
    const fData = [];
    for (let i = 0; i < fN; i++) {
      fPos[i * 3] = (Math.random() - 0.5) * 38;
      fPos[i * 3 + 1] = (Math.random() - 0.5) * 28;
      fPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      fData.push({ bx: fPos[i * 3], by: fPos[i * 3 + 1], ph: Math.random() * Math.PI * 2 });
    }
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    const fMat = new THREE.PointsMaterial({
      map: fireflyTex,
      size: isMobile ? 0.45 : 0.75,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.8,
      depthWrite: false,
    });
    scene.add(new THREE.Points(fGeo, fMat));

    let visible = true;
    const obs = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
    }, { threshold: 0.05 });
    if (sectionRef.current) obs.observe(sectionRef.current);

    const clock = new THREE.Clock();
    let last = 0;
    const loop = (ts) => {
      raf = requestAnimationFrame(loop);
      if (!visible || ts - last < 28) return;
      last = ts;
      const t = clock.getElapsedTime();
      const pa = pGeo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const s = pSpd[i];
        s.sw += s.ss;
        pa[i * 3 + 1] += s.vy;
        pa[i * 3] += s.vx + Math.sin(s.sw) * 0.012;
        if (pa[i * 3 + 1] < -17) {
          pa[i * 3 + 1] = 17;
          pa[i * 3] = (Math.random() - 0.5) * 44;
        }
      }
      pGeo.attributes.position.needsUpdate = true;
      const fa = fGeo.attributes.position.array;
      for (let i = 0; i < fN; i++) {
        const d = fData[i];
        fa[i * 3] = d.bx + Math.sin(t * 0.75 + d.ph) * 1.4;
        fa[i * 3 + 1] = d.by + Math.cos(t * 0.55 + d.ph) * 1.1;
      }
      fGeo.attributes.position.needsUpdate = true;
      fMat.opacity = 0.45 + Math.sin(t * 2.4) * 0.35;
      renderer.render(scene, cam);
    };
    raf = requestAnimationFrame(loop);

    const handleWindowResize = () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleWindowResize);
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
      petalTex.dispose();
      fGeo.dispose();
      fMat.dispose();
      fireflyTex.dispose();
    };
  }, []);

  return (
    <section id="story" ref={sectionRef} aria-label="Our Journey of Love">
      <div className="story-bg-texture" aria-hidden="true" />

      {/* ─────────────────────────────────────────────────────────────
          1. SECTION HEADER
      ───────────────────────────────────────────────────────────── */}
      <header ref={headerRef} className="story-header">
        <div className="story-badge">
          <NilavilakkuSVG size={17} lit />
          <span className="story-badge-txt">Our Journey of Love</span>
        </div>

        <h2 className="story-title">The Romantic Story</h2>

        {/* Divider with Nilavilakku SVG (NO EMOJI) */}
        <div className="story-divider" aria-hidden="true">
          <span className="story-divider-line" />
          <div className="story-divider-lamp">
            <NilavilakkuSVG size={22} lit />
          </div>
          <span className="story-divider-line" />
        </div>

        {/* Quote Reveal */}
        <div ref={quoteRef} className="story-quote-container">
          <p className="story-quote">
            {'"Like waters returning to the tranquil backwaters, two kindred souls found their '}
            <span className="story-quote-underline">
              {'eternal home."'}
            </span>
            <span style={{ display: 'none' }}>
              {'Like waters returning to the tranquil backwaters, two kindred souls found their eternal home.'
                .split(' ')
                .map((word, i) => (
                  <span key={i} className="story-quote-word">
                    {word}{' '}
                  </span>
                ))}
            </span>
          </p>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MARQUEE BAND (Tight 24px padding, zero extra margin)
      ───────────────────────────────────────────────────────────── */}
      <div ref={marqueeRef} className="story-marquee-section" aria-hidden="true">
        {/* Row 1: Leftward drift with pure SVGs */}
        <div className="story-marquee-row">
          <div ref={track1Ref} className="story-marquee-track">
            {[0, 1].map((copyIdx) => (
              <span key={copyIdx} className="story-marquee-text" aria-hidden={copyIdx > 0}>
                FIRST GLIMPSE <span className="story-marquee-icon"><NilavilakkuSVG size={26} lit /></span> THE JASMINE PROMISE <span className="story-marquee-icon"><LotusSVG size={28} /></span> TOWARD SACRED FOREVER <span className="story-marquee-icon"><NilavilakkuSVG size={26} lit /></span>{' '}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2: Rightward drift with pure SVGs */}
        <div className="story-marquee-row">
          <div ref={track2Ref} className="story-marquee-track">
            {[0, 1].map((copyIdx) => (
              <span key={copyIdx} className="story-marquee-text" aria-hidden={copyIdx > 0}>
                ANANYA &amp; ROHAN <span className="story-marquee-icon"><LotusSVG size={28} /></span> 2023 <span className="story-marquee-icon"><NilavilakkuSVG size={26} lit /></span> 2024 <span className="story-marquee-icon"><LotusSVG size={28} /></span> 2026 <span className="story-marquee-icon"><NilavilakkuSVG size={26} lit /></span> KERALA <span className="story-marquee-icon"><LotusSVG size={28} /></span>{' '}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. PINNED STAGE (Exact calc(100svh - var(--nav-h)), centered)
      ───────────────────────────────────────────────────────────── */}
      <div ref={pinRef} className="story-pin">
        {/* Ambient Canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

        {/* 1240px Centered Stage Container */}
        <div ref={stageRef} className="story-stage">
          {/* Giant Year Watermark Centered in Stage */}
          <div className="ch-watermark" aria-hidden="true">
            {CHAPTERS[0].year}
          </div>

          {CHAPTERS.map((ch, i) => (
            <article
              key={ch.id}
              ref={(el) => (chapterRefs.current[i] = el)}
              className={`story-chapter${ch.textLeft ? '' : ' photo-left'}${i === 0 ? ' is-active' : ''}`}
            >
              {/* Column 1: Vertical Timeline Rail (64px width) */}
              <div className="ch-timeline-col" aria-hidden="true">
                <div className="story-timeline-rail">
                  <div className="sr-tl-track" />
                  <div ref={i === 0 ? lineRef : null} className="sr-tl-fill" />
                  {CHAPTERS.map((c, idx) => (
                    <div
                      key={c.id}
                      className={`sr-node${idx === i ? ' active' : ''}`}
                      ref={(el) => {
                        if (i === 0) nodeRefs.current[idx] = el;
                      }}
                    >
                      <div className="sr-node-circle">
                        <NilavilakkuSVG size={idx === i ? 18 : 15} lit={idx <= i} />
                      </div>
                      <span className="sr-node-year">{c.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Text Column (Max 560px) */}
              <div className="ch-text-col">
                <div className="ch-chip">
                  <Sparkles size={13} aria-hidden="true" />
                  <span>{ch.label} • {ch.period}</span>
                </div>

                <h3 className="ch-title">{ch.title}</h3>

                <div className="ch-location">
                  <NilavilakkuSVG size={14} lit />
                  <span>{ch.location}</span>
                </div>

                {/* Paragraph with Word Fill */}
                <p className="ch-paragraph">
                  {ch.text.split(' ').map((word, wordIdx) => (
                    <span key={wordIdx} className="ch-word">
                      {word}{' '}
                    </span>
                  ))}
                </p>

                <div className="ch-accent">
                  <Heart size={14} fill="#C9A24B" color="#C9A24B" style={{ flexShrink: 0 }} aria-hidden="true" />
                  <span>{ch.accent}</span>
                </div>
              </div>

              {/* Column 3: Photo Column (Max 580px) & Ticker */}
              <div className="ch-photo-col">
                <div className="ch-photo-wrap">
                  <div
                    className="ch-photo-frame"
                    onMouseMove={(e) => handleTilt(e, i)}
                    onMouseLeave={() => resetTilt(i)}
                  >
                    <div className="ch-photo-inner">
                      <img
                        ref={(el) => (photoRefs.current[i] = el)}
                        src={ch.image}
                        alt={ch.title}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        style={{ objectPosition: ch.objectPosition || 'center center' }}
                      />
                      <div className="ch-date-chip">
                        <NilavilakkuSVG size={13} lit />
                        <span>{ch.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* Chapter Keyword Ticker with Mask Edge Fade */}
                  <div className="ch-keyword-ticker" aria-hidden="true">
                    <div className="ch-ticker-track">
                      {[0, 1].map((copyIdx) => (
                        <span key={copyIdx} className="ch-ticker-text">
                          {ch.keywords} • {ch.keywords} •{' '}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION END LINE (Outside Pin in normal flow)
      ───────────────────────────────────────────────────────────── */}
      <div ref={endSentenceRef} className="story-end-section">
        <p className="story-end-quote">
          {'"Every love story is beautiful, but ours is our favourite."'
            .split(' ')
            .map((word, idx) => (
              <span key={idx} className="story-end-word">
                {word}{' '}
              </span>
            ))}
        </p>
        <div className="story-end-flourish" aria-hidden="true">
          <LotusSVG size={24} />
          <NilavilakkuSVG size={22} lit />
          <LotusSVG size={24} />
        </div>
      </div>
    </section>
  );
}
