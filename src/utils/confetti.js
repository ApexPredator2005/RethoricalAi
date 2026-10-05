import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#ae3200', '#7d5719', '#4e6544', '#fe5d26', '#ffddb1']
    });

    // Right burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ae3200', '#7d5719', '#4e6544', '#fe5d26', '#ffddb1']
    });

    // Center starburst
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7d5719', '#4e6544', '#ffddb1', '#ffffff']
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
      colors: ['#4e6544', '#819a76', '#d0eac1']
    });
  } catch {}
}
