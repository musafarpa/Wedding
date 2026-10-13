import React from 'react';
import { MapPin, Navigation, Plane, Train, Compass, ExternalLink, Sun, Sparkles } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';

export default function VenueSection() {
  const openMap = () => {
    window.open(WEDDING_CONFIG.venue.mapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="venue" className="section-padding" style={{ background: '#0b2519', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <MapPin size={13} />
            <span>The Destination</span>
          </div>
          <h2 className="section-title">The Wedding Venue</h2>
          <div className="ornament-divider">
            <span className="ornament-line" />
            <span className="ornament-icon">🪷</span>
            <span className="ornament-line" />
          </div>
          <p className="section-subtitle">
            An enchanting heritage sanctuary nestled on the pristine shores of Lake Vembanad.
          </p>
        </div>

        {/* Resort Panoramic Photo */}
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto 2.5rem auto',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '2px solid var(--color-gold-400)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.55)',
            position: 'relative',
          }}
        >
          <img
            src="/kumarakom-lake-resort.jpg"
            alt="Kumarakom Lake Resort waterfront villas at sunset"
            loading="lazy"
            style={{
              width: '100%',
              height: '380px',
              objectFit: 'cover',
              objectPosition: 'center 60%',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '20px',
              background: 'rgba(11, 36, 27, 0.88)',
              border: '1px solid rgba(212, 175, 98, 0.4)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 16px',
              color: 'var(--color-gold-300)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              backdropFilter: 'blur(10px)',
            }}
          >
            Kumarakom Lake Resort • Waterfront Sanctuary on Lake Vembanad
          </div>
        </div>

        {/* Venue Showcase Card */}
        <div
          className="glass-panel"
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            overflow: 'hidden',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Left: Venue Story & Details */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--color-gold-400)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '0.65rem',
                }}
              >
                <Sparkles size={14} />
                <span>God's Own Country Sanctuary</span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)',
                  color: 'var(--color-ivory-100)',
                  lineHeight: 1.15,
                  marginBottom: '0.75rem',
                }}
              >
                {WEDDING_CONFIG.venue.name}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  color: 'var(--color-gold-300)',
                  fontStyle: 'italic',
                  marginBottom: '1.25rem',
                }}
              >
                {WEDDING_CONFIG.venue.subtitle}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  color: 'var(--color-ivory-200)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem',
                }}
              >
                <MapPin size={20} style={{ color: 'var(--color-gold-400)', flexShrink: 0, marginTop: '2px' }} />
                <span>{WEDDING_CONFIG.venue.address}</span>
              </div>

              {/* Weather Callout */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(7, 23, 16, 0.7)',
                  border: '1px solid rgba(226, 196, 116, 0.25)',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-ivory-200)',
                  fontSize: '0.84rem',
                  marginBottom: '2rem',
                }}
              >
                <Sun size={17} style={{ color: 'var(--color-gold-400)' }} />
                <span>December Climate: Pleasant 26°C • Gentle Lake Breeze</span>
              </div>

              <div>
                <button onClick={openMap} className="btn-gold">
                  <Navigation size={16} />
                  <span>Open In Google Maps</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* Right: Travel & Arrival Logistics */}
            <div
              style={{
                background: 'rgba(7, 23, 16, 0.8)',
                border: '1px solid rgba(226, 196, 116, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  color: 'var(--color-gold-300)',
                  marginBottom: '1.25rem',
                  letterSpacing: '0.04em',
                }}
              >
                How To Reach The Venue
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {WEDDING_CONFIG.venue.travelInfo.map((info, idx) => {
                  let Icon = Plane;
                  if (info.mode.includes('Rail')) Icon = Train;
                  if (info.mode.includes('Water')) Icon = Compass;

                  return (
                    <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'rgba(212, 175, 55, 0.12)',
                          border: '1px solid rgba(226, 196, 116, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-gold-400)',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ color: 'var(--color-gold-400)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '2px' }}>
                          {info.mode}
                        </div>
                        <div style={{ color: 'var(--color-ivory-300)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                          {info.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hospitality Desk Callout */}
              <div
                style={{
                  marginTop: '1.75rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid rgba(226, 196, 116, 0.15)',
                  fontSize: '0.82rem',
                  color: 'var(--color-ivory-300)',
                }}
              >
                <span style={{ color: 'var(--color-gold-400)', fontWeight: 600 }}>Hospitality Team: </span>
                {WEDDING_CONFIG.contacts.hospitality}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
