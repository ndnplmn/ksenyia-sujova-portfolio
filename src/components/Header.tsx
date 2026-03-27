'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

const navLinks = [
  { name: 'Home', href: '#' }, // Al no tener id main, sube arriba
  { name: 'Work', href: '#work' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' }
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksWrapRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;
    
    if (menuOpen) {
      // Bloquear scroll global mientras el menu está abierto
      document.body.style.overflow = 'hidden';
      // Lenis se desactiva si bloqueamos body, pero por seguridad
      document.documentElement.classList.add('lenis-stopped');

      // 1. Expandimos el círculo desde la esquina superior derecha
      gsap.to(menuRef.current, { 
        clipPath: 'circle(150% at 95% 5%)', 
        duration: 1.2, 
        ease: 'power4.inOut' 
      });

      // 2. Animamos los textos apareciendo desde abajo
      const links = gsap.utils.toArray('.menu-item-text') as HTMLElement[];
      gsap.fromTo(links, 
        { y: '100%', rotate: 5, opacity: 0 },
        { y: '0%', rotate: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.4 }
      );

    } else {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('lenis-stopped');
      
      gsap.to(menuRef.current, { 
        clipPath: 'circle(0% at 95% 5%)', 
        duration: 0.8, 
        ease: 'power3.inOut' 
      });
    }
  }, [menuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false); // Cerramos menú

    // Esperamos que se cierre para scrollear
    setTimeout(() => {
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 800); // 800ms de retraso para que cierre el menu primero
  };

  return (
    <>
      <header 
        className="site-header" 
        role="banner" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          width: '100%', 
          padding: '2rem 5%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          zIndex: 99999, // Arriba de todo para que el botón siempre sea clicable
          mixBlendMode: menuOpen ? 'normal' : 'difference' // Si está abierto, no mezclamos color
        }}
      >
        <Link 
          href="/" 
          className="brand-logo"
          onClick={(e) => { e.preventDefault(); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Go to home page" 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none', 
            color: 'var(--text-primary)',
            cursor: 'none' // Custom cursor takes over
          }}
          onMouseEnter={() => {
             gsap.to('.logo-circle', { scale: 1.1, backgroundColor: 'var(--text-primary)', color: 'var(--bg-pure)', border: '1px solid var(--text-primary)', duration: 0.4, ease: 'power3.out' });
             gsap.to('.logo-text span', { letterSpacing: '0.25em', x: 4, stagger: 0.05, duration: 0.4, ease: 'power3.out' });
          }}
          onMouseLeave={() => {
             gsap.to('.logo-circle', { scale: 1, backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--surface-secondary)', duration: 0.4, ease: 'power3.out' });
             gsap.to('.logo-text span', { letterSpacing: '0.1em', x: 0, stagger: 0.05, duration: 0.4, ease: 'power3.out' });
          }}
        >
          <div 
             className="logo-circle"
             style={{ 
               width: '45px', height: '45px', 
               borderRadius: '50%', 
               border: '1px solid var(--surface-secondary)', 
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               fontSize: '1rem', fontWeight: 900,
               willChange: 'transform, background-color, border, color'
             }}
          >
            KS
          </div>
          <div 
            className="logo-text"
            style={{ 
              display: 'flex', flexDirection: 'column', 
              fontSize: '0.65rem', fontWeight: 600, 
              textTransform: 'uppercase', letterSpacing: '0.1em',
              lineHeight: 1.2
            }}
          >
            <span style={{ willChange: 'letter-spacing, transform' }}>Ksenyia</span>
            <span style={{ color: 'var(--text-secondary)', willChange: 'letter-spacing, transform' }}>Sujova</span>
          </div>
        </Link>
        
        {/* HAMBURGER / CLOSE BUTTON */}
        <button 
          aria-label="Toggle navigation menu" 
          aria-expanded={menuOpen} 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            width: '40px',
            height: '24px',
            zIndex: 100000,
            cursor: 'none' // Para usar el nuestro custom
          }}
        >
          <span 
            style={{ 
              position: 'absolute', display: 'block', width: '30px', height: '2px', backgroundColor: 'var(--text-primary)', 
              top: menuOpen ? '50%' : '20%', right: 0,
              transform: menuOpen ? 'rotate(45deg)' : 'none',
              transition: 'all 0.4s cubic-bezier(0.77, 0, 0.175, 1)' 
            }}
          />
          <span 
            style={{ 
              position: 'absolute', display: 'block', width: '30px', height: '2px', backgroundColor: 'var(--text-primary)', 
              top: menuOpen ? '50%' : '80%', right: 0,
              transform: menuOpen ? 'rotate(-45deg)' : 'none',
              transition: 'all 0.4s cubic-bezier(0.77, 0, 0.175, 1)' 
            }}
          />
        </button>
      </header>

      {/* FULLSCREEN NAVIGATION OVERLAY */}
      <nav 
        ref={menuRef}
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: '#070A0F', // Color base del overlay
          zIndex: 99998, // Debajo del header pero encima de todo lo demás
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 10vw',
          clipPath: 'circle(0% at 95% 5%)', // Empieza escondido apuntando al botón superior derecho
          pointerEvents: menuOpen ? 'auto' : 'none'
        }}
      >
        {/* Fondo de ruido para cohesión */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: `url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)"/%3E%3C/svg%3E')` }} />
        
        <ul 
          ref={linksWrapRef}
          style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '2vh'
          }}
        >
          {navLinks.map((link) => (
            <li key={link.name} style={{ overflow: 'hidden' }}>
              <a 
                href={link.href}
                className="menu-item-text"
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{
                  display: 'inline-block',
                  fontSize: 'clamp(4rem, 12vw, 10rem)',
                  lineHeight: 1,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: 'transparent',
                  WebkitTextStroke: '2px var(--surface-secondary)',
                  textDecoration: 'none',
                  transition: 'all 0.4s ease',
                  cursor: 'none' // Custm cursor takes over
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.paddingLeft = '3vw';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'transparent';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Footer del menú flotante */}
        <div 
          className="menu-item-text" // Animamos junto con el menú
          style={{ 
            position: 'absolute', 
            bottom: '10vh', 
            left: '10vw', 
            display: 'flex', 
            gap: '2rem', 
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}
        >
          <span>ksenyia@info.com</span>
          <span>+1 900 892 102</span>
        </div>
      </nav>
    </>
  );
}
