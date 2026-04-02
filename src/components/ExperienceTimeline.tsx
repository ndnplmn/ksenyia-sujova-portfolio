'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) return;

      const milestones = gsap.utils.toArray('.milestone-panel') as HTMLElement[];
      const totalMilestones = milestones.length;
      
      // 1. One Master Timeline for all transitions
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalMilestones * 100}%`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
        }
      });

      // 2. Initial state: hide all except the first milestone
      milestones.forEach((panel, i) => {
        gsap.set(panel, { 
          autoAlpha: i === 0 ? 1 : 0, 
          y: i === 0 ? 0 : 80,
          scale: i === 0 ? 1 : 0.95
        });
      });

      // 3. Sequentially add milestone transitions to the master timeline
      // Each transition takes '1 unit' of the timeline.
      milestones.forEach((panel, i) => {
        if (i === 0) return;

        // Transition out of previous slide and into current slide
        masterTl.to(milestones[i - 1], { 
          autoAlpha: 0, 
          y: -80, 
          scale: 0.95, 
          duration: 1 
        }, i - 0.5) // Adjust timing to create a clean crossfade
        .to(panel, { 
          autoAlpha: 1, 
          y: 0, 
          scale: 1, 
          duration: 1 
        }, i - 0.5);
      });

      // 4. Kinetic Progress Bar tied to the same scroll
      gsap.to('.progress-fill', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalMilestones * 100}%`,
          scrub: true
        }
      });

      // 5. Background Aura pulsing
      gsap.to('.timeline-aura', {
        scale: 1.2,
        opacity: 0.35,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
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
        backgroundColor: 'var(--bg-pure)',
        color: 'var(--text-primary)',
        height: isMobile ? 'auto' : '100vh',
        overflow: isMobile ? 'visible' : 'hidden',
        position: 'relative',
        zIndex: 10,
        padding: isMobile ? '20vw 0' : '0'
      }}
    >
      {/* Background Cinematic Aura - Sapphire Blend */}
      <div 
        className="timeline-aura"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vh',
          background: 'radial-gradient(circle, var(--accent-ice) 0%, transparent 70%)',
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
          color: 'var(--text-secondary)',
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
            className="timeline-slide milestone-panel"
            style={{ 
              position: isMobile ? 'relative' : 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: isMobile ? 'auto' : '100%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: experiences.length - index,
              pointerEvents: isMobile ? 'auto' : 'none',
              opacity: (isMobile || index === 0) ? 1 : 0,
              visibility: (isMobile || index === 0) ? 'visible' : 'hidden',
              marginBottom: isMobile ? '15vh' : 0
            }}
          >
            {/* Background Year - Sapphire Stroke */}
            <div 
              className="huge-year"
              style={{
                position: isMobile ? 'relative' : 'absolute',
                top: isMobile ? 'auto' : '50%',
                left: isMobile ? 'auto' : '50%',
                transform: isMobile ? 'none' : 'translate(-50%, -50%)',
                fontSize: isMobile ? '20vw' : 'clamp(10rem, 30vw, 35rem)',
                fontWeight: 900,
                color: 'transparent',
                WebkitTextStroke: '1px var(--surface-secondary)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 1,
                willChange: 'transform, opacity',
                marginBottom: isMobile ? '-5vw' : 0
              }}
            >
              {exp.year.split('—')[0]}
            </div>

            {/* Kinetic Content Container */}
            <div 
              className="content-box milestone-content"
              style={{
                width: '90%',
                maxWidth: '800px',
                zIndex: 2,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                willChange: 'transform, opacity, filter',
                WebkitBackfaceVisibility: 'hidden', // iOS hardware acceleration
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
                  color: 'var(--accent-powder)',
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
                    color: 'var(--text-primary)',
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
                      color: 'var(--text-secondary)' 
                    }}>
                      @ {exp.company}
                    </span>
                    <span style={{
                      width: '40px',
                      height: '1px',
                      backgroundColor: 'var(--surface-secondary)'
                    }} />
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      color: 'var(--accent-sapphire)'
                    }}>
                      {exp.year}
                    </span>
                  </div>
                </div>
              </div>

              <p style={{ 
                fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)', 
                lineHeight: 1.5, 
                color: 'var(--text-primary)', 
                opacity: 0.8,
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

      {/* Kinetic Progress Indicator (Hide on Mobile) */}
      {!isMobile && (
        <div 
          style={{
          position: 'absolute',
          right: '5vw',
          top: '50%',
          transform: 'translateY(-50%)',
          height: '20vh',
          width: '2px',
          backgroundColor: 'var(--surface-secondary)',
          opacity: 0.3,
          zIndex: 100
        }}
      >
        <div 
          className="progress-fill" 
          style={{ 
            width: '100%', 
            height: '0%', 
            backgroundColor: 'var(--accent-sapphire)',
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
          color: 'var(--accent-powder)',
          writingMode: 'vertical-rl',
          letterSpacing: '0.2em'
        }}>
          SCROLL TO EXPLORE
        </div>
      </div>
      )}
    </section>
  );
}
