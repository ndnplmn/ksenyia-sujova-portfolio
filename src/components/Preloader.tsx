'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const [percent, setPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // 2026 Pinnacle Timing: Precise and weighted
    const DURATION = 2.8; 
    const tl = gsap.timeline();

    // Initial Aura materialization
    tl.fromTo(auraRef.current, 
      { scale: 0.8, opacity: 0, filter: 'blur(30px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' }
    );

    // Sync Counter & Aura Turbulence
    const counterObj = { value: 0 };
    gsap.to(counterObj, {
      value: 100,
      duration: DURATION,
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.floor(counterObj.value);
        setPercent(val);
        
        // Dynamic Turbulence modulation
        const turb = document.querySelector('#aura-turb');
        if (turb) {
          const baseFreq = 0.01 + (val / 100) * 0.05;
          turb.setAttribute('baseFrequency', `${baseFreq}`);
        }
      },
      onComplete: () => {
        setTimeout(exitTransition, 400);
      }
    });

    function exitTransition() {
      if (!containerRef.current) return;

      const exitTl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          if (containerRef.current) containerRef.current.style.display = 'none';
          window.dispatchEvent(new Event('preloaderComplete'));
        }
      });

      // 2026 'Lens Pull' Effect
      exitTl.to(monogramRef.current, {
        scale: 40,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.inOut'
      })
      .to(containerRef.current, {
        backgroundColor: 'transparent',
        duration: 1,
        ease: 'power2.inOut'
      }, '-=1.2')
      .to(auraRef.current, {
        scale: 2,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.inOut'
      }, '-=1.5');
    }

    return () => {
      tl.kill();
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
        backgroundColor: 'var(--bg-pure)',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* SVG Morphing Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="fluid-aura">
          <feTurbulence id="aura-turb" type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Fluid Aura Element */}
      <div
        ref={auraRef}
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-ice) 0%, transparent 70%)',
          filter: 'url(#fluid-aura)',
          willChange: 'transform, opacity'
        }}
      />

      {/* Kinetic Content */}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div
          ref={monogramRef}
          style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            color: 'var(--text-primary)',
            opacity: 0.6,
            willChange: 'transform, opacity'
          }}
        >
          KS
        </div>

        {/* High-Fidelity Slot Counter */}
        <div 
          style={{ 
            marginTop: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.5em',
            WebkitTextStroke: '1px var(--surface-secondary)',
            color: 'var(--text-secondary)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '1.2em',
            overflow: 'hidden'
          }}
        >
           <span style={{ display: 'inline-block', minWidth: '4ch', textAlign: 'right' }}>{percent}</span>
           <span>%</span>
        </div>
      </div>

    </div>
  );
}

