import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Share2, Calendar, Sparkles, Check } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────
   CONFIG OBJECT (Top of file)
───────────────────────────────────────────────────────────────── */
export const FOOTER_CONFIG = {
  palette: {
    cream: '#F7F2E7',
    deepGreen: '#0F3B2E',
    darkBg: '#0A2A21',
    gold: '#C9A24B',
    lightGold: '#E8D296',
    darkGold: '#8C6F2A',
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
    reveal: 800,
  },
};

export default function Footer() {
  const footerRef = useRef(null);
  const canvasRef = useRef(null);
  const monogramRef = useRef(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Smooth scroll back to top using Lenis instance if available
  const scrollToTop = () => {
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Google Calendar URL
  const googleCalendarUrl = useMemo(() => {
    const title = encodeURIComponent("Ananya & Rohan's Wedding — The Sacred Muhurtham");
    const details = encodeURIComponent(
      "Join us in celebrating the traditional Kerala wedding ceremony of Ananya Menon & Rohan Varma at Kumarakom Lake Resort."
    );
    const location = encodeURIComponent("Kumarakom Lake Resort, Kottayam, Kerala");
    const dates = "20261212T040000Z/20261212T070000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  }, []);

  // Copy Hashtag with Toast
  const handleCopyHashtag = async () => {
    try {
      await navigator.clipboard.writeText(WEDDING_CONFIG.couple.hashtag);
      setToastMessage(`Hashtag ${WEDDING_CONFIG.couple.hashtag} Copied! ✨`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      setToastMessage(`${WEDDING_CONFIG.couple.hashtag} ✨`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Share Invitation
  const handleShare = async () => {
    const shareData = {
      title: `${WEDDING_CONFIG.couple.bride.name} & ${WEDDING_CONFIG.couple.groom.name} — Wedding Invitation`,
      text: "You're invited to celebrate the 3D Wedding Journey of Ananya & Rohan in Kerala!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setToastMessage("Invitation link copied to clipboard! ✨");
        setTimeout(() => setToastMessage(null), 3000);
      } catch (e) {}
    }
  };

  // Monogram Mouse Tilt
  const handleMonogramTilt = (e) => {
    if (window.innerWidth < 992 || !monogramRef.current) return;
    const rect = monogramRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / (rect.height / 2)) * 12;
    const rotY = (x / (rect.width / 2)) * 12;
    monogramRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05)`;
  };

  const resetMonogramTilt = () => {
    if (monogramRef.current) {
      monogramRef.current.style.transform = '';
    }
  };

  // Desktop Curtain Parallax Reveal
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;
    if (prefersReducedMotion || isMobile || !footerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-main',
        { y: 40, opacity: 0.8 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 92%',
            end: 'top 40%',
            scrub: 0.5,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Ambient Particles Canvas (Petals & Golden Fireflies)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let isVisible = true;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? FOOTER_CONFIG.particleCount.mobile : FOOTER_CONFIG.particleCount.desktop;

    let w = (canvas.width = canvas.parentElement.offsetWidth);
    let h = (canvas.height = canvas.parentElement.offsetHeight);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Particle pool
    const particles = Array.from({ length: count }, (_, idx) => ({
      isFirefly: idx % 2 === 0,
      x: Math.random() * w,
      y: Math.random() * h,
      size: idx % 2 === 0 ? Math.random() * 2 + 1.2 : Math.random() * 4 + 3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: idx % 2 === 0 ? (Math.random() - 0.5) * 0.5 : Math.random() * 0.6 + 0.3,
      angle: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.45 + 0.35,
    }));

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, w, h);

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.angle += 0.015;

          if (p.isFirefly) {
            // Firefly glow
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            const glow = Math.sin(p.angle) * 0.2 + p.opacity;
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(248, 231, 178, ${Math.max(0.2, glow)})`;
            ctx.shadowColor = '#C9A24B';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
          } else {
            // Jasmine Petal teardrop
            if (p.y > h + 15) {
              p.y = -15;
              p.x = Math.random() * w;
            }
            if (p.x < -15) p.x = w + 15;
            if (p.x > w + 15) p.x = -15;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 252, 240, ${p.opacity * 0.65})`;
            ctx.fill();
            ctx.restore();
          }
        });
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <footer id="footer" ref={footerRef} className="site-footer" role="contentinfo" aria-label="Wedding Footer">
      {/* Kasavu Cream + Gold Top Strip */}
      <div className="footer-top-strip" aria-hidden="true" />

      {/* Background Texture & Ambient Canvas */}
      <div className="footer-bg-texture" aria-hidden="true" />
      <canvas ref={canvasRef} className="footer-ambient-canvas" aria-hidden="true" />

      {/* ─────────────────────────────────────────────────────────────
          1. HASHTAG MARQUEE
      ───────────────────────────────────────────────────────────── */}
      <div className="footer-marquee" aria-hidden="true">
        <div className="footer-marquee-track">
          {[0, 1, 2, 3].map((idx) => (
            <span key={idx} className="footer-marquee-text">
              {WEDDING_CONFIG.couple.hashtag} <span className="footer-marquee-icon">🪷</span> DECEMBER 2026 <span className="footer-marquee-icon">🪔</span> KERALA <span className="footer-marquee-icon">🪷</span> GOD'S OWN COUNTRY <span className="footer-marquee-icon">🪔</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN FOOTER CONTENT
      ───────────────────────────────────────────────────────────── */}
      <div className="footer-main">
        {/* Warm Gratitude Line */}
        <p className="footer-warm-line">
          With hearts full of gratitude, we can't wait to celebrate with you.
        </p>

        {/* 3D Tilting Monogram Seal */}
        <div
          className="footer-monogram-wrap"
          onMouseMove={handleMonogramTilt}
          onMouseLeave={resetMonogramTilt}
          title="Sacred Monogram"
          aria-hidden="true"
        >
          <div ref={monogramRef} className="footer-monogram">
            {WEDDING_CONFIG.couple.monogram}
          </div>
        </div>

        {/* Giant Gold Names */}
        <div className="footer-names-masked">
          <h2 className="footer-names">
            {WEDDING_CONFIG.couple.bride.name} &amp; {WEDDING_CONFIG.couple.groom.name}
          </h2>
        </div>

        {/* Sacred Destiny Tagline */}
        <div className="footer-tagline">
          Two Hearts, One Sacred Destiny
        </div>

        {/* Lotus Divider */}
        <div className="footer-divider" aria-hidden="true">
          <span className="footer-divider-line" />
          <span className="footer-divider-lotus">🪷</span>
          <span className="footer-divider-line" />
        </div>

        {/* Quick Nav Links */}
        <nav className="footer-nav" aria-label="Footer Quick Navigation">
          {[
            { label: 'Home', href: '#hero' },
            { label: 'Our Story', href: '#story' },
            { label: 'Invitation', href: '#invitation' },
            { label: 'Events', href: '#events' },
            { label: 'Venue', href: '#venue' },
            { label: 'RSVP', href: '#rsvp' },
          ].map((item) => (
            <a key={item.label} href={item.href} className="footer-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Copyable Hashtag Pill */}
        <button
          type="button"
          onClick={handleCopyHashtag}
          className="footer-hashtag-pill"
          aria-label={`Copy wedding hashtag ${WEDDING_CONFIG.couple.hashtag}`}
        >
          <span>{WEDDING_CONFIG.couple.hashtag}</span>
          <Sparkles size={14} aria-hidden="true" />
        </button>

        {/* Action Buttons Row */}
        <div className="footer-buttons-row">
          <button
            type="button"
            onClick={handleShare}
            className="footer-btn footer-btn-share"
            aria-label="Share this wedding invitation"
          >
            <Share2 size={16} aria-hidden="true" />
            <span>Share this invitation</span>
          </button>

          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-btn footer-btn-cal"
            aria-label="Add wedding to Google Calendar"
          >
            <Calendar size={16} aria-hidden="true" />
            <span>Add to calendar</span>
          </a>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. FOOTER BOTTOM BAR & NILAVILAKKU BACK-TO-TOP
      ───────────────────────────────────────────────────────────── */}
      <div className="footer-bottom">
        <div className="footer-crafted">
          <span>Crafted with</span>
          <Heart size={14} fill="#e57373" color="#e57373" aria-hidden="true" />
          <span>for Ananya &amp; Rohan • Kerala 2026</span>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="footer-lamp-btn"
          aria-label="Scroll smoothly back to top"
        >
          <span className="footer-lamp-icon" aria-hidden="true">🪔</span>
          <span>Back to Top</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="footer-toast" role="status" aria-live="polite">
          <Check size={16} color="#E8D296" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </footer>
  );
}
