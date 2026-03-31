'use client';

import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  drift: number; // For individualized scroll speed
  offset: string; // Random horizontal nudge
}

const ColumnView = ({ projectsArray, colRef, customStyle = {} }: { projectsArray: Project[], colRef: React.RefObject<HTMLDivElement | null>, customStyle?: React.CSSProperties }) => (
  <div 
    ref={colRef}
    className="portfolio-col"
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8vw', // Larger base gap to allow for more overlap/drift
      width: '33.333%',
      willChange: 'transform',
      ...customStyle
    }}
  >
    {projectsArray.map((project: Project, idx: number) => (
      <div 
        key={project.id} 
        className="premium-card grid-item-pro"
        data-speed={project.drift}
        style={{ 
          position: 'relative', 
          width: idx % 2 === 0 ? '110%' : '90%', // Varying widths for anti-grid feel
          marginLeft: project.offset,
          overflow: 'hidden',
          borderRadius: '24px', 
          backgroundColor: '#e8e8ef',
          cursor: 'none' 
        }}
      >
        <div style={{ paddingBottom: idx % 3 === 0 ? '150%' : '120%' }} />
        
        <Image 
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="premium-img"
          style={{
            objectFit: 'cover',
            willChange: 'transform'
          }}
        />
        
        <div 
          className="premium-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(26,26,46,0.95) 0%, rgba(26,26,46,0.4) 50%, transparent 100%)',
            color: 'var(--text-primary)',
            opacity: 0, 
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2.5vw',
            willChange: 'opacity'
          }}
        >
          <div style={{ 
            fontSize: '0.85rem', 
            color: 'var(--accent-lime)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em', 
            marginBottom: '0.5rem',
            fontWeight: 700
          }}>
            {project.category}
          </div>
          <h3 style={{ 
            fontSize: 'clamp(1.5rem, 2.8vw, 3.5rem)', 
            margin: 0, 
            fontWeight: 300,
            letterSpacing: '-0.03em',
            lineHeight: 1.1
          }}>
            {project.title}
          </h3>
        </div>
      </div>
    ))}
  </div>
);

export default function PortfolioGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  const { col1, col2, col3 } = useMemo(() => {
    const allProjects = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      title: `PROJECT ${String(i + 1).padStart(3, '00')}`,
      category: i % 3 === 0 ? 'Digital Art' : i % 3 === 1 ? 'UI/UX Design' : 'Motion',
      image: `https://picsum.photos/seed/${i + 800}/800/1000`,
      drift: 0.5 + (Math.random() * 1.5), // Drift between 0.5x and 2.0x
      offset: `${(Math.random() * 20) - 10}%` // Random offset between -10% and 10%
    }));

    return {
      col1: allProjects.filter((_, i) => i % 3 === 0),
      col2: allProjects.filter((_, i) => i % 3 === 1),
      col3: allProjects.filter((_, i) => i % 3 === 2),
    };
  }, []);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // Column Parallax (Base)
      gsap.to([col1Ref.current, col3Ref.current], {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to(col2Ref.current, {
        yPercent: 10, 
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Individual Item Drift (Anti-Grid 2.0 Logic)
      const items = gsap.utils.toArray('.grid-item-pro') as HTMLElement[];
      items.forEach(card => {
        const speed = parseFloat(card.getAttribute('data-speed') || '1');
        
        gsap.to(card, {
          y: (i, target) => {
             // Calculate a specific y-offset based on speed
             // This creates the "drift" feel relative to the column
             return (speed - 1) * 300; 
          },
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });

        // Hover effects with Magnetic sensibility
        const img = card.querySelector('.premium-img');
        const overlay = card.querySelector('.premium-overlay');
        
        card.addEventListener('mouseenter', () => {
          gsap.to(img, { scale: 1.1, duration: 0.8, ease: 'power4.out' });
          gsap.to(overlay, { opacity: 1, duration: 0.5, ease: 'power2.out' });
          // Cursor magnetic activation is handled by the data-magnetic-target system
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(img, { scale: 1, duration: 1, ease: 'power3.out' });
          gsap.to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.out' });
        });
      });
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="work" 
      style={{ 
        padding: '20vw 5vw', 
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ marginBottom: '12vw', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 8vw, 12rem)', margin: 0, color: 'var(--text-primary)', fontWeight: 300, letterSpacing: '-0.04em' }}>
          SELECTED<br />ARCHIVE
        </h2>
        <p style={{ color: 'var(--text-secondary)', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0, paddingBottom: '2.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
          Immersed in Visual Storytelling
        </p>
      </div>

      <div 
        className="portfolio-grid-wrapper"
        style={{ 
          display: 'flex', 
          gap: '2vw', 
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}
      >
        <ColumnView projectsArray={col1} colRef={col1Ref} />
        <ColumnView projectsArray={col2} colRef={col2Ref} customStyle={{ marginTop: '-20vw' }} />
        <ColumnView projectsArray={col3} colRef={col3Ref} />
      </div>
    </section>
  );
}

