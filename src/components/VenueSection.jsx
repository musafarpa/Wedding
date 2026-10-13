import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Navigation, ExternalLink, Plane, Train, Compass, Phone, Sparkles } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';
import './VenueSection.css';

gsap.registerPlugin(ScrollTrigger);

// =====================================================================
// CONFIGURATION OBJECT
// =====================================================================
const CONFIG = {
  palette: {
    deepGreen: '#0F3B2E',
    darkEdge: '#0A2A21',
    gold: '#C9A24B',
    lightGold: '#E8D296',
    cream: '#F7F2E7',
  },
  tilt: 5,
  particleCount: { mobile: 10, desktop: 24 },
  durations: {
    reveal: 0.85,
    ease: 'power3.out',
  },
  routes: {
    air: {
      id: 'air',
      label: 'By Air',
      icon: 'Plane',
      distance: 72,
      time: 'approx 1 hr 45 min drive',
      detail: 'Cochin International Airport (COK) — ~72 km (approx 1 hr 45 min drive)',
      desc: 'Scenic highway & rural palm corridor drive south from Nedumbassery through central Kerala directly to the waterfront resort gates.',
      pathD: 'M 180 50 C 220 100, 290 140, 340 210',
    },
    rail: {
      id: 'rail',
      label: 'By Rail',
      icon: 'Train',
      distance: 14,
      time: 'approx 25 min drive',
      detail: 'Kottayam Railway Station (KTYM) — ~14 km (approx 25 min drive)',
      desc: 'A short picturesque 25-minute scenic journey westward through rubber groves and paddy fields right to Lake Vembanad.',
      pathD: 'M 470 310 C 420 270, 380 235, 340 210',
    },
    water: {
      id: 'water',
      label: 'By Water',
      icon: 'Compass',
      distance: null, // scenic cruise
      time: 'scenic shikara cruise',
      detail: 'Special backwater private shikara transfers available from Muhamma jetty',
      desc: 'Glide gently across tranquil Lake Vembanad on handcrafted Kerala shikaras, accompanied by fresh tender coconut refreshments.',
      pathD: 'M 220 185 C 260 195, 300 205, 340 210',
    },
  },
};

// =====================================================================
// CONTENT DATA OBJECT
// =====================================================================
const VENUE_DATA = {
  badge: 'THE DESTINATION',
  title: 'The Wedding Venue',
  subtitle: 'An enchanting heritage sanctuary nestled on the pristine shores of Lake Vembanad.',
  photoCaption: 'Kumarakom Lake Resort • Waterfront Sanctuary on Lake Vembanad',
  label: "GOD'S OWN COUNTRY SANCTUARY",
  name: 'Kumarakom Lake Resort',
  tagline: 'Heritage Waterfront Sanctuary',
  address: 'North Post, Kumarakom, Kottayam, Kerala 686563, India',
  climate: 'December Climate: Pleasant 26°C • Gentle Lake Breeze',
  mapUrl: WEDDING_CONFIG?.venue?.mapUrl || 'https://maps.google.com/?q=Kumarakom+Lake+Resort+Kerala',
  hospitality: {
    contact: '+91 98470 12345 (Rahul Menon)',
    tel: 'tel:+919847012345',
  },
};

// -------------------------------------------------------------
// BACKGROUND CANVAS: WARM MOTES & LOTUS PETALS
// -------------------------------------------------------------
function VenueBackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let isVisible = false;
    let width = 0;
    let height = 0;

    const isMobile = window.innerWidth <= 768;
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const count = isLowPower ? 6 : (isMobile ? CONFIG.particleCount.mobile : CONFIG.particleCount.desktop);

    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.4 + 0.15), // drifting softly upwards
      alpha: Math.random() * 0.5 + 0.2,
      angle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += 0.015;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.angle));
        ctx.fillStyle = '#E8D296';
        ctx.shadowColor = '#C9A24B';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animId) animId = requestAnimationFrame(render);
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      },
      { threshold: 0.1 }
    );

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    window.addEventListener('resize', resize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="venue-bg-canvas" aria-hidden="true" />;
}

// -------------------------------------------------------------
// FLOATING LANTERNS OVER WATER AREA
// -------------------------------------------------------------
function WaterLanternsCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let isVisible = false;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    // 8 floating golden lantern dots
    const lanterns = Array.from({ length: 8 }, () => ({
      x: Math.random() * width,
      y: height * 0.6 + Math.random() * (height * 0.35),
      size: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(Math.random() * 0.25 + 0.1),
      alpha: Math.random() * 0.6 + 0.3,
      angle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      lanterns.forEach((l) => {
        l.x += l.vx;
        l.y += l.vy;
        l.angle += 0.02;

        if (l.y < height * 0.55) l.y = height * 0.95;
        if (l.x < 0) l.x = width;
        if (l.x > width) l.x = 0;

        ctx.save();
        ctx.globalAlpha = l.alpha * (0.7 + 0.3 * Math.sin(l.angle));
        ctx.fillStyle = '#FDE68A';
        ctx.shadowColor = '#C9A24B';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animId) animId = requestAnimationFrame(render);
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      },
      { threshold: 0.1 }
    );

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    window.addEventListener('resize', resize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="venue-lanterns-canvas" aria-hidden="true" />;
}

// =====================================================================
// MAIN VENUE SECTION COMPONENT
// =====================================================================
export default function VenueSection() {
  const sectionRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroDuskRef = useRef(null);
  const cardRef = useRef(null);
  const cardGlareRef = useRef(null);

  // Tab State: 'air' | 'rail' | 'water'
  const [activeTab, setActiveTab] = useState('air');
  const [countedKm, setCountedKm] = useState(0);

  // Path animation refs
  const pathAirRef = useRef(null);
  const pathRailRef = useRef(null);
  const pathWaterRef = useRef(null);
  const travelerRef = useRef(null);

  // 1. Interactive 3D Card Tilt (Desktop)
  const handleCardMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * CONFIG.tilt;
    const rotY = ((x - centerX) / centerX) * CONFIG.tilt;

    card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-3px)`;

    if (cardGlareRef.current) {
      cardGlareRef.current.style.opacity = '0.32';
      cardGlareRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(232, 210, 150, 0.4) 0%, transparent 65%)`;
    }
  };

  const handleCardMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    if (cardGlareRef.current) {
      cardGlareRef.current.style.opacity = '0';
    }
  };

  // 2. Open Google Maps Handler
  const openGoogleMaps = (e) => {
    if (e && e.currentTarget) {
      const btn = e.currentTarget;
      const ripple = document.createElement('span');
      ripple.className = 'cel-btn-ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    window.open(VENUE_DATA.mapUrl, '_blank', 'noopener,noreferrer');
  };

  // 3. Tab Click & Route Path Animation + Km Count-Up
  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    animateRoute(tabKey);
  };

  // Keyboard navigation for Tabs (ArrowLeft / ArrowRight)
  const handleTabKeyDown = (e, currentKey) => {
    const keys = ['air', 'rail', 'water'];
    const idx = keys.indexOf(currentKey);
    let nextIdx = idx;

    if (e.key === 'ArrowRight') {
      nextIdx = (idx + 1) % keys.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + keys.length) % keys.length;
      e.preventDefault();
    }

    if (nextIdx !== idx) {
      const nextKey = keys[nextIdx];
      setActiveTab(nextKey);
      animateRoute(nextKey);
      const btn = document.getElementById(`venue-tab-${nextKey}`);
      if (btn) btn.focus();
    }
  };

  // Animate Route Stroke and Vehicle Position
  const animateRoute = (tabKey) => {
    const route = CONFIG.routes[tabKey];
    if (!route) return;

    // Count up km number
    if (route.distance) {
      const target = route.distance;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => setCountedKm(Math.round(obj.val)),
      });
    } else {
      setCountedKm(0);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetPath = null;
    if (tabKey === 'air') targetPath = pathAirRef.current;
    if (tabKey === 'rail') targetPath = pathRailRef.current;
    if (tabKey === 'water') targetPath = pathWaterRef.current;

    if (targetPath) {
      const len = targetPath.getTotalLength();
      gsap.fromTo(
        targetPath,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out' }
      );

      // Animate vehicle traveling along path
      if (travelerRef.current) {
        const traveler = travelerRef.current;
        const progressObj = { p: 0 };
        gsap.fromTo(
          progressObj,
          { p: 0 },
          {
            p: 1,
            duration: 1.1,
            ease: 'power2.out',
            onUpdate: () => {
              const pt = targetPath.getPointAtLength(progressObj.p * len);
              traveler.setAttribute('cx', pt.x);
              traveler.setAttribute('cy', pt.y);
            },
          }
        );
      }
    }
  };

  // GSAP ScrollTrigger Setup
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // 1. Header reveal
      gsap.from('.venue-badge', {
        y: -25,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.venue-header',
          start: 'top 85%',
        },
      });

      gsap.from('.venue-title', {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.15,
        scrollTrigger: {
          trigger: '.venue-header',
          start: 'top 85%',
        },
      });

      gsap.from('.venue-divider-line', {
        scaleX: 0,
        duration: 0.85,
        ease: 'expo.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: '.venue-header',
          start: 'top 85%',
        },
      });

      gsap.from('.venue-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4,
        scrollTrigger: {
          trigger: '.venue-header',
          start: 'top 85%',
        },
      });

      // 2. Hero photo: Curved arch opening reveal + parallax & dusk shift
      if (!prefersReducedMotion) {
        // Arch reveal
        gsap.fromTo(
          '.venue-hero-frame',
          { clipPath: 'ellipse(70% 0% at 50% 100%)', opacity: 0.6 },
          {
            clipPath: 'ellipse(120% 120% at 50% 50%)',
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.venue-hero',
              start: 'top 80%',
            },
          }
        );

        // 12% Parallax and Ken Burns zoom
        if (heroImgRef.current) {
          gsap.to(heroImgRef.current, {
            yPercent: -12,
            scale: 1.06,
            ease: 'none',
            scrollTrigger: {
              trigger: '.venue-hero',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        // Dusk overlay scrub (golden hour -> dusk)
        if (heroDuskRef.current) {
          gsap.to(heroDuskRef.current, {
            opacity: 0.75,
            ease: 'none',
            scrollTrigger: {
              trigger: '.venue-hero',
              start: 'top center',
              end: 'bottom 20%',
              scrub: true,
            },
          });
        }
      }

      // 3. Staggered 3D reveal for Venue Card and Journey Map
      gsap.from(['.venue-card-wrapper', '.venue-journey'], {
        y: 45,
        rotateX: 8,
        opacity: 0,
        duration: CONFIG.durations.reveal,
        ease: CONFIG.durations.ease,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.venue-hero',
          start: 'center 75%',
        },
        onComplete: () => {
          // Play initial Air route
          animateRoute('air');
        },
      });
    }, sectionRef);

    // Initial route setup
    animateRoute('air');

    return () => ctx.revert();
  }, []);

  const activeRoute = CONFIG.routes[activeTab];

  return (
    <section id="venue" ref={sectionRef} className="venue" aria-label="The Wedding Venue">
      {/* Floating Canvas Motes */}
      <VenueBackgroundCanvas />

      <div className="venue-container">
        {/* Section Header */}
        <header className="venue-header">
          <div className="venue-badge">
            <Sparkles size={13} aria-hidden="true" />
            <span>{VENUE_DATA.badge}</span>
          </div>

          <h2 className="venue-title">{VENUE_DATA.title}</h2>

          <div className="venue-divider">
            <span className="venue-divider-line" />
            <span className="venue-divider-lotus" role="img" aria-label="Sacred Lotus">
              <svg viewBox="0 0 24 24">
                <path d="M12 3 C10.5 7 7.5 9 5 12 C8 13.5 10.5 12 12 9 C13.5 12 16 13.5 19 12 C16.5 9 13.5 7 12 3 Z M12 10 C9.5 14 5 16 2 17 C6 19 10 18 12 15 C14 18 18 19 22 17 C19 16 14.5 14 12 10 Z" />
              </svg>
            </span>
            <span className="venue-divider-line" />
          </div>

          <p className="venue-subtitle">{VENUE_DATA.subtitle}</p>
        </header>

        {/* HERO PANORAMIC PHOTO FRAME (16:8 Desktop / 4:3 Mobile) */}
        <div className="venue-hero">
          <div className="venue-hero-frame">
            <div className="venue-hero-img-wrap">
              <img
                ref={heroImgRef}
                src="/kumarakom-lake-resort.jpg"
                alt="Kumarakom Lake Resort waterfront villas at sunset on Lake Vembanad"
                loading="lazy"
                decoding="async"
                width="1200"
                height="600"
                className="venue-hero-img"
              />
              {/* Golden Hour to Dusk Scrubbed Overlay */}
              <div ref={heroDuskRef} className="venue-hero-dusk-overlay" aria-hidden="true" />

              {/* Water Ripple Shimmer on Lower Third */}
              <div className="venue-hero-water-shimmer" aria-hidden="true" />

              {/* 8 Floating Golden Lanterns over Water Area */}
              <WaterLanternsCanvas />
            </div>
          </div>

          {/* Caption Pill sits BELOW photo edge in normal flow (Never covers crowd) */}
          <div style={{ textAlign: 'center' }}>
            <div className="venue-caption-pill">
              <Compass className="venue-caption-icon" aria-hidden="true" />
              <span>{VENUE_DATA.photoCaption}</span>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN GRID: 5/12 Venue Card and 7/12 Arrival Journey */}
        <div className="venue-grid">
          {/* Left Column: Venue Showcase Card (3D Tilt) */}
          <div className="venue-card-wrapper">
            <article
              ref={cardRef}
              className="venue-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div ref={cardGlareRef} className="venue-card-glare" aria-hidden="true" />

              <div className="venue-card-inner">
                <div className="venue-card-tag">
                  <Sparkles size={13} aria-hidden="true" />
                  <span>{VENUE_DATA.label}</span>
                </div>

                <h3 className="venue-card-title">{VENUE_DATA.name}</h3>
                <p className="venue-card-tagline">{VENUE_DATA.tagline}</p>

                <div className="venue-address-row">
                  <MapPin className="venue-pin-icon" aria-hidden="true" />
                  <span>{VENUE_DATA.address}</span>
                </div>

                {/* Weather Chip: Inline SVG Sun with Rotating Rays & Breeze Line */}
                <div>
                  <div className="venue-weather-chip">
                    <div className="venue-weather-sun-wrap" aria-hidden="true">
                      <svg className="venue-weather-sun" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="5" fill="#E8D296" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                          <line
                            key={i}
                            x1="12"
                            y1="2"
                            x2="12"
                            y2="4.5"
                            stroke="#C9A24B"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            transform={`rotate(${ang} 12 12)`}
                          />
                        ))}
                      </svg>
                    </div>
                    <span>{VENUE_DATA.climate}</span>
                  </div>
                </div>

                {/* Google Maps Button with Gold Shimmer Sweep & Ripple */}
                <div>
                  <button
                    type="button"
                    onClick={openGoogleMaps}
                    className="venue-maps-btn"
                    aria-label="Open Kumarakom Lake Resort in Google Maps"
                  >
                    <Navigation size={16} aria-hidden="true" />
                    <span>Open In Google Maps</span>
                    <ExternalLink size={14} className="venue-btn-arrow" aria-hidden="true" />
                  </button>
                </div>

                {/* Hospitality Contact Card with Pulsing Phone & tel: Link */}
                <div className="venue-hospitality-card">
                  <div className="venue-hosp-left">
                    <div className="venue-phone-pulse" aria-hidden="true">
                      <Phone size={17} />
                    </div>
                    <div className="venue-hosp-text">
                      <span className="venue-hosp-label">Hospitality Team</span>
                      <a href={VENUE_DATA.hospitality.tel} className="venue-tel-link">
                        {VENUE_DATA.hospitality.contact}
                      </a>
                    </div>
                  </div>
                  <span className="venue-tap-hint">Tap to call</span>
                </div>
              </div>
            </article>
          </div>

          {/* Right Column: Animated Route Map (The Centrepiece) & Tabs */}
          <div className="venue-journey">
            <div className="venue-journey-header">
              <h4 className="venue-journey-title">How To Reach The Venue</h4>
            </div>

            {/* Travel Tabs (Role=tablist / tab, Arrow-key navigation) */}
            <div className="venue-tabs" role="tablist" aria-label="Travel routes to venue">
              {Object.keys(CONFIG.routes).map((key) => {
                const r = CONFIG.routes[key];
                const isSelected = activeTab === key;
                return (
                  <button
                    key={key}
                    id={`venue-tab-${key}`}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    aria-controls={`venue-panel-${key}`}
                    tabIndex={isSelected ? 0 : -1}
                    className="venue-tab-btn"
                    onClick={() => handleTabSelect(key)}
                    onKeyDown={(e) => handleTabKeyDown(e, key)}
                  >
                    {key === 'air' && <Plane className="venue-tab-icon" aria-hidden="true" />}
                    {key === 'rail' && <Train className="venue-tab-icon" aria-hidden="true" />}
                    {key === 'water' && <Compass className="venue-tab-icon" aria-hidden="true" />}
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>

            {/* STYLISED DARK-GREEN INLINE SVG MAP */}
            <div className="venue-map-wrap">
              <svg
                className="venue-map-svg"
                viewBox="0 0 600 380"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Stylized map showing travel routes to Kumarakom Lake Resort via Air, Rail, and Water"
              >
                <title>Kumarakom Travel Routes Map</title>

                {/* Lake Vembanad Stylized Shape */}
                <path
                  d="M 120 10 C 180 80, 240 120, 260 200 C 275 260, 290 320, 310 375 L 170 375 C 150 300, 100 240, 80 160 C 65 90, 80 40, 120 10 Z"
                  fill="#0B2E24"
                  stroke="rgba(201, 162, 75, 0.25)"
                  strokeWidth="1"
                />

                {/* Subtle Water Shimmer Waves */}
                <path d="M 150 140 Q 180 135 210 140" stroke="rgba(232, 210, 150, 0.15)" strokeWidth="1" />
                <path d="M 170 220 Q 210 215 250 220" stroke="rgba(232, 210, 150, 0.15)" strokeWidth="1" />
                <path d="M 190 290 Q 230 285 270 290" stroke="rgba(232, 210, 150, 0.15)" strokeWidth="1" />

                {/* Decorative Backwater Palm Glyphs */}
                <g fill="#07221A" opacity="0.6">
                  <circle cx="80" cy="80" r="14" />
                  <circle cx="480" cy="180" r="16" />
                  <circle cx="430" cy="110" r="12" />
                  <circle cx="520" cy="240" r="15" />
                </g>

                {/* 1. Air Route Path (Cochin Airport -> Kumarakom) */}
                <path
                  ref={pathAirRef}
                  d={CONFIG.routes.air.pathD}
                  stroke="#C9A24B"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  opacity={activeTab === 'air' ? 1 : 0.25}
                  style={{ transition: 'opacity 0.4s ease' }}
                />

                {/* 2. Rail Route Path (Kottayam -> Kumarakom) */}
                <path
                  ref={pathRailRef}
                  d={CONFIG.routes.rail.pathD}
                  stroke="#C9A24B"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  opacity={activeTab === 'rail' ? 1 : 0.25}
                  style={{ transition: 'opacity 0.4s ease' }}
                />

                {/* 3. Water Route Path (Muhamma Jetty -> Kumarakom) */}
                <path
                  ref={pathWaterRef}
                  d={CONFIG.routes.water.pathD}
                  stroke="#E8D296"
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  opacity={activeTab === 'water' ? 1 : 0.25}
                  style={{ transition: 'opacity 0.4s ease' }}
                />

                {/* Traveling Vehicle / Dot */}
                <circle
                  ref={travelerRef}
                  cx="340"
                  cy="210"
                  r="5"
                  fill="#F8E7B2"
                  filter="drop-shadow(0 0 6px #C9A24B)"
                />

                {/* PIN 1: Cochin Airport (COK) */}
                <g transform="translate(180, 50)" opacity={activeTab === 'air' ? 1 : 0.45}>
                  <circle cx="0" cy="0" r="10" fill="#0A2A21" stroke="#C9A24B" strokeWidth="1.5" />
                  <path d="M-3 -4 L3 -4 L2 0 L0 3 L-2 0 Z" fill="#E8D296" />
                  <text x="-15" y="-14" fill="#E8D296" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                    Cochin Airport (COK)
                  </text>
                </g>

                {/* PIN 2: Kottayam Railway Station (KTYM) */}
                <g transform="translate(470, 310)" opacity={activeTab === 'rail' ? 1 : 0.45}>
                  <circle cx="0" cy="0" r="10" fill="#0A2A21" stroke="#C9A24B" strokeWidth="1.5" />
                  <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="#E8D296" />
                  <text x="-40" y="24" fill="#E8D296" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                    Kottayam (KTYM)
                  </text>
                </g>

                {/* PIN 3: Muhamma Jetty (Water Route Start) */}
                <g transform="translate(220, 185)" opacity={activeTab === 'water' ? 1 : 0.45}>
                  <circle cx="0" cy="0" r="8" fill="#0A2A21" stroke="#E8D296" strokeWidth="1.5" />
                  <text x="-45" y="-12" fill="#E8D296" fontSize="10" fontWeight="500" fontFamily="sans-serif">
                    Muhamma Jetty
                  </text>
                </g>

                {/* PIN 4: Kumarakom Lake Resort (DESTINATION - HERO PIN) */}
                <g transform="translate(340, 210)">
                  {/* Concentric Pulsing Gold Ring */}
                  <circle cx="0" cy="0" r="16" fill="none" stroke="#C9A24B" strokeWidth="1.5" className="venue-resort-pulse" />
                  <circle cx="0" cy="0" r="14" fill="#0F3B2E" stroke="#E8D296" strokeWidth="2" />
                  {/* Golden Lotus / Lamp Core */}
                  <circle cx="0" cy="0" r="6" fill="#C9A24B" />
                  <circle cx="0" cy="0" r="2.5" fill="#FFFBEB" />
                  <text x="18" y="5" fill="#F7F2E7" fontSize="12" fontWeight="700" fontFamily="serif">
                    Kumarakom Lake Resort
                  </text>
                </g>

                {/* Gently Bobbing Boat for Water Route */}
                {activeTab === 'water' && (
                  <g transform="translate(300, 202)" className="venue-boat-bobbing">
                    <path d="M-9 2 L9 2 L7 6 L-7 6 Z" fill="#E8D296" />
                    <line x1="0" y1="2" x2="0" y2="-5" stroke="#C9A24B" strokeWidth="1.2" />
                    <path d="M0 -5 L5 -1 L0 1 Z" fill="#C9A24B" />
                  </g>
                )}
              </svg>
            </div>

            {/* ROUTE DETAIL PANEL (Animated text swap + km count-up) */}
            <div id={`venue-panel-${activeTab}`} className="venue-detail-panel" role="tabpanel">
              <div className="venue-stat-col">
                <span className="venue-stat-num">
                  {activeRoute.distance ? `${countedKm} km` : 'Scenic'}
                </span>
                <span className="venue-stat-label">{activeRoute.time}</span>
              </div>

              <div className="venue-detail-desc">
                <p style={{ margin: 0, fontWeight: 500 }}>{activeRoute.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
