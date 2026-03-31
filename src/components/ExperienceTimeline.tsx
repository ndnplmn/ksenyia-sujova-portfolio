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
    // On mobile, skip the horizontal scroll experience entirely
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => '+=' + (track.scrollWidth / 1.5) 
        }
      });
      
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
      className="timeline-section"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Fixed section title */}
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

      {/* Horizontal scrolling track */}
      <div 
        ref={trackRef}
        className="horizontal-track"
        style={{ 
          display: 'flex', 
          width: 'fit-content',
          height: '100%',
          paddingLeft: '10vw',
          paddingRight: '10vw',
          willChange: 'transform'
        }}
      >
        {experiences.map((exp, index) => (
          <div 
            key={index} 
            className="timeline-slide"
            style={{ 
              width: '50vw',
              height: '100%', 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {/* Giant year background */}
            <div 
              className="huge-year"
              data-magnetic-target
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 'clamp(8rem, 25vw, 25rem)',
                fontWeight: 900,
                color: 'transparent',
                WebkitTextStroke: '2px rgba(0,0,0,0.05)',
                whiteSpace: 'nowrap',
                pointerEvents: 'auto',
                cursor: 'none',
                zIndex: 0
              }}
            >
              {exp.year.split('—')[0]}
            </div>

            {/* Content card */}
            <div 
              className="content-box"
              style={{
                width: '80%',
                maxWidth: '600px',
                zIndex: 2,
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  marginBottom: '1.5rem',
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
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
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '450px', margin: 0 }}>
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress bar (desktop only) */}
      <div 
        style={{
          position: 'absolute',
          bottom: '10vh',
          left: '5vw',
          width: '90vw',
          height: '1px',
          backgroundColor: 'rgba(0,0,0,0.1)',
          zIndex: 10
        }}
      >
        <div className="progress-fill" style={{ width: '0%', height: '100%', backgroundColor: 'var(--accent-lime)' }}></div>
      </div>
    </section>
  );
}
