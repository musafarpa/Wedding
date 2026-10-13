import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';

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
            ? 'rgba(7, 23, 16, 0.92)' 
            : 'linear-gradient(180deg, rgba(7, 23, 16, 0.88) 0%, transparent 100%)',
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
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1.5px solid var(--color-gold-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(212, 175, 55, 0.14)',
                color: 'var(--color-gold-300)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.92rem',
                letterSpacing: '1px',
                boxShadow: '0 0 15px rgba(212, 175, 55, 0.25)',
              }}
            >
              {WEDDING_CONFIG.couple.monogram}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-ivory-100)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  lineHeight: 1.1,
                }}
              >
                {WEDDING_CONFIG.couple.bride.name} & {WEDDING_CONFIG.couple.groom.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-gold-400)',
                  fontSize: '0.72rem',
                  fontStyle: 'italic',
                  letterSpacing: '0.04em',
                }}
              >
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
