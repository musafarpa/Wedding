import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  Send, 
  Heart, 
  CheckCircle2, 
  Calendar, 
  User, 
  Users, 
  Utensils, 
  Edit3, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';
import './CountdownRsvpSection.css';

// CONFIG OBJECT (Mandatory top of the file)
export const CONFIG = {
  palette: {
    cream: '#F7F2E7',
    deepGreen: '#0F3B2E',
    gold: '#C9A24B',
    lightGold: '#E8D296',
    darkGold: '#8C6F2A',
  },
  weddingDateISO: "2026-12-12T09:30:00+05:30",
  startDateISO: "2026-04-01T00:00:00+05:30",
  rsvpDeadlineText: "Kindly respond by 20th November 2026",
  scratch: {
    brush: 26,
    brushMobile: 20,
    autoRevealAt: 0.5,
  },
  tilt: 3,
  particleCount: {
    mobile: 10,
    desktop: 24,
  },
  durations: {
    flip: 500,
    tilt: 300,
  },
};

// Dietary label helper
const DIET_LABELS = {
  sadhya: 'Traditional Kerala Sadhya (Pure Veg)',
  jain: 'Jain Friendly Vegetarian',
  coastal: 'Special Kerala Coastal Fare',
};

// Guest count label helper
const GUEST_LABELS = {
  '1': '1 Person (Myself)',
  '2': '2 Persons (Couple)',
  '3': '3 Persons (Family)',
  '4': '4+ Persons (Extended Family)',
};

export default function CountdownRsvpSection() {
  // --- PETALS CANVAS BACKGROUND ---
  const petalsCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = petalsCanvasRef.current;
    if (!canvas) return;

    // Check reduced motion or low concurrency
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? CONFIG.particleCount.mobile : CONFIG.particleCount.desktop;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Observer to pause animation off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Jasmine petal instances
    const petals = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 5 + 4,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.5,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.4 + 0.3,
    }));

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        petals.forEach((p) => {
          p.y += p.speedY;
          p.x += Math.sin(p.angle) * 0.6 + p.speedX;
          p.angle += p.angularSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = `rgba(255, 253, 245, ${p.opacity})`;
          ctx.strokeStyle = `rgba(201, 162, 75, ${p.opacity * 0.3})`;
          ctx.lineWidth = 0.5;

          // Jasmine petal teardrop shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        });
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <section id="rsvp" className="cd-rsvp" aria-label="Wedding Countdown and RSVP">
      <canvas ref={petalsCanvasRef} className="cd-petals-canvas" aria-hidden="true" />
      
      <div className="cd-container">
        {/* HEADER */}
        <header className="cd-header">
          <div className="cd-badge">
            <Clock size={13} aria-hidden="true" />
            <span>Counting The Moments</span>
          </div>

          <h2 className="cd-title">THE COUNTDOWN &amp; RSVP</h2>

          <div className="cd-divider" aria-hidden="true">
            <span className="cd-divider-line" />
            <span className="cd-divider-lamp">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#C9A24B" aria-hidden="true">
                <path d="M12 2 C11 5 8 8 8 11 C8 13.2 9.8 15 12 15 C14.2 15 16 13.2 16 11 C16 8 13 5 12 2 Z M5 16 C5 18.5 8 21 12 21 C16 21 19 18.5 19 16 C18 15.2 15 16 12 16 C9 16 6 15.2 5 16 Z" />
              </svg>
            </span>
            <span className="cd-divider-line" />
          </div>

          <p className="cd-subtitle">
            Every second draws us nearer to the sacred muhurtham. Kindly confirm your gracious attendance.
          </p>
        </header>

        {/* 2-COLUMN STAGE */}
        <div className="cd-stage">
          {/* LEFT COLUMN: Scratch Card & 3D Flip Countdown */}
          <div className="cd-left">
            <ScratchCard />
            <FlipCountdown />
          </div>

          {/* RIGHT COLUMN: 3D RSVP Form & The Golden Pass */}
          <div className="cd-right">
            <RsvpContainer />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   1) SCRATCH CARD COMPONENT
   ===================================================================== */
function ScratchCard() {
  const canvasRef = useRef(null);
  const particlesCanvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const particlesRef = useRef([]);
  const lastSampleTimeRef = useRef(0);
  const lastWidthRef = useRef(0);
  const offscreenCanvasRef = useRef(null);

  // MatchMedia coarse pointer detection for touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(pointer: coarse)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: coarse)');
    const updateTouch = (e) => setIsTouchDevice(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', updateTouch);
      return () => mq.removeEventListener('change', updateTouch);
    } else if (mq.addListener) {
      mq.addListener(updateTouch);
      return () => mq.removeListener(updateTouch);
    }
  }, []);

  // Check sessionStorage once on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('wedding_scratch_revealed');
      if (stored === 'true') {
        setIsRevealed(true);
        setLiveAnnouncement('Wedding date revealed: 12 December 2026 at Kumarakom Lake Resort');
      }
    } catch (e) {}
  }, []);

  // Initialize and paint gold foil
  const initFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.save();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // 1. Rich gold linear gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#8C6F2A');
    grad.addColorStop(0.3, '#E8D296');
    grad.addColorStop(0.65, '#C9A24B');
    grad.addColorStop(1, '#8C6F2A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Diagonal shimmer highlight band
    const shimmerGrad = ctx.createLinearGradient(0, 0, w, h);
    shimmerGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    shimmerGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.22)');
    shimmerGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shimmerGrad;
    ctx.fillRect(0, 0, w, h);

    // 3. Subtle noise pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let i = 0; i < 350; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // 4. Embossed Lotus Icon & Ring in center (Pure vector canvas paths - NO EMOJI)
    ctx.save();
    ctx.translate(w / 2, h / 2 - 16);
    
    // Outer Ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(112, 85, 24, 0.35)';
    ctx.beginPath();
    ctx.arc(1, 1, 32, 0, Math.PI * 2);
    ctx.stroke();

    // Sacred Lotus Vector Petals
    ctx.fillStyle = '#FFE8A3';
    ctx.strokeStyle = '#8C6F2A';
    ctx.lineWidth = 1.2;

    // Center Petal
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.bezierCurveTo(7, -8, 7, 6, 0, 10);
    ctx.bezierCurveTo(-7, 6, -7, -8, 0, -14);
    ctx.fill();
    ctx.stroke();

    // Left Petal
    ctx.beginPath();
    ctx.moveTo(-1, 8);
    ctx.bezierCurveTo(-14, 4, -18, -6, -10, -8);
    ctx.bezierCurveTo(-5, -6, -2, 0, -1, 8);
    ctx.fill();
    ctx.stroke();

    // Right Petal
    ctx.beginPath();
    ctx.moveTo(1, 8);
    ctx.bezierCurveTo(14, 4, 18, -6, 10, -8);
    ctx.bezierCurveTo(5, -6, 2, 0, 1, 8);
    ctx.fill();
    ctx.stroke();

    // Base calyx
    ctx.beginPath();
    ctx.arc(0, 10, 4, 0, Math.PI);
    ctx.fill();
    ctx.restore();

    // 5. "SCRATCH TO REVEAL" Heading (No emoji)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '0.18em';
    
    // Inset shadow text
    ctx.fillStyle = 'rgba(74, 53, 11, 0.45)';
    ctx.fillText('SCRATCH TO REVEAL', w / 2 + 0.5, h / 2 + 36);
    // Highlight text
    ctx.fillStyle = '#3E2A05';
    ctx.fillText('SCRATCH TO REVEAL', w / 2, h / 2 + 35);

    // 6. Hint Subtitle (Dynamic for touch vs mouse, >= 15px font)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const hintText = isTouch ? 'Scratch with your finger' : 'Scratch with your mouse';
    ctx.font = 'italic 15px Georgia, serif';
    ctx.fillStyle = 'rgba(74, 53, 11, 0.88)';
    ctx.fillText(hintText, w / 2, h / 2 + 58);
    ctx.restore(); // restore heading save
    ctx.restore(); // restore initial ctx.save() with scale
  }, [isRevealed]);

  // Reveal trigger handler
  const revealCard = useCallback(() => {
    if (isRevealed) return;
    setIsRevealed(true);
    setLiveAnnouncement('Wedding date revealed: 12 December 2026 at Kumarakom Lake Resort');

    try {
      sessionStorage.setItem('wedding_scratch_revealed', 'true');
    } catch (e) {}

    // Petals & gold sparkle burst
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C9A24B', '#E8D296', '#8C6F2A', '#FFFDF8'],
      });
    } catch (err) {}
  }, [isRevealed]);

  // Fast & efficient cleared percentage check via small offscreen canvas (60x38), throttled to 200ms
  const checkClearedPercentage = useCallback((force = false) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const now = Date.now();
    if (!force && now - lastSampleTimeRef.current < 200) return;
    lastSampleTimeRef.current = now;

    try {
      if (!offscreenCanvasRef.current) {
        offscreenCanvasRef.current = document.createElement('canvas');
        offscreenCanvasRef.current.width = 60;
        offscreenCanvasRef.current.height = 38;
      }
      const offCanvas = offscreenCanvasRef.current;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.clearRect(0, 0, 60, 38);
      offCtx.drawImage(canvas, 0, 0, 60, 38);

      const imgData = offCtx.getImageData(0, 0, 60, 38);
      const data = imgData.data;
      let clearedCount = 0;
      const totalPixels = 60 * 38;

      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 48) {
          clearedCount++;
        }
      }

      // Auto-reveal at 40% on touch devices, 50% on desktop
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const threshold = isTouch ? 0.40 : 0.50;

      if (clearedCount / totalPixels >= threshold) {
        revealCard();
      }
    } catch (_) {}
  }, [isRevealed, revealCard]);

  // ResizeObserver: Sizing canvas only when dimensions > 0, re-initializing ONLY on width changes > 2px
  // NEVER redraw on mobile address-bar height changes, scroll, or while stroke is active
  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetEl = canvas.parentElement || canvas;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) return;
        if (isDrawingRef.current) return;

        // Re-initialize only if width changed by more than 2px
        if (Math.abs(width - lastWidthRef.current) > 2) {
          lastWidthRef.current = width;
          initFoil();
        }
      }
    });

    ro.observe(targetEl);
    return () => ro.disconnect();
  }, [initFoil, isRevealed]);

  // Pointer event listeners attached directly to canvas with { passive: false }
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const handlePointerDown = (e) => {
      if (isRevealed) return;
      e.preventDefault();
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {}

      isDrawingRef.current = true;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      lastPointRef.current = { x, y };

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const isMobile = window.innerWidth < 640;
      const radius = (isMobile ? 24 : 26) * dpr;

      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      checkClearedPercentage();
    };

    const handlePointerMove = (e) => {
      if (!isDrawingRef.current || isRevealed) return;
      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const isMobile = window.innerWidth < 640;
      const radius = (isMobile ? 24 : 26) * dpr;

      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = radius * 2;

      const coalesced = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : null;
      const events = (coalesced && coalesced.length > 0) ? coalesced : [e];
      for (const ev of events) {
        const x = (ev.clientX - rect.left) * (canvas.width / rect.width);
        const y = (ev.clientY - rect.top) * (canvas.height / rect.height);

        if (lastPointRef.current) {
          ctx.beginPath();
          ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        lastPointRef.current = { x, y };

        // Gold dust particles (max 30 active)
        if (particlesRef.current.length < 30) {
          particlesRef.current.push({
            x: x / dpr,
            y: y / dpr,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.8) * 3,
            radius: Math.random() * 2 + 1,
            life: 1,
          });
        }
      }
      ctx.restore();

      checkClearedPercentage();
    };

    const handlePointerUp = (e) => {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}
      checkClearedPercentage(true);
    };

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
    canvas.addEventListener('pointermove', handlePointerMove, { passive: false });
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('lostpointercapture', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('lostpointercapture', handlePointerUp);
    };
  }, [isRevealed, checkClearedPercentage]);

  // Particles animation frame loop
  useEffect(() => {
    if (isRevealed) return;
    const pCanvas = particlesCanvasRef.current;
    if (!pCanvas) return;

    const pCtx = pCanvas.getContext('2d');
    let frameId;

    const updateParticles = () => {
      const rect = pCanvas.getBoundingClientRect();
      pCanvas.width = rect.width;
      pCanvas.height = rect.height;

      pCtx.clearRect(0, 0, rect.width, rect.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= 0.035;

        pCtx.save();
        pCtx.fillStyle = `rgba(232, 210, 150, ${Math.max(0, p.life)})`;
        pCtx.shadowColor = '#C9A24B';
        pCtx.shadowBlur = 4;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
      });

      frameId = requestAnimationFrame(updateParticles);
    };

    updateParticles();
    return () => cancelAnimationFrame(frameId);
  }, [isRevealed]);

  return (
    <div className="cd-scratch-container" data-lenis-prevent="true">
      {/* Screen Reader polite live region */}
      <span className="sr-only" aria-live="polite">
        {liveAnnouncement}
      </span>

      <div
        className="cd-scratch-card"
        data-lenis-prevent="true"
        tabIndex={0}
        role="button"
        aria-label="Scratch card to reveal the sacred wedding date. Press Enter or Space to reveal."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            revealCard();
          }
        }}
      >
        {/* UNDERNEATH REAL DOM PRIZE LAYER */}
        <div className="cd-scratch-prize">
          <span className="cd-prize-tag">Save The Date</span>
          <div className={`cd-prize-date ${isRevealed ? 'revealed-glow' : ''}`}>
            12 December 2026
          </div>
          <div className="cd-prize-time">Saturday • 09:30 AM IST</div>
          <div className="cd-prize-venue">
            <span>Kumarakom Lake Resort</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#C9A24B" aria-hidden="true">
              <path d="M12 2 C11 5 8 8 8 11 C8 13.2 9.8 15 12 15 C14.2 15 16 13.2 16 11 C16 8 13 5 12 2 Z M5 16 C5 18.5 8 21 12 21 C16 21 19 18.5 19 16 C18 15.2 15 16 12 16 C9 16 6 15.2 5 16 Z" />
            </svg>
          </div>
        </div>

        {/* OVERLAY FOIL CANVAS */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="cd-scratch-canvas"
            aria-label="Scratch surface"
          />
        )}

        {/* GOLD DUST PARTICLES OVERLAY */}
        {!isRevealed && (
          <canvas
            ref={particlesCanvasRef}
            className="cd-scratch-particles"
            aria-hidden="true"
          />
        )}
      </div>

      {/* ACCESSIBLE REVEAL BUTTON */}
      {!isRevealed ? (
        <button
          type="button"
          onClick={revealCard}
          className="cd-scratch-reveal-btn"
          aria-label="Reveal the wedding date without scratching"
        >
          Reveal instead
        </button>
      ) : (
        <span style={{ fontSize: '0.85rem', color: '#8C6F2A', marginTop: '16px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#C9A24B" /> Date Revealed
        </span>
      )}

      {/* SCROLL CAPTION FOR MOBILE */}
      <span className="cd-scratch-scroll-hint">
        Scroll by touching outside the card
      </span>
    </div>
  );
}

/* =====================================================================
   2) 3D FLIP-CLOCK COUNTDOWN COMPONENT
   ===================================================================== */
function FlipCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const prevDigitsRef = useRef({ days: -1, hours: -1, minutes: -1, seconds: -1 });
  const [flippingUnits, setFlippingUnits] = useState({});
  const [ariaLabelText, setAriaLabelText] = useState('');
  const lastAriaUpdateRef = useRef(0);

  // Time Calculation
  const calculateTime = useCallback(() => {
    const target = new Date(CONFIG.weddingDateISO).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Flip animation trigger for changing digits only
    const prev = prevDigitsRef.current;
    const changed = {};

    if (prev.days !== days && prev.days !== -1) changed.days = true;
    if (prev.hours !== hours && prev.hours !== -1) changed.hours = true;
    if (prev.minutes !== minutes && prev.minutes !== -1) changed.minutes = true;
    if (prev.seconds !== seconds && prev.seconds !== -1) changed.seconds = true;

    if (Object.keys(changed).length > 0) {
      setFlippingUnits(changed);
      setTimeout(() => setFlippingUnits({}), CONFIG.durations.flip);
    }

    prevDigitsRef.current = { days, hours, minutes, seconds };
    setTimeLeft({ days, hours, minutes, seconds, isExpired: false });

    // Update aria-label only once a minute to avoid noisy screen reader announcements
    if (now - lastAriaUpdateRef.current >= 60000 || !ariaLabelText) {
      lastAriaUpdateRef.current = now;
      setAriaLabelText(`${days} days, ${hours} hours, and ${minutes} minutes remaining until the wedding`);
    }
  }, [ariaLabelText]);

  useEffect(() => {
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [calculateTime]);

  // Elapsed Time Progress Bar calculation
  const progressPercent = useMemo(() => {
    const start = new Date(CONFIG.startDateISO).getTime();
    const target = new Date(CONFIG.weddingDateISO).getTime();
    const now = Date.now();
    const totalSpan = target - start;
    const elapsed = now - start;
    if (totalSpan <= 0) return 100;
    return Math.min(Math.max((elapsed / totalSpan) * 100, 0), 100);
  }, [timeLeft.seconds]);

  const units = [
    { label: 'Days', val: timeLeft.days, key: 'days' },
    { label: 'Hours', val: timeLeft.hours, key: 'hours' },
    { label: 'Minutes', val: timeLeft.minutes, key: 'minutes' },
    { label: 'Seconds', val: timeLeft.seconds, key: 'seconds' },
  ];

  return (
    <div className="cd-flip-wrapper" aria-label={ariaLabelText}>
      {timeLeft.isExpired ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #C9A24B' }}>
          <h3 style={{ fontFamily: 'var(--font-display, serif)', color: '#0F3B2E', fontSize: '1.5rem', margin: 0 }}>
            Today is the day!
          </h3>
          <p style={{ color: '#8C6F2A', marginTop: '0.4rem', fontSize: '0.95rem' }}>
            The sacred muhurtham has arrived.
          </p>
        </div>
      ) : (
        <>
          <div className="cd-flip-grid" aria-hidden="true">
            {units.map((u) => {
              const isFlipping = !!flippingUnits[u.key];
              return (
                <div key={u.label} className="cd-flip-tile">
                  <div className={`cd-flip-num ${isFlipping ? 'flipping' : ''}`}>
                    {String(u.val).padStart(2, '0')}
                  </div>
                  <div className="cd-flip-label">{u.label}</div>
                </div>
              );
            })}
          </div>

          {/* PROGRESS TRACK & NILAVILAKKU MARKER */}
          <div className="cd-progress-wrap" aria-hidden="true">
            <div className="cd-progress-track">
              <div 
                className="cd-progress-fill" 
                style={{ width: `${progressPercent}%` }} 
              />
              <div 
                className="cd-progress-lamp" 
                style={{ left: `${progressPercent}%` }}
                title="Sacred Journey Progress"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C12 2 8 7 8 11C8 13.2 9.8 15 12 15C14.2 15 16 13.2 16 11C16 7 12 2 12 2Z" fill="#F4D03F" />
                  <path d="M12 5C12 5 10 8 10 10.5C10 11.9 10.9 13 12 13C13.1 13 14 11.9 14 10.5C14 8 12 5 12 5Z" fill="#E86C1E" />
                  <ellipse cx="12" cy="17" rx="8" ry="2.5" fill="#C9A24B" stroke="#8C6F2A" strokeWidth="0.8" />
                  <path d="M6 17L12 22L18 17" fill="#B38E32" />
                  <rect x="10.5" y="19" width="3" height="3" fill="#8C6F2A" />
                  <ellipse cx="12" cy="22" rx="4" ry="1.2" fill="#C9A24B" />
                </svg>
              </div>
            </div>
            <div className="cd-progress-labels">
              <span>Journey Began</span>
              <span>12 Dec 2026</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =====================================================================
   3) RSVP CONTAINER: 3D FORM & GOLDEN PASS FLIP CARD
   ===================================================================== */
function RsvpContainer() {
  const [formData, setFormData] = useState({
    guestName: '',
    emailOrPhone: '',
    attendance: 'accept', // 'accept' | 'decline'
    guestCount: '2',
    dietPreference: 'sadhya',
    blessing: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRSVP, setSubmittedRSVP] = useState(null);
  const [isFieldFocused, setIsFieldFocused] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [submitError, setSubmitError] = useState(null);
  const [liveStatus, setLiveStatus] = useState('');

  // Restore saved RSVP from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wedding_rsvp_record');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSubmittedRSVP(parsed);
        setFormData(parsed);
      }
    } catch (e) {}
  }, []);

  // Desktop 3D Card Tilt (Locked when any input is focused to prevent distraction)
  const handleMouseMove = (e) => {
    if (isFieldFocused || window.innerWidth < 992) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * CONFIG.tilt;
    const rotY = (x / (rect.width / 2)) * CONFIG.tilt;
    setCardTilt({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  // Validation
  const validate = () => {
    const errors = {};
    if (!formData.guestName.trim()) {
      errors.guestName = 'Please enter your full name';
    }
    if (!formData.emailOrPhone.trim()) {
      errors.emailOrPhone = 'Please provide your email or phone number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const record = {
          ...formData,
          submittedAt: new Date().toISOString(),
        };

        // Exact storage key preserved
        localStorage.setItem('wedding_rsvp_record', JSON.stringify(record));
        setSubmittedRSVP(record);
        setIsSubmitting(false);
        setLiveStatus(`RSVP confirmed for ${record.guestName}. Your Golden Invitation Pass is ready.`);

        // Confetti celebration
        if (formData.attendance === 'accept') {
          confetti({
            particleCount: 110,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#f7ebb8', '#0d3325', '#e2c474', '#ffffff'],
          });
        }
      } catch (err) {
        setIsSubmitting(false);
        setSubmitError('Unable to record your response. Please try again.');
      }
    }, 600);
  };

  // Edit Response: Flips back to form with previous values intact
  const handleEditResponse = () => {
    setSubmittedRSVP(null);
    setLiveStatus('Returned to RSVP editing form.');
  };

  return (
    <div
      className="cd-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
        transition: isFieldFocused ? 'transform 0.4s ease' : 'transform 0.15s ease-out',
      }}
    >
      {/* Polite Screen Reader Live Announcement */}
      <span className="sr-only" aria-live="polite">
        {liveStatus}
      </span>

      <div className={`cd-card-flip-stage ${submittedRSVP ? 'flipped' : ''}`}>
        {/* FRONT: RSVP FORM */}
        <div className="cd-rsvp-card">
          <div className="cd-rsvp-header">
            <h3 className="cd-rsvp-deadline">
              {CONFIG.rsvpDeadlineText}
            </h3>
            <p className="cd-rsvp-sub">
              Please assist us in preparing the grand Kerala feast and accommodations.
            </p>
          </div>

          {submitError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.25rem', textAlign: 'center', fontSize: '0.88rem' }}>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* WILL YOU BE JOINING US? (Side by Side Selectable Cards) */}
            <div className="cd-field-group">
              <label className="cd-label">Will you be joining us? *</label>
              <div className="cd-choice-grid">
                {/* Accept Card */}
                <label 
                  className={`cd-choice-card ${formData.attendance === 'accept' ? 'selected' : ''}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFormData({ ...formData, attendance: 'accept' });
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="accept"
                    checked={formData.attendance === 'accept'}
                    onChange={() => setFormData({ ...formData, attendance: 'accept' })}
                  />
                  <Heart size={16} fill={formData.attendance === 'accept' ? 'currentColor' : 'none'} />
                  <span>Joyfully Accept</span>
                  {formData.attendance === 'accept' && (
                    <CheckCircle2 size={16} className="cd-choice-check" />
                  )}
                </label>

                {/* Decline Card */}
                <label 
                  className={`cd-choice-card ${formData.attendance === 'decline' ? 'selected' : ''}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFormData({ ...formData, attendance: 'decline' });
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="decline"
                    checked={formData.attendance === 'decline'}
                    onChange={() => setFormData({ ...formData, attendance: 'decline' })}
                  />
                  <span role="img" aria-label="Folded hands">🙏</span>
                  <span>Regretfully Decline</span>
                  {formData.attendance === 'decline' && (
                    <CheckCircle2 size={16} className="cd-choice-check" />
                  )}
                </label>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="cd-field-group">
              <label htmlFor="guestName" className="cd-label">
                Full Name *
              </label>
              <input
                id="guestName"
                type="text"
                required
                className={`cd-input ${formErrors.guestName ? 'error' : ''}`}
                placeholder="e.g. Dr. Gautham Menon"
                value={formData.guestName}
                onFocus={() => setIsFieldFocused(true)}
                onBlur={() => setIsFieldFocused(false)}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({ ...prev, guestName: val }));
                  if (formErrors.guestName) {
                    setFormErrors((prev) => ({ ...prev, guestName: undefined }));
                  }
                }}
                aria-invalid={!!formErrors.guestName}
                aria-describedby={formErrors.guestName ? 'guestName-error' : undefined}
              />
              {formErrors.guestName && (
                <div id="guestName-error" className="cd-error-msg">
                  {formErrors.guestName}
                </div>
              )}
            </div>

            {/* EMAIL OR MOBILE */}
            <div className="cd-field-group">
              <label htmlFor="emailOrPhone" className="cd-label">
                Email or Mobile Number *
              </label>
              <input
                id="emailOrPhone"
                type="text"
                required
                className={`cd-input ${formErrors.emailOrPhone ? 'error' : ''}`}
                placeholder="e.g. gautham@example.com / +91 98470..."
                value={formData.emailOrPhone}
                onFocus={() => setIsFieldFocused(true)}
                onBlur={() => setIsFieldFocused(false)}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({ ...prev, emailOrPhone: val }));
                  if (formErrors.emailOrPhone) {
                    setFormErrors((prev) => ({ ...prev, emailOrPhone: undefined }));
                  }
                }}
                aria-invalid={!!formErrors.emailOrPhone}
                aria-describedby={formErrors.emailOrPhone ? 'emailOrPhone-error' : undefined}
              />
              {formErrors.emailOrPhone && (
                <div id="emailOrPhone-error" className="cd-error-msg">
                  {formErrors.emailOrPhone}
                </div>
              )}
            </div>

            {/* TOTAL GUESTS & DIETARY PREFERENCE (Collapsed when declined) */}
            <div className={`cd-select-row ${formData.attendance === 'decline' ? 'collapsed' : ''}`}>
              <div className="cd-field-group">
                <label htmlFor="guestCount" className="cd-label">
                  Total Guests Attending
                </label>
                <select
                  id="guestCount"
                  className="cd-select"
                  value={formData.guestCount}
                  onFocus={() => setIsFieldFocused(true)}
                  onBlur={() => setIsFieldFocused(false)}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                >
                  <option value="1">1 Person (Just Myself)</option>
                  <option value="2">2 Persons (Couple)</option>
                  <option value="3">3 Persons (Family)</option>
                  <option value="4">4+ Persons (Extended Family)</option>
                </select>
              </div>

              <div className="cd-field-group">
                <label htmlFor="dietPreference" className="cd-label">
                  Dietary Preference
                </label>
                <select
                  id="dietPreference"
                  className="cd-select"
                  value={formData.dietPreference}
                  onFocus={() => setIsFieldFocused(true)}
                  onBlur={() => setIsFieldFocused(false)}
                  onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value })}
                >
                  <option value="sadhya">Traditional Kerala Sadhya (Pure Veg)</option>
                  <option value="jain">Jain Friendly Vegetarian</option>
                  <option value="coastal">Special Kerala Coastal Fare</option>
                </select>
              </div>
            </div>

            {/* WARM WISHES & BLESSINGS (Optional, max 300) */}
            <div className="cd-field-group">
              <label htmlFor="blessing" className="cd-label">
                Warm Wishes &amp; Blessings for Ananya &amp; Rohan (Optional)
              </label>
              <textarea
                id="blessing"
                rows={3}
                maxLength={300}
                className="cd-textarea"
                placeholder="May your journey be filled with endless joy, love, and laughter..."
                value={formData.blessing}
                onFocus={() => setIsFieldFocused(true)}
                onBlur={() => setIsFieldFocused(false)}
                onChange={(e) => setFormData({ ...formData, blessing: e.target.value })}
              />
              <span className="cd-char-counter">
                {formData.blessing.length} / 300
              </span>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="cd-submit-btn"
              aria-label="Send RSVP Confirmation"
            >
              <Send size={18} className="cd-btn-plane" aria-hidden="true" />
              <span>
                {isSubmitting ? 'Recording Your Response...' : 'Send RSVP Confirmation'}
              </span>
            </button>
          </form>
        </div>

        {/* BACK: THE GOLDEN PASS */}
        {submittedRSVP && (
          <GoldenPass
            record={submittedRSVP}
            onEdit={handleEditResponse}
          />
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   4) THE GOLDEN PASS (FLIP CARD BACKSIDE)
   ===================================================================== */
function GoldenPass({ record, onEdit }) {
  // Exact Google Calendar URL generation
  const googleCalendarUrl = useMemo(() => {
    const title = encodeURIComponent("Ananya & Rohan's Wedding — The Sacred Muhurtham");
    const details = encodeURIComponent(
      "Join us in celebrating the traditional Kerala wedding ceremony of Ananya Menon & Rohan Varma at Kumarakom Lake Resort."
    );
    const location = encodeURIComponent("Kumarakom Lake Resort, Kottayam, Kerala");
    // 12 Dec 2026, 09:30 AM IST (04:00 UTC) to 12:30 PM IST (07:00 UTC)
    const dates = "20261212T040000Z/20261212T070000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  }, []);

  const isAccepted = record.attendance === 'accept';

  return (
    <div className="cd-pass-card" role="region" aria-label="Your Golden Invitation Pass">
      {/* PASS HEADER */}
      <div className="cd-pass-header">
        <div className="cd-pass-monogram" aria-hidden="true">
          A&amp;R
        </div>

        <div className="cd-pass-title-group" style={{ textAlign: 'left', flex: 1, marginLeft: '1rem' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8C6F2A', fontWeight: 800 }}>
            GOLDEN INVITATION PASS
          </div>
          <div style={{ fontFamily: 'var(--font-display, serif)', fontSize: '1.15rem', color: '#0F3B2E', fontWeight: 700 }}>
            ANANYA &amp; ROHAN
          </div>
        </div>

        <div className={`cd-pass-status-badge ${isAccepted ? 'accepted' : ''}`}>
          {isAccepted ? 'Joyfully Accepted' : 'With Regret'}
        </div>
      </div>

      {/* GUEST NAME */}
      <div>
        <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8C6F2A', fontWeight: 600 }}>
          Gracious Guest
        </div>
        <h4 className="cd-pass-guest-name">
          {record.guestName}
        </h4>
      </div>

      {/* DETAILS GRID */}
      <div className="cd-pass-details-grid">
        <div className="cd-pass-detail-item">
          <span className="cd-pass-detail-label">Status</span>
          <span className="cd-pass-detail-val">
            {isAccepted ? `${GUEST_LABELS[record.guestCount] || `${record.guestCount} Guests`}` : 'Warm Wishes Sent'}
          </span>
        </div>

        <div className="cd-pass-detail-item">
          <span className="cd-pass-detail-label">Dietary Preference</span>
          <span className="cd-pass-detail-val">
            {isAccepted ? (DIET_LABELS[record.dietPreference] || 'Kerala Sadhya') : 'Decline Recorded'}
          </span>
        </div>

        <div className="cd-pass-detail-item">
          <span className="cd-pass-detail-label">Ceremony Date</span>
          <span className="cd-pass-detail-val">12 Dec 2026 • 09:30 AM</span>
        </div>

        <div className="cd-pass-detail-item">
          <span className="cd-pass-detail-label">Venue</span>
          <span className="cd-pass-detail-val">Kumarakom Lake Resort</span>
        </div>
      </div>

      {/* BLESSING NOTE IF PROVIDED */}
      {record.blessing && (
        <div
          style={{
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: '#3D5A4E',
            background: 'rgba(201, 162, 75, 0.08)',
            padding: '0.65rem 0.95rem',
            borderRadius: '10px',
            borderLeft: '2.5px solid #C9A24B',
            margin: '0.5rem 0',
          }}
        >
          "{record.blessing}"
        </div>
      )}

      {/* DECORATIVE NON-SCANNABLE BARCODE */}
      <div className="cd-pass-barcode" aria-hidden="true">
        {[2, 4, 1, 3, 5, 2, 6, 2, 4, 1, 3, 6, 2, 4, 1, 5, 3, 2, 4, 2, 5, 1, 3, 6, 2].map((w, idx) => (
          <div
            key={idx}
            className="cd-barcode-line"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="cd-pass-actions">
        {isAccepted && (
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cd-pass-btn-cal"
            aria-label="Add Ananya and Rohan's wedding ceremony to Google Calendar"
          >
            <Calendar size={15} aria-hidden="true" />
            <span>Add to Calendar</span>
          </a>
        )}

        <button
          type="button"
          onClick={onEdit}
          className="cd-pass-btn-edit"
          aria-label="Edit your submitted RSVP response"
        >
          <Edit3 size={15} aria-hidden="true" />
          <span>Edit Response</span>
        </button>
      </div>
    </div>
  );
}
