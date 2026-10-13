import React from 'react';
import { Heart, ArrowUp, Sparkles } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        background: '#040d09',
        borderTop: '1px solid rgba(226, 196, 116, 0.25)',
        padding: '5rem 0 3rem 0',
        position: 'relative',
        color: 'var(--color-ivory-200)',
        textAlign: 'center',
      }}
    >
      <div className="container">
        {/* Monogram Seal */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '1.5px solid var(--color-gold-400)',
            margin: '0 auto 1.5rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(212, 175, 55, 0.1)',
            color: 'var(--color-gold-300)',
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            fontWeight: 700,
            boxShadow: '0 0 25px rgba(212, 175, 55, 0.25)',
          }}
        >
          {WEDDING_CONFIG.couple.monogram}
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            color: 'var(--color-ivory-100)',
            marginBottom: '0.4rem',
            letterSpacing: '0.04em',
          }}
        >
          {WEDDING_CONFIG.couple.bride.name} & {WEDDING_CONFIG.couple.groom.name}
        </h3>

        <div
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            color: 'var(--color-gold-400)',
            marginBottom: '1rem',
          }}
        >
          Two Hearts, One Sacred Destiny
        </div>

        <div className="ornament-divider">
          <span className="ornament-line" />
          <span className="ornament-icon">🪷</span>
          <span className="ornament-line" />
        </div>

        {/* Wedding Hashtag */}
        <div
          style={{
            display: 'inline-block',
            padding: '0.4rem 1.4rem',
            background: 'rgba(7, 23, 16, 0.8)',
            border: '1px solid rgba(226, 196, 116, 0.3)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--color-gold-300)',
            fontSize: '0.88rem',
            letterSpacing: '0.12em',
            marginBottom: '2.5rem',
          }}
        >
          {WEDDING_CONFIG.couple.hashtag}
        </div>

        {/* Quick Nav Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.75rem',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}
        >
          {[
            { label: 'Home', href: '#hero' },
            { label: 'Our Story', href: '#story' },
            { label: 'Invitation', href: '#invitation' },
            { label: 'Events', href: '#events' },
            { label: 'Venue', href: '#venue' },
            { label: 'RSVP', href: '#rsvp' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                color: 'var(--color-ivory-300)',
                textDecoration: 'none',
                fontSize: '0.88rem',
                letterSpacing: '0.04em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold-300)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ivory-300)')}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Bottom Credits & Back to Top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2rem',
            flexWrap: 'wrap',
            gap: '1.25rem',
            fontSize: '0.82rem',
            color: 'var(--color-ivory-300)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted with</span>
            <Heart size={14} fill="#e57373" color="#e57373" />
            <span>for Ananya & Rohan • Kerala 2026</span>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-outline"
            style={{
              padding: '0.55rem 1.25rem',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
