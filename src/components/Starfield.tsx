import React, { useEffect, useRef } from 'react';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; size: number; speed: number; opacity: number; color: string }[] = [];
    let nebulae: { x: number; y: number; size: number; color: string; opacity: number }[] = [];

    const initStars = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Background Stars
      stars = Array.from({ length: 400 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random(),
        color: Math.random() > 0.8 ? '#93c5fd' : (Math.random() > 0.9 ? '#fca5a5' : '#ffffff'),
      }));

      // Nebulae effects
      nebulae = Array.from({ length: 5 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 400 + 200,
        color: Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.05)' : 'rgba(139, 92, 246, 0.05)',
        opacity: Math.random() * 0.5 + 0.2,
      }));
    };

    const draw = () => {
      // Deep space gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#020617');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Nebulae
      nebulae.forEach(n => {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.size);
        g.addColorStop(0, n.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(n.x - n.size, n.y - n.size, n.size * 2, n.size * 2);
      });

      // Draw Stars
      stars.forEach((star) => {
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * (0.5 + Math.sin(Date.now() * 0.001 * star.speed) * 0.5);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(draw);
    };

    initStars();
    draw();

    const handleResize = () => {
      initStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-slate-950"
      style={{ touchAction: 'none' }}
    />
  );
};

export default Starfield;
