import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';

// Vector Monogram SVG: Centered A, &, R inside double gold rings with geometric precision
const LogoMonogramSVG = () => (
  <svg
    viewBox="0 0 64 64"
    className="nav-logo-monogram-svg"
    shapeRendering="geometricPrecision"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="navLogoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8C6F2A" />
        <stop offset="35%" stopColor="#E8D296" />
        <stop offset="65%" stopColor="#FFF4D0" />
        <stop offset="100%" stopColor="#C9A24B" />
      </linearGradient>
    </defs>
    {/* Outer Thin Gold Ring */}
    <circle cx="32" cy="32" r="28.5" fill="none" stroke="#C9A24B" strokeWidth="1.5" />
    {/* Second Inner Ring */}
    <circle cx="32" cy="32" r="24.5" fill="none" stroke="#E8D296" strokeWidth="0.75" />
    {/* Auspicious Tiny Lotus Crest at Top */}
    <path d="M32 4.8 C31.2 6.5 30 7.8 28.8 8.4 C30.6 8.5 32 7.2 32 7.2 C32 7.2 33.4 8.5 35.2 8.4 C34 7.8 32.8 6.5 32 4.8 Z" fill="url(#navLogoGoldGrad)" />
    <circle cx="32" cy="9.2" r="0.8" fill="#E8D296" />
    {/* Letters A, &, R Centered with Exact Vector Paths */}
    <g fill="url(#navLogoGoldGrad)">
      {/* Letter A */}
      <path d="M 16.2 41.5 L 14 41.5 L 14 40.2 L 16.4 40.2 L 19.8 23 L 21.6 23 L 25.2 40.2 L 27.2 40.2 L 27.2 41.5 L 24.2 41.5 L 24.2 40.2 L 25 40.2 L 24 35.5 L 17.5 35.5 L 16.8 40.2 L 17.8 40.2 L 17.8 41.5 L 16.2 41.5 Z M 17.8 34.2 L 23.7 34.2 L 20.8 24.8 L 20.6 24.8 Z" />
      {/* Ampersand & */}
      <path d="M 31.8 30.5 C 30.8 29.5 30.2 28.5 30.2 27.3 C 30.2 25.6 31.3 24.4 32.7 24.4 C 33.9 24.4 34.8 25.3 34.8 26.6 C 34.8 28.2 33.6 29.8 32.1 31.2 L 34.2 33.6 C 35 32.7 35.5 31.7 35.7 30.8 L 36.8 31.1 C 36.4 32.4 35.7 33.6 34.7 34.6 L 36.5 36.8 L 35.6 37.4 L 33.8 35.2 C 32.8 36.2 31.7 36.8 30.4 36.8 C 28.8 36.8 27.6 35.6 27.6 33.9 C 27.6 32.2 28.8 30.8 30.6 29.7 L 31.8 30.5 Z M 32.1 26.7 C 32.1 25.8 31.6 25.2 31 25.2 C 30.4 25.2 30 25.8 30 26.7 C 30 27.5 30.4 28.3 31.1 29.1 C 31.8 28.3 32.1 27.4 32.1 26.7 Z M 33.1 34.3 L 31.2 32.2 C 29.9 33.1 29.2 34 29.2 35 C 29.2 35.9 29.8 36.4 30.7 36.4 C 31.5 36.4 32.3 35.6 33.1 34.3 Z" />
      {/* Letter R */}
      <path d="M 38 41.5 L 38 40.2 L 39.5 40.2 L 39.5 24.3 L 38 24.3 L 38 23 L 44.5 23 C 47 23 48.8 24.5 48.8 27.2 C 48.8 29.3 47.6 30.8 45.4 31.4 C 46.8 32.2 47.5 33.6 48.4 36.5 C 48.9 38.3 49.4 39.6 50 40.2 L 50 40.5 L 50 41.5 L 47.8 41.5 C 47.1 40.8 46.6 39.4 46.1 37.4 C 45.3 34.3 44.4 33.2 42.4 33.2 L 41.6 33.2 L 41.6 40.2 L 43.2 40.2 L 43.2 41.5 L 38 41.5 Z M 41.6 24.3 L 41.6 31.9 L 44 31.9 C 45.8 31.9 46.8 30.7 46.8 28.2 C 46.8 25.5 45.6 24.3 43.8 24.3 L 41.6 24.3 Z" />
    </g>
  </svg>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { label: 'Our Story', href: '#story' },
    { label: 'The Invitation', href: '#invitation' },
    { label: 'Events', href: '#events' },
    { label: 'Venue', href: '#venue' },
    { label: 'RSVP', href: '#rsvp', isHighlight: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsScrolled(scrollY > 40);

      // Active section detection with proper top offset
      const sections = ['hero', 'story', 'invitation', 'events', 'venue', 'rsvp'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (e, href) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const navHeight = 72;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: Math.max(0, targetPos),
        behavior: 'smooth',
      });
      if (window.history.pushState) {
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <>
      {/* Top Thin Gold Scroll Progress Indicator */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #c5a059, #f7ebb8, #e2c474)',
          zIndex: 1001,
          boxShadow: '0 0 10px rgba(226, 196, 116, 0.7)',
          transition: 'width 0.1s linear',
        }}
      />

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: isScrolled ? '0.7rem 1.5rem' : '1.1rem 2rem',
          background: isScrolled 
            ? 'rgba(7, 23, 16, 0.94)' 
            : 'linear-gradient(180deg, rgba(15, 59, 46, 0.88) 0%, rgba(7, 23, 16, 0.45) 60%, transparent 100%)',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(226, 196, 116, 0.25)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo / Monogram */}
          <a
            href="#hero"
            onClick={(e) => scrollTo(e, '#hero')}
            className="nav-logo-link"
            aria-label="Ananya and Rohan - home"
          >
            <div className="nav-logo-monogram-wrap">
              <LogoMonogramSVG />
            </div>
            <div className="nav-logo-text-block">
              <span className="nav-logo-title">
                ANANYA &amp; ROHAN
              </span>
              <span className="nav-logo-tagline">
                God's Own Country
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.65rem',
            }}
            className="desktop-nav-menu"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              if (link.isHighlight) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className="btn-gold"
                    style={{ padding: '0.5rem 1.3rem', fontSize: '0.8rem' }}
                  >
                    <Heart size={14} fill="currentColor" />
                    {link.label}
                  </a>
                );
              }
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  style={{
                    textDecoration: 'none',
                    color: isActive ? 'var(--color-gold-300)' : 'var(--color-ivory-200)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '0.04em',
                    position: 'relative',
                    transition: 'all 0.25s ease',
                    padding: '0.35rem 0',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--color-gold-400)',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px var(--color-gold-400)',
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="mobile-nav-toggle"
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(226, 196, 116, 0.4)',
              color: 'var(--color-ivory-100)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(7, 23, 16, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.3s ease forwards',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem', width: '100%' }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  color: link.isHighlight ? 'var(--color-gold-300)' : 'var(--color-ivory-100)',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                }}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="btn-outline"
              style={{ marginTop: '1.5rem', width: '100%', maxWidth: '240px' }}
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      <style>{`
        .nav-logo-link {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .nav-logo-monogram-wrap {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          filter: drop-shadow(0 2px 8px rgba(201, 162, 75, 0.25));
          transition: filter 0.4s ease;
        }
        .nav-logo-monogram-svg {
          width: 100%;
          height: 100%;
          display: block;
          transition: transform 0.4s ease;
          transform-origin: center center;
        }
        .nav-logo-link:hover .nav-logo-monogram-svg {
          transform: rotate(8deg);
        }
        .nav-logo-link:hover .nav-logo-monogram-wrap {
          filter: drop-shadow(0 0 12px rgba(232, 210, 150, 0.55));
        }
        .nav-logo-text-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
          justify-content: center;
        }
        .nav-logo-title {
          font-family: var(--font-display, 'Cinzel Decorative', Georgia, serif);
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #F7F2E7;
          line-height: 1.1;
          white-space: nowrap;
          text-shadow: 0 1px 12px rgba(201, 162, 75, 0.2);
        }
        .nav-logo-tagline {
          font-family: var(--font-serif, 'Cormorant Garamond', Georgia, serif);
          font-size: 12px;
          font-style: italic;
          color: #E8D296;
          opacity: 0.9;
          letter-spacing: 0.04em;
          line-height: 1.2;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .nav-logo-monogram-wrap {
            width: 38px;
            height: 38px;
          }
          .nav-logo-title {
            font-size: 16px;
          }
          .nav-logo-tagline {
            font-size: 11px;
            display: none;
          }
        }
        @media (min-width: 900px) {
          .desktop-nav-menu {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
