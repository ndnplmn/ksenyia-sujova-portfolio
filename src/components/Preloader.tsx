'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const imageUrls = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200',
  'https://images.unsplash.com/photo-1618005191263-d731885b525f?q=80&w=1200'
];

const videoUrl = '/hero-video.mp4?v=3';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    let loadedCount = 0;
    const totalAssets = imageUrls.length + 1;
    let isFinished = false;

    // Radius considerations for the SVG circle
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = `${circumference}`;
      circleRef.current.style.strokeDashoffset = `${circumference}`;
    }

    const updateProgress = () => {
      if (isFinished) return;
      loadedCount++;
      const percent = Math.floor((loadedCount / totalAssets) * 100);
      setProgress(percent);

      // Animar el círculo de progreso
      if (circleRef.current) {
        const offset = circumference - (percent / 100) * circumference;
        gsap.to(circleRef.current, { strokeDashoffset: offset, duration: 0.3, ease: 'power2.out' });
      }

      if (loadedCount === totalAssets) {
        isFinished = true;
        setTimeout(() => {
          hidePreloader();
        }, 500);
      }
    };

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = updateProgress;
      img.onerror = updateProgress;
    });

    const video = document.createElement('video');
    video.src = videoUrl;
    video.preload = 'auto';
    video.load();
    video.oncanplaythrough = updateProgress;
    video.onerror = updateProgress;
    if (video.readyState >= 3) {
      updateProgress();
    } else {
       setTimeout(() => {
         if (!isFinished) {
           loadedCount = totalAssets - 1;
           updateProgress();
         }
       }, 8000);
    }

    function hidePreloader() {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            if (containerRef.current) containerRef.current.style.display = 'none';
            window.dispatchEvent(new Event('preloaderComplete'));
          }
        });

        // 1. Shrink tracking circle and text
        tl.to(contentRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.in'
        })
        // 2. The Aperture Reveal! The black background shrinks into a tiny hole and disappears
        .to(containerRef.current, {
          clipPath: 'circle(0% at 50% 50%)',
          duration: 1.2,
          ease: 'expo.inOut'
        });
      });
      return () => ctx.revert();
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#070A0F',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        clipPath: 'circle(150% at 50% 50%)' // Starts fully covering the screen
      }}
    >
      <div 
        ref={contentRef}
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '200px',
          height: '200px'
        }}
      >
        <svg 
          width="200" 
          height="200" 
          viewBox="0 0 200 200" 
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
        >
          <circle 
            cx="100" cy="100" r="60" 
            fill="transparent" 
            stroke="var(--surface-secondary)" 
            strokeWidth="1" 
          />
          <circle 
            ref={circleRef}
            cx="100" cy="100" r="60" 
            fill="transparent" 
            stroke="var(--accent-lime)" 
            strokeWidth="2" 
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 0.1s linear' // managed by GSAP mainly, but fallback
            }}
          />
        </svg>

        <div className="kinetic-text" style={{ fontSize: '2rem', color: 'var(--text-primary)', textAlign: 'center' }}>
          {progress.toString().padStart(3, '0')}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '10%', fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
        Ksenyia Sujova
      </div>
    </div>
  );
}
