import { useMemo } from 'react';

const hearts = ['💕', '💖', '💗', '💘', '💝', '❤️', '🌹', '✨'];

export default function FloatingHearts() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: hearts[i % hearts.length],
      left: `${Math.random() * 100}%`,
      size: `${0.8 + Math.random() * 1.2}rem`,
      duration: `${10 + Math.random() * 20}s`,
      delay: `${Math.random() * 15}s`,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-heart"
          style={{
            left: p.left,
            fontSize: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
