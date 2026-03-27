'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = `${circumference}`;
      circleRef.current.style.strokeDashoffset = `${circumference}`;
    }

    // Duration of the preloader animation in ms
    const DURATION = 2000;
    const startTime = Date.now();
    let animFrame: number;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / DURATION) * 100), 100);
      setProgress(pct);

      if (circleRef.current) {
        const offset = circumference - (pct / 100) * circumference;
        circleRef.current.style.strokeDashoffset = `${offset}`;
      }

      if (pct < 100) {
        animFrame = requestAnimationFrame(tick);
      } else {
        // Small pause at 100% before exiting
        setTimeout(hidePreloader, 400);
      }
    };

    animFrame = requestAnimationFrame(tick);

    function hidePreloader() {
      if (!containerRef.current) {
        cleanup();
        return;
      }

      const tl = gsap.timeline({ onComplete: cleanup });

      tl.to(contentRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
      }).to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        '-=0.1'
      );
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
        backgroundColor: '#070A0F',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Progress ring */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '160px',
          height: '160px',
        }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 200 200"
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="transparent"
            stroke="var(--surface-secondary)"
            strokeWidth="1"
          />
          <circle
            ref={circleRef}
            cx="100"
            cy="100"
            r="60"
            fill="transparent"
            stroke="var(--accent-lime)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div
          className="kinetic-text"
          style={{ fontSize: '1.8rem', color: 'var(--text-primary)', textAlign: 'center' }}
        >
          {progress.toString().padStart(3, '0')}
        </div>
      </div>

      {/* Brand name */}
      <div
        className="preloader-name"
        style={{
          position: 'absolute',
          bottom: '10%',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
      >
        Ksenyia Sujova
      </div>
    </div>
  );
}
