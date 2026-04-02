'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  drift: number;
  offset: string;
}

const ColumnView = ({ projectsArray, colRef, customStyle = {} }: { projectsArray: Project[], colRef: React.RefObject<HTMLDivElement | null>, customStyle?: React.CSSProperties }) => (
  <div 
    ref={colRef}
    className="portfolio-col"
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8vw',
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
          width: idx % 2 === 0 ? '110%' : '90%',
          marginLeft: project.offset,
          overflow: 'hidden',
          borderRadius: '24px', 
          backgroundColor: '#e8e8ef',
          cursor: 'none' 
        }}
        suppressHydrationWarning // Extra safety layer for dynamic layout
      >
        <div style={{ paddingBottom: idx % 3 === 0 ? '150%' : '120%' }} />
        
        <Image 
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="premium-img"
          style={{ objectFit: 'cover', willChange: 'transform' }}
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
          <div style={{ fontSize: '0.85rem', color: 'var(--accent-lime)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem', fontWeight: 700 }}>
            {project.category}
          </div>
          <h3 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 3.5rem)', margin: 0, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
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
  
  // High-Quality Hydration Guard: Initialize state after mount to ensure SSR matches hydration pass exactly
  const [gridData, setGridData] = useState<{col1: Project[], col2: Project[], col3: Project[]} | null>(null);

  useEffect(() => {
    // Generate data only on the client
    const allProjects = Array.from({ length: 30 }).map((_, i) => {
      const drift = 0.6 + ((i * 7) % 13) / 10;
      const offsetValue = ((i * 11) % 21) - 10;
      
      return {
        id: i,
        title: `PROJECT ${String(i + 1).padStart(3, '00')}`,
        category: i % 3 === 0 ? 'Digital Art' : i % 3 === 1 ? 'UI/UX Design' : 'Motion',
        image: `https://picsum.photos/seed/${i + 800}/800/1000`,
        drift: drift,
        offset: `${offsetValue}%`
      };
    });

    setGridData({
      col1: allProjects.filter((_, i) => i % 3 === 0),
      col2: allProjects.filter((_, i) => i % 3 === 1),
      col3: allProjects.filter((_, i) => i % 3 === 2),
    });
  }, []);

  useEffect(() => {
    if (!gridData) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
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

      const items = gsap.utils.toArray('.grid-item-pro') as HTMLElement[];
      items.forEach(card => {
        const speed = parseFloat(card.getAttribute('data-speed') || '1');
        gsap.to(card, {
          y: () => (speed - 1) * 300,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });

        const img = card.querySelector('.premium-img');
        const overlay = card.querySelector('.premium-overlay');
        
        card.addEventListener('mouseenter', () => {
          gsap.to(img, { scale: 1.1, duration: 0.8, ease: 'power4.out' });
          gsap.to(overlay, { opacity: 1, duration: 0.5, ease: 'power2.out' });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(img, { scale: 1, duration: 1, ease: 'power3.out' });
          gsap.to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.out' });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [gridData]);

  return (
    <section 
      ref={sectionRef}
      id="work" 
      style={{ padding: '20vw 5vw', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ marginBottom: '12vw', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 8vw, 12rem)', margin: 0, color: 'var(--text-primary)', fontWeight: 300, letterSpacing: '-0.04em' }}>
          SELECTED<br />ARCHIVE
        </h2>
        <p style={{ color: 'var(--text-secondary)', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0, paddingBottom: '2.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
          Immersed in Visual Storytelling
        </p>
      </div>

      <div className="portfolio-grid-wrapper" style={{ display: 'flex', gap: '2vw', alignItems: 'flex-start', justifyContent: 'center' }}>
        {gridData ? (
          <>
            <ColumnView projectsArray={gridData.col1} colRef={col1Ref} />
            <ColumnView projectsArray={gridData.col2} colRef={col2Ref} customStyle={{ marginTop: '-20vw' }} />
            <ColumnView projectsArray={gridData.col3} colRef={col3Ref} />
          </>
        ) : (
          <div style={{ height: '100vh', width: '100%' }} /> // Stable SSR Placeholder
        )}
      </div>
    </section>
  );
}

