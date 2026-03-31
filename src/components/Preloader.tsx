'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = `${circumference}`;
      circleRef.current.style.strokeDashoffset = `${circumference}`;
    }

    const DURATION = 2400; // Slightly longer for "Max Pro" gravitas
    const startTime = Date.now();
    let animFrame: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(Math.floor(pct));

      if (circleRef.current) {
        const offset = circumference - (pct / 100) * circumference;
        circleRef.current.style.strokeDashoffset = `${offset}`;
      }

      // Subtle logo scaling as it loads (Sensory detail)
      if (logoRef.current) {
        const scaleBase = 1 + (pct / 100) * 0.2;
        logoRef.current.style.transform = `scale(${scaleBase})`;
      }

      if (pct < 100) {
        animFrame = requestAnimationFrame(tick);
      } else {
        setTimeout(hidePreloader, 600);
      }
    };

    animFrame = requestAnimationFrame(tick);

    function hidePreloader() {
      if (!containerRef.current) {
        cleanup();
        return;
      }

      const tl = gsap.timeline({ onComplete: cleanup });

      // 2026 Seamless Morph Transition
      tl.to(contentRef.current, {
        scale: 12, // Giant zoom expansion "pull-through"
        opacity: 0,
        duration: 1.2,
        ease: 'power4.inOut',
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      }, '-=0.8');
    }

    function cleanup() {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      if (containerRef.current) {
        containerRef.current.style.display = 'none';
      }
      window.dispatchEvent(new Event('preloaderComplete'));
    }

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--bg-primary)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '240px',
          height: '240px',
          willChange: 'transform, opacity'
        }}
      >
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="120"
            cy="120"
            r="80"
            fill="transparent"
            stroke="var(--surface-secondary)"
            strokeWidth="1"
            opacity="0.3"
          />
          <circle
            ref={circleRef}
            cx="120"
            cy="120"
            r="80"
            fill="transparent"
            stroke="var(--text-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <div
          ref={logoRef}
          className="kinetic-text"
          style={{ 
            fontSize: '3.5rem', 
            color: 'var(--text-primary)', 
            textAlign: 'center',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            willChange: 'transform'
          }}
        >
          KS
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            fontWeight: 600,
            opacity: progress / 100
          }}
        >
          {progress}%
        </div>
      </div>
    </div>
  );
}

