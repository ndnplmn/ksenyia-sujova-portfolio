'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Generar 60 proyectos para mantener alto rendimiento pero sensación de "muchos diseños"
const projects = Array.from({ length: 60 }).map((_, i) => ({
  id: i,
  title: `PROJECT ${String(i + 1).padStart(3, '0')}`,
  category: i % 3 === 0 ? 'Digital Art' : i % 3 === 1 ? 'UI/UX Design' : 'Motion',
  image: `https://picsum.photos/seed/${i + 500}/600/800` 
}));

// Separamos en 3 columnas fotográficas limpias
const col1 = projects.filter((_, i) => i % 3 === 0);
const col2 = projects.filter((_, i) => i % 3 === 1);
const col3 = projects.filter((_, i) => i % 3 === 2);

export default function PortfolioGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Parallax suave y fluido
      // Columnas exteriores suben sutilmente más rápido
      gsap.to([col1Ref.current, col3Ref.current], {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1, // Suavidad máxima
        }
      });

      // La columna central baja sutilmente
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

      // Efecto Hover Premium
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

  // Componente de Columna Elegante
  const ColumnView = ({ projectsArray, colRef, customStyle = {} }: { projectsArray: any[], colRef: any, customStyle?: React.CSSProperties }) => (
    <div 
      ref={colRef} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '3vw', // Margen generoso y elegante
        width: '33.333%',
        willChange: 'transform',
        ...customStyle
      }}
    >
      {projectsArray.map(project => (
        <div 
          key={project.id} 
          className="premium-card"
          style={{ 
            position: 'relative', 
            width: '100%', 
            overflow: 'hidden',
            borderRadius: '16px', // Bordes suaves y modernos tipo Apple/Awwwards
            backgroundColor: '#111',
            cursor: 'none' // Para utilizar nuestro Custom Cursor global
          }}
        >
          {/* Aspect-ratio fotográfico perfecto 3:4 */}
          <div style={{ paddingBottom: '133%' }} />
          
          <img 
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="premium-img"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              willChange: 'transform'
            }}
          />
          
          {/* Overlay de diseño limpio y minimalista */}
          <div 
            className="premium-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
              color: 'var(--text-primary)',
              opacity: 0, // Oculto por defecto
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
      <div style={{ marginBottom: '8vw', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', margin: 0, color: 'var(--text-primary)', fontWeight: 300, letterSpacing: '-0.02em' }}>
          SELECTED WORKS
        </h2>
        <p style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, paddingBottom: '1rem', fontSize: '0.9rem' }}>
          Explore the Archive
        </p>
      </div>

      <div 
        style={{ 
          display: 'flex', 
          gap: '3vw', // Gap aéreo y lujoso
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}
      >
        <ColumnView projectsArray={col1} colRef={col1Ref} />
        {/* La columna central empieza más arriba para el scroll invertido */}
        <ColumnView projectsArray={col2} colRef={col2Ref} customStyle={{ marginTop: '-15%' }} />
        <ColumnView projectsArray={col3} colRef={col3Ref} />
      </div>
    </section>
  );
}
