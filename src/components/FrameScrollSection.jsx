import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WEDDING_CONFIG } from '../config/weddingConfig';
import { Sparkles, ArrowRight, Film } from 'lucide-react';

export default function FrameScrollSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const totalFrames = WEDDING_CONFIG.frames.totalFrames; // 192
  const imagesRef = useRef([]);
  const loadedMapRef = useRef(new Set());
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState(1);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const targetFrameRef = useRef(1);
  const currentFrameRef = useRef(1);
  const rafIdRef = useRef(null);

  // Draw a specific image to the canvas preserving 16:9 aspect ratio and filling screen
  const drawImageCover = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Calculate "cover" scale
    const scale = Math.max(cw / imgWidth, ch / imgHeight);
    const renderW = imgWidth * scale;
    const renderH = imgHeight * scale;
    const renderX = (cw - renderW) / 2;
    const renderY = (ch - renderH) / 2;

    ctx.drawImage(img, renderX, renderY, renderW, renderH);
  }, []);

  // Find the closest loaded frame to the requested index to guarantee zero blank screens
  const getBestAvailableImage = useCallback((targetIndex) => {
    const images = imagesRef.current;
    if (images[targetIndex] && images[targetIndex].complete && images[targetIndex].naturalWidth > 0) {
      return images[targetIndex];
    }

    // Search closest backwards
    for (let offset = 1; offset < totalFrames; offset++) {
      const prev = targetIndex - offset;
      if (prev >= 1 && images[prev] && images[prev].complete && images[prev].naturalWidth > 0) {
        return images[prev];
      }
      const next = targetIndex + offset;
      if (next <= totalFrames && images[next] && images[next].complete && images[next].naturalWidth > 0) {
        return images[next];
      }
    }

    return images[1] || null;
  }, [totalFrames]);

  // Handle Canvas Resize
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // Immediately draw current frame
    const currentIdx = Math.round(currentFrameRef.current);
    const img = getBestAvailableImage(currentIdx);
    if (img) drawImageCover(img);
  }, [drawImageCover, getBestAvailableImage]);

  // Progressive Priority Loading Strategy
  useEffect(() => {
    let isCancelled = false;
    const images = [];

    // Helper to load a specific frame
    const loadFrame = (idx) => {
      if (images[idx]) return images[idx];
      const img = new Image();
      img.src = WEDDING_CONFIG.frames.getFrameUrl(idx);
      img.onload = () => {
        if (isCancelled) return;
        loadedMapRef.current.add(idx);
        setLoadPercentage(Math.round((loadedMapRef.current.size / totalFrames) * 100));

        // If the newly loaded frame is very close to current scrubber position, redraw immediately!
        const currentActive = Math.round(currentFrameRef.current);
        if (Math.abs(currentActive - idx) <= 1) {
          drawImageCover(img);
        }
      };
      img.onerror = () => {
        if (isCancelled) return;
        loadedMapRef.current.add(idx); // mark as resolved to prevent hanging
      };
      images[idx] = img;
      return img;
    };

    // 1. Immediately load Frame 1
    const firstImg = loadFrame(1);
    firstImg.onload = () => {
      if (isCancelled) return;
      loadedMapRef.current.add(1);
      resizeCanvas();
      drawImageCover(firstImg);
    };

    // 2. Load stride samples (every 10 frames) so visitor has instant previews across the entire timeline
    const stridePromises = [];
    for (let i = 10; i <= totalFrames; i += 10) {
      loadFrame(i);
    }

    // 3. Progressively fill in all remaining frames in small batches
    let currentBatchIndex = 2;
    const loadRemainingBatch = () => {
      if (isCancelled) return;
      const batchSize = 12;
      const end = Math.min(totalFrames, currentBatchIndex + batchSize);
      for (let i = currentBatchIndex; i <= end; i++) {
        loadFrame(i);
      }
      currentBatchIndex = end + 1;
      if (currentBatchIndex <= totalFrames) {
        setTimeout(loadRemainingBatch, 40);
      }
    };

    setTimeout(loadRemainingBatch, 80);
    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, drawImageCover, resizeCanvas]);

  // Resize Listener
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Scroll Listener & Render Loop
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      if (scrollableDist <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollableDist));
      targetFrameRef.current = 1 + progress * (totalFrames - 1);

      // Determine active narrative phase
      const currentIdx = Math.round(targetFrameRef.current);
      const phaseIdx = WEDDING_CONFIG.frames.narrativePhases.findIndex(
        (p) => currentIdx >= p.startFrame && currentIdx <= p.endFrame
      );
      if (phaseIdx !== -1) {
        setActivePhaseIndex(phaseIdx);
      }
    };

    // Run on mount
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth 60fps lerp scrub loop
    let lastRenderedIndex = -1;
    const renderLoop = () => {
      currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * 0.22;
      const frameToDraw = Math.round(currentFrameRef.current);

      if (frameToDraw !== lastRenderedIndex) {
        const img = getBestAvailableImage(frameToDraw);
        if (img) {
          drawImageCover(img);
          lastRenderedIndex = frameToDraw;
          setCurrentFrameDisplay(frameToDraw);
        }
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [totalFrames, drawImageCover, getBestAvailableImage]);

  const skipToStory = () => {
    const el = document.getElementById('story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentPhase = WEDDING_CONFIG.frames.narrativePhases[activePhaseIndex] || WEDDING_CONFIG.frames.narrativePhases[0];
  const progressPercent = Math.round(((currentFrameDisplay - 1) / (totalFrames - 1)) * 100);

  return (
    <section
      id="journey"
      ref={containerRef}
      style={{
        position: 'relative',
        height: '200vh', // Optimized pinned scroll height (smooth and responsive!)
        background: '#071710',
      }}
    >
      {/* Sticky Fullscreen Container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />

        {/* Soft Vignette & Edge Gradients */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '16vh',
            background: 'linear-gradient(180deg, rgba(7, 23, 16, 0.95) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '22vh',
            background: 'linear-gradient(0deg, rgba(7, 23, 16, 0.95) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* Top Floating Badge */}
        <div
          style={{
            position: 'absolute',
            top: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            background: 'rgba(7, 23, 16, 0.78)',
            border: '1px solid rgba(226, 196, 116, 0.35)',
            borderRadius: 'var(--radius-full)',
            backdropFilter: 'blur(12px)',
            color: 'var(--color-gold-300)',
            fontSize: '0.78rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          <Film size={14} style={{ color: 'var(--color-gold-400)' }} />
          <span>Interactive Scroll Film</span>
          <span style={{ color: 'var(--color-gold-500)', opacity: 0.6 }}>•</span>
          <span>{currentFrameDisplay} / {totalFrames}</span>
        </div>

        {/* Dynamic Poetic Narrative Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '44px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            textAlign: 'center',
            width: '90%',
            maxWidth: '740px',
            background: 'rgba(7, 23, 16, 0.84)',
            border: '1.5px solid rgba(226, 196, 116, 0.35)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem 2.2rem',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.15)',
            transition: 'all 0.4s ease',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-gold-400)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            <Sparkles size={13} />
            <span>Scene {activePhaseIndex + 1} of 3</span>
            <Sparkles size={13} />
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2.8vw, 1.85rem)',
              color: 'var(--color-ivory-100)',
              fontWeight: 700,
              margin: '0.2rem 0 0.5rem 0',
              lineHeight: 1.25,
            }}
          >
            {currentPhase.title}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              fontStyle: 'italic',
              color: 'var(--color-ivory-300)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {currentPhase.subtitle}
          </p>

          {/* Interactive Scrub Progress Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '1.2rem',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '4px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #c5a059, #f7ebb8)',
                  borderRadius: '999px',
                  boxShadow: '0 0 10px rgba(226, 196, 116, 0.8)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>

            <button
              onClick={skipToStory}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gold-400)',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-gold-400)')}
            >
              <span>Skip</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Progressive Loading Toast (Only briefly if loading remaining frames) */}
        {loadPercentage < 100 && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '24px',
              background: 'rgba(7, 23, 16, 0.85)',
              border: '1px solid rgba(226, 196, 116, 0.2)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              fontSize: '0.7rem',
              color: 'var(--color-gold-300)',
              zIndex: 25,
            }}
          >
            Buffering: {loadPercentage}%
          </div>
        )}
      </div>
    </section>
  );
}
