'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const ctx = gsap.context(() => {
      // 1. MAGNETIC HEADING DISTORTION
      const heading = headingRef.current;
      if (heading) {
        const chars = heading.querySelectorAll('.char');
        
        const handleMouseMove = (e: MouseEvent) => {
          const rect = heading.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
          
          if (dist < 800) { // Increased range for larger heading
            chars.forEach((char) => {
              const charRect = char.getBoundingClientRect();
              const dx = e.clientX - (charRect.left + charRect.width / 2);
              const dy = e.clientY - (charRect.top + charRect.height / 2);
              const angle = Math.atan2(dy, dx);
              const force = Math.max(0, (800 - dist) / 800);
              
              gsap.to(char, {
                x: Math.cos(angle) * force * 50,
                y: Math.sin(angle) * force * 50,
                rotate: Math.cos(angle) * force * 20,
                duration: 0.8,
                ease: 'power3.out',
                overwrite: 'auto'
              });
            });
          }
        };

        const handleMouseLeave = () => {
          gsap.to(chars, { x: 0, y: 0, rotate: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
        };

        window.addEventListener('mousemove', handleMouseMove as EventListener);
        heading.addEventListener('mouseleave', handleMouseLeave as EventListener);
      }

      // 2. INTERACTIVE AURA TRACKING
      const aura = auraRef.current;
      const section = sectionRef.current;
      if (aura && section) {
        const moveAura = (e: MouseEvent) => {
          const rect = section.getBoundingClientRect();
          const x = e.clientX;
          const y = e.clientY - rect.top;
          gsap.to(aura, {
            left: x,
            top: y,
            duration: 1.8,
            ease: 'power2.out'
          });
        };
        section.addEventListener('mousemove', moveAura as EventListener);
      }

      // 3. MAGNETIC LINKS & BUTTONS
      const items = [...linksRef.current, submitBtnRef.current].filter(Boolean) as (HTMLElement | HTMLAnchorElement)[];
      items.forEach(item => {
        const move = (e: MouseEvent) => {
          const rect = item.getBoundingClientRect();
          const x = (e.clientX - (rect.left + rect.width / 2)) * 0.45;
          const y = (e.clientY - (rect.top + rect.height / 2)) * 0.45;
          gsap.to(item, { x, y, duration: 0.4, ease: 'power2.out' });
        };
        const reset = () => gsap.to(item, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        item.addEventListener('mousemove', move as EventListener);
        item.addEventListener('mouseleave', reset as EventListener);
      });

    }, sectionRef);

    return () => {
      window.removeEventListener('resize', checkMobile);
      ctx.revert();
    };
  }, []);

  const [btnText, setBtnText] = useState('SEND MESSAGE');
  const btnTextTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBtnText('TALK SOON');
    
    if (btnTextTimeoutRef.current) clearTimeout(btnTextTimeoutRef.current);
    btnTextTimeoutRef.current = setTimeout(() => {
      setBtnText('SEND MESSAGE');
    }, 2500);
  };

  return (
    <footer 
      ref={sectionRef}
      id="contact" 
      className="site-footer" 
      role="contentinfo"
      style={{
        height: isMobile ? '100svh' : '100vh',
        padding: '0 5%',
        backgroundColor: 'var(--bg-pure)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: isMobile ? '4vh' : '8vh',
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden'
      }}
    >
      {/* Interactive Background Aura - Sapphire Pulse */}
      <div 
        ref={auraRef}
        className="footer-aura"
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, var(--accent-ice) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
          left: '50%',
          top: '50%'
        }}
      />

      <div className="footer-cta" style={{ textAlign: 'center', marginBottom: '4vh' }}>
        <h2 
          ref={headingRef}
          className="kinetic-text flex flex-col items-center overflow-visible" 
          style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 12rem)', 
            margin: 0, 
            lineHeight: 1, 
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            fontWeight: 900,
            color: 'var(--text-primary)',
            mixBlendMode: 'normal',
            userSelect: 'none'
          }}
        >
          <div className="flex flex-wrap justify-center">
            {"Let's get to know".split('').map((char, i) => (
              <span key={i} className="char relative inline-block">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center">
            {"each other".split('').map((char, i) => (
              <span key={i} className="char relative inline-block">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </h2>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4rem', position: 'relative' }}>
        <form 
          className="minimal-form" 
          aria-label="Contact form" 
          style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '3.5rem', minWidth: 0 }}
          onSubmit={handleFormSubmit}
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
                borderBottom: '2px solid var(--surface-secondary)',
                color: 'var(--text-primary)',
                padding: '1.5rem 0',
                fontSize: '1.5rem',
                outline: 'none',
                transition: 'border-bottom-color 0.5s var(--ease-fluid)'
              }}
              onFocus={(e) => e.currentTarget.style.borderBottomColor = 'var(--accent-sapphire)'}
              onBlur={(e) => e.currentTarget.style.borderBottomColor = 'var(--surface-secondary)'}
            />
            <label 
              htmlFor="name" 
              style={{ 
                position: 'absolute', top: '1.5rem', left: 0, color: 'var(--text-secondary)',
                transition: '0.4s var(--ease-fluid)', pointerEvents: 'none',
                fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em'
              }}
            >
              Your Name
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
                borderBottom: '2px solid var(--surface-secondary)',
                color: 'var(--text-primary)',
                padding: '1.5rem 0',
                fontSize: '1.5rem',
                outline: 'none',
                transition: 'border-bottom-color 0.5s var(--ease-fluid)'
              }}
              onFocus={(e) => e.currentTarget.style.borderBottomColor = 'var(--accent-sapphire)'}
              onBlur={(e) => e.currentTarget.style.borderBottomColor = 'var(--surface-secondary)'}
            />
            <label 
              htmlFor="email" 
              style={{ 
                position: 'absolute', top: '1.5rem', left: 0, color: 'var(--text-secondary)',
                transition: '0.4s var(--ease-fluid)', pointerEvents: 'none',
                fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em'
              }}
            >
              Email Address
            </label>
          </div>
          
          <button 
            ref={submitBtnRef}
            type="submit" 
            className="morphing-submit"
            style={{
              alignSelf: 'flex-start',
              background: 'var(--text-primary)',
              color: 'var(--bg-pure)',
              border: 'none',
              borderRadius: '100px',
              padding: '0 2.5rem',
              width: '300px',
              height: '60px',
              fontSize: '1rem',
              cursor: 'none',
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '0.15em',
              marginTop: '1.5rem',
              transition: 'background 0.5s var(--ease-fluid), transform 0.3s var(--ease-fluid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-sapphire)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--text-primary)';
              gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: 'power2.out' });
            }}
            onMouseDown={(e) => {
              gsap.to(e.currentTarget, { scale: 0.94, duration: 0.15, ease: 'power2.out' });
            }}
            onMouseUp={(e) => {
              gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
            }}
          >
            <span style={{ 
              whiteSpace: 'nowrap', 
              opacity: 1, 
              transition: 'opacity 0.3s' 
            }} 
            key={btnText}
            className="btn-text"
            >
              {btnText}
            </span>
          </button>
        </form>

        <nav 
          className="footer-social" 
          aria-label="Social Networks"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'flex-end',
            fontSize: '1.4rem',
            flexShrink: 0,
            paddingTop: '1.5rem' // Align with the first input label
          }}
        >
          {['Behance', 'Twitter', 'LinkedIn'].map((network, i) => (
            <a 
              key={network}
              href="#" 
              ref={(el) => { linksRef.current[i] = el; }}
              className="magnetic-link" 
              aria-label={`${network} Profile`}
              style={{ 
                display: 'inline-block', 
                padding: '0.5rem', 
                cursor: 'none',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}
            >
              {network}
            </a>
          ))}
        </nav>
      </div>

      <style jsx>{`
        .input-group input:focus + label,
        .input-group input:not(:placeholder-shown) + label {
          transform: translateY(-2.5rem) scale(0.85);
          color: var(--accent-sapphire);
        }
        .morphing-submit:hover .btn-text {
          opacity: 1 !important;
        }
      `}</style>
    </footer>
  );
}
