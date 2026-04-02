'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const magneticTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if(isMobile) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    document.body.style.cursor = 'none';

    const xDotSet = gsap.quickSetter(dot, "x", "px");
    const yDotSet = gsap.quickSetter(dot, "y", "px");
    const xRingSet = gsap.quickSetter(ring, "x", "px");
    const yRingSet = gsap.quickSetter(ring, "y", "px");

    const mouse = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const dotPos = { x: -100, y: -100 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);
    
    const tickerFunc = () => {
      let targetX = mouse.x;
      let targetY = mouse.y;

      // Magnetic Attraction Logic
      if (magneticTarget.current) {
        const rect = magneticTarget.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Intensity of the pull (0.5 = 50% pull towards center)
        const pullFactor = 0.35; 
        targetX += (centerX - mouse.x) * pullFactor;
        targetY += (centerY - mouse.y) * pullFactor;

        // Subtle vibration/buzz when magnetic (2026 sensory detail)
        targetX += (Math.random() - 0.5) * 0.5;
        targetY += (Math.random() - 0.5) * 0.5;
      }

      // Smooth trailing math (LERP + DeltaRatio for framerate independence)
      const ringDt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
      const dotDt = 1.0 - Math.pow(1.0 - 0.35, gsap.ticker.deltaRatio());
      
      ringPos.x += (targetX - ringPos.x) * ringDt;
      ringPos.y += (targetY - ringPos.y) * ringDt;
      
      dotPos.x += (targetX - dotPos.x) * dotDt;
      dotPos.y += (targetY - dotPos.y) * dotDt;

      xDotSet(dotPos.x);
      yDotSet(dotPos.y);
      xRingSet(ringPos.x);
      yRingSet(ringPos.y);
    };
    
    gsap.ticker.add(tickerFunc);

    const onMouseEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      
      // Check if it's a magnetic target
      if (el.hasAttribute('data-magnetic-target')) {
        magneticTarget.current = el;
      }

      gsap.to(ring, { 
        scale: 1.8, 
        backgroundColor: '#ffffff', 
        borderColor: 'transparent',
        mixBlendMode: 'difference',
        filter: 'drop-shadow(2px 0 0px rgba(255,0,0,0.8)) drop-shadow(-2px 0 0px rgba(0,255,255,0.8))',
        duration: 0.5, 
        ease: 'power4.out' 
      });
      gsap.to(dot, { opacity: 0, duration: 0.2 });
      if(textRef.current) {
        const isProject = el.classList.contains('premium-card');
        if (isProject) {
          gsap.to(textRef.current, { opacity: 1, scale: 1, duration: 0.3, delay: 0.1, ease: 'back.out(1.7)' });
        }
      }
    };

    const onMouseLeave = () => {
      magneticTarget.current = null;

      gsap.to(ring, { 
        scale: 1, 
        backgroundColor: 'transparent', 
        borderColor: 'var(--surface-secondary)',
        mixBlendMode: 'normal',
        filter: 'drop-shadow(0 0 0 transparent)',
        duration: 0.5, 
        ease: 'power4.out' 
      });
      gsap.to(dot, { opacity: 1, duration: 0.2, delay: 0.1 });
      if(textRef.current) gsap.to(textRef.current, { opacity: 0, scale: 0.5, duration: 0.2 });
    };

    // Attach listeners to interactive elements
    const interactables = document.querySelectorAll('a, button, input, .premium-card, .footer-cta, [data-magnetic-target]');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
      (el as HTMLElement).style.cursor = 'none';
    });

    // Observer for dynamic elements (Awwwards 2026 standard for SPA)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const newInteractables = node.querySelectorAll('a, button, [data-magnetic-target]');
            newInteractables.forEach(el => {
              el.addEventListener('mouseenter', onMouseEnter);
              el.addEventListener('mouseleave', onMouseLeave);
              (el as HTMLElement).style.cursor = 'none';
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tickerFunc);
      observer.disconnect();
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    }
  }, []);

  return (
    <>
        <div 
          ref={ringRef}
          className="custom-cursor-ring"
          style={{
            position: 'fixed',
            top: '-20px',
            left: '-20px', 
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--surface-secondary)',
            pointerEvents: 'none',
            zIndex: 9999998,
            willChange: 'transform',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div 
            ref={textRef} 
            style={{ 
              color: 'var(--text-primary)', 
              fontSize: '0.6rem', 
              fontWeight: 800,
              opacity: 0, 
              transform: 'scale(0.5)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              willChange: 'opacity, transform'
            }}
          >
            View
          </div>
        </div>
        
        <div 
          ref={dotRef}
          className="custom-cursor-dot"
          style={{
            position: 'fixed',
            top: '-3px',
            left: '-3px',
            width: '6px',
            height: '6px',
            backgroundColor: 'var(--accent-sapphire)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999999,
            willChange: 'transform'
          }}
        />
    </>
  );
}

