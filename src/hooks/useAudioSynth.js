import { useRef, useCallback } from 'react';

/**
 * Native Web Audio API chime synthesizer.
 * Generates an uplifting 4-note chime sequence (C5, E5, G5, C6) with natural decay,
 * harmonics, and zero external asset dependencies.
 */
export function useAudioSynth() {
  const audioCtxRef = useRef(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playChime = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Arpeggiated cheerful chime: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const notes = [
        { freq: 523.25, time: 0.00, dur: 0.8 },
        { freq: 659.25, time: 0.12, dur: 0.8 },
        { freq: 783.99, time: 0.24, dur: 0.9 },
        { freq: 1046.50, time: 0.36, dur: 1.4 },
      ];

      notes.forEach(({ freq, time, dur }) => {
        const startTime = now + time;

        // Primary bell tone (sine)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, startTime);

        // Warm harmonic overtone (triangle)
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, startTime); // Octave overtone

        // Subtle bell sparkle (sine at 3x frequency, low gain)
        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(freq * 3.01, startTime);

        // Gain envelope
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.28, startTime + 0.02); // quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + dur); // gentle decay

        // Sparkle gain
        const sparkleGain = ctx.createGain();
        sparkleGain.gain.setValueAtTime(0.04, startTime);
        sparkleGain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur * 0.4);

        // Master gain for this note
        const noteGain = ctx.createGain();
        noteGain.gain.value = 0.85;

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc3.connect(sparkleGain);
        sparkleGain.connect(gainNode);

        gainNode.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc1.start(startTime);
        osc2.start(startTime);
        osc3.start(startTime);

        osc1.stop(startTime + dur);
        osc2.stop(startTime + dur);
        osc3.stop(startTime + dur);
      });
    } catch (err) {
      console.warn('AudioContext playback error:', err);
    }
  }, [getAudioContext]);

  return { playChime, getAudioContext };
}
