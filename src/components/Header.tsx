'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

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
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksWrapRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
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
            cursor: 'none'
          }}
          data-magnetic-target
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
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop: Contact pill button on the right */}
        <a
          href="#contact"
          className="desktop-nav contact-pill"
          onClick={(e) => handleLinkClick(e, '#contact')}
          style={pillStyle}
          data-magnetic-target
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-lime)';
            e.currentTarget.style.borderColor = 'var(--accent-lime)';
            e.currentTarget.style.color = 'var(--bg-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--surface-secondary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          Contact
        </a>

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
