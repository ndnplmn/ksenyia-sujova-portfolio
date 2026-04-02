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
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const milestones = gsap.utils.toArray('.milestone-panel') as HTMLElement[];
      
      // Pin the main container while we cycle through milestones
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${milestones.length * 100}%`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
      });

      milestones.forEach((panel, i) => {
        if (panel === milestones[milestones.length - 1]) return;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: '+=100%',
            scrub: true,
          }
        });

        // 2026 Pinnacle Transition: Depth & Scale
        timeline.to(panel.querySelector('.milestone-content'), {
          opacity: 0,
          y: -100,
          scale: 0.95,
          filter: 'blur(10px)',
          ease: 'power2.inOut'
        })
        .to(panel.querySelector('.huge-year-bg'), {
          scale: 1.5,
          opacity: 0,
          y: -200,
          ease: 'power2.inOut'
        }, 0);
      });

      // Background Aura pulsing
      gsap.to('.timeline-aura', {
        scale: 1.1,
        opacity: 0.6,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      // Kinetic Progress Bar
      gsap.to('.progress-fill', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${milestones.length * 100}%`,
          scrub: true
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
        backgroundColor: '#ffffff',
        color: '#1a1a2e',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Background Cinematic Aura */}
      <div 
        className="timeline-aura"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vh',
          background: 'radial-gradient(circle, rgba(176, 196, 222, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <h2 
        style={{ 
          position: 'absolute', 
          top: '3.5vh', 
          left: '5vw', 
          fontSize: '0.7rem', 
          letterSpacing: '0.4em', 
          textTransform: 'uppercase',
          color: 'rgba(26, 26, 46, 0.7)',
          zIndex: 100,
          margin: 0
        }}
      >
        THE STORY / EVOLUTION
      </h2>

      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', marginTop: '5vh' }}>
        {experiences.map((exp, index) => (
          <div 
            key={index} 
            className="milestone-panel"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: experiences.length - index
            }}
          >
            {/* Background Year - High Density Parallax */}
            <div 
              className="huge-year-bg"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 'clamp(10rem, 30vw, 35rem)',
                fontWeight: 900,
                color: 'transparent',
                WebkitTextStroke: '1px rgba(26, 26, 46, 0.12)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 1,
                willChange: 'transform, opacity'
              }}
            >
              {exp.year.split('—')[0]}
            </div>

            {/* Kinetic Content Container */}
            <div 
              className="milestone-content"
              style={{
                width: '90%',
                maxWidth: '800px',
                zIndex: 2,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                willChange: 'transform, opacity, filter'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '2rem'
                }}
              >
                <span style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  fontFamily: 'monospace',
                  color: '#b0c4de',
                  marginTop: '0.5rem'
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 style={{ 
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)', 
                    margin: 0, 
                    fontWeight: 800, 
                    lineHeight: 0.9, 
                    textTransform: 'uppercase',
                    color: '#1a1a2e',
                    letterSpacing: '-0.03em'
                  }}>
                    {exp.role}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}>
                    <span style={{ 
                      fontSize: 'clamp(1rem, 2vw, 1.5rem)', 
                      fontWeight: 500,
                      color: 'rgba(26, 26, 46, 0.6)' 
                    }}>
                      @ {exp.company}
                    </span>
                    <span style={{
                      width: '40px',
                      height: '1px',
                      backgroundColor: '#b0c4de'
                    }} />
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      color: '#b0c4de'
                    }}>
                      {exp.year}
                    </span>
                  </div>
                </div>
              </div>

              <p style={{ 
                fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)', 
                lineHeight: 1.5, 
                color: 'rgba(26, 26, 46, 0.8)', 
                maxWidth: '550px', 
                margin: 0,
                marginLeft: '3.5rem',
                fontWeight: 450
              }}>
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Kinetic Progress Indicator */}
      <div 
        style={{
          position: 'absolute',
          right: '5vw',
          top: '50%',
          transform: 'translateY(-50%)',
          height: '20vh',
          width: '2px',
          backgroundColor: 'rgba(26, 26, 46, 0.05)',
          zIndex: 100
        }}
      >
        <div 
          className="progress-fill" 
          style={{ 
            width: '100%', 
            height: '0%', 
            backgroundColor: '#1a1a2e',
            transition: 'height 0.1s linear'
          }} 
        />
        <div style={{
          position: 'absolute',
          top: '110%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.6rem',
          fontWeight: 900,
          color: '#b0c4de',
          writingMode: 'vertical-rl',
          letterSpacing: '0.2em'
        }}>
          SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  );
}
