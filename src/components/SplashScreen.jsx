import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import './SplashScreen.css';

/* ─────────────────────────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────────────────────────── */
export const SPLASH_CONFIG = {
  palette: {
    cream: '#F7F2E7',
    deepGreen: '#0F3B2E',
    gold: '#C9A24B',
    goldLight: '#E8D296',
    goldDark: '#8C6F2A',
  },
  durations: {
    total: 5.0,
    open: 4.8,
  },
  particleCount: { mobile: 12, desktop: 20 },
  showOncePerSession: true,
  musicOnTap: true,
};

/* ─────────────────────────────────────────────────────────────────
   SVGS (NILAVILAKKU & FAINT MURAL CORNERS)
───────────────────────────────────────────────────────────────── */
const NilavilakkuIcon = ({ size = 18, lit = true }) => (
  <svg
    width={size}
    height={size * 1.5}
    viewBox="0 0 32 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ overflow: 'visible', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <ellipse cx="16" cy="44" rx="8" ry="2" fill="#8C6F2A" />
    <path d="M8 44 Q16 41 24 44 L22 41 Q16 39 10 41Z" fill="#C9A24B" />
    <rect x="14.5" y="26" width="3" height="15" rx="1.5" fill="#A88432" />
    <ellipse cx="16" cy="26" rx="5" ry="1.5" fill="#C9A24B" />
    <path d="M7 24 Q16 28 25 24 L23 21 Q16 23 9 21Z" fill="#C9A24B" />
    <ellipse cx="16" cy="21" rx="9" ry="2" fill="#E8D296" />
    <path d="M14.5 21 L16 15 L17.5 21Z" fill="#C9A24B" />
    {lit && (
      <g>
        <ellipse cx="16" cy="10" rx="3.5" ry="5.5" fill="#FFA020" opacity="0.9" />
        <ellipse cx="16" cy="11" rx="1.6" ry="3.2" fill="#FFFDE8" />
      </g>
    )}
  </svg>
);

const MuralCornerArt = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M10 10 L90 10" stroke="currentColor" strokeWidth="1.2" />
    <path d="M10 10 L10 90" stroke="currentColor" strokeWidth="1.2" />
    <path d="M10 30 Q30 30 30 10" stroke="currentColor" strokeWidth="1" />
    <path d="M10 50 Q50 50 50 10" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="35" cy="35" r="8" stroke="currentColor" strokeWidth="0.8" />
    <path d="M28 35 Q35 25 42 35 Q35 45 28 35 Z" stroke="currentColor" strokeWidth="0.8" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   PROCEDURAL JASMINE PETAL TEXTURE FOR CANVAS
───────────────────────────────────────────────────────────────── */
function createPetalTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.translate(32, 32);
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 24, 0, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(0, -6, 2, 0, 0, 24);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.55, '#FFFBF2');
  grad.addColorStop(0.85, '#F5ECD4');
  grad.addColorStop(1, 'rgba(235, 220, 190, 0)');
  ctx.fillStyle = grad;
  ctx.fill();
  return new THREE.CanvasTexture(c);
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function SplashScreen() {
  // Session storage check with ?splash=1 override
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('splash') === '1') return true;
    if (SPLASH_CONFIG.showOncePerSession && sessionStorage.getItem('splashSeen')) {
      return false;
    }
    return true;
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(20);
  const [isOpening, setIsOpening] = useState(false);

  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  const textGroupRef = useRef(null);
  const flashRef = useRef(null);
  const envelopeStageRef = useRef(null);
  const envelope3DRef = useRef(null);
  const flapRef = useRef(null);
  const envelopeCardRef = useRef(null);
  const sealLeftRef = useRef(null);
  const sealRightRef = useRef(null);
  const sealWholeRef = useRef(null);
  const bookContainerRef = useRef(null);
  const bookFlipperRef = useRef(null);
  const burstPetalsRef = useRef([]);

  /* ── CLOSE & UNMOUNT HANDLER ── */
  const finalizeClose = () => {
    sessionStorage.setItem('splashSeen', 'true');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.scrollTo(0, 0);
    setIsVisible(false);
  };

  /* ── LOCK SCROLLING WHILE SPLASH IS ACTIVE ── */
  useEffect(() => {
    if (!isVisible) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevDocOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevDocOverflow;
    };
  }, [isVisible]);

  /* ── PRELOAD SIMULATOR & MAX TIMEOUT ── */
  useEffect(() => {
    if (!isVisible) return;

    let p = 25;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 26 + 12);
      if (p >= 100) {
        p = 100;
        setLoadProgress(100);
        setIsLoaded(true);
        clearInterval(interval);
      } else {
        setLoadProgress(p);
      }
    }, 180);

    // Preload hero image
    const img = new Image();
    img.src = '/frames/ezgif-frame-001.jpg';

    // Maximum 4s fallback
    const maxTimer = setTimeout(() => {
      setLoadProgress(100);
      setIsLoaded(true);
      clearInterval(interval);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(maxTimer);
    };
  }, [isVisible]);

  /* ── MOUSE PARALLAX TILT ON ENVELOPE (DESKTOP) ── */
  useEffect(() => {
    if (!isVisible || isOpening) return;

    const handleMouseMove = (e) => {
      if (!envelope3DRef.current) return;
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(envelope3DRef.current, {
        rotateY: xPct * 7,
        rotateX: -yPct * 7,
        duration: 0.45,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible, isOpening]);

  /* ── THREE.JS PETAL & GOLD DUST CANVAS (LIGHTWEIGHT AMBIENT LAYER) ── */
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? SPLASH_CONFIG.particleCount.mobile : SPLASH_CONFIG.particleCount.desktop;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 20;

    const petalTex = createPetalTexture();
    const petalGeo = new THREE.PlaneGeometry(0.35, 0.55);
    const petalMat = new THREE.MeshBasicMaterial({
      map: petalTex,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const petals = [];
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(petalGeo, petalMat);
      mesh.position.set((Math.random() - 0.5) * 32, (Math.random() - 0.5) * 24, (Math.random() - 0.5) * 8);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);
      petals.push({
        mesh,
        baseX: mesh.position.x,
        vy: -(0.012 + Math.random() * 0.016),
        vx: (Math.random() - 0.5) * 0.008,
        vz: 0,
        rx: (Math.random() - 0.5) * 0.02,
        ry: (Math.random() - 0.5) * 0.02,
      });
    }
    burstPetalsRef.current = petals;

    // Golden firefly dust
    const dustCount = isMobile ? 18 : 36;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 34;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 26;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xE8D296,
      size: isMobile ? 0.28 : 0.42,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(dustGeo, dustMat));

    let raf;
    const clock = new THREE.Clock();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      petals.forEach((p) => {
        p.mesh.position.y += p.vy;
        p.mesh.position.x += p.vx + Math.sin(t * 1.1 + p.baseX) * 0.004;
        p.mesh.position.z += p.vz;
        p.mesh.rotation.x += p.rx;
        p.mesh.rotation.y += p.ry;
        if (p.mesh.position.y < -14) {
          p.mesh.position.y = 14;
          p.mesh.position.x = (Math.random() - 0.5) * 32;
        }
      });
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      petalGeo.dispose();
      petalTex.dispose();
      petalMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
    };
  }, [isVisible]);

  /* ── OPEN ANIMATION (GSAP 5.0S MASTER TIMELINE) ── */
  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Trigger wedding background music ("Love At First Sight.mp3")
    if (SPLASH_CONFIG.musicOnTap) {
      try {
        const playBtn = document.querySelector('button[data-audio-player]') || document.querySelector('button[aria-label*="Play ambient"]');
        if (playBtn) playBtn.click();
      } catch {
        // Fail silently
      }
    }

    // Prefers-reduced-motion fallback
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: finalizeClose,
      });
      return;
    }

    // Stop idle float during scripted timeline
    if (envelope3DRef.current) {
      envelope3DRef.current.classList.remove('envelope-floating');
      gsap.to(envelope3DRef.current, { rotateX: 0, rotateY: 0, duration: 0.3 });
    }

    const tl = gsap.timeline({
      onComplete: finalizeClose,
    });

    /* ── 0.0s: UI text and button fade out; seal glows, cracks & falls ── */
    tl.to(
      textGroupRef.current,
      {
        autoAlpha: 0,
        y: 18,
        duration: 0.45,
        ease: 'power2.in',
      },
      0
    );

    // Wax seal crack effect
    tl.to(
      sealWholeRef.current,
      {
        scale: 1.15,
        duration: 0.25,
        ease: 'power2.out',
      },
      0
    );
    tl.to(
      sealLeftRef.current,
      {
        x: -24,
        y: 12,
        rotation: -25,
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power2.in',
      },
      0.25
    );
    tl.to(
      sealRightRef.current,
      {
        x: 24,
        y: 12,
        rotation: 25,
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power2.in',
      },
      0.25
    );

    /* ── 0.5s: Flap rotates open in 3D (0 -> -180deg) ── */
    tl.to(
      flapRef.current,
      {
        rotateX: -180,
        duration: 0.85,
        ease: 'power3.inOut',
      },
      0.5
    );

    /* ── 1.2s: The invitation card slides up out of envelope (y -65%) ── */
    tl.to(
      envelopeCardRef.current,
      {
        y: '-65%',
        scale: 1.12,
        duration: 0.85,
        ease: 'power3.out',
      },
      1.2
    );

    /* ── 2.0s: Envelope drops down & fades away; book card moves to center ── */
    tl.to(
      envelopeStageRef.current,
      {
        y: 140,
        autoAlpha: 0,
        duration: 0.65,
        ease: 'power2.in',
      },
      2.0
    );

    tl.fromTo(
      bookContainerRef.current,
      {
        autoAlpha: 0,
        scale: 0.75,
        y: -30,
      },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out',
      },
      2.05
    );

    /* ── 2.6s: Book unfolds: Left panel rotates 0 -> -170deg ── */
    tl.to(
      bookFlipperRef.current,
      {
        rotateY: -170,
        duration: 1.25,
        ease: 'power3.inOut',
      },
      2.6
    );

    /* ── 3.6s: Petals & sparkles burst outward around card ── */
    burstPetalsRef.current.forEach((p) => {
      tl.to(
        p,
        {
          vz: 0.05 + Math.random() * 0.06,
          vx: (Math.random() - 0.5) * 0.04,
          vy: (Math.random() - 0.5) * 0.04,
          duration: 1.3,
          ease: 'power2.out',
        },
        3.6
      );
    });

    /* ── 4.2s: Camera push-in (scale 1 -> 1.45) & cream flash ── */
    tl.to(
      bookContainerRef.current,
      {
        scale: 1.45,
        duration: 0.65,
        ease: 'power2.in',
      },
      4.2
    );
    tl.to(
      flashRef.current,
      {
        opacity: 1,
        duration: 0.65,
        ease: 'power2.in',
      },
      4.2
    );

    /* ── 4.8s: Overlay autoAlpha 0 & unmount ── */
    tl.to(
      overlayRef.current,
      {
        autoAlpha: 0,
        duration: 0.45,
        ease: 'power2.out',
      },
      4.8
    );
  };

  /* ── SKIP BUTTON ── */
  const handleSkip = () => {
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: finalizeClose,
    });
  };

  /* ── KEYBOARD SHORTCUTS (ENTER / SPACE / ESCAPE) ── */
  useEffect(() => {
    if (!isVisible || isOpening) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isOpening, isLoaded]);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className="splash-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation Splash Screen"
    >
      {/* ── BACKGROUND RADIAL GOLD GLOW ── */}
      <div className="splash-bg-glow" />

      {/* ── KASAVU SCREEN BORDER FRAME ── */}
      <div className="splash-kasavu-frame">
        <span className="splash-corner splash-corner-tl" />
        <span className="splash-corner splash-corner-tr" />
        <span className="splash-corner splash-corner-bl" />
        <span className="splash-corner splash-corner-br" />
      </div>

      {/* ── FAINT TEMPLE MURAL CORNERS (OPACITY 0.05) ── */}
      <div className="splash-mural-corner splash-mural-tl">
        <MuralCornerArt />
      </div>
      <div className="splash-mural-corner splash-mural-br">
        <MuralCornerArt />
      </div>

      {/* ── THREE.JS PETAL & DUST CANVAS ── */}
      <canvas ref={canvasRef} className="splash-canvas" />

      {/* ── SKIP BUTTON ── */}
      <button
        type="button"
        className="splash-skip-btn"
        onClick={handleSkip}
        aria-label="Skip splash screen"
      >
        Skip ✕
      </button>

      {/* ── MAIN CONTENT (FLEX COLUMN, SPACIOUS, ZERO OVERLAP) ── */}
      <div className="splash-main-container">
        {/* ── 3D ENVELOPE STAGE ── */}
        <div ref={envelopeStageRef} className="envelope-stage" onClick={handleOpen}>
          {/* Ground shadow underneath */}
          <div className="envelope-ground-shadow" />

          {/* 3D Envelope */}
          <div ref={envelope3DRef} className="envelope-3d envelope-floating">
            {/* Back layer & emerald green lining */}
            <div className="envelope-back">
              <div className="envelope-inner-lining">
                <div className="envelope-lining-pattern" />
              </div>
            </div>

            {/* Invitation card tucked inside */}
            <div ref={envelopeCardRef} className="envelope-card-item">
              <div className="envelope-card-preview">
                <span className="envelope-card-preview-monogram">A & R</span>
                <span className="envelope-card-preview-sub">Royal Wedding Invitation</span>
              </div>
            </div>

            {/* Front pocket (V-shape opening) */}
            <div className="envelope-front-pocket">
              <div className="envelope-pocket-border" />
            </div>

            {/* Top flap (hinged at top, opens 3D -180deg) */}
            <div ref={flapRef} className="envelope-flap">
              <div className="envelope-flap-front">
                <div className="envelope-flap-gold-trim" />
              </div>
              <div className="envelope-flap-back" />
            </div>

            {/* Wax seal at flap point (breaks in 2 on tap) */}
            <div ref={sealWholeRef} className="wax-seal">
              <div className="wax-seal-body">
                <div className="wax-seal-shine" />
                <span className="wax-seal-monogram">A&R</span>
              </div>
              <div className="wax-seal-halves">
                <div ref={sealLeftRef} className="wax-seal-half" />
                <div ref={sealRightRef} className="wax-seal-half" />
              </div>
            </div>
          </div>
        </div>

        {/* ── UI SECTION BELOW ENVELOPE (MIN 32PX GAP, ZERO OVERLAP) ── */}
        <div ref={textGroupRef} className="splash-text-group">
          <h1 className="splash-names">Ananya & Rohan</h1>
          <p className="splash-date">December 2026 • Kerala</p>

          {!isLoaded ? (
            <div className="splash-loader">
              <div className="splash-progress-track">
                <div className="splash-progress-fill" style={{ width: `${loadProgress}%` }} />
              </div>
              <span className="splash-loader-text">Preparing Invitation...</span>
            </div>
          ) : (
            <button
              type="button"
              className="splash-tap-btn"
              onClick={handleOpen}
              aria-label="Open the wedding invitation"
            >
              <NilavilakkuIcon size={18} lit />
              <span>Tap to Open the Invitation</span>
            </button>
          )}
        </div>
      </div>

      {/* ── EXPANDED 3D BOOK INVITATION (REVEALED IN STATE 2) ── */}
      <div ref={bookContainerRef} className="book-invitation-container">
        <div className="book-invitation-card">
          {/* Base Page (Right side) */}
          <div className="book-panel-right">
            <div className="book-family-header">Together with their families</div>
            <div className="book-couple-names">Ananya & Rohan</div>
            <div className="book-family-header" style={{ fontSize: '0.92rem', margin: '4px 0' }}>
              request the honour of your presence to celebrate their wedding
            </div>
            <div className="book-date-venue">
              <strong>December 11 – 13, 2026</strong>
              <br />
              Kumarakom Lake Resort, Vembanad Lake, Kerala
            </div>
            <div style={{ marginTop: '12px' }}>
              <NilavilakkuIcon size={20} lit />
            </div>
          </div>

          {/* Left Folding Cover (Folds open like a book rotateY 0 -> -170deg) */}
          <div ref={bookFlipperRef} className="book-panel-left-flipper">
            {/* Front of cover */}
            <div className="book-left-front">
              <div className="book-left-front-inner">
                <NilavilakkuIcon size={24} lit />
                <div style={{ fontFamily: 'var(--font-display, "Cinzel Decorative", Georgia, serif)', color: '#E8D296', fontSize: '1.4rem', fontWeight: 800 }}>
                  A & R
                </div>
                <div style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", Georgia, serif)', color: '#F7F2E7', fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.85 }}>
                  The Sacred Union
                </div>
              </div>
            </div>

            {/* Inside of cover (Revealed after flip) */}
            <div className="book-left-back">
              <div className="book-couple-portrait-arch">
                <img src="/frames/ezgif-frame-001.jpg" alt="Ananya & Rohan" />
              </div>
              <p className="book-blessing-text">
                "Two souls, two traditions, one eternal journey by the tranquil backwaters."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FLASH TO CREAM BEFORE UNMOUNT ── */}
      <div ref={flashRef} className="splash-flash" />
    </div>
  );
}
