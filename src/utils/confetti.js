import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#3a5743', '#3b7080', '#fcec52', '#ade25d', '#cfffb3']
    });

    // Right burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#3a5743', '#3b7080', '#fcec52', '#ade25d', '#cfffb3']
    });

    // Center starburst
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ade25d', '#3b7080', '#fcec52', '#ffffff']
      });
    }, 200);
  } catch {
    // Gracefully handle if canvas is unavailable
  }
}

export function firePraiseConfetti() {
  try {
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#3a5743', '#ade25d', '#cfffb3']
    });
  } catch {}
}
