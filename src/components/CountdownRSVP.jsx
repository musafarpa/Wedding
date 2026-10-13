import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Clock, Send, Heart, CheckCircle2, Share2, Copy, Sparkles, User, Users, MessageSquare } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingConfig';

export default function CountdownRSVP() {
  // --- COUNTDOWN STATE ---
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(WEDDING_CONFIG.weddingDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- RSVP FORM STATE ---
  const [formData, setFormData] = useState({
    guestName: '',
    emailOrPhone: '',
    attendance: 'accept', // 'accept' | 'decline'
    guestCount: '2',
    dietPreference: 'sadhya',
    blessing: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRSVP, setSubmittedRSVP] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load existing RSVP if previously saved in browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wedding_rsvp_record');
      if (saved) {
        setSubmittedRSVP(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const validate = () => {
    const errors = {};
    if (!formData.guestName.trim()) {
      errors.guestName = 'Please enter your full name';
    }
    if (!formData.emailOrPhone.trim()) {
      errors.emailOrPhone = 'Please provide your email or phone for guest coordination';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const record = {
        ...formData,
        submittedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem('wedding_rsvp_record', JSON.stringify(record));
      } catch (err) {}

      setSubmittedRSVP(record);
      setIsSubmitting(false);

      // Trigger Confetti Celebration for joyful attendance!
      if (formData.attendance === 'accept') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f7ebb8', '#0d3325', '#e2c474', '#ffffff'],
        });
      }
    }, 600);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${WEDDING_CONFIG.couple.bride.name} & ${WEDDING_CONFIG.couple.groom.name} — Wedding Invitation`,
      text: `You're invited to celebrate the 3D Wedding Journey of Ananya & Rohan in Kerala!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const resetRSVP = () => {
    localStorage.removeItem('wedding_rsvp_record');
    setSubmittedRSVP(null);
    setFormData({
      guestName: '',
      emailOrPhone: '',
      attendance: 'accept',
      guestCount: '2',
      dietPreference: 'sadhya',
      blessing: '',
    });
  };
  return (
    <section id="rsvp" className="section-padding" style={{ background: 'var(--palette-warm-ivory)', color: 'var(--palette-forest-green)', position: 'relative' }}>
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
            <Clock size={13} />
            <span>Counting The Moments</span>
          </div>
          <h2 className="section-title" style={{ color: 'var(--palette-forest-green)' }}>
            The Countdown & RSVP
          </h2>
          <div className="ornament-divider">
            <span className="ornament-line" style={{ background: 'linear-gradient(90deg, transparent, #D4AF62, transparent)' }} />
            <span className="ornament-icon">🪷</span>
            <span className="ornament-line" style={{ background: 'linear-gradient(90deg, transparent, #D4AF62, transparent)' }} />
          </div>
          <p className="section-subtitle" style={{ color: 'var(--color-text-muted)' }}>
            Every second draws us nearer to the sacred muhurtham. Kindly confirm your gracious attendance.
          </p>
        </div>

        {/* --- COUNTDOWN TIMER CLOCK --- */}
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto 4rem auto',
          }}
        >
          {timeLeft.isExpired ? (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'center',
                border: '2px solid var(--palette-champagne-gold)',
                boxShadow: '0 10px 30px rgba(18, 59, 44, 0.08)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--palette-forest-green)', fontSize: '1.8rem' }}>
                The Sacred Union Has Begun!
              </h3>
              <p style={{ color: '#2D473A', marginTop: '0.5rem' }}>
                Thank you for being part of this blissful chapter.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'clamp(0.75rem, 2vw, 1.75rem)',
              }}
            >
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Minutes', val: timeLeft.minutes },
                { label: 'Seconds', val: timeLeft.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'clamp(1.2rem, 3vw, 2rem) 0.5rem',
                    textAlign: 'center',
                    border: '1.5px solid var(--palette-champagne-gold)',
                    boxShadow: '0 8px 25px rgba(18, 59, 44, 0.08)',
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                      fontWeight: 700,
                      color: 'var(--palette-forest-green)',
                      lineHeight: 1,
                      marginBottom: '0.4rem',
                    }}
                  >
                    {String(unit.val).padStart(2, '0')}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(0.68rem, 1.5vw, 0.85rem)',
                      color: '#8C6F2A',
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- RSVP FORM & CONFIRMATION --- */}
        <div
          style={{
            background: 'var(--palette-forest-green)',
            color: 'var(--color-ivory-100)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--palette-champagne-gold)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35), 0 0 35px rgba(212, 175, 98, 0.15)',
            maxWidth: '720px',
            margin: '0 auto',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            position: 'relative',
          }}
        >
          {submittedRSVP ? (
            /* SUCCESS CONFIRMATION STATE */
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '2px solid var(--color-gold-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  color: 'var(--color-gold-400)',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  color: 'var(--color-ivory-100)',
                  marginBottom: '0.75rem',
                }}
              >
                {submittedRSVP.attendance === 'accept'
                  ? 'We Look Forward To Celebrating With You!'
                  : 'Thank You For Sending Your Warm Wishes'}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  color: 'var(--color-ivory-200)',
                  lineHeight: 1.6,
                  maxWidth: '520px',
                  margin: '0 auto 1.75rem auto',
                }}
              >
                {submittedRSVP.attendance === 'accept'
                  ? `Your confirmation for ${submittedRSVP.guestCount} guest(s) under the name "${submittedRSVP.guestName}" has been safely registered.`
                  : `Dear ${submittedRSVP.guestName}, we deeply cherish your blessings and will miss your physical presence.`}
              </p>

              {submittedRSVP.blessing && (
                <div
                  style={{
                    background: 'rgba(7, 23, 16, 0.8)',
                    border: '1px solid rgba(226, 196, 116, 0.25)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-gold-300)',
                    marginBottom: '2rem',
                    maxWidth: '500px',
                    margin: '0 auto 2rem auto',
                  }}
                >
                  "{submittedRSVP.blessing}"
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={handleShare} className="btn-gold" style={{ padding: '0.75rem 1.6rem', fontSize: '0.85rem' }}>
                  <Share2 size={16} />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Invitation'}</span>
                </button>

                <button
                  onClick={resetRSVP}
                  className="btn-outline"
                  style={{ padding: '0.75rem 1.6rem', fontSize: '0.85rem' }}
                >
                  <span>Edit Response</span>
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE RSVP INPUT FORM */
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    color: 'var(--color-ivory-100)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Kindly Respond by 20th November 2026
                </h3>
                <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ivory-300)', fontStyle: 'italic' }}>
                  Please assist us in preparing the grand Kerala feast and accommodations.
                </p>
              </div>

              {/* Attendance Choice Buttons */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', color: 'var(--color-gold-300)', fontSize: '0.84rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Will you be joining us?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: 'accept' })}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: formData.attendance === 'accept' ? 'rgba(212, 175, 55, 0.22)' : 'rgba(7, 23, 16, 0.6)',
                      border: formData.attendance === 'accept' ? '2px solid var(--color-gold-400)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: formData.attendance === 'accept' ? 'var(--color-gold-300)' : 'var(--color-ivory-300)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Heart size={16} fill={formData.attendance === 'accept' ? 'currentColor' : 'none'} />
                    <span>Joyfully Accept</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attendance: 'decline' })}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: formData.attendance === 'decline' ? 'rgba(212, 175, 55, 0.22)' : 'rgba(7, 23, 16, 0.6)',
                      border: formData.attendance === 'decline' ? '2px solid var(--color-gold-400)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: formData.attendance === 'decline' ? 'var(--color-gold-300)' : 'var(--color-ivory-300)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>Regretfully Decline</span>
                  </button>
                </div>
              </div>

              {/* Guest Full Name */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="guestName"
                  style={{ display: 'block', color: 'var(--color-gold-300)', fontSize: '0.84rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
                >
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="guestName"
                    type="text"
                    required
                    placeholder="e.g. Dr. Gautham Menon"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1rem 0.95rem 2.8rem',
                      background: 'rgba(7, 23, 16, 0.75)',
                      border: formErrors.guestName ? '1.5px solid #e57373' : '1px solid rgba(226, 196, 116, 0.35)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-ivory-100)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold-400)' }} />
                </div>
                {formErrors.guestName && (
                  <p style={{ color: '#e57373', fontSize: '0.8rem', marginTop: '0.35rem' }}>{formErrors.guestName}</p>
                )}
              </div>

              {/* Phone or Email */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="emailOrPhone"
                  style={{ display: 'block', color: 'var(--color-gold-300)', fontSize: '0.84rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
                >
                  Email or Mobile Number *
                </label>
                <input
                  id="emailOrPhone"
                  type="text"
                  required
                  placeholder="e.g. gautham@example.com / +91 98470..."
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1rem',
                    background: 'rgba(7, 23, 16, 0.75)',
                    border: formErrors.emailOrPhone ? '1.5px solid #e57373' : '1px solid rgba(226, 196, 116, 0.35)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-ivory-100)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                {formErrors.emailOrPhone && (
                  <p style={{ color: '#e57373', fontSize: '0.8rem', marginTop: '0.35rem' }}>{formErrors.emailOrPhone}</p>
                )}
              </div>

              {/* Number of Guests (Only if accepting) */}
              {formData.attendance === 'accept' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label
                      htmlFor="guestCount"
                      style={{ display: 'block', color: 'var(--color-gold-300)', fontSize: '0.84rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
                    >
                      Total Guests Attending
                    </label>
                    <select
                      id="guestCount"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.95rem 1rem',
                        background: 'rgba(7, 23, 16, 0.9)',
                        border: '1px solid rgba(226, 196, 116, 0.35)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-ivory-100)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    >
                      <option value="1">1 Person (Just Myself)</option>
                      <option value="2">2 Persons (Couple)</option>
                      <option value="3">3 Persons (Family)</option>
                      <option value="4">4+ Persons (Extended Family)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="dietPreference"
                      style={{ display: 'block', color: 'var(--color-gold-300)', fontSize: '0.84rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
                    >
                      Dietary Preference
                    </label>
                    <select
                      id="dietPreference"
                      value={formData.dietPreference}
                      onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.95rem 1rem',
                        background: 'rgba(7, 23, 16, 0.9)',
                        border: '1px solid rgba(226, 196, 116, 0.35)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-ivory-100)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    >
                      <option value="sadhya">Traditional Kerala Sadhya (Pure Veg)</option>
                      <option value="jain">Jain Friendly Vegetarian</option>
                      <option value="coastal">Special Kerala Coastal Fare</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Blessings Note */}
              <div style={{ marginBottom: '2rem' }}>
                <label
                  htmlFor="blessing"
                  style={{ display: 'block', color: 'var(--color-gold-300)', fontSize: '0.84rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}
                >
                  Warm Wishes & Blessings for Ananya & Rohan (Optional)
                </label>
                <textarea
                  id="blessing"
                  rows={3}
                  placeholder="May your journey be filled with endless joy, love, and laughter..."
                  value={formData.blessing}
                  onChange={(e) => setFormData({ ...formData, blessing: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1rem',
                    background: 'rgba(7, 23, 16, 0.75)',
                    border: '1px solid rgba(226, 196, 116, 0.35)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-ivory-100)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '1.05rem',
                  fontSize: '0.95rem',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Recording Your Response...' : 'Send RSVP Confirmation'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
