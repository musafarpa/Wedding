import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
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
    speed: 0.8,
    velocityBoost: 2.2,
    skewMax: 6,
  },
  particleCount: {
    mobile: 8,
    desktop: 20,
  },
  durations: {
    fade: 500,
  },
  navHeight: 80,
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
   NILAVILAKKU SVG
───────────────────────────────────────────────────────────────── */
const NilavilakkuSVG = ({ size = 22, lit = false }) => (
  <svg
    width={size}
    height={size * 1.6}
    viewBox="0 0 32 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: 'visible', display: 'block' }}
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
        <ellipse cx="16" cy="10" rx="3.5" ry="6" fill="url(#story_fg)" opacity="0.95" />
        <ellipse cx="16" cy="11" rx="1.5" ry="3.2" fill="#FFFDE8" />
      </g>
    )}
    <defs>
      <radialGradient id="story_fg" cx="50%" cy="65%" r="55%">
        <stop offset="0%" stopColor="#FFF5A0" />
        <stop offset="45%" stopColor="#FFB020" />
        <stop offset="90%" stopColor="#E64000" stopOpacity="0.5" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export default function RomanticStorySection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const quoteRef = useRef(null);
  const pinRef = useRef(null);
  const chapterRefs = useRef([]);
  const photoRefs = useRef([]);
  const lineRef = useRef(null);
  const nodeRefs = useRef([]);
  const canvasRef = useRef(null);
  const endSentenceRef = useRef(null);

  // Marquee refs
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  /* ── LENIS SMOOTH SCROLL (Single Global Instance Reuse) ── */
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let lenis = window.lenis;
    let created = false;

    if (!lenis) {
      lenis = new Lenis({
        lerp: 0.08,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.4,
        smoothWheel: true,
      });
      window.lenis = lenis;
      created = true;

      lenis.on('scroll', ScrollTrigger.update);
      const tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      if (created && window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }
    };
  }, []);

  /* ── MARQUEE ANIMATION WITH SCROLL SCRUB & VELOCITY SKEW ── */
  useEffect(() => {
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!r1 || !r2) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let pos1 = 0;
    let pos2 = 0;
    let lastScrollY = window.scrollY;
    let currentSkew = 0;
    let rafId;

    const tick = () => {
      const scrollY = window.scrollY;
      const velocity = scrollY - lastScrollY;
      lastScrollY = scrollY;

      // Base idle drift + velocity boost
      const delta1 = -STORY_CONFIG.marquee.speed - velocity * STORY_CONFIG.marquee.velocityBoost * 0.1;
      const delta2 = STORY_CONFIG.marquee.speed + velocity * STORY_CONFIG.marquee.velocityBoost * 0.1;

      pos1 += delta1;
      pos2 += delta2;

      // Skew calculation (capped at skewMax)
      const targetSkew = Math.max(-STORY_CONFIG.marquee.skewMax, Math.min(STORY_CONFIG.marquee.skewMax, velocity * 0.3));
      currentSkew += (targetSkew - currentSkew) * 0.1;

      // Half width wrap for seamless looping
      const half1 = r1.scrollWidth / 2 || 1200;
      const half2 = r2.scrollWidth / 2 || 1200;

      if (pos1 <= -half1) pos1 += half1;
      if (pos1 > 0) pos1 -= half1;

      if (pos2 >= half2) pos2 -= half2;
      if (pos2 < 0) pos2 += half2;

      r1.style.transform = `translate3d(${pos1}px, 0, 0) skewX(${currentSkew}deg)`;
      r2.style.transform = `translate3d(${-pos2}px, 0, 0) skewX(${-currentSkew}deg)`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  /* ── QUOTE REVEAL & CHAPTER WORD FILL ANIMATION ── */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Quote Reveal
      const quoteWords = quoteRef.current?.querySelectorAll('.story-quote-word');
      if (quoteWords && quoteWords.length > 0) {
        gsap.to(quoteWords, {
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 85%',
            end: 'bottom 65%',
            scrub: 0.5,
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

      // 2. End Sentence Word-by-Word Reveal
      const endWords = endSentenceRef.current?.querySelectorAll('.story-end-word');
      if (endWords && endWords.length > 0) {
        gsap.to(endWords, {
          scrollTrigger: {
            trigger: endSentenceRef.current,
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
          opacity: 1,
          y: 0,
          color: '#0F3B2E',
          stagger: 0.08,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── MAIN PINNED STAGE & CHAPTER SCRUB ── */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;
    if (prefersReducedMotion || isMobile) return;

    const ctx = gsap.context(() => {
      const chs = chapterRefs.current;
      if (!chs[0] || !pinRef.current) return;

      // Initial state: Chapter 0 active
      gsap.set(chs[0], { autoAlpha: 1, y: 0, zIndex: 2 });
      gsap.set(chs[1], { autoAlpha: 0, y: 50, zIndex: 1 });
      gsap.set(chs[2], { autoAlpha: 0, y: 50, zIndex: 1 });

      gsap.set(nodeRefs.current[0], { scale: 1.15, opacity: 1 });
      gsap.set(nodeRefs.current[1], { scale: 1, opacity: 0.35 });
      gsap.set(nodeRefs.current[2], { scale: 1, opacity: 0.35 });

      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top center' });

      // Words in paragraphs
      const ch0Words = chs[0]?.querySelectorAll('.ch-word');
      const ch1Words = chs[1]?.querySelectorAll('.ch-word');
      const ch2Words = chs[2]?.querySelectorAll('.ch-word');

      const master = gsap.timeline({
        scrollTrigger: {
          id: 'story-main',
          trigger: pinRef.current,
          start: `top top+=${STORY_CONFIG.navHeight}`,
          end: '+=300%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const SEG = 1;
      const FADE = 0.22;

      /* ── CHAPTER 0 (0 → 1) ── */
      if (photoRefs.current[0]) {
        master.to(photoRefs.current[0], { scale: 1.05, ease: 'none', duration: SEG }, 0);
      }
      master.to(lineRef.current, { scaleY: 0.33, ease: 'none', duration: SEG }, 0);
      if (ch0Words) {
        master.to(ch0Words, { color: '#0F3B2E', stagger: 0.02, duration: SEG * 0.7, ease: 'none' }, 0);
      }

      /* ── Transition CH0 → CH1 ── */
      master
        .to(chs[0], { autoAlpha: 0, y: -40, ease: 'power2.in', duration: FADE }, SEG - FADE * 0.5)
        .set(chs[0], { zIndex: 1 }, SEG)
        .set(chs[1], { zIndex: 2 }, SEG - FADE * 0.5)
        .to(chs[1], { autoAlpha: 1, y: 0, ease: 'power2.out', duration: FADE }, SEG - FADE * 0.5)
        .to(nodeRefs.current[1], { scale: 1.15, opacity: 1, ease: 'power2.out', duration: 0.15 }, SEG);

      /* ── CHAPTER 1 (1 → 2) ── */
      if (photoRefs.current[1]) {
        master.to(photoRefs.current[1], { scale: 1.05, ease: 'none', duration: SEG }, SEG);
      }
      master.to(lineRef.current, { scaleY: 0.66, ease: 'none', duration: SEG }, SEG);
      if (ch1Words) {
        master.to(ch1Words, { color: '#0F3B2E', stagger: 0.02, duration: SEG * 0.7, ease: 'none' }, SEG);
      }

      /* ── Transition CH1 → CH2 ── */
      master
        .to(chs[1], { autoAlpha: 0, y: -40, ease: 'power2.in', duration: FADE }, SEG * 2 - FADE * 0.5)
        .set(chs[1], { zIndex: 1 }, SEG * 2)
        .set(chs[2], { zIndex: 2 }, SEG * 2 - FADE * 0.5)
        .to(chs[2], { autoAlpha: 1, y: 0, ease: 'power2.out', duration: FADE }, SEG * 2 - FADE * 0.5)
        .to(nodeRefs.current[2], { scale: 1.15, opacity: 1, ease: 'power2.out', duration: 0.15 }, SEG * 2);

      /* ── CHAPTER 2 (2 → 3) ── */
      if (photoRefs.current[2]) {
        master.to(photoRefs.current[2], { scale: 1.05, ease: 'none', duration: SEG }, SEG * 2);
      }
      master.to(lineRef.current, { scaleY: 1, ease: 'none', duration: SEG }, SEG * 2);
      if (ch2Words) {
        master.to(ch2Words, { color: '#0F3B2E', stagger: 0.02, duration: SEG * 0.7, ease: 'none' }, SEG * 2);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── PHOTO 3D TILT ── */
  const handleTilt = (e, idx) => {
    const wrap = photoRefs.current[idx]?.parentElement;
    if (!wrap || window.innerWidth < 992) return;
    const r = wrap.getBoundingClientRect();
    const rx = (((e.clientY - r.top) / r.height) - 0.5) * -10;
    const ry = (((e.clientX - r.left) / r.width) - 0.5) * 10;
    gsap.to(wrap, { rotateX: rx, rotateY: ry, scale: 1.02, duration: 0.25, ease: 'power2.out', transformPerspective: 900 });
  };

  const resetTilt = (idx) => {
    const wrap = photoRefs.current[idx]?.parentElement;
    if (!wrap) return;
    gsap.to(wrap, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.45, ease: 'power3.out' });
  };

  /* ── THREE.JS JASMINE & FIREFLY AMBIENT ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isMobile = window.innerWidth < 768;
    const N = isMobile ? STORY_CONFIG.particleCount.mobile : STORY_CONFIG.particleCount.desktop;

    let renderer, raf;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch { return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    cam.position.z = 24;

    const mkTex = (draw) => {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const ctx = c.getContext('2d'); draw(ctx); return new THREE.CanvasTexture(c);
    };

    const petalTex = mkTex((ctx) => {
      const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 28);
      g.addColorStop(0, 'rgba(255,255,255,0.95)');
      g.addColorStop(0.6, 'rgba(255,250,235,0.7)');
      g.addColorStop(1, 'rgba(255,245,220,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(32, 32, 28, 0, Math.PI * 2); ctx.fill();
    });

    const fireflyTex = mkTex((ctx) => {
      const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
      g.addColorStop(0, 'rgba(255,245,170,1)');
      g.addColorStop(0.4, 'rgba(201,162,75,0.6)');
      g.addColorStop(1, 'rgba(201,162,75,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(32, 32, 30, 0, Math.PI * 2); ctx.fill();
    });

    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(N * 3);
    const pSpd = [];
    for (let i = 0; i < N; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 44;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      pSpd.push({ vy: -(0.012 + Math.random() * 0.02), vx: (Math.random() - 0.5) * 0.008, sw: Math.random() * Math.PI * 2, ss: 0.01 + Math.random() * 0.02 });
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ map: petalTex, size: isMobile ? 0.4 : 0.6, transparent: true, opacity: 0.72, depthWrite: false });
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
    const fMat = new THREE.PointsMaterial({ map: fireflyTex, size: isMobile ? 0.45 : 0.75, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.8, depthWrite: false });
    scene.add(new THREE.Points(fGeo, fMat));

    let visible = true;
    const obs = new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.05 });
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
        const s = pSpd[i]; s.sw += s.ss;
        pa[i * 3 + 1] += s.vy; pa[i * 3] += s.vx + Math.sin(s.sw) * 0.012;
        if (pa[i * 3 + 1] < -17) { pa[i * 3 + 1] = 17; pa[i * 3] = (Math.random() - 0.5) * 44; }
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

    const onResize = () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      obs.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('resize', onResize);
      renderer.dispose(); pGeo.dispose(); pMat.dispose(); petalTex.dispose();
      fGeo.dispose(); fMat.dispose(); fireflyTex.dispose();
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

        <h2 className="story-title">
          The Romantic Story
        </h2>

        <div className="story-divider" aria-hidden="true">
          <span className="story-divider-line" />
          <span className="story-divider-lamp">🪔</span>
          <span className="story-divider-line" />
        </div>

        {/* QUOTE REVEAL (Word-by-word scrubbed fill) */}
        <div ref={quoteRef} className="story-quote-container">
          <p className="story-quote">
            {'"Like waters returning to the tranquil backwaters, two kindred souls found their '}
            <span className="story-quote-underline">
              {'eternal home."'}
            </span>
            {/* Split for scrub */}
            <span style={{ display: 'none' }}>
              {'Like waters returning to the tranquil backwaters, two kindred souls found their eternal home.'
                .split(' ')
                .map((word, i) => (
                  <span key={i} className="story-quote-word">{word} </span>
                ))}
            </span>
          </p>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MARQUEE BAND (Between Header and Pinned Stage)
      ───────────────────────────────────────────────────────────── */}
      <div className="story-marquee-section" aria-hidden="true">
        {/* Row 1: Leftward drift */}
        <div className="story-marquee-row">
          <div ref={row1Ref} className="story-marquee-track">
            {[0, 1, 2, 3].map((rep) => (
              <span key={rep} className="story-marquee-text" aria-hidden={rep > 0}>
                FIRST GLIMPSE <span className="story-marquee-icon">🪔</span> THE JASMINE PROMISE <span className="story-marquee-icon">🪷</span> TOWARD SACRED FOREVER <span className="story-marquee-icon">🪔</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row 2: Rightward drift */}
        <div className="story-marquee-row">
          <div ref={row2Ref} className="story-marquee-track">
            {[0, 1, 2, 3].map((rep) => (
              <span key={rep} className="story-marquee-text" aria-hidden={rep > 0}>
                ANANYA &amp; ROHAN <span className="story-marquee-icon">🪷</span> 2023 <span className="story-marquee-icon">🪔</span> 2024 <span className="story-marquee-icon">🪷</span> 2026 <span className="story-marquee-icon">🪔</span> KERALA <span className="story-marquee-icon">🪷</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. PINNED ELEMENT (Vertically Centred Chapter Scroll)
      ───────────────────────────────────────────────────────────── */}
      <div ref={pinRef} className="story-pin">
        {/* Ambient Canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

        {/* Vertical Timeline Rail */}
        <div className="story-timeline" aria-hidden="true">
          <div className="sr-tl-track" />
          <div ref={lineRef} className="sr-tl-fill" />
          {CHAPTERS.map((ch, i) => (
            <div
              key={ch.id}
              className="sr-node"
              ref={(el) => (nodeRefs.current[i] = el)}
              style={{ opacity: i === 0 ? 1 : 0.35 }}
            >
              <div
                className="sr-node-lamp"
                style={i === 0 ? { borderColor: '#C9A24B', boxShadow: '0 0 18px rgba(201,162,75,.6)' } : {}}
              >
                <NilavilakkuSVG size={i === 0 ? 22 : 17} lit={i === 0} />
              </div>
              <span className="sr-node-year" style={i === 0 ? { color: '#8C6F2A' } : {}}>{ch.year}</span>
            </div>
          ))}
        </div>

        {/* Stage Container */}
        <div className="story-stage" style={{ zIndex: 5 }}>
          {CHAPTERS.map((ch, i) => (
            <article
              key={ch.id}
              ref={(el) => (chapterRefs.current[i] = el)}
              className={`story-chapter${ch.textLeft ? '' : ' photo-left'}${i === 0 ? ' is-active' : ''}`}
            >
              {/* Year Watermark Centered in Stage */}
              <div className="ch-watermark" aria-hidden="true">{ch.year}</div>

              {/* Text Column (Max 560px) */}
              <div className="ch-text-col">
                <div className="ch-chip">
                  <Sparkles size={13} aria-hidden="true" />
                  <span>{ch.label} • {ch.period}</span>
                </div>

                <h3 className="ch-title">{ch.title}</h3>

                <div className="ch-location">
                  <span role="img" aria-label="location pin">📍</span>
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

              {/* Photo Column & Keyword Ticker */}
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

                  {/* Chapter Keyword Ticker */}
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
          4. SECTION END LINE (Outside pinned stage in normal flow)
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
          🪷 🪔 🪷
        </div>
      </div>
    </section>
  );
}
