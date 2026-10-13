import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Heart } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';

/**
 * InvitationCard3D
 * Luxury Digital Wedding Invitation Card with Symmetrical 3D Gatefold Doors.
 * - Symmetrical left and right palace doors that part outward in 3D perspective.
 * - Flaps stay completely within bounds without clipping or overflowing.
 * - Warm ivory paper, Kasavu gold foil embossing, and refined editorial typography.
 */
export default function InvitationCard3D() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasScrolledIntoView) {
            setHasScrolledIntoView(true);
            setTimeout(() => setIsOpen(true), 500);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasScrolledIntoView]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const addToCalendar = () => {
    const title = encodeURIComponent(`${WEDDING_CONFIG.couple.bride.name} & ${WEDDING_CONFIG.couple.groom.name}'s Wedding Ceremony`);
    const details = encodeURIComponent(`You are cordially invited to celebrate the auspicious wedding of Ananya & Rohan in Kumarakom, Kerala.`);
    const location = encodeURIComponent(`${WEDDING_CONFIG.venue.name}, ${WEDDING_CONFIG.venue.address}`);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20261212T040000Z/20261212T060000Z`;
    window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="invitation"
      ref={sectionRef}
      className="section-padding"
      style={{
        background: 'linear-gradient(180deg, #071710 0%, #0b2519 50%, #071710 100%)',
        position: 'relative',
        perspective: '1400px',
        overflow: 'hidden',
        padding: '5rem 0',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="section-tag">
            <Sparkles size={13} />
            <span>Sacred Invocation</span>
          </div>
          <h2 className="section-title">The Royal Wedding Invitation</h2>
          <div className="ornament-divider">
            <span className="ornament-line" />
            <span className="ornament-icon">🪷</span>
            <span className="ornament-line" />
          </div>
          <p className="section-subtitle">
            With the blessings of our ancestors and divine grace, we invite your presence.
          </p>
        </div>

        {/* 3D Gatefold Card Container */}
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            perspective: '1200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Unfold / Fold Toggle Pill */}
          <div style={{ marginBottom: '1.5rem', zIndex: 10 }}>
            <button
              onClick={toggleOpen}
              className="btn-outline"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.84rem' }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-gold-400)' }} />
              <span>{isOpen ? 'Click to Fold Card' : 'Click to Unfold Card'}</span>
            </button>
          </div>

          {/* 3D Card Stage with Tilt */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              width: '100%',
              minHeight: '640px',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* --- MAIN INNER IVORY CARD --- */}
            <div
              className="ivory-card"
              style={{
                width: '100%',
                padding: 'clamp(2.5rem, 5vw, 3.8rem) clamp(1.5rem, 4vw, 3.2rem)',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55), 0 0 35px rgba(212, 175, 55, 0.22)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Corner Ornaments */}
              <div className="card-corner top-left" />
              <div className="card-corner top-right" />
              <div className="card-corner bottom-left" />
              <div className="card-corner bottom-right" />

              {/* Embossed Kasavu Border Motif */}
              <div
                style={{
                  position: 'absolute',
                  inset: '8px',
                  border: '1px solid rgba(197, 160, 89, 0.35)',
                  pointerEvents: 'none',
                }}
              />

              {/* Sacred Sanskrit Invocation */}
              <div
                style={{
                  color: 'var(--color-gold-600)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                ॥ ॐ श्री गणेशाय नमः ॥
              </div>

              {/* Parents' Blessings */}
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontStyle: 'italic',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6,
                  maxWidth: '580px',
                  margin: '0 auto 1.5rem auto',
                }}
              >
                {WEDDING_CONFIG.couple.bride.parents}
                <br />&<br />
                {WEDDING_CONFIG.couple.groom.parents}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.88rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold-700)',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                }}
              >
                Solicit your gracious presence and blessings on the auspicious occasion of the wedding of their children
              </p>

              {/* Couple Names */}
              <div style={{ margin: '1.5rem 0' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                    color: 'var(--color-emerald-950)',
                    lineHeight: 1.1,
                    fontWeight: 700,
                  }}
                >
                  {WEDDING_CONFIG.couple.bride.fullName}
                </h3>

                <div
                  style={{
                    fontFamily: 'var(--font-script)',
                    fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                    color: 'var(--color-gold-600)',
                    margin: '0.2rem 0',
                  }}
                >
                  and
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                    color: 'var(--color-emerald-950)',
                    lineHeight: 1.1,
                    fontWeight: 700,
                  }}
                >
                  {WEDDING_CONFIG.couple.groom.fullName}
                </h3>
              </div>

              {/* Golden Divider */}
              <div className="ornament-divider" style={{ opacity: 0.7, margin: '1.5rem auto' }}>
                <span className="ornament-line" style={{ background: 'linear-gradient(90deg, transparent, #c5a059, transparent)' }} />
                <span className="ornament-icon" style={{ color: '#c5a059' }}>✦</span>
                <span className="ornament-line" style={{ background: 'linear-gradient(90deg, transparent, #c5a059, transparent)' }} />
              </div>

              {/* Ceremony Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '1.25rem',
                  margin: '1.75rem 0',
                  padding: '1.25rem',
                  background: 'rgba(212, 175, 55, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-gold-700)', marginBottom: '4px' }}>
                    <Calendar size={16} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-emerald-950)', margin: 0 }}>
                    {WEDDING_CONFIG.formattedDate}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-gold-700)', marginBottom: '4px' }}>
                    <Clock size={16} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Muhurtham</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-emerald-950)', margin: 0 }}>
                    {WEDDING_CONFIG.muhurthamTime}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-gold-700)', marginBottom: '4px' }}>
                    <MapPin size={16} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Venue</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-emerald-950)', margin: 0 }}>
                    {WEDDING_CONFIG.venue.name}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    {WEDDING_CONFIG.venue.city}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginTop: '1.75rem',
                }}
              >
                <button
                  onClick={addToCalendar}
                  className="btn-gold"
                  style={{ padding: '0.75rem 1.6rem', fontSize: '0.85rem' }}
                >
                  <Calendar size={16} />
                  <span>Add To Google Calendar</span>
                </button>

                <a
                  href="#rsvp"
                  className="btn-outline"
                  style={{
                    color: 'var(--color-emerald-950)',
                    borderColor: 'var(--color-gold-600)',
                    background: 'rgba(212, 175, 55, 0.15)',
                    padding: '0.75rem 1.6rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <Heart size={16} />
                  <span>RSVP Your Presence</span>
                </a>
              </div>
            </div>

            {/* --- 3D GATEFOLD LEFT DOOR (Folds -105deg outward to the left) --- */}
            <div
              onClick={toggleOpen}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(135deg, #103827 0%, #081d14 100%)',
                border: '1.5px solid var(--color-gold-400)',
                borderRight: 'none',
                borderTopLeftRadius: 'var(--radius-lg)',
                borderBottomLeftRadius: 'var(--radius-lg)',
                boxShadow: isOpen ? 'none' : '0 15px 35px rgba(0, 0, 0, 0.7)',
                transformOrigin: 'left center',
                transform: isOpen ? 'rotateY(-108deg)' : 'rotateY(0deg)',
                transition: 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: isOpen ? 0 : 3,
                pointerEvents: isOpen ? 'none' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '1rem',
                cursor: 'pointer',
              }}
            >
              {/* Left Door Half Wax Seal */}
              <div
                style={{
                  width: '42px',
                  height: '84px',
                  borderTopLeftRadius: '84px',
                  borderBottomLeftRadius: '84px',
                  background: 'var(--grad-gold-foil)',
                  boxShadow: '-3px 4px 15px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '6px',
                  color: 'var(--color-emerald-950)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  border: '1.5px solid #fff',
                  borderRight: 'none',
                }}
              >
                A
              </div>
            </div>

            {/* --- 3D GATEFOLD RIGHT DOOR (Folds +105deg outward to the right) --- */}
            <div
              onClick={toggleOpen}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(225deg, #103827 0%, #081d14 100%)',
                border: '1.5px solid var(--color-gold-400)',
                borderLeft: 'none',
                borderTopRightRadius: 'var(--radius-lg)',
                borderBottomRightRadius: 'var(--radius-lg)',
                boxShadow: isOpen ? 'none' : '0 15px 35px rgba(0, 0, 0, 0.7)',
                transformOrigin: 'right center',
                transform: isOpen ? 'rotateY(108deg)' : 'rotateY(0deg)',
                transition: 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: isOpen ? 0 : 3,
                pointerEvents: isOpen ? 'none' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '1rem',
                cursor: 'pointer',
              }}
            >
              {/* Right Door Half Wax Seal */}
              <div
                style={{
                  width: '42px',
                  height: '84px',
                  borderTopRightRadius: '84px',
                  borderBottomRightRadius: '84px',
                  background: 'var(--grad-gold-foil)',
                  boxShadow: '3px 4px 15px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: '6px',
                  color: 'var(--color-emerald-950)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  border: '1.5px solid #fff',
                  borderLeft: 'none',
                }}
              >
                R
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
