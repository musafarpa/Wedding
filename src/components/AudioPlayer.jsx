import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

/**
 * AudioPlayer
 * Plays the romantic wedding song "Love At First Sight.mp3".
 * Features smooth audio playback, loop support, and ambient volume management.
 */
export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create HTML5 Audio element for "Love At First Sight.mp3"
    const audio = new Audio('/Love%20At%20First%20Sight.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.45;

    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay policy fallback
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 900 }}>
      <button
        type="button"
        onClick={toggleAudio}
        data-audio-player="true"
        aria-label={isPlaying ? 'Mute ambient wedding music' : 'Play ambient wedding music'}
        title={isPlaying ? 'Pause "Love At First Sight"' : 'Play "Love At First Sight"'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 18px',
          background: isPlaying
            ? 'linear-gradient(135deg, #164e37 0%, #0b2519 100%)'
            : 'rgba(11, 37, 25, 0.88)',
          color: '#f4eedf',
          border: '1.5px solid var(--color-gold-400, #C9A24B)',
          borderRadius: '9999px',
          boxShadow: isPlaying ? '0 0 25px rgba(201, 162, 75, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {isPlaying ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}>
              <span className="eq-bar eq-bar-1" />
              <span className="eq-bar eq-bar-2" />
              <span className="eq-bar eq-bar-3" />
            </div>
            <Volume2 size={18} style={{ color: 'var(--color-gold-400, #C9A24B)' }} />
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: 'var(--color-gold-300, #E8D296)',
                maxWidth: '140px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Love At First Sight
            </span>
          </>
        ) : (
          <>
            <VolumeX size={18} style={{ color: 'var(--color-gold-400, #C9A24B)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.04em' }}>
              Music
            </span>
          </>
        )}
      </button>

      <style>{`
        .eq-bar {
          width: 3px;
          background: var(--color-gold-400, #C9A24B);
          border-radius: 2px;
          animation: eqDance 1.2s ease-in-out infinite alternate;
        }
        .eq-bar-1 { height: 14px; animation-delay: 0.1s; }
        .eq-bar-2 { height: 8px; animation-delay: 0.35s; }
        .eq-bar-3 { height: 16px; animation-delay: 0.2s; }
        @keyframes eqDance {
          0% { height: 4px; }
          100% { height: 16px; }
        }
      `}</style>
    </div>
  );
}
