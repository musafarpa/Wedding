import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, MapPin, Shirt, Sparkles, Heart, Utensils, Wine, ArrowRight } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';
import './CelebrationsSection.css';

gsap.registerPlugin(ScrollTrigger);

// =====================================================================
// CONFIGURATION OBJECT
// =====================================================================
const CONFIG = {
  palette: {
    cream: '#F7F2E7',
    deepGreen: '#0F3B2E',
    gold: '#C9A24B',
    lightGold: '#E8D296',
    darkGold: '#8C6F2A',
    sage: '#DCE6D8',
  },
  moods: {
    'haldi-mehendi': {
      accent: '#D97706',
      cardBorder: 'rgba(217, 119, 6, 0.35)',
      particleColor: '#F59E0B',
      themeTone: 'afternoon-sun',
    },
    'muhurtham': {
      accent: '#C9A24B',
      cardBorder: '#C9A24B',
      particleColor: '#C9A24B',
      themeTone: 'sunrise-glow',
    },
    'sadhya': {
      accent: '#15803D',
      cardBorder: 'rgba(21, 128, 61, 0.35)',
      particleColor: '#22C55E',
      themeTone: 'midday-light',
    },
    'reception': {
      accent: '#E8D296',
      cardBorder: 'rgba(232, 210, 150, 0.45)',
      particleColor: '#FDE68A',
      themeTone: 'backwater-starlight',
      isDark: true,
    },
  },
  tilt: 6,
  particleCount: { mobile: 12, desktop: 25 },
  durations: {
    reveal: 0.85,
    ease: 'power3.out',
  },
  weddingDates: {
    'haldi-mehendi': '2026-12-11T15:30:00+05:30',
    'muhurtham': '2026-12-12T09:30:00+05:30',
    'sadhya': '2026-12-12T12:00:00+05:30',
    'reception': '2026-12-12T19:00:00+05:30',
  },
};

// =====================================================================
// EVENT DATA ARRAY
// =====================================================================
const EVENTS = [
  {
    id: 'haldi-mehendi',
    day: 1,
    title: 'Haldi & Mehendi Fiesta',
    subtitle: 'The Auspicious Turmeric & Henna Melodies',
    date: 'Friday, 11th December 2026',
    time: '03:30 PM Onwards',
    venue: 'The Mango Grove Courtyard, Kumarakom Lake Resort',
    dressCode: 'Sunset Yellows & Vibrant Greens',
    description: 'An afternoon filled with fragrant marigold flowers, auspicious haldi blessings, soulful folk music, and intricate henna designs.',
    iconType: 'haldi',
    isPrimary: false,
    targetDate: '2026-12-11T15:30:00+05:30',
  },
  {
    id: 'muhurtham',
    day: 2,
    title: 'The Sacred Muhurtham',
    subtitle: 'Traditional Kerala Vedic Ceremony',
    date: 'Saturday, 12th December 2026',
    time: '09:30 AM – 11:00 AM IST',
    venue: 'The Grand Heritage Mandap, Kumarakom Lake Resort',
    dressCode: 'Traditional Kerala Kasavu & Ivory Silks',
    description: 'The divine solemnization amidst traditional nadaswaram chants, sacred nilavilakku lamps, exchanging floral garlands, and the holy saptapadi.',
    iconType: 'nilavilakku',
    isPrimary: true, // HERO CARD
    targetDate: '2026-12-12T09:30:00+05:30',
  },
  {
    id: 'sadhya',
    day: 2,
    title: 'The Royal Kerala Sadhya',
    subtitle: 'Traditional Feast Served on Banana Leaf',
    date: 'Saturday, 12th December 2026',
    time: '12:00 PM – 02:30 PM IST',
    venue: 'Oottupura Dining Pavilion',
    dressCode: 'Traditional Festive Attire',
    description: 'An authentic 28-dish grand vegetarian banquet celebrating the rich culinary heritage of Kerala, concluding with golden ada pradhaman.',
    iconType: 'sadhya',
    isPrimary: false,
    targetDate: '2026-12-12T12:00:00+05:30',
  },
  {
    id: 'reception',
    day: 2,
    title: 'The Grand Twilight Reception',
    subtitle: 'Cocktails, Dinner & Backwater Starlight',
    date: 'Saturday, 12th December 2026',
    time: '07:00 PM Onwards',
    venue: 'The Waterfront Palms Lawn & Amphitheatre',
    dressCode: 'Formal Indian Glamour / Champagne Gold',
    description: 'An enchanting evening of toasts, live acoustic fusion, gourmet dinner, and stargazing under illuminated coconut palms.',
    iconType: 'reception',
    isPrimary: false,
    targetDate: '2026-12-12T19:00:00+05:30',
  },
];

// Helper: Calculate live countdown chip text ("In 58 days 4h")
function getCountdownText(targetDateStr) {
  const target = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return 'Event in Progress';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `In ${days} days ${hours}h`;
  }
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `In ${hours}h ${minutes}m`;
}

// -------------------------------------------------------------
// ANIMATED MEDALLION SVGS
// -------------------------------------------------------------
function MedallionSVG({ type }) {
  switch (type) {
    case 'haldi':
      return (
        <div className="cel-medallion cel-medallion--haldi" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Rotating Marigold Petals */}
            <g transform="translate(32, 32)">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <ellipse
                  key={i}
                  cx="0"
                  cy="-16"
                  rx="4.5"
                  ry="9"
                  fill="#F59E0B"
                  transform={`rotate(${angle})`}
                  opacity="0.88"
                />
              ))}
              {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
                <ellipse
                  key={`in-${i}`}
                  cx="0"
                  cy="-12"
                  rx="3.5"
                  ry="7"
                  fill="#D97706"
                  transform={`rotate(${angle})`}
                  opacity="0.9"
                />
              ))}
              {/* Central Auspicious Turmeric Drop */}
              <circle cx="0" cy="0" r="8" fill="#FBBF24" />
              <circle cx="0" cy="0" r="5" fill="#C9A24B" />
              <circle cx="-1.5" cy="-2" r="1.8" fill="#FFFBEB" />
            </g>
          </svg>
        </div>
      );

    case 'nilavilakku':
      return (
        <div className="cel-medallion cel-medallion--flame" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(32, 32)">
              {/* Nilavilakku Tiered Brass Base & Spindle */}
              <path d="M-14 22 C-14 20 -8 18 0 18 C8 18 14 20 14 22 L12 25 L-12 25 Z" fill="#C9A24B" />
              <rect x="-3" y="2" width="6" height="17" rx="1.5" fill="#8C6F2A" />
              <ellipse cx="0" cy="4" rx="15" ry="4" fill="#C9A24B" />
              <ellipse cx="0" cy="2" rx="13" ry="3" fill="#E8D296" />
              {/* Central Spire */}
              <path d="M-2.5 2 L-1 -10 L1 -10 L2.5 2 Z" fill="#C9A24B" />
              {/* Flickering Sacred Flame */}
              <path
                d="M0 -22 C-5 -16 -4 -10 0 -9 C4 -10 5 -16 0 -22 Z"
                fill="url(#sacredFlameGrad)"
              />
              <path
                d="M0 -18 C-2.5 -14 -2 -11 0 -10 C2 -11 2.5 -14 0 -18 Z"
                fill="#FFFBEB"
              />
            </g>
            <defs>
              <linearGradient id="sacredFlameGrad" x1="0" y1="-22" x2="0" y2="-9" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="0.6" stopColor="#EAB308" />
                <stop offset="1" stopColor="#C9A24B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'sadhya':
      return (
        <div className="cel-medallion cel-medallion--steam" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(32, 32)">
              {/* Banana Leaf Base */}
              <path
                d="M-20 6 C-14 -4 14 -4 20 6 C12 16 -12 16 -20 6 Z"
                fill="#15803D"
              />
              <path
                d="M-18 6 C-12 -2 12 -2 18 6"
                stroke="#86EFAC"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Rice Mound & Ghee */}
              <ellipse cx="0" cy="5" rx="7.5" ry="4" fill="#FFFFFF" />
              <circle cx="0" cy="4" r="2.5" fill="#EAB308" />
              {/* Rising Culinary Steam Wisps */}
              <path
                d="M-6 -2 C-8 -8 -4 -12 -6 -18"
                stroke="#C9A24B"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M0 -4 C2 -10 -2 -14 0 -20"
                stroke="#C9A24B"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M6 -2 C4 -8 8 -12 6 -18"
                stroke="#C9A24B"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.85"
              />
            </g>
          </svg>
        </div>
      );

    case 'reception':
      return (
        <div className="cel-medallion cel-medallion--stars" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(32, 32)">
              {/* Champagne Flute */}
              <path d="M-6 -14 L6 -14 L4 -2 L0 4 L-4 -2 Z" fill="#E8D296" opacity="0.3" />
              <path d="M-5 -13 L5 -13 L3.5 -3 L0 3 L-3.5 -3 Z" stroke="#E8D296" strokeWidth="1.2" fill="none" />
              <line x1="0" y1="3" x2="0" y2="16" stroke="#E8D296" strokeWidth="1.5" />
              <ellipse cx="0" cy="17" rx="7" ry="2" fill="#C9A24B" />
              {/* Sparkle Stars & Bubbles */}
              <circle cx="-1" cy="-7" r="1.2" fill="#FDE68A" />
              <circle cx="1.5" cy="-10" r="1" fill="#FDE68A" />
              {/* Starlight Star */}
              <path
                d="M10 -16 L12 -12 L16 -10 L12 -8 L10 -4 L8 -8 L4 -10 L8 -12 Z"
                fill="#E8D296"
              />
              <path
                d="M-10 -4 L-8.5 -1.5 L-6 0 L-8.5 1.5 L-10 4 L-11.5 1.5 L-14 0 L-11.5 -1.5 Z"
                fill="#C9A24B"
              />
            </g>
          </svg>
        </div>
      );

    default:
      return null;
  }
}

// -------------------------------------------------------------
// MOOD PARTICLES CANVAS (Optimized, pauses off-screen, capped DPR)
// -------------------------------------------------------------
function CardMoodCanvas({ eventId, isDark }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let isVisible = false;
    let width = 0;
    let height = 0;

    // Determine device capabilities
    const isMobile = window.innerWidth <= 768;
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const count = isLowPower ? 8 : (isMobile ? CONFIG.particleCount.mobile : CONFIG.particleCount.desktop);

    // Resize handling
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

    // Particle state initialization according to event mood
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1.2,
      vx: (Math.random() - 0.5) * (eventId === 'haldi-mehendi' ? 0.8 : 0.4),
      vy: eventId === 'haldi-mehendi' 
        ? Math.random() * 0.7 + 0.3 // falling marigold
        : eventId === 'sadhya'
        ? -(Math.random() * 0.6 + 0.25) // rising steam
        : eventId === 'muhurtham'
        ? -(Math.random() * 0.5 + 0.2) // rising rays
        : (Math.random() - 0.5) * 0.35, // fireflies/stars
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.025 + 0.015,
      angle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += 0.02;

        // Wrap around boundaries
        if (p.y > height + 10) p.y = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;

        ctx.save();
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.angle));

        if (eventId === 'haldi-mehendi') {
          // Marigold Petal
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (eventId === 'muhurtham') {
          // Golden Divine Ray Specks
          ctx.fillStyle = '#C9A24B';
          ctx.shadowColor = '#E8D296';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (eventId === 'sadhya') {
          // Steam Wisp
          ctx.fillStyle = 'rgba(201, 162, 75, 0.45)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Twilight Backwater Stars & Fireflies
          ctx.fillStyle = '#FDE68A';
          ctx.shadowColor = '#FDE68A';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    // IntersectionObserver to pause when offscreen
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
  }, [eventId]);

  return <canvas ref={canvasRef} className="cel-card-canvas" aria-hidden="true" />;
}

// -------------------------------------------------------------
// SINGLE EVENT CARD COMPONENT (With 3D Tilt & Ticket Stub)
// -------------------------------------------------------------
function EventCard({ event, onCalendarClick }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const [countdownText, setCountdownText] = useState(() => getCountdownText(event.targetDate));
  const isDark = event.id === 'reception';

  // Live countdown update every 60s
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownText(getCountdownText(event.targetDate));
    }, 60000);
    return () => clearInterval(timer);
  }, [event.targetDate]);

  // 3D Tilt interaction for desktop pointer devices
  const handleMouseMove = (e) => {
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

    card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;

    if (glareRef.current) {
      glareRef.current.style.opacity = '0.35';
      glareRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  const isHaldi = event.id === 'haldi-mehendi';

  return (
    <div className={`cel-card-wrapper cel-card-wrapper--${event.id} ${event.isPrimary ? 'cel-card-wrapper--hero' : ''}`}>
      <article
        ref={cardRef}
        id={`event-${event.id}`}
        className={`cel-card cel-card--${event.id} ${event.isPrimary ? 'cel-card--hero' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Mood Canvas Particles */}
        <CardMoodCanvas eventId={event.id} isDark={isDark} />

        {/* 3D Glare Lighting Overlay */}
        <div ref={glareRef} className="cel-card-glare" aria-hidden="true" />

        <div className="cel-card-inner">
          {/* Top Row: Ribbon (if primary) + Medallion & Titles */}
          <div className="cel-card-top-row">
            <div className="cel-card-header-main">
              <MedallionSVG type={event.iconType} />
              <div className="cel-title-group">
                <h3 className="cel-card-title">{event.title}</h3>
                <span className="cel-card-subtitle">{event.subtitle}</span>
              </div>
            </div>

            {/* Main Muhurtham Ribbon has its own distinct space - never overlaps title */}
            {event.isPrimary && (
              <div className="cel-hero-ribbon">
                <Sparkles size={12} aria-hidden="true" />
                <span>Main Muhurtham</span>
              </div>
            )}
          </div>

          {/* Body Layout: Split on desktop for Haldi horizontal layout */}
          {isHaldi ? (
            <div className="cel-haldi-cols">
              <div className="cel-card-left">
                {/* Ticket Stub Info Panel */}
                <div className="cel-ticket-stub">
                  <div className="cel-stub-row">
                    <Calendar className="cel-stub-icon" aria-hidden="true" />
                    <span><strong>{event.date}</strong></span>
                  </div>
                  <div className="cel-stub-row">
                    <Clock className="cel-stub-icon" aria-hidden="true" />
                    <span>{event.time}</span>
                  </div>
                  <div className="cel-stub-row">
                    <MapPin className="cel-stub-icon" aria-hidden="true" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="cel-stub-row">
                    <Shirt className="cel-stub-icon" aria-hidden="true" />
                    <span className="cel-stub-attire">Attire: {event.dressCode}</span>
                  </div>
                </div>
              </div>

              <div className="cel-card-right">
                <p className="cel-description">{event.description}</p>
                <div className="cel-card-footer">
                  <div className="cel-countdown-chip" aria-live="off">
                    <span className="cel-countdown-pulse" aria-hidden="true" />
                    <span>{countdownText}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => onCalendarClick(event, e)}
                    className="cel-calendar-btn"
                    aria-label={`Add ${event.title} to Google Calendar`}
                  >
                    <Calendar className="cel-btn-icon" aria-hidden="true" />
                    <span>Add To Google Calendar</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Ticket Stub Info Panel */}
              <div className="cel-ticket-stub">
                <div className="cel-stub-row">
                  <Calendar className="cel-stub-icon" aria-hidden="true" />
                  <span><strong>{event.date}</strong></span>
                </div>
                <div className="cel-stub-row">
                  <Clock className="cel-stub-icon" aria-hidden="true" />
                  <span>{event.time}</span>
                </div>
                <div className="cel-stub-row">
                  <MapPin className="cel-stub-icon" aria-hidden="true" />
                  <span>{event.venue}</span>
                </div>
                <div className="cel-stub-row">
                  <Shirt className="cel-stub-icon" aria-hidden="true" />
                  <span className="cel-stub-attire">Attire: {event.dressCode}</span>
                </div>
              </div>

              {/* Description Paragraph (Accessible Single Color) */}
              <p className="cel-description">{event.description}</p>

              {/* Card Footer: Live Countdown Chip + Add to Calendar Button */}
              <div className="cel-card-footer">
                <div className="cel-countdown-chip" aria-live="off">
                  <span className="cel-countdown-pulse" aria-hidden="true" />
                  <span>{countdownText}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => onCalendarClick(event, e)}
                  className="cel-calendar-btn"
                  aria-label={`Add ${event.title} to Google Calendar`}
                >
                  <Calendar className="cel-btn-icon" aria-hidden="true" />
                  <span>Add To Google Calendar</span>
                </button>
              </div>
            </>
          )}
        </div>
      </article>
    </div>
  );
}

// =====================================================================
// MAIN CELEBRATIONS SECTION COMPONENT
// =====================================================================
export default function CelebrationsSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const lineRef = useRef(null);
  const lampRef = useRef(null);

  // Exact Google Calendar URL generation preserved from weddingConfig
  const handleCalendar = (event, e) => {
    // Add ripple effect on click
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

    const bride = WEDDING_CONFIG?.couple?.bride?.name || 'Ananya';
    const groom = WEDDING_CONFIG?.couple?.groom?.name || 'Rohan';
    const city = WEDDING_CONFIG?.venue?.city || 'Kumarakom, Kerala';
    const title = encodeURIComponent(`${event.title} — ${bride} & ${groom}`);
    const details = encodeURIComponent(`${event.subtitle}\n${event.description}\nDress Code: ${event.dressCode}`);
    const location = encodeURIComponent(`${event.venue}, ${city}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // GSAP ScrollTrigger Animations & Parallax setup
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Header Animation
      gsap.from('.cel-badge', {
        y: -25,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cel-header',
          start: 'top 85%',
        },
      });

      gsap.from('.cel-title', {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.15,
        scrollTrigger: {
          trigger: '.cel-header',
          start: 'top 85%',
        },
      });

      gsap.from('.cel-divider-line', {
        scaleX: 0,
        duration: 0.85,
        ease: 'expo.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: '.cel-header',
          start: 'top 85%',
        },
      });

      gsap.from('.cel-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4,
        scrollTrigger: {
          trigger: '.cel-header',
          start: 'top 85%',
        },
      });

      // 2. Day Numerals Parallax Drift
      gsap.utils.toArray('.day-numeral').forEach((numeral) => {
        gsap.to(numeral, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: numeral.closest('.cel-day'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.85,
          },
        });
      });

      // 3. Staggered 3D Card Reveal
      const cards = gsap.utils.toArray('.cel-card-wrapper');
      cards.forEach((cardWrapper, idx) => {
        gsap.from(cardWrapper.querySelector('.cel-card'), {
          y: 60,
          rotateX: 12,
          opacity: 0,
          duration: CONFIG.durations.reveal,
          ease: CONFIG.durations.ease,
          scrollTrigger: {
            trigger: cardWrapper,
            start: 'top 88%',
          },
        });
      });

      // 4. Desktop Connecting Timeline Scrub
      if (lineRef.current && trackRef.current && lampRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 40%',
          end: 'bottom 85%',
          scrub: 0.5,
          onUpdate: (self) => {
            if (lineRef.current) {
              lineRef.current.style.transform = `scaleY(${self.progress})`;
            }
            if (lampRef.current) {
              lampRef.current.style.top = `${self.progress * 100}%`;
            }
          },
        });
      }

      // 5. Footer CTA Reveal
      gsap.from('.cel-footer-cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cel-footer-cta',
          start: 'top 92%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const day1Events = EVENTS.filter((e) => e.day === 1);
  const day2Events = EVENTS.filter((e) => e.day === 2);

  return (
    <section id="events" ref={sectionRef} className="celebrations" aria-label="Celebration Itinerary">
      {/* Desktop Connecting Gold Timeline Track */}
      <div ref={trackRef} className="cel-timeline-track" aria-hidden="true">
        <div className="cel-timeline-track-rail" />
        <div ref={lineRef} className="cel-timeline-line" />
        <div ref={lampRef} className="cel-timeline-lamp">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C10.5 4 10 5.5 10 7C10 8.1 10.9 9 12 9C13.1 9 14 8.1 14 7C14 5.5 13.5 4 12 2ZM5 18C5 15.8 8.1 14 12 14C15.9 14 19 15.8 19 18L18 20H6L5 18Z" />
          </svg>
        </div>
      </div>

      <div className="cel-container">
        {/* Section Header */}
        <header className="cel-header">
          <div className="cel-badge">
            <Sparkles size={13} aria-hidden="true" />
            <span>Celebration Itinerary</span>
          </div>

          <h2 className="cel-title">The Wedding Celebrations</h2>

          <div className="cel-divider">
            <span className="cel-divider-line" />
            <span className="cel-divider-lamp" role="img" aria-label="sacred nilavilakku lamp">🪔</span>
            <span className="cel-divider-line" />
          </div>

          <p className="cel-subtitle">
            Two days of sacred traditions, vibrant music, authentic cuisine, and joyful memories.
          </p>
        </header>

        {/* DAY ONE: Haldi & Mehendi Fiesta */}
        <div className="cel-day" data-day="1">
          <div className="day-label">
            <span className="day-numeral">11</span>
            <div className="day-label-text">
              <span className="day-tag">DAY ONE</span>
              <span className="day-date">Friday • December 2026</span>
            </div>
          </div>

          <div className="cel-grid">
            {day1Events.map((evt) => (
              <EventCard key={evt.id} event={evt} onCalendarClick={handleCalendar} />
            ))}
          </div>
        </div>

        {/* DAY TWO: The Wedding Day (Bento Grid) */}
        <div className="cel-day" data-day="2">
          <div className="day-label">
            <span className="day-numeral">12</span>
            <div className="day-label-text">
              <span className="day-tag">DAY TWO — THE WEDDING DAY</span>
              <span className="day-date">Saturday • December 2026</span>
            </div>
          </div>

          <div className="cel-grid cel-grid--bento">
            {day2Events.map((evt) => (
              <EventCard key={evt.id} event={evt} onCalendarClick={handleCalendar} />
            ))}
          </div>
        </div>

        {/* End of Section: Thin gold line & "Join us in celebrating" RSVP CTA */}
        <div className="cel-footer-cta">
          <div className="cel-cta-line" />
          <p className="cel-cta-text">Join us in celebrating this sacred union</p>
          <a href="#rsvp" className="cel-cta-btn" aria-label="Scroll to RSVP section">
            <span>Confirm Your Presence</span>
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
