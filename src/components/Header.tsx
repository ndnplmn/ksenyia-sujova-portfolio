'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const inlineLinks = [
  { name: 'Work', href: '#work' },
  { name: 'About', href: '#experience' },
];

const inlineLinkStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  textDecoration: 'none',
  color: 'var(--text-secondary)',
  transition: 'color 0.3s ease',
  cursor: 'none',
  mixBlendMode: 'difference',
};

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.55rem 1.4rem',
  borderRadius: '999px',
  border: '1px solid var(--surface-secondary)',
  background: 'transparent',
  color: 'var(--text-primary)',
  fontSize: '0.8rem',
  fontWeight: 500,
  letterSpacing: '0.04em',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  cursor: 'none',
  whiteSpace: 'nowrap',
  mixBlendMode: 'difference',
};

export default function Header() {
  const [contactText, setContactText] = useState('Contact');
  const contactTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksWrapRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Phase 2: Variable Typography Dynamics
    const logoTxt = document.querySelector('.brand-name-dynamic');
    if (logoTxt) {
      gsap.to(logoTxt, {
        fontWeight: 100, // Shift from 800 (style) to 100 on scroll
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });
    }

    if (!menuRef.current) return;

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('lenis-stopped');

      gsap.to(menuRef.current, {
        clipPath: 'circle(150% at 95% 5%)',
        duration: 1.2,
        ease: 'power4.inOut'
      });

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

  const scrollTo = (href: string) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (menuOpen) {
      setMenuOpen(false);
      setTimeout(() => scrollTo(href), 800);
    } else {
      scrollTo(href);
    }
  };

  const handleContactClick = () => {
    navigator.clipboard.writeText('ks@sujova.design');
    setContactText('Copied!');
    
    if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
    contactTimeoutRef.current = setTimeout(() => {
      // Only revert if we are still hovering (indicated by width) or just let it stay until leave
      // Actually, safest is to just set it to the email if still hovered, or Contact if not.
      // But let's keep it simple: after 1.5s, if we're not in the process of leaving, 
      // stay on email or go back to contact.
      const el = document.querySelector('.contact-pill') as HTMLElement;
      if (el && el.offsetWidth > 120) {
        setContactText('ks@sujova.design');
      } else {
        setContactText('Contact');
      }
    }, 1500);
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
          padding: '1.5rem 5%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 99999,
        }}
      >
        {/* Logo */}
        {/* Logo: Minimalist Pure Typography */}
        <Link
          href="/"
          className="brand-logo"
          onClick={(e) => { e.preventDefault(); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="Go to home page"
          style={{ 
            textDecoration: 'none', 
            color: '#FFFFFF', 
            fontSize: '1rem', 
            fontWeight: 800, 
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            cursor: 'none',
            mixBlendMode: 'difference'
          }}
        >
          <span className="brand-name-dynamic">Ksenyia Sujova</span>
        </Link>
 
        {/* Desktop: centered nav links */}
        <nav
          className="desktop-nav"
          aria-label="Main navigation"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          {inlineLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              style={inlineLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-sapphire)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>
 
        {/* Desktop: Morphing Contact Capsule (2026 Pinnacle) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleContactClick}
            className="desktop-nav contact-pill"
            style={{
              ...pillStyle,
              position: 'relative',
              overflow: 'hidden',
              minWidth: '100px',
              transition: 'background-color 0.4s ease, border-color 0.4s ease',
              display: 'flex',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.02)',
              backdropFilter: 'blur(10px)',
            }}
            data-magnetic-target
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { 
                width: '180px', 
                backgroundColor: 'var(--accent-sapphire)', 
                color: 'var(--bg-pure)',
                borderColor: 'var(--accent-sapphire)',
                duration: 0.5, 
                ease: 'expo.out' 
              });
              setContactText('ks@sujova.design');
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { 
                width: '100px', 
                backgroundColor: 'transparent', 
                color: 'var(--text-primary)',
                borderColor: 'var(--surface-secondary)',
                duration: 0.5, 
                ease: 'expo.inOut' 
              });
              setContactText('Contact');
              if (contactTimeoutRef.current) clearTimeout(contactTimeoutRef.current);
            }}
          >
            <span className="contact-pill-text" style={{ position: 'relative', zIndex: 1, willChange: 'transform, opacity' }}>
              {contactText}
            </span>
          </button>
        </div>

        {/* Mobile hamburger — hidden on desktop */}
        <button
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', // Hidden by default, shown via CSS on mobile
            position: 'relative',
            background: 'none',
            border: 'none',
            width: '40px',
            height: '24px',
            zIndex: 100000,
            cursor: 'none'
          }}
          data-magnetic-target
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

      {/* FULLSCREEN NAVIGATION OVERLAY (mobile) */}
      <nav
        ref={menuRef}
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'var(--bg-primary)',
          zIndex: 99998,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 10vw',
          clipPath: 'circle(0% at 95% 5%)',
          pointerEvents: menuOpen ? 'auto' : 'none'
        }}
      >
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
          {[{ name: 'Home', href: '#' }, ...inlineLinks, { name: 'Contact', href: '#contact' }].map((link) => (
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
                  cursor: 'none'
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

        <div
          className="menu-item-text"
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
