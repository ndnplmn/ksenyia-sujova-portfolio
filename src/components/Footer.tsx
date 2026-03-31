'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Footer() {
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const links = linksRef.current.filter(Boolean) as HTMLAnchorElement[];
    
    links.forEach(link => {
      const handleMouseMove = (e: MouseEvent) => {
        const position = link.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        gsap.to(link, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
      };
      
      const handleMouseLeave = () => {
        gsap.to(link, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      };

      link.addEventListener('mousemove', handleMouseMove);
      link.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        link.removeEventListener('mousemove', handleMouseMove);
        link.removeEventListener('mouseleave', handleMouseLeave);
      }
    });
  }, []);

  return (
    <footer 
      id="contact" 
      className="site-footer" 
      role="contentinfo"
      style={{
        padding: '10vw 5%',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--surface-secondary)',
        display: 'flex',
        flexDirection: 'column',
        gap: '5vh',
        position: 'relative',
        zIndex: 5
      }}
    >
      <div className="footer-cta" style={{ textAlign: 'center', marginBottom: '8vh' }}>
        <h2 
          className="kinetic-text" 
          style={{ 
            fontSize: 'clamp(4rem, 15vw, 20rem)', 
            margin: 0, 
            lineHeight: 0.85, 
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            fontWeight: 900,
          }}
        >
          Let&apos;s<br />talk.
        </h2>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
        <form 
          className="minimal-form" 
          aria-label="Contact form" 
          style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="input-group" style={{ position: 'relative' }}>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              placeholder=" " 
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--surface-secondary)',
                color: 'var(--text-primary)',
                padding: '1rem 0',
                fontSize: '1.2rem',
                outline: 'none',
                transition: 'border-bottom-color 0.3s'
              }}
            />
            <label 
              htmlFor="name" 
              style={{ 
                position: 'absolute', top: '1rem', left: 0, color: 'var(--text-secondary)',
                transition: '0.3s ease', pointerEvents: 'none'
              }}
            >
              What is your name?
            </label>
          </div>
          <div className="input-group" style={{ position: 'relative' }}>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              placeholder=" " 
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--surface-secondary)',
                color: 'var(--text-primary)',
                padding: '1rem 0',
                fontSize: '1.2rem',
                outline: 'none',
                transition: 'border-bottom-color 0.3s'
              }}
            />
            <label 
              htmlFor="email" 
              style={{ 
                position: 'absolute', top: '1rem', left: 0, color: 'var(--text-secondary)',
                transition: '0.3s ease', pointerEvents: 'none'
              }}
            >
              What is your email?
            </label>
          </div>
          <button 
            type="submit" 
            style={{
              alignSelf: 'flex-start',
              background: 'transparent',
              color: 'var(--accent-lime)',
              border: '1px solid var(--accent-lime)',
              padding: '1rem 2rem',
              fontSize: '1rem',
              cursor: 'none',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginTop: '1rem',
              transition: 'background 0.3s, color 0.3s'
            }}
            data-magnetic-target
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-lime)';
              e.currentTarget.style.color = 'var(--bg-pure)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--accent-lime)';
            }}
          >
            <span>Send message</span>
          </button>
        </form>

        <nav 
          className="footer-social" 
          aria-label="Social Networks"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'flex-end',
            fontSize: '1.2rem',
            flexShrink: 0
          }}
        >
          {['Behance', 'Twitter', 'LinkedIn'].map((network, i) => (
            <a 
              key={network}
              href="#" 
              ref={(el) => { linksRef.current[i] = el; }}
              className="magnetic-link" 
              aria-label={`${network} Profile`}
              style={{ display: 'inline-block', padding: '0.5rem', cursor: 'none' }}
              data-magnetic-target
            >
              {network}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
