import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, Calendar, MapPin, Sparkles, Heart } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';

export default function HeroSection() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  const scrollToStory = () => {
    const el = document.getElementById('story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInvitation = () => {
    const el = document.getElementById('invitation');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#071710',
      }}
    >
      {/* Background Video with Poster Fallback */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/frames/ezgif-frame-001.jpg"
        onLoadedData={() => setVideoLoaded(true)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 35%',
          zIndex: 1,
          filter: 'brightness(0.92) contrast(1.05)',
          transform: 'scale(1.02)',
          transition: 'opacity 1s ease',
          opacity: videoLoaded ? 1 : 0.85,
        }}
      >
        <source src="/wedding-video.mp4" type="video/mp4" />
        <source src="3D_chibi_wedding_animation_film_20261012141934.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric Overlays for Readability & Luxury */}
      {/* Top subtle vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(180deg, rgba(7, 23, 16, 0.85) 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      {/* Bottom deep gradient for text protection */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65%',
          background: 'linear-gradient(0deg, rgba(7, 23, 16, 0.98) 0%, rgba(7, 23, 16, 0.65) 45%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Hero Content Container */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          marginTop: 'auto',
          marginBottom: '3.5rem',
          padding: '0 1.5rem',
        }}
      >
        {/* Sacred Auspicious Invocation */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.45rem 1.4rem',
            background: 'rgba(11, 37, 25, 0.75)',
            border: '1px solid rgba(226, 196, 116, 0.4)',
            borderRadius: 'var(--radius-full)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: 'var(--color-gold-300)',
            fontSize: '0.8rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--color-gold-400)' }} />
          <span>Om Shree Ganeshayanamah</span>
          <Sparkles size={14} style={{ color: 'var(--color-gold-400)' }} />
        </div>

        {/* Couple Names */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '0.04em',
            margin: '0.5rem 0',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.3)',
          }}
        >
          <span style={{ color: 'var(--color-ivory-100)' }}>{WEDDING_CONFIG.couple.bride.name}</span>
          <span
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: 'var(--color-gold-400)',
              margin: '0 0.85rem',
              fontWeight: 400,
              display: 'inline-block',
              transform: 'translateY(-2px)',
            }}
          >
            &
          </span>
          <span style={{ color: 'var(--color-ivory-100)' }}>{WEDDING_CONFIG.couple.groom.name}</span>
        </h1>

        {/* Poetic Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.15rem, 2.2vw, 1.55rem)',
            fontStyle: 'italic',
            color: 'var(--color-ivory-300)',
            maxWidth: '680px',
            margin: '0.5rem auto 1.75rem auto',
            lineHeight: 1.5,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
          }}
        >
          {WEDDING_CONFIG.couple.subtitle} — {WEDDING_CONFIG.couple.title}
        </p>

        {/* Date & Location Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(7, 23, 16, 0.65)',
              padding: '0.5rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(226, 196, 116, 0.25)',
              color: 'var(--color-ivory-200)',
              fontSize: '0.88rem',
            }}
          >
            <Calendar size={15} style={{ color: 'var(--color-gold-400)' }} />
            <span>{WEDDING_CONFIG.formattedDate}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(7, 23, 16, 0.65)',
              padding: '0.5rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(226, 196, 116, 0.25)',
              color: 'var(--color-ivory-200)',
              fontSize: '0.88rem',
            }}
          >
            <MapPin size={15} style={{ color: 'var(--color-gold-400)' }} />
            <span>{WEDDING_CONFIG.venue.name}, {WEDDING_CONFIG.venue.city}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          <button onClick={scrollToStory} className="btn-gold">
            <Sparkles size={17} />
            <span>Read Our Story</span>
          </button>

          <button onClick={scrollToInvitation} className="btn-outline">
            <Heart size={16} />
            <span>View Invitation</span>
          </button>
        </div>

        {/* Refined Scroll Prompt */}
        <div
          onClick={scrollToStory}
          role="button"
          tabIndex={0}
          style={{
            marginTop: '2.5rem',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'opacity 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
        >
          <span
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-400)',
            }}
          >
            Scroll to enter the celebration
          </span>
          <ChevronDown
            size={20}
            className="animate-float"
            style={{ color: 'var(--color-gold-300)' }}
          />
        </div>
      </div>
    </header>
  );
}
