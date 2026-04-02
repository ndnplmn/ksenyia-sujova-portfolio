'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const span1Ref = useRef<HTMLSpanElement>(null);
  const span2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── 1. INITIAL STATES ──────────────────────────────────────────────────
      gsap.set(containerRef.current, { autoAlpha: 1 });
      gsap.set([span1Ref.current, span2Ref.current], { y: 120, opacity: 0, skewY: 6 });
      gsap.set(subtitleRef.current, { y: 40, opacity: 0 });

      // ── 2. INTRO ANIMATION ─────────────────────────────────────────────────
      const introTl = gsap.timeline({ paused: true });
      introTl
        .to(span1Ref.current, { y: 0, opacity: 1, skewY: 0, duration: 1.4, ease: 'power4.out' })
        .to(span2Ref.current, { y: 0, opacity: 1, skewY: 0, duration: 1.4, ease: 'power4.out' }, '-=1.1')
        .to(subtitleRef.current, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, '-=0.6');

      const handlePreloaderDone = () => introTl.play();
      window.addEventListener('preloaderComplete', handlePreloaderDone);
      const fallbackTimer = setTimeout(() => introTl.play(), 1500);

      // ── 3. SCROLL ANIMATION ────────────────────────────────────────────────
      const isMobile = window.matchMedia('(max-width: 768px)').matches;

      const scrollHandler = (self: { progress: number }) => {
        const p = self.progress;

        // Text: phase 0→0.4 — rise and fade out
        if (span1Ref.current && span2Ref.current) {
          const textProgress = Math.min(p / 0.4, 1);
          gsap.set([span1Ref.current, span2Ref.current], {
            y: textProgress * (isMobile ? -100 : -180),
            opacity: 1 - textProgress,
            scale: 1 - textProgress * 0.1
          });
        }
        if (subtitleRef.current) {
          const subProgress = Math.min(p / 0.3, 1);
          gsap.set(subtitleRef.current, {
            y: subProgress * (isMobile ? -40 : -80),
            opacity: 1 - subProgress
          });
        }

        // Overlay: completely removed initial veil for immediate impact
        if (overlayRef.current) {
          gsap.set(overlayRef.current, { opacity: 0 }); 
        }

        // Video: phase 0.3→1 — slow zoom in
        if (videoRef.current) {
          const videoProgress = Math.max(0, Math.min((p - 0.3) / 0.7, 1));
          gsap.set(videoRef.current, { scale: 1 + videoProgress * 0.1 });

          // Also scrub playback
          if (videoRef.current.duration > 0) {
            videoRef.current.currentTime = p * (videoRef.current.duration - 0.1);
          }
        }
      };

      // Scroll animation — unified for both desktop and mobile
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: isMobile ? '+=120%' : '+=200%',
        pin: true,
        anticipatePin: 1,
        scrub: isMobile ? 0.8 : 1.5,
        onUpdate: scrollHandler
      });

      // ── 4. MOUSE KINETICS (desktop only) ───────────────────────────────────
      let mouseTimeoutId: NodeJS.Timeout;
      if (!isMobile) {
        let lastX = 0;

        const handleMouseMove = (e: MouseEvent) => {
          const nX = (e.clientX / window.innerWidth) * 2 - 1;
          const nY = (e.clientY / window.innerHeight) * 2 - 1;
          const vX = e.clientX - lastX;
          lastX = e.clientX;
          const skew = gsap.utils.clamp(-20, 20, vX * -0.4);

          gsap.to([span1Ref.current, span2Ref.current], {
            x: nX * -40,
            y: nY * -25,
            skewX: skew,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto'
          });

          clearTimeout(mouseTimeoutId);
          mouseTimeoutId = setTimeout(() => {
            gsap.to([span1Ref.current, span2Ref.current], {
              skewX: 0,
              duration: 1.4,
              ease: 'elastic.out(1, 0.3)'
            });
          }, 60);
        };

        window.addEventListener('mousemove', handleMouseMove);
      }

      return () => {
        window.removeEventListener('preloaderComplete', handlePreloaderDone);
        clearTimeout(fallbackTimer);
        clearTimeout(mouseTimeoutId);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-section"
      aria-labelledby="hero-heading"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-pure)', // Fixed pure white background to match reference
      }}
    >

      {/* Video background */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <video
          ref={videoRef}
          src="/flower-transition.mp4"
          muted
          playsInline
          onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = 0.01;
          }}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        />
        <div
          ref={overlayRef}
          style={{ position: 'absolute', inset: 0, background: 'var(--bg-pure)', zIndex: 1 }}
        />
      </div>

      {/* Text content */}
      <div
        className="hero-content"
        style={{
          position: 'relative',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          mixBlendMode: 'difference', // Move to container to bypass child isolation
          pointerEvents: 'none', // Allow mouse to hit video for any interaction
          WebkitBackfaceVisibility: 'hidden', // iOS hardware acceleration
          WebkitTransform: 'translate3d(0,0,0)', // Stabilize blending
        }}
      >
        <h1
          id="hero-heading"
          className="kinetic-text"
          style={{
            fontSize: 'clamp(2rem, 11vw, 9rem)', 
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#FDA98E', // Mathematical inverse of #025671
            margin: 0,
            display: 'flex',
            gap: 'clamp(0.5rem, 2vw, 2rem)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span ref={span1Ref} style={{ display: 'inline-block' }}>
            DESIGN.
          </span>
          <span ref={span2Ref} style={{ display: 'inline-block' }}>
            ART.
          </span>
        </h1>

        <p
          ref={subtitleRef}
          style={{
            fontSize: 'clamp(0.7rem, 1.3vw, 1rem)',
            fontWeight: 500,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#FDA98E', // Consistent inverted base
            margin: 0,
            willChange: 'transform, opacity',
          }}
        >
          Digital Art Direction&nbsp;&nbsp;/&nbsp;&nbsp;UI·UX Design&nbsp;&nbsp;/&nbsp;&nbsp;Motion
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.5,
        }}
      >
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          Scroll
        </span>
        <div style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, var(--text-secondary), transparent)',
          animation: 'pulse 1.8s ease-in-out infinite',
        }} />
      </div>
    </section>
  );
}
