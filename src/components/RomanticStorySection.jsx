import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { Sparkles, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────────────────────────── */
export const STORY_CONFIG = {
  palette: {
    cream: '#F7F2E7',
    deepGreen: '#0F3B2E',
    gold: '#C9A24B',
    goldLight: '#E8D296',
    goldDark: '#8C6F2A',
    textMuted: 'rgba(15,59,46,0.72)',
  },
  navHeight: 80, // px – matches fixed navbar
  particles: { mobile: 25, desktop: 80 },
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
    accent: 'Traditional Kasavu Weave & Jasmine',
    image: '/frames/ezgif-frame-001.jpg',
    objectPosition: 'center 32%',
    textLeft: true, // text left, photo right
  },
  {
    id: 'ch1',
    label: 'Chapter II',
    period: 'Monsoon 2024',
    year: '2024',
    title: 'The Jasmine Promise',
    location: 'The Heritage Courtyard',
    text: 'With a fragrant white blossom and hearts beating in sync, a heartfelt promise was exchanged. In the courtyard of ancient heritage, they vowed to walk through all seasons hand-in-hand.',
    accent: 'A Promise of Sacred Devotion',
    image: '/frames/ezgif-frame-090.jpg',
    objectPosition: 'center 22%',
    textLeft: false, // photo left, text right
  },
  {
    id: 'ch2',
    label: 'Chapter III',
    period: 'December 2026',
    year: '2026',
    title: 'Toward Sacred Forever',
    location: 'Kumarakom Lake Resort',
    text: 'Dressed in handwoven Kerala kasavu and golden ornaments, they prepare to step into the sacred circle around the nilavilakku, sealing two lifetimes into one eternal bond.',
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
  >
    {/* Base */}
    <ellipse cx="16" cy="46" rx="9" ry="2.2" fill="#8C6F2A" />
    <path d="M8 46 Q16 43 24 46 L22 43 Q16 41 10 43Z" fill="#C9A24B" />
    {/* Shaft */}
    <rect x="14.5" y="27" width="3" height="16" rx="1.5" fill="#A88432" />
    <ellipse cx="16" cy="27" rx="5" ry="1.6" fill="#C9A24B" />
    <ellipse cx="16" cy="36" rx="4" ry="1.3" fill="#E8D296" />
    {/* Oil basin */}
    <path d="M6 25 Q16 29 26 25 L24 22 Q16 24 8 22Z" fill="#C9A24B" />
    <ellipse cx="16" cy="22" rx="9.5" ry="2.2" fill="#E8D296" />
    {/* Finial */}
    <path d="M14.5 22 L16 15 L17.5 22Z" fill="#C9A24B" />
    <ellipse cx="16" cy="15" rx="1.8" ry="0.9" fill="#E8D296" />
    {/* Flame */}
    {lit && (
      <g>
        <ellipse cx="16" cy="10" rx="3.5" ry="6" fill="url(#fg)" opacity="0.95" />
        <ellipse cx="16" cy="11" rx="1.5" ry="3.2" fill="#FFFDE8" />
      </g>
    )}
    <defs>
      <radialGradient id="fg" cx="50%" cy="65%" r="55%">
        <stop offset="0%" stopColor="#FFF5A0" />
        <stop offset="45%" stopColor="#FFB020" />
        <stop offset="90%" stopColor="#E64000" stopOpacity="0.5" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────── */
export default function RomanticStorySection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const pinRef = useRef(null);           // pinned element
  const stageRef = useRef(null);         // holds all .chapter articles
  const chapterRefs = useRef([]);        // [article0, article1, article2]
  const photoRefs = useRef([]);          // photo img nodes for Ken Burns
  const lineRef = useRef(null);          // gold progress line
  const nodeRefs = useRef([]);           // 3 nilavilakku node wrappers
  const canvasRef = useRef(null);
  const lenisRef = useRef(null);

  /* ── LENIS ── */
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.4,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* ── HEADER ANIMATIONS ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: headerRef.current, start: 'top 82%', once: true },
      });
      tl.fromTo('.srb', { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo('.srt', { y: 44, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, '-=0.35')
        .fromTo('.srk', { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.out', transformOrigin: 'center' }, '-=0.5')
        .fromTo('.srq', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75, ease: 'power3.out' }, '-=0.6');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ── MAIN PIN + CHAPTER SCRUB ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const chs = chapterRefs.current;
      if (!chs[0] || !pinRef.current) return;

      /* Initial state: only chapter 0 visible */
      gsap.set(chs[0], { autoAlpha: 1, y: 0, zIndex: 2 });
      gsap.set(chs[1], { autoAlpha: 0, y: 60, zIndex: 1 });
      gsap.set(chs[2], { autoAlpha: 0, y: 60, zIndex: 1 });

      /* Node 0 lit, others dim */
      gsap.set(nodeRefs.current[0], { scale: 1.1, opacity: 1 });
      gsap.set(nodeRefs.current[1], { scale: 1, opacity: 0.35 });
      gsap.set(nodeRefs.current[2], { scale: 1, opacity: 0.35 });

      /* Gold progress line starts at 0 */
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top center' });

      /* Ken Burns — chapter 0 image starts at scale 1 */
      if (photoRefs.current[0]) gsap.set(photoRefs.current[0], { scale: 1 });
      if (photoRefs.current[1]) gsap.set(photoRefs.current[1], { scale: 1 });
      if (photoRefs.current[2]) gsap.set(photoRefs.current[2], { scale: 1 });

      /* ── MASTER TIMELINE ── */
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

      /* Segment durations (each ~1 unit = 100% progress) */
      const SEG = 1;        // one chapter occupies 1 unit
      const FADE = 0.18;    // crossfade window within a segment

      /* ── CHAPTER 0 range (0 → 1) ── */
      // Ken Burns zoom (subtle 1.04 to preserve full 1080p crisp sharpness)
      master.to(photoRefs.current[0], { scale: 1.04, ease: 'none', duration: SEG }, 0);
      // Gold line grows to 33%
      master.to(lineRef.current, { scaleY: 0.33, ease: 'none', duration: SEG }, 0);

      /* ── Transition: CH0 out / CH1 in ── */
      master
        .to(chs[0], { autoAlpha: 0, y: -40, ease: 'power2.in', duration: FADE }, SEG - FADE * 0.5)
        .set(chs[0], { zIndex: 1 }, SEG)
        .set(chs[1], { zIndex: 2 }, SEG - FADE * 0.5)
        .to(chs[1], { autoAlpha: 1, y: 0, ease: 'power2.out', duration: FADE }, SEG - FADE * 0.5)
        // Node 2024 lights up
        .to(nodeRefs.current[1], { scale: 1.1, opacity: 1, ease: 'power2.out', duration: 0.12 }, SEG);

      /* ── CHAPTER 1 range (1 → 2) ── */
      master.to(photoRefs.current[1], { scale: 1.04, ease: 'none', duration: SEG }, SEG);
      master.to(lineRef.current, { scaleY: 0.66, ease: 'none', duration: SEG }, SEG);

      /* ── Transition: CH1 out / CH2 in ── */
      master
        .to(chs[1], { autoAlpha: 0, y: -40, ease: 'power2.in', duration: FADE }, SEG * 2 - FADE * 0.5)
        .set(chs[1], { zIndex: 1 }, SEG * 2)
        .set(chs[2], { zIndex: 2 }, SEG * 2 - FADE * 0.5)
        .to(chs[2], { autoAlpha: 1, y: 0, ease: 'power2.out', duration: FADE }, SEG * 2 - FADE * 0.5)
        // Node 2026 lights up
        .to(nodeRefs.current[2], { scale: 1.1, opacity: 1, ease: 'power2.out', duration: 0.12 }, SEG * 2);

      /* ── CHAPTER 2 range (2 → 3) ── */
      master.to(photoRefs.current[2], { scale: 1.04, ease: 'none', duration: SEG }, SEG * 2);
      master.to(lineRef.current, { scaleY: 1, ease: 'none', duration: SEG }, SEG * 2);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── PHOTO 3D TILT ── */
  const handleTilt = (e, idx) => {
    const wrap = photoRefs.current[idx]?.parentElement;
    if (!wrap) return;
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

  /* ── THREE.JS AMBIENT CANVAS ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isMobile = window.innerWidth < 768;
    const N = isMobile ? STORY_CONFIG.particles.mobile : STORY_CONFIG.particles.desktop;

    let renderer, raf;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch { return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    cam.position.z = 24;

    /* Petal texture */
    const mkTex = (draw) => {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const ctx = c.getContext('2d'); draw(ctx); return new THREE.CanvasTexture(c);
    };
    const petalTex = mkTex((ctx) => {
      const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 28);
      g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.6, 'rgba(255,250,235,0.7)'); g.addColorStop(1, 'rgba(255,245,220,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(32, 32, 28, 0, Math.PI * 2); ctx.fill();
    });
    const firefly = mkTex((ctx) => {
      const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
      g.addColorStop(0, 'rgba(255,245,170,1)'); g.addColorStop(0.4, 'rgba(201,162,75,0.6)'); g.addColorStop(1, 'rgba(201,162,75,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(32, 32, 30, 0, Math.PI * 2); ctx.fill();
    });

    /* Petals */
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(N * 3);
    const pSpd = [];
    for (let i = 0; i < N; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 44;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      pSpd.push({ vy: -(0.014 + Math.random() * 0.022), vx: (Math.random() - 0.5) * 0.009, sw: Math.random() * Math.PI * 2, ss: 0.01 + Math.random() * 0.02 });
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ map: petalTex, size: isMobile ? 0.4 : 0.6, transparent: true, opacity: 0.72, depthWrite: false });
    scene.add(new THREE.Points(pGeo, pMat));

    /* Fireflies */
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
    const fMat = new THREE.PointsMaterial({ map: firefly, size: isMobile ? 0.45 : 0.78, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.8, depthWrite: false });
    scene.add(new THREE.Points(fGeo, fMat));

    /* Pause when off-screen */
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
      fGeo.dispose(); fMat.dispose(); firefly.dispose();
    };
  }, []);

  /* ─────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────── */
  return (
    <section id="story" ref={sectionRef} style={{ position: 'relative', backgroundColor: '#F7F2E7', color: '#0F3B2E' }}>
      {/* ── SCOPED STYLES ── */}
      <style>{`
        /* Reset any old zigzag styles that may bleed in */
        #story * { box-sizing: border-box; }

        /* Badge shimmer */
        @keyframes srShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes flicker {
          0%,100% { opacity:.95; transform:scale(1) rotate(-1deg); }
          50%      { opacity:1;   transform:scale(1.18) rotate(2deg); }
        }
        .sr-badge-txt {
          background: linear-gradient(110deg,#8C6F2A 0%,#C9A24B 30%,#FFF5D0 50%,#C9A24B 70%,#8C6F2A 100%);
          background-size: 200% auto;
          animation: srShimmer 5s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sr-chip {
          background: linear-gradient(100deg,rgba(201,162,75,.15) 0%,rgba(232,210,150,.32) 50%,rgba(201,162,75,.15) 100%);
          background-size: 200% auto;
          animation: srShimmer 6s linear infinite;
        }
        .sr-node-lamp svg ellipse, .sr-node-lamp svg path, .sr-node-lamp svg rect { transition: all .4s ease; }

        /* ── PIN ELEMENT ── */
        .story-pin {
          position: relative;
          width: 100%;
          height: calc(100vh - ${STORY_CONFIG.navHeight}px);
          overflow: hidden;
          display: flex;
          align-items: stretch;
        }

        /* ── STAGE ── */
        .story-stage {
          position: relative;
          flex: 1;
          height: 100%;
        }

        /* ── CHAPTER ARTICLES ── */
        .story-chapter {
          position: absolute;
          inset: 0;
          display: grid;
          align-items: center;
          padding: 0 clamp(2rem, 5vw, 5rem) 0 clamp(4.5rem, 8vw, 8rem);
          gap: clamp(2rem, 4vw, 4rem);
          /* proportional widescreen layout */
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
        }
        .story-chapter.photo-left {
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
        }
        .story-chapter .ch-text-col {
          grid-column: 1;
          grid-row: 1;
        }
        .story-chapter .ch-photo-col {
          grid-column: 2;
          grid-row: 1;
        }
        /* Chapter II: swap columns */
        .story-chapter.photo-left .ch-text-col {
          grid-column: 2;
        }
        .story-chapter.photo-left .ch-photo-col {
          grid-column: 1;
        }

        /* ── PHOTO FRAME ── */
        .ch-photo-frame {
          width: 100%;
          max-width: 580px;
          max-height: 58vh;
          aspect-ratio: 16 / 10.5;
          margin: 0 auto;
          border-radius: 200px 200px 24px 24px;
          padding: 5px;
          background: linear-gradient(140deg,#C9A24B,#E8D296 50%,#8C6F2A);
          box-shadow: 0 24px 55px rgba(15,59,46,.18), 0 0 35px rgba(201,162,75,.22);
          position: relative;
          transform-style: preserve-3d;
          transition: transform .18s ease-out;
          cursor: pointer;
          will-change: transform;
        }
        .ch-photo-inner {
          width: 100%;
          height: 100%;
          border-radius: 195px 195px 19px 19px;
          overflow: hidden;
          border: 2px solid rgba(247,242,231,.9);
          position: relative;
          background: #071710;
        }
        .ch-photo-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: auto;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          filter: contrast(1.03) saturate(1.04);
          will-change: transform;
        }
        .ch-date-chip {
          position: absolute;
          bottom: 14px;
          right: 14px;
          background: rgba(15,59,46,.9);
          backdrop-filter: blur(8px);
          border: 1px solid #C9A24B;
          padding: 5px 14px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #E8D296;
          font-size: .78rem;
          font-weight: 700;
          letter-spacing: .1em;
          z-index: 3;
        }

        /* ── YEAR WATERMARK (per chapter) ── */
        .ch-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-display, 'Cinzel Decorative', Georgia, serif);
          font-size: clamp(7rem, 22vw, 20rem);
          font-weight: 900;
          color: rgba(201,162,75,.06);
          letter-spacing: -.04em;
          line-height: 1;
          user-select: none;
          pointer-events: none;
          z-index: -1;
          white-space: nowrap;
        }

        /* ── TIMELINE RAIL ── */
        .story-timeline {
          position: absolute;
          left: clamp(1.4rem, 3.5vw, 3.8rem);
          top: 50%;
          transform: translateY(-50%);
          height: 320px;
          width: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          z-index: 20;
        }
        .sr-tl-track {
          position: absolute;
          top: 0; bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          background: rgba(201,162,75,.22);
          border-radius: 2px;
        }
        .sr-tl-fill {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%) scaleY(0);
          transform-origin: top center;
          width: 3px;
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(180deg, #E8D296, #C9A24B);
          box-shadow: 0 0 10px rgba(201,162,75,.55);
        }
        .sr-node {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .sr-node-lamp {
          background: rgba(247,242,231,.95);
          border-radius: 50%;
          padding: 8px;
          border: 2px solid rgba(201,162,75,.45);
          transition: box-shadow .5s ease, border-color .5s ease;
        }
        .sr-node-year {
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .1em;
          color: rgba(15,59,46,.5);
          font-family: var(--font-display, 'Cinzel Decorative', Georgia, serif);
          transition: color .4s ease;
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .story-chapter {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto auto;
            padding: 1rem 1.2rem 1.5rem;
            gap: 1.2rem;
            overflow-y: auto;
          }
          .story-chapter .ch-text-col,
          .story-chapter .ch-photo-col,
          .story-chapter.photo-left .ch-text-col,
          .story-chapter.photo-left .ch-photo-col {
            grid-column: 1;
          }
          .story-chapter .ch-photo-col { grid-row: 1; }
          .story-chapter .ch-text-col  { grid-row: 2; }
          .story-chapter.photo-left .ch-photo-col { grid-row: 1; }
          .story-chapter.photo-left .ch-text-col  { grid-row: 2; }
          .ch-photo-frame {
            max-width: 100%;
            max-height: 38vh;
            aspect-ratio: 16 / 10;
            border-radius: 140px 140px 18px 18px;
          }
          .ch-photo-inner {
            border-radius: 135px 135px 14px 14px;
          }
          .story-timeline { display: none; }
          .story-pin { height: calc(100vh - ${STORY_CONFIG.navHeight}px); }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════
          SECTION HEADER (normal page flow, above the pin)
      ══════════════════════════════════════════════════════════ */}
      <header
        ref={headerRef}
        style={{
          textAlign: 'center',
          padding: '6rem 1.5rem 4rem',
          position: 'relative',
          zIndex: 2,
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        {/* Badge */}
        <div className="srb" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', padding: '0.45rem 1.4rem', borderRadius: '9999px', backgroundColor: 'rgba(201,162,75,.12)', border: '1px solid #C9A24B', boxShadow: '0 4px 18px rgba(201,162,75,.14)', marginBottom: '1.35rem', opacity: 0 }}>
          <NilavilakkuSVG size={17} lit />
          <span className="sr-badge-txt" style={{ fontSize: '.78rem', fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase' }}>Our Journey of Love</span>
        </div>

        {/* Title */}
        <div style={{ overflow: 'hidden', marginBottom: '.5rem' }}>
          <h2 className="srt" style={{ fontFamily: 'var(--font-display,"Cinzel Decorative",Georgia,serif)', fontSize: 'clamp(2.1rem,4.5vw,3.5rem)', color: '#0F3B2E', letterSpacing: '.04em', textTransform: 'uppercase', margin: 0, lineHeight: 1.18, opacity: 0 }}>
            The Romantic Story
          </h2>
        </div>

        {/* Kasavu Divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', margin: '1.3rem auto', maxWidth: '400px' }}>
          <span className="srk" style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg,transparent,#C9A24B)', display: 'block', transformOrigin: 'left center' }} />
          <NilavilakkuSVG size={22} lit />
          <span className="srk" style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg,#C9A24B,transparent)', display: 'block', transformOrigin: 'right center' }} />
        </div>

        {/* Quote */}
        <p className="srq" style={{ fontFamily: 'var(--font-serif,"Cormorant Garamond",Georgia,serif)', fontStyle: 'italic', fontSize: 'clamp(1.1rem,2vw,1.38rem)', color: 'rgba(15,59,46,.7)', maxWidth: '660px', margin: '0 auto', lineHeight: 1.75, opacity: 0 }}>
          "Like waters returning to the tranquil backwaters, two kindred souls found their eternal home."
        </p>
      </header>

      {/* ══════════════════════════════════════════════════════════
          PINNED ELEMENT
      ══════════════════════════════════════════════════════════ */}
      <div ref={pinRef} className="story-pin">

        {/* THREE.JS CANVAS — absolute behind everything */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

        {/* VERTICAL TIMELINE */}
        <div className="story-timeline">
          <div className="sr-tl-track" />
          <div ref={lineRef} className="sr-tl-fill" />
          {CHAPTERS.map((ch, i) => (
            <div
              key={ch.id}
              className="sr-node"
              ref={(el) => (nodeRefs.current[i] = el)}
              style={{ opacity: i === 0 ? 1 : 0.35 }}
            >
              <div className="sr-node-lamp" style={i === 0 ? { borderColor: '#C9A24B', boxShadow: '0 0 18px rgba(201,162,75,.6)' } : {}}>
                <NilavilakkuSVG size={i === 0 ? 22 : 17} lit={i === 0} />
              </div>
              <span className="sr-node-year" style={i === 0 ? { color: '#8C6F2A' } : {}}>{ch.year}</span>
            </div>
          ))}
        </div>

        {/* STAGE — all chapters stacked, only one visible */}
        <div ref={stageRef} className="story-stage" style={{ zIndex: 5 }}>
          {CHAPTERS.map((ch, i) => (
            <article
              key={ch.id}
              ref={(el) => (chapterRefs.current[i] = el)}
              className={`story-chapter${ch.textLeft ? '' : ' photo-left'}`}
              style={{ visibility: i === 0 ? 'visible' : 'hidden', opacity: i === 0 ? 1 : 0 }}
            >
              {/* YEAR WATERMARK (z-index:-1, stays inside its own chapter) */}
              <div className="ch-watermark">{ch.year}</div>

              {/* TEXT COLUMN */}
              <div className="ch-text-col" style={{ padding: '0 0.5rem' }}>
                {/* Chapter Chip */}
                <div className="sr-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.38rem 1.1rem', borderRadius: '9999px', border: '1px solid #C9A24B', color: '#8C6F2A', fontSize: '.82rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  <Sparkles size={13} />
                  <span>{ch.label} • {ch.period}</span>
                </div>

                {/* Title */}
                <h3 style={{ fontFamily: 'var(--font-display,"Cinzel Decorative",Georgia,serif)', fontSize: 'clamp(1.7rem,3vw,2.5rem)', color: '#0F3B2E', lineHeight: 1.22, letterSpacing: '.02em', marginBottom: '.55rem' }}>
                  {ch.title}
                </h3>

                {/* Location */}
                <div style={{ fontSize: '.88rem', fontWeight: 600, color: '#8C6F2A', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
                  {ch.location}
                </div>

                {/* Body text — 18px serif, 1.8 leading */}
                <p style={{ fontFamily: 'var(--font-serif,"Cormorant Garamond",Georgia,serif)', fontSize: '18px', lineHeight: 1.8, color: 'rgba(15,59,46,.92)', marginBottom: '1.5rem' }}>
                  {ch.text}
                </p>

                {/* Accent note */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', padding: '.7rem 1.1rem', background: 'rgba(201,162,75,.08)', borderLeft: '3px solid #C9A24B', borderRadius: '0 8px 8px 0', fontSize: '.88rem', fontStyle: 'italic', color: 'rgba(15,59,46,.7)' }}>
                  <Heart size={13} fill="#C9A24B" style={{ color: '#C9A24B', flexShrink: 0 }} />
                  {ch.accent}
                </div>
              </div>

              {/* PHOTO COLUMN */}
              <div className="ch-photo-col">
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
                      style={{
                        objectPosition: ch.objectPosition || 'center center',
                      }}
                    />
                    {/* Date chip inside photo, bottom-right */}
                    <div className="ch-date-chip">
                      <NilavilakkuSVG size={13} lit />
                      <span>{ch.period}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
