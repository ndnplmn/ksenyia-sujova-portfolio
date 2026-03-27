'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    year: '2023—NOW',
    role: 'DIGITAL ART DIRECTOR',
    company: 'Studio Nought',
    description: 'Leading experimental projects combining WebGL, 3D and interaction. We reshape digital brands to an entirely new standard.'
  },
  {
    year: '2021—2023',
    role: 'LEAD UI/UX DESIGNER',
    company: 'Nexus Agency',
    description: 'Crafting premium immersive user experiences for luxury fashion and tech clientele across Europe.'
  },
  {
    year: '2019—2021',
    role: 'SENIOR INTERACTIVE DESIGNER',
    company: 'Pentagram',
    description: 'Award-winning conceptual designs focused on motion, fluid transitions, and unconventional web structures.'
  },
  {
    year: '2017—2019',
    role: 'CREATIVE DEVELOPER',
    company: 'AKQA',
    description: 'Bridging the gap between design and code, building high-performance interactive prototypes for global campaigns.'
  },
  {
    year: '2015—2017',
    role: 'DIGITAL DESIGNER',
    company: 'Freelance',
    description: 'Independent consultant focused on typography-driven layouts and editorial web design.'
  }
];

export default function ExperienceTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      // Pin the section and scroll the track horizontally
      // Translate it relative to the true scroll width instead of assuming 100vw per slide
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,           // Clavamos la sección a la pantalla
          scrub: 1,            // Suavizamos el movimiento de arrastre
          // Hacemos que el scroll sea mucho más corto visualmente (1.5x más rápido de lo habitual)
          end: () => '+=' + (track.scrollWidth / 1.5) 
        }
      });
      
      // Animate the progress bar linearly with the scroll
      gsap.to('.progress-fill', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => '+=' + (track.scrollWidth / 1.5),
          scrub: 0.1
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="experience" 
      style={{ 
        backgroundColor: '#070A0F', 
        color: 'var(--text-primary)',
        height: '100vh',   // El contenedor debe medir exactamente la pantalla
        overflow: 'hidden', // Escondemos lo que se desborda horizontalmente
        position: 'relative',
        zIndex: 10
      }}
    >
      <style>{`
        /* Ajustamos las slides para que en PC se vean al menos 2 a la vez (50vw) y no haya tanto espacio vacío */
        .timeline-slide {
          width: 100vw;
        }
        @media (min-width: 768px) {
          .timeline-slide {
            width: 50vw;
          }
        }
      `}</style>
      
      {/* Título superior fijo */}
      <h2 
        style={{ 
          position: 'absolute', 
          top: '5vh', 
          left: '5vw', 
          fontSize: '1rem', 
          letterSpacing: '0.3em', 
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          zIndex: 10,
          margin: 0
        }}
      >
        THE STORY / TIMELINE
      </h2>

      {/* Track que se desliza horizontalmente */}
      <div 
        ref={trackRef}
        className="horizontal-track"
        style={{ 
          display: 'flex', 
          width: 'fit-content', // Crece en función de los slides internos
          height: '100%',
          paddingLeft: '10vw', // Espacio inicial
          paddingRight: '10vw', // Espacio final de rebote decorativo
          willChange: 'transform' // Optimización estricta para GSAP
        }}
      >
        {experiences.map((exp, index) => (
          <div 
            key={index} 
            className="timeline-slide"
            style={{ 
              height: '100%', 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {/* Año Gigante (Stroke-only layout para el fondo) */}
            <div 
              className="huge-year"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 'clamp(8rem, 25vw, 25rem)',
                fontWeight: 900,
                color: 'transparent',
                WebkitTextStroke: '2px rgba(255,255,255,0.05)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 0
              }}
            >
              {exp.year.split('—')[0]}
            </div>

            {/* Caja de contenido (Rol + Descripción) */}
            <div 
              className="content-box"
              style={{
                width: '80%',
                maxWidth: '600px',
                zIndex: 2,
                mixBlendMode: 'difference' // Alto contraste dinámico al pasar sobre arte o líneas
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  marginBottom: '1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  paddingBottom: '1.5rem'
                }}
              >
                <span style={{ color: 'var(--accent-lime)', fontSize: '1.2rem', fontWeight: 300, fontFamily: 'monospace' }}>
                  ({String(index + 1).padStart(2, '0')}/{String(experiences.length).padStart(2, '0')})
                </span>
                <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.8rem)', margin: 0, fontWeight: 300, lineHeight: 1.1, textTransform: 'uppercase' }}>
                  {exp.role}<br/>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', letterSpacing: '0.1em' }}>@ {exp.company}</span>
                </h3>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '450px' }}>
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Barra de progreso / Línea temporal visual en el footer del slider */}
      <div 
        style={{
          position: 'absolute',
          bottom: '10vh',
          left: '5vw',
          width: '90vw',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          zIndex: 10
        }}
      >
        <div className="progress-fill" style={{ width: '0%', height: '100%', backgroundColor: 'var(--accent-lime)' }}></div>
      </div>
    </section>
  );
}
