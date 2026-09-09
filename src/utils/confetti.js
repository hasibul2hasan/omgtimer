import confetti from 'canvas-confetti';

/**
 * Fires a vibrant multi-directional confetti particle burst.
 */
export function triggerConfettiBurst() {
  const count = 200;
  const defaults = {
    origin: { y: 0.65 },
    zIndex: 9999,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-stage explosion for realism
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#f43f5e', '#a855f7', '#06b6d4', '#eab308'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f97316'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#e11d48', '#2563eb', '#14b8a6'],
    shapes: ['circle'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#fbbf24', '#f472b6', '#38bdf8'],
  });
}
