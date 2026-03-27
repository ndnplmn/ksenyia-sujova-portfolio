'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    
    // Check for mobile devices (no custom cursor needed)
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if(isMobile) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    // Usamos una clase en html que oculta el cursor con !important en un CSS global si es necesario
    // pero manipulamos body temporalmente para garantizar que funcione:
    document.body.style.cursor = 'none';

    // Setters ultrarrápidos para el punto central (0 latencia GSAP)
    const xDotSet = gsap.quickSetter(dot, "x", "px");
    const yDotSet = gsap.quickSetter(dot, "y", "px");

    // Setters para el anillo utilizando interpolación en el Ticker (arrastre sedoso)
    const xRingSet = gsap.quickSetter(ring, "x", "px");
    const yRingSet = gsap.quickSetter(ring, "y", "px");

    const mouse = { x: -100, y: -100 }; // Inicializado fuera de la pantalla
    const ringPos = { x: -100, y: -100 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Actualizamos inmediatamente el punto. (Su top/left es -3px, por ende centrado exacto)
      xDotSet(mouse.x);
      yDotSet(mouse.y);
    };

    window.addEventListener('mousemove', onMouseMove);
    
    // Loop de renderizado para el trailing del anillo
    const tickerFunc = () => {
      // Lerp (Linear Interpolation) para que el anillo persiga al ratón con un retraso elástico
      // Un 20% de la distancia restante se recorre por frame (0.2)
      const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
      
      ringPos.x += (mouse.x - ringPos.x) * dt;
      ringPos.y += (mouse.y - ringPos.y) * dt;

      // Actualizamos anillo (Top/Left es -20px, centrado perfecto siempre incluso tras el scale)
      xRingSet(ringPos.x);
      yRingSet(ringPos.y);
    };
    
    gsap.ticker.add(tickerFunc);

    // Configurar interacciones Hover (Estados)
    const onMouseEnter = () => {
      // Anillo de Arrastre crece un 200%, pierde su borde y se rellena de blanco
      gsap.to(ring, { 
        scale: 2, 
        backgroundColor: '#ffffff', 
        borderColor: 'transparent',
        mixBlendMode: 'difference', // Fundamental para crear contrastes ricos con fondos de imagenes
        duration: 0.4, 
        ease: 'power3.out' 
      });
      // El punto principal desaparece suavemente
      gsap.to(dot, { opacity: 0, duration: 0.2 });
      // El texto 'VIEW' del centro aparece escalado desde 0
      if(textRef.current) gsap.to(textRef.current, { opacity: 1, scale: 1, duration: 0.3, delay: 0.1, ease: 'back.out(1.7)' });
    };

    const onMouseLeave = () => {
      // El anillo vuelve a su pequeño tamaño y a tener solo el borde sutil
      gsap.to(ring, { 
        scale: 1, 
        backgroundColor: 'transparent', 
        borderColor: 'rgba(255,255,255,0.4)', 
        mixBlendMode: 'normal',
        duration: 0.4, 
        ease: 'power3.out' 
      });
      // Vuelve el punto principal
      gsap.to(dot, { opacity: 1, duration: 0.2, delay: 0.1 });
      // Escondemos el texto
      if(textRef.current) gsap.to(textRef.current, { opacity: 0, scale: 0.5, duration: 0.2 });
    };

    // Aplica a todos los elementos interactivos del DOM actual y sub-arboles
    const interactables = document.querySelectorAll('a, button, input, .premium-card, .footer-cta');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
      (el as HTMLElement).style.cursor = 'none'; // Evitar el cursor pointer nativo 'manita'
    });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tickerFunc);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    }
  }, []);

  return (
    <>
      {/* Trailing Ring */}
      <div 
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          top: '-20px',  // Al poner -20 y -20 en top/left, el x=0, y=0 literal centrará el div en el ratón.
          left: '-20px', 
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.4)',
          pointerEvents: 'none',
          zIndex: 9999998,
          willChange: 'transform, border-color, background-color', // Solo estas evitan repaints
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div 
          ref={textRef} 
          style={{ 
            color: '#000', 
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
      
      {/* Main tracking dot */}
      <div 
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: '-3px', // Mitad del alto
          left: '-3px', // Mitad del ancho
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--accent-lime)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999999, // Arriba de todo para apuntar precise
          willChange: 'transform, opacity'
        }}
      />
    </>
  );
}
