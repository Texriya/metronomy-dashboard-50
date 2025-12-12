/**
 * SoundManager - Audio feedback system for UI interactions
 * Creates synthesized sounds using Web Audio API
 */

class SoundManager {
  constructor() {
    this.audioContext = null
    this.enabled = true
    this.volume = 0.3
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
    return this.audioContext
  }

  setEnabled(enabled) {
    this.enabled = enabled
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  // Soft click sound
  playClick() {
    if (!this.enabled) return
    try {
      const ctx = this.init()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)

      gain.gain.setValueAtTime(0.1 * this.volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
    } catch (e) { /* Ignore audio errors */ }
  }

  // Subtle hover tick
  playHover() {
    if (!this.enabled) return
    try {
      const ctx = this.init()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, ctx.currentTime)

      gain.gain.setValueAtTime(0.03 * this.volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.04)
    } catch (e) { /* Ignore audio errors */ }
  }

  // Success chord (C-E-G)
  playSuccess() {
    if (!this.enabled) return
    try {
      const ctx = this.init()
      const notes = [523.25, 659.25, 783.99]

      notes.forEach((freq, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()

          osc.connect(gain)
          gain.connect(ctx.destination)

          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, ctx.currentTime)

          gain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

          osc.start(ctx.currentTime)
          osc.stop(ctx.currentTime + 0.4)
        }, i * 80)
      })
    } catch (e) { /* Ignore audio errors */ }
  }

  // Warning tone
  playWarning() {
    if (!this.enabled) return
    try {
      const ctx = this.init()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.setValueAtTime(550, ctx.currentTime + 0.12)

      gain.gain.setValueAtTime(0.1 * this.volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.25)
    } catch (e) { /* Ignore audio errors */ }
  }

  // Error/alert sound
  playError() {
    if (!this.enabled) return
    try {
      const ctx = this.init()

      [0, 0.12].forEach((delay) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.type = 'square'
        osc.frequency.setValueAtTime(330, ctx.currentTime + delay)

        gain.gain.setValueAtTime(0.06 * this.volume, ctx.currentTime + delay)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.1)

        osc.start(ctx.currentTime + delay)
        osc.stop(ctx.currentTime + delay + 0.1)
      })
    } catch (e) { /* Ignore audio errors */ }
  }

  // Swoosh for transitions
  playSwoosh() {
    if (!this.enabled) return
    try {
      const ctx = this.init()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(100, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(500, ctx.currentTime)
      filter.frequency.exponentialRampToValueAtTime(5000, ctx.currentTime + 0.1)

      gain.gain.setValueAtTime(0.05 * this.volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)
    } catch (e) { /* Ignore audio errors */ }
  }

  // Pop sound for notifications
  playPop() {
    if (!this.enabled) return
    try {
      const ctx = this.init()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05)
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1)

      gain.gain.setValueAtTime(0.1 * this.volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.15)
    } catch (e) { /* Ignore audio errors */ }
  }

  // Scan/analyze sound
  playScan() {
    if (!this.enabled) return
    try {
      const ctx = this.init()
      
      // Multiple layered tones for scanning effect
      [200, 400, 600].forEach((baseFreq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.type = 'sine'
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(baseFreq * 2, ctx.currentTime + 0.5)

        gain.gain.setValueAtTime(0.03 * this.volume, ctx.currentTime + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)

        osc.start(ctx.currentTime + i * 0.1)
        osc.stop(ctx.currentTime + 0.6)
      })
    } catch (e) { /* Ignore audio errors */ }
  }

  // Result reveal sound
  playReveal() {
    if (!this.enabled) return
    try {
      const ctx = this.init()
      const notes = [261.63, 329.63, 392, 523.25] // C4-E4-G4-C5

      notes.forEach((freq, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()

          osc.connect(gain)
          gain.connect(ctx.destination)

          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, ctx.currentTime)

          gain.gain.setValueAtTime(0.06 * this.volume, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

          osc.start(ctx.currentTime)
          osc.stop(ctx.currentTime + 0.3)
        }, i * 100)
      })
    } catch (e) { /* Ignore audio errors */ }
  }
}

// Singleton instance
const soundManager = new SoundManager()

export default soundManager
