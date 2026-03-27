'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    let ctx = gsap.context(() => {
      let introTl = gsap.timeline({ paused: true });
      
      introTl.to(containerRef.current, { autoAlpha: 1, duration: 0.1 });
      
      // Animar texto inicial (Entrada)
      introTl.fromTo(
        textRef.current?.children || [],
        { 
          y: 100,
          opacity: 0,
          skewY: 5
        },
        {
          y: 0,
          opacity: 1,
          skewY: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power4.out',
        }
      );

      // Escuchar al Preloader para arrancar
      const handlePreloaderDone = () => introTl.play();
      window.addEventListener('preloaderComplete', handlePreloaderDone);
      
      // Fallback de seguridad
      const fallbackTimer = setTimeout(() => introTl.play(), 3000);

      // Usar ScrollTrigger en la capa principal sin estados de React que rompan el sincronismo.
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%', // Reducido para no ser tan largo
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
             const video = videoRef.current;
             if (video && video.duration > 0) {
               // De 0 hasta (duracion - 0.1s para prevenir parones)
               const targetTime = self.progress * (video.duration - 0.1);
               video.currentTime = targetTime;
             }
          }
        }
      });

      // Efecto parallax en el texto mientras scrolleas
      scrollTl.to(textRef.current, {
        y: -150,
        opacity: 0,
        ease: 'none'
      }, 0);

      // --- KINETIC MOUSE PHYSICS ---
      let lastX = 0;
      let timeoutId: NodeJS.Timeout;

      const handleMouseMove = (e: MouseEvent) => {
        if (!parallaxRef.current) return;
        
        const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
        const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
        
        // Calculate velocity (delta X)
        const vX = e.clientX - lastX;
        lastX = e.clientX;

        // Apply a dampened skew based on velocity
        const skewAmount = gsap.utils.clamp(-25, 25, vX * -0.5);

        // Apply Parallax and Skew immediately
        gsap.to(parallaxRef.current, {
          x: normalizedX * -50,
          y: normalizedY * -30,
          skewX: skewAmount,
          skewY: normalizedX * 2, // Slight tilt
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'auto'
        });

        // Gracefully return skew to 0 when mouse stops moving
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          gsap.to(parallaxRef.current, {
            skewX: 0,
            skewY: 0,
            duration: 1.2,
            ease: 'elastic.out(1, 0.3)'
          });
        }, 50);
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('preloaderComplete', handlePreloaderDone);
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(fallbackTimer);
        clearTimeout(timeoutId);
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
        overflow: 'hidden'
      }}
    >
      <div 
        className="hero-background-reel" 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          zIndex: -1
        }}
      >
        <video
          ref={videoRef}
          src="/hero-video.mp4?v=3"
          muted
          playsInline
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'translateZ(0)', willChange: 'transform' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1, transform: 'translateZ(0)' }} />
      </div>
      
      <div className="hero-content" style={{ textAlign: 'center', mixBlendMode: 'difference' }}>
        <h1 
          id="hero-heading" 
          className="kinetic-text" 
          style={{
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            margin: 0,
          }}
        >
          <div 
            ref={textRef}
            style={{ 
              display: 'flex', 
              gap: '2rem', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}
          >
            {/* Contenedor Parallax Interno para no chocar con el GSAP de Scroll */}
            <div ref={parallaxRef} style={{ display: 'flex', gap: '2rem' }}>
              <span style={{ display: 'inline-block' }}>DESIGN.</span>
              <span style={{ display: 'inline-block' }}>ART.</span>
            </div>
          </div>
        </h1>
      </div>
    </section>
  );
}
