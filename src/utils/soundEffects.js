// Sound Effects Manager (Muted / Disabled by design for silent, distraction-free UI)

class SoundEffectsManager {
  constructor() {
    this.enabled = false;
    this.ctx = null;
  }

  init() {
    // No-op
  }

  toggleSound() {
    this.enabled = false;
    return false;
  }

  playPaperRustle() {
    // No-op (Sound muted)
  }

  playPenScratch() {
    // No-op (Sound muted)
  }

  playStampThud() {
    // No-op (Sound muted)
  }

  playSuccessChime() {
    // No-op (Sound muted)
  }
}

export const sounds = new SoundEffectsManager();
