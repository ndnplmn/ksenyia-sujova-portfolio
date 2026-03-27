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
}

const ColumnView = ({ projectsArray, colRef, customStyle = {} }: { projectsArray: Project[], colRef: React.RefObject<HTMLDivElement | null>, customStyle?: React.CSSProperties }) => (
  <div 
    ref={colRef}
    className="portfolio-col"
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '3vw', 
      width: '33.333%',
      willChange: 'transform',
      ...customStyle
    }}
  >
    {projectsArray.map((project: Project) => (
      <div 
        key={project.id} 
        className="premium-card"
        style={{ 
          position: 'relative', 
          width: '100%', 
          overflow: 'hidden',
          borderRadius: '16px', 
          backgroundColor: '#111',
          cursor: 'none' 
        }}
      >
        <div style={{ paddingBottom: '133%' }} />
        
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
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
            color: 'var(--text-primary)',
            opacity: 0, 
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2vw',
            willChange: 'opacity'
          }}
        >
          <div style={{ 
            fontSize: '0.9rem', 
            color: 'var(--accent-lime)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.15em', 
            marginBottom: '0.5rem',
            fontWeight: 500
          }}>
            {project.category}
          </div>
          <h3 style={{ 
            fontSize: 'clamp(1.5rem, 2.5vw, 3rem)', 
            margin: 0, 
            fontWeight: 300,
            letterSpacing: '-0.02em'
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
    const allProjects = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      title: `PROJECT ${String(i + 1).padStart(3, '00')}`,
      category: i % 3 === 0 ? 'Digital Art' : i % 3 === 1 ? 'UI/UX Design' : 'Motion',
      image: `https://picsum.photos/seed/${i + 500}/600/800` 
    }));

    return {
      col1: allProjects.filter((_, i) => i % 3 === 0),
      col2: allProjects.filter((_, i) => i % 3 === 1),
      col3: allProjects.filter((_, i) => i % 3 === 2),
    };
  }, []);

  useEffect(() => {
    // Disable GSAP parallax on mobile (touch devices)
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      gsap.to([col1Ref.current, col3Ref.current], {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      gsap.to(col2Ref.current, {
        yPercent: 15, 
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      const items = gsap.utils.toArray('.premium-card') as HTMLElement[];
      items.forEach(card => {
        const img = card.querySelector('.premium-img');
        const overlay = card.querySelector('.premium-overlay');
        
        card.addEventListener('mouseenter', () => {
          gsap.to(img, { scale: 1.08, duration: 0.6, ease: 'power3.out' });
          gsap.to(overlay, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(img, { scale: 1, duration: 0.8, ease: 'power3.out' });
          gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.out' });
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
        padding: '15vw 5vw', 
        backgroundColor: '#070A0F', 
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200vh'
      }}
    >
      <div style={{ marginBottom: '8vw', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', margin: 0, color: 'var(--text-primary)', fontWeight: 300, letterSpacing: '-0.02em' }}>
          SELECTED WORKS
        </h2>
        <p style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, paddingBottom: '1rem', fontSize: '0.9rem' }}>
          Explore the Archive
        </p>
      </div>

      <div 
        className="portfolio-grid-wrapper"
        style={{ 
          display: 'flex', 
          gap: '3vw', 
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}
      >
        <ColumnView projectsArray={col1} colRef={col1Ref} />
        <ColumnView projectsArray={col2} colRef={col2Ref} customStyle={{ marginTop: '-15%' }} />
        <ColumnView projectsArray={col3} colRef={col3Ref} />
      </div>
    </section>
  );
}
