import { useMemo } from 'react';

const colors = ['#E63946', '#FFB4C2', '#D4A373', '#800020', '#FF6B8A', '#FFD700'];
const shapes = ['❤️', '💕', '✨', '🌹', '💖'];

export default function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      isEmoji: i % 3 === 0,
      emoji: shapes[i % shapes.length],
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
      size: `${6 + Math.random() * 10}px`,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="fixed top-0"
          style={{
            left: p.left,
            animation: `confettiFall ${p.duration} ${p.delay} linear forwards`,
            fontSize: p.isEmoji ? '1.5rem' : undefined,
          }}
        >
          {p.isEmoji ? (
            p.emoji
          ) : (
            <div
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
