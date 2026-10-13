import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Heart, Utensils, GlassWater, Shirt } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';

const iconMap = {
  Sparkles: Sparkles,
  Heart: Heart,
  Utensils: Utensils,
  GlassWater: GlassWater,
};

export default function EventsSection() {
  const handleCalendar = (event) => {
    const title = encodeURIComponent(`${event.title} — ${WEDDING_CONFIG.couple.bride.name} & ${WEDDING_CONFIG.couple.groom.name}`);
    const details = encodeURIComponent(`${event.subtitle}\n${event.description}\nDress Code: ${event.dressCode}`);
    const location = encodeURIComponent(`${event.venue}, ${WEDDING_CONFIG.venue.city}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="events" className="section-padding" style={{ background: 'var(--palette-soft-sage)', color: 'var(--palette-forest-green)', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div
            className="section-tag"
            style={{
              background: 'rgba(212, 175, 98, 0.15)',
              color: '#8C6F2A',
              borderColor: 'rgba(212, 175, 98, 0.4)',
            }}
          >
            <Sparkles size={13} />
            <span>Celebration Itinerary</span>
          </div>
          <h2 className="section-title" style={{ color: 'var(--palette-forest-green)' }}>
            The Wedding Celebrations
          </h2>
          <div className="ornament-divider">
            <span className="ornament-line" style={{ background: 'linear-gradient(90deg, transparent, #D4AF62, transparent)' }} />
            <span className="ornament-icon">🪷</span>
            <span className="ornament-line" style={{ background: 'linear-gradient(90deg, transparent, #D4AF62, transparent)' }} />
          </div>
          <p className="section-subtitle" style={{ color: 'var(--color-text-muted)' }}>
            Two days of sacred traditions, vibrant music, authentic cuisine, and joyful memories.
          </p>
        </div>

        {/* Events Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            maxWidth: '1180px',
            margin: '0 auto',
          }}
        >
          {WEDDING_CONFIG.events.map((evt) => {
            const IconComponent = iconMap[evt.icon] || Sparkles;
            const isPrimary = evt.isPrimary;

            return (
              <div
                key={evt.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: isPrimary ? '2px solid var(--palette-champagne-gold)' : '1px solid rgba(18, 59, 44, 0.15)',
                  boxShadow: isPrimary
                    ? '0 16px 45px rgba(212, 175, 98, 0.25), 0 4px 15px rgba(18, 59, 44, 0.08)'
                    : '0 10px 30px rgba(18, 59, 44, 0.08)',
                  transition: 'var(--transition-smooth)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 45px rgba(18, 59, 44, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isPrimary
                    ? '0 16px 45px rgba(212, 175, 98, 0.25), 0 4px 15px rgba(18, 59, 44, 0.08)'
                    : '0 10px 30px rgba(18, 59, 44, 0.08)';
                }}
              >
                {/* Primary Auspicious Badge */}
                {isPrimary && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      right: '24px',
                      background: 'var(--grad-gold-foil)',
                      color: 'var(--palette-forest-green)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '4px 14px',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: '0 4px 12px rgba(212, 175, 98, 0.4)',
                    }}
                  >
                    Main Muhurtham
                  </div>
                )}

                {/* Event Icon Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(212, 175, 98, 0.15)',
                      border: '1px solid var(--palette-champagne-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8C6F2A',
                    }}
                  >
                    <IconComponent size={22} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.45rem',
                        color: 'var(--palette-forest-green)',
                        lineHeight: 1.2,
                        margin: 0,
                      }}
                    >
                      {evt.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '0.95rem',
                        fontStyle: 'italic',
                        color: '#8C6F2A',
                      }}
                    >
                      {evt.subtitle}
                    </span>
                  </div>
                </div>

                {/* Event Meta Box */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    margin: '1rem 0 1.5rem 0',
                    padding: '1rem',
                    background: 'var(--palette-warm-ivory)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(18, 59, 44, 0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--palette-forest-green)', fontSize: '0.88rem' }}>
                    <Calendar size={16} style={{ color: '#8C6F2A', flexShrink: 0 }} />
                    <span style={{ fontWeight: 500 }}>{evt.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--palette-forest-green)', fontSize: '0.88rem' }}>
                    <Clock size={16} style={{ color: '#8C6F2A', flexShrink: 0 }} />
                    <span>{evt.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--palette-forest-green)', fontSize: '0.88rem' }}>
                    <MapPin size={16} style={{ color: '#8C6F2A', flexShrink: 0, marginTop: '3px' }} />
                    <span>{evt.venue}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#8C6F2A', fontSize: '0.84rem' }}>
                    <Shirt size={16} style={{ color: '#8C6F2A', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ fontStyle: 'italic' }}>Attire: {evt.dressCode}</span>
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.05rem',
                    color: '#2D473A',
                    lineHeight: 1.6,
                    marginBottom: '1.75rem',
                    flex: 1,
                  }}
                >
                  {evt.description}
                </p>

                {/* Add to Calendar button */}
                <button
                  onClick={() => handleCalendar(evt)}
                  className="btn-gold"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.82rem',
                    letterSpacing: '0.04em',
                    justifyContent: 'center',
                  }}
                >
                  <Calendar size={15} />
                  <span>Add To Google Calendar</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
