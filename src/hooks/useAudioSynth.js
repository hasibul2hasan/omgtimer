import { useRef, useCallback, useState, useEffect } from 'react';

/**
 * Suite of 5 distinct, multi-phrase ~10-second synthesized ringtones using native Web Audio API.
 * 100% offline, zero external sound files, crystal clear audio.
 */

const buildPhrase = (pattern, offset) =>
  pattern.map((n) => ({
    freq: n.f,
    time: +(offset + n.t).toFixed(3),
    dur: n.d,
  }));

// 1. Marimba Pop (~10s, Bouncy tropical marimba ringtone)
const marimbaP1 = [
  { f: 659.25, t: 0.00, d: 0.22 }, { f: 830.61, t: 0.14, d: 0.22 }, { f: 987.77, t: 0.28, d: 0.22 }, { f: 1318.51, t: 0.42, d: 0.30 },
  { f: 987.77, t: 0.60, d: 0.20 }, { f: 830.61, t: 0.74, d: 0.20 }, { f: 659.25, t: 0.88, d: 0.25 },
  { f: 739.99, t: 1.06, d: 0.20 }, { f: 830.61, t: 1.20, d: 0.20 }, { f: 987.77, t: 1.34, d: 0.22 }, { f: 1318.51, t: 1.48, d: 0.30 }, { f: 1661.22, t: 1.68, d: 0.45 }
];
const marimbaP2 = [
  { f: 830.61, t: 0.00, d: 0.22 }, { f: 987.77, t: 0.14, d: 0.22 }, { f: 1318.51, t: 0.28, d: 0.25 }, { f: 1661.22, t: 0.42, d: 0.32 },
  { f: 1318.51, t: 0.60, d: 0.20 }, { f: 987.77, t: 0.74, d: 0.20 }, { f: 880.00, t: 0.88, d: 0.25 },
  { f: 987.77, t: 1.06, d: 0.20 }, { f: 1108.73, t: 1.20, d: 0.20 }, { f: 1318.51, t: 1.34, d: 0.22 }, { f: 1661.22, t: 1.48, d: 0.30 }, { f: 1975.53, t: 1.68, d: 0.45 }
];
const marimbaP3 = [
  { f: 739.99, t: 0.00, d: 0.20 }, { f: 880.00, t: 0.14, d: 0.20 }, { f: 1108.73, t: 0.28, d: 0.22 }, { f: 1479.98, t: 0.42, d: 0.30 },
  { f: 1318.51, t: 0.60, d: 0.20 }, { f: 1108.73, t: 0.74, d: 0.20 }, { f: 987.77, t: 0.88, d: 0.22 },
  { f: 830.61, t: 1.04, d: 0.20 }, { f: 739.99, t: 1.18, d: 0.20 }, { f: 830.61, t: 1.32, d: 0.20 }, { f: 987.77, t: 1.46, d: 0.22 }, { f: 1318.51, t: 1.62, d: 0.45 }
];
const marimbaP4 = [
  { f: 659.25, t: 0.00, d: 0.20 }, { f: 830.61, t: 0.12, d: 0.20 }, { f: 987.77, t: 0.24, d: 0.20 }, { f: 1318.51, t: 0.36, d: 0.22 },
  { f: 1661.22, t: 0.48, d: 0.25 }, { f: 1975.53, t: 0.62, d: 0.30 }, { f: 1661.22, t: 0.80, d: 0.22 }, { f: 1318.51, t: 0.96, d: 0.22 },
  { f: 987.77, t: 1.12, d: 0.25 }, { f: 1318.51, t: 1.30, d: 0.35 }, { f: 1661.22, t: 1.52, d: 0.40 }, { f: 2093.00, t: 1.80, d: 0.80 }
];
const RINGTONE_MARIMBA = {
  name: 'Marimba Pop',
  instrument: 'marimba',
  notes: [
    ...buildPhrase(marimbaP1, 0.0),
    ...buildPhrase(marimbaP2, 2.4),
    ...buildPhrase(marimbaP3, 4.8),
    ...buildPhrase(marimbaP4, 7.2),
  ],
};

// 2. Digital Pulse (~10s, Catchy modern smartphone ringtone)
const digP1 = [
  { f: 523.25, t: 0.00, d: 0.18 }, { f: 783.99, t: 0.11, d: 0.18 }, { f: 1046.50, t: 0.22, d: 0.25 },
  { f: 783.99, t: 0.38, d: 0.18 }, { f: 932.33, t: 0.49, d: 0.18 }, { f: 698.46, t: 0.60, d: 0.25 },
  { f: 523.25, t: 0.78, d: 0.18 }, { f: 783.99, t: 0.89, d: 0.18 }, { f: 1046.50, t: 1.00, d: 0.25 },
  { f: 1174.66, t: 1.18, d: 0.22 }, { f: 1046.50, t: 1.35, d: 0.25 }, { f: 783.99, t: 1.55, d: 0.20 }, { f: 1046.50, t: 1.72, d: 0.45 }
];
const digP2 = [
  { f: 659.25, t: 0.00, d: 0.18 }, { f: 987.77, t: 0.11, d: 0.18 }, { f: 1318.51, t: 0.22, d: 0.25 },
  { f: 987.77, t: 0.38, d: 0.18 }, { f: 1174.66, t: 0.49, d: 0.18 }, { f: 880.00, t: 0.60, d: 0.25 },
  { f: 659.25, t: 0.78, d: 0.18 }, { f: 987.77, t: 0.89, d: 0.18 }, { f: 1318.51, t: 1.00, d: 0.25 },
  { f: 1479.98, t: 1.18, d: 0.22 }, { f: 1318.51, t: 1.35, d: 0.25 }, { f: 987.77, t: 1.55, d: 0.20 }, { f: 1318.51, t: 1.72, d: 0.45 }
];
const digP3 = [
  { f: 783.99, t: 0.00, d: 0.18 }, { f: 1046.50, t: 0.11, d: 0.18 }, { f: 1318.51, t: 0.22, d: 0.22 }, { f: 1567.98, t: 0.35, d: 0.28 },
  { f: 1318.51, t: 0.52, d: 0.18 }, { f: 1046.50, t: 0.65, d: 0.18 }, { f: 880.00, t: 0.78, d: 0.20 },
  { f: 1046.50, t: 0.95, d: 0.18 }, { f: 1318.51, t: 1.08, d: 0.18 }, { f: 1567.98, t: 1.22, d: 0.25 }, { f: 1760.00, t: 1.40, d: 0.25 }, { f: 1567.98, t: 1.62, d: 0.45 }
];
const digP4 = [
  { f: 523.25, t: 0.00, d: 0.18 }, { f: 783.99, t: 0.11, d: 0.18 }, { f: 1046.50, t: 0.22, d: 0.22 },
  { f: 1318.51, t: 0.35, d: 0.22 }, { f: 1567.98, t: 0.48, d: 0.25 }, { f: 2093.00, t: 0.65, d: 0.35 },
  { f: 1567.98, t: 0.88, d: 0.22 }, { f: 1318.51, t: 1.05, d: 0.25 }, { f: 1046.50, t: 1.25, d: 0.35 },
  { f: 1567.98, t: 1.50, d: 0.40 }, { f: 2093.00, t: 1.80, d: 0.80 }
];
const RINGTONE_DIGITAL = {
  name: 'Digital Pulse',
  instrument: 'digital',
  notes: [
    ...buildPhrase(digP1, 0.0),
    ...buildPhrase(digP2, 2.4),
    ...buildPhrase(digP3, 4.8),
    ...buildPhrase(digP4, 7.2),
  ],
};

// 3. Celestial Cascade (~10s, Magical crystal bell chime ringtone)
const celP1 = [
  { f: 587.33, t: 0.00, d: 0.35 }, { f: 739.99, t: 0.12, d: 0.35 }, { f: 880.00, t: 0.24, d: 0.35 },
  { f: 1108.73, t: 0.36, d: 0.38 }, { f: 1174.66, t: 0.48, d: 0.42 }, { f: 880.00, t: 0.68, d: 0.30 },
  { f: 739.99, t: 0.80, d: 0.30 }, { f: 783.99, t: 0.98, d: 0.32 }, { f: 987.77, t: 1.10, d: 0.32 },
  { f: 1174.66, t: 1.22, d: 0.35 }, { f: 1318.51, t: 1.34, d: 0.40 }, { f: 1760.00, t: 1.52, d: 0.65 }
];
const celP2 = [
  { f: 739.99, t: 0.00, d: 0.35 }, { f: 880.00, t: 0.12, d: 0.35 }, { f: 1174.66, t: 0.24, d: 0.35 },
  { f: 1479.98, t: 0.36, d: 0.38 }, { f: 1760.00, t: 0.48, d: 0.42 }, { f: 1479.98, t: 0.68, d: 0.30 },
  { f: 1174.66, t: 0.80, d: 0.30 }, { f: 987.77, t: 0.98, d: 0.32 }, { f: 1318.51, t: 1.10, d: 0.35 },
  { f: 1567.98, t: 1.22, d: 0.40 }, { f: 1975.53, t: 1.40, d: 0.70 }
];
const celP3 = [
  { f: 783.99, t: 0.00, d: 0.35 }, { f: 987.77, t: 0.12, d: 0.35 }, { f: 1174.66, t: 0.24, d: 0.35 },
  { f: 1567.98, t: 0.36, d: 0.38 }, { f: 1479.98, t: 0.52, d: 0.35 }, { f: 1174.66, t: 0.68, d: 0.30 },
  { f: 880.00, t: 0.84, d: 0.30 }, { f: 1108.73, t: 1.00, d: 0.32 }, { f: 1318.51, t: 1.15, d: 0.35 },
  { f: 1760.00, t: 1.35, d: 0.45 }, { f: 2093.00, t: 1.58, d: 0.65 }
];
const celP4 = [
  { f: 587.33, t: 0.00, d: 0.35 }, { f: 880.00, t: 0.12, d: 0.35 }, { f: 1174.66, t: 0.24, d: 0.35 },
  { f: 1479.98, t: 0.38, d: 0.40 }, { f: 1760.00, t: 0.55, d: 0.45 }, { f: 2093.00, t: 0.75, d: 0.50 },
  { f: 1760.00, t: 1.00, d: 0.40 }, { f: 1479.98, t: 1.22, d: 0.45 }, { f: 1174.66, t: 1.45, d: 0.55 },
  { f: 1760.00, t: 1.70, d: 0.60 }, { f: 2349.32, t: 1.95, d: 0.95 }
];
const RINGTONE_CELESTIAL = {
  name: 'Celestial Cascade',
  instrument: 'crystal',
  notes: [
    ...buildPhrase(celP1, 0.0),
    ...buildPhrase(celP2, 2.4),
    ...buildPhrase(celP3, 4.8),
    ...buildPhrase(celP4, 7.2),
  ],
};

// 4. Kalimba Dream (~10s, Warm acoustic thumb piano melody)
const kalP1 = [
  { f: 440.00, t: 0.00, d: 0.30 }, { f: 523.25, t: 0.15, d: 0.30 }, { f: 659.25, t: 0.30, d: 0.30 },
  { f: 783.99, t: 0.45, d: 0.35 }, { f: 659.25, t: 0.65, d: 0.25 }, { f: 523.25, t: 0.80, d: 0.30 },
  { f: 698.46, t: 1.00, d: 0.30 }, { f: 880.00, t: 1.15, d: 0.30 }, { f: 1046.50, t: 1.30, d: 0.35 },
  { f: 987.77, t: 1.50, d: 0.30 }, { f: 783.99, t: 1.68, d: 0.30 }, { f: 659.25, t: 1.88, d: 0.55 }
];
const kalP2 = [
  { f: 523.25, t: 0.00, d: 0.30 }, { f: 659.25, t: 0.15, d: 0.30 }, { f: 783.99, t: 0.30, d: 0.30 },
  { f: 987.77, t: 0.45, d: 0.35 }, { f: 783.99, t: 0.65, d: 0.25 }, { f: 659.25, t: 0.80, d: 0.30 },
  { f: 880.00, t: 1.00, d: 0.30 }, { f: 1046.50, t: 1.15, d: 0.30 }, { f: 1318.51, t: 1.30, d: 0.35 },
  { f: 1174.66, t: 1.50, d: 0.30 }, { f: 987.77, t: 1.68, d: 0.30 }, { f: 783.99, t: 1.88, d: 0.55 }
];
const kalP3 = [
  { f: 349.23, t: 0.00, d: 0.30 }, { f: 440.00, t: 0.15, d: 0.30 }, { f: 523.25, t: 0.30, d: 0.30 },
  { f: 698.46, t: 0.45, d: 0.35 }, { f: 659.25, t: 0.65, d: 0.25 }, { f: 523.25, t: 0.80, d: 0.30 },
  { f: 392.00, t: 1.00, d: 0.30 }, { f: 493.88, t: 1.15, d: 0.30 }, { f: 587.33, t: 1.30, d: 0.35 },
  { f: 783.99, t: 1.50, d: 0.30 }, { f: 698.46, t: 1.68, d: 0.30 }, { f: 587.33, t: 1.88, d: 0.55 }
];
const kalP4 = [
  { f: 440.00, t: 0.00, d: 0.30 }, { f: 523.25, t: 0.15, d: 0.30 }, { f: 659.25, t: 0.30, d: 0.30 },
  { f: 880.00, t: 0.48, d: 0.35 }, { f: 1046.50, t: 0.68, d: 0.40 }, { f: 1318.51, t: 0.90, d: 0.45 },
  { f: 1046.50, t: 1.15, d: 0.35 }, { f: 880.00, t: 1.35, d: 0.35 }, { f: 659.25, t: 1.55, d: 0.45 },
  { f: 880.00, t: 1.78, d: 0.85 }
];
const RINGTONE_KALIMBA = {
  name: 'Kalimba Dream',
  instrument: 'kalimba',
  notes: [
    ...buildPhrase(kalP1, 0.0),
    ...buildPhrase(kalP2, 2.4),
    ...buildPhrase(kalP3, 4.8),
    ...buildPhrase(kalP4, 7.2),
  ],
};

// 5. Retro Fanfare (~10s, Upbeat 16-bit celebratory ringtone)
const retP1 = [
  { f: 523.25, t: 0.00, d: 0.14 }, { f: 659.25, t: 0.09, d: 0.14 }, { f: 783.99, t: 0.18, d: 0.14 },
  { f: 1046.50, t: 0.27, d: 0.22 }, { f: 783.99, t: 0.42, d: 0.14 }, { f: 1046.50, t: 0.51, d: 0.22 },
  { f: 587.33, t: 0.68, d: 0.14 }, { f: 739.99, t: 0.77, d: 0.14 }, { f: 880.00, t: 0.86, d: 0.14 },
  { f: 1174.66, t: 0.95, d: 0.22 }, { f: 880.00, t: 1.10, d: 0.14 }, { f: 1174.66, t: 1.19, d: 0.22 },
  { f: 783.99, t: 1.36, d: 0.14 }, { f: 987.77, t: 1.46, d: 0.14 }, { f: 1174.66, t: 1.56, d: 0.18 }, { f: 1567.98, t: 1.68, d: 0.45 }
];
const retP2 = [
  { f: 659.25, t: 0.00, d: 0.14 }, { f: 783.99, t: 0.09, d: 0.14 }, { f: 987.77, t: 0.18, d: 0.14 },
  { f: 1318.51, t: 0.27, d: 0.22 }, { f: 987.77, t: 0.42, d: 0.14 }, { f: 1318.51, t: 0.51, d: 0.22 },
  { f: 698.46, t: 0.68, d: 0.14 }, { f: 880.00, t: 0.77, d: 0.14 }, { f: 1046.50, t: 0.86, d: 0.14 },
  { f: 1396.91, t: 0.95, d: 0.22 }, { f: 1046.50, t: 1.10, d: 0.14 }, { f: 1396.91, t: 1.19, d: 0.22 },
  { f: 987.77, t: 1.36, d: 0.14 }, { f: 1174.66, t: 1.46, d: 0.14 }, { f: 1318.51, t: 1.56, d: 0.18 }, { f: 1975.53, t: 1.68, d: 0.45 }
];
const retP3 = [
  { f: 783.99, t: 0.00, d: 0.14 }, { f: 1046.50, t: 0.09, d: 0.14 }, { f: 1318.51, t: 0.18, d: 0.14 },
  { f: 1567.98, t: 0.27, d: 0.22 }, { f: 1318.51, t: 0.42, d: 0.14 }, { f: 1567.98, t: 0.51, d: 0.22 },
  { f: 880.00, t: 0.68, d: 0.14 }, { f: 1108.73, t: 0.77, d: 0.14 }, { f: 1318.51, t: 0.86, d: 0.14 },
  { f: 1760.00, t: 0.95, d: 0.22 }, { f: 1318.51, t: 1.10, d: 0.14 }, { f: 1760.00, t: 1.19, d: 0.22 },
  { f: 1174.66, t: 1.36, d: 0.14 }, { f: 1479.98, t: 1.46, d: 0.14 }, { f: 1760.00, t: 1.56, d: 0.18 }, { f: 2093.00, t: 1.68, d: 0.45 }
];
const retP4 = [
  { f: 523.25, t: 0.00, d: 0.12 }, { f: 659.25, t: 0.09, d: 0.12 }, { f: 783.99, t: 0.18, d: 0.12 },
  { f: 1046.50, t: 0.27, d: 0.15 }, { f: 1318.51, t: 0.38, d: 0.15 }, { f: 1567.98, t: 0.50, d: 0.18 },
  { f: 2093.00, t: 0.65, d: 0.30 }, { f: 1567.98, t: 0.85, d: 0.20 }, { f: 2093.00, t: 1.05, d: 0.30 },
  { f: 1567.98, t: 1.25, d: 0.20 }, { f: 2093.00, t: 1.45, d: 0.35 }, { f: 2637.02, t: 1.75, d: 0.85 }
];
const RINGTONE_RETRO = {
  name: 'Retro Fanfare',
  instrument: 'retro',
  notes: [
    ...buildPhrase(retP1, 0.0),
    ...buildPhrase(retP2, 2.4),
    ...buildPhrase(retP3, 4.8),
    ...buildPhrase(retP4, 7.2),
  ],
};

const ALL_RINGTONES = [
  RINGTONE_MARIMBA,
  RINGTONE_DIGITAL,
  RINGTONE_CELESTIAL,
  RINGTONE_KALIMBA,
  RINGTONE_RETRO,
];

export function useAudioSynth() {
  const audioCtxRef = useRef(null);
  const activeNodesRef = useRef([]);
  const lastRingtoneIdxRef = useRef(-1);
  const stopTimeoutRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const stopActiveSounds = useCallback(() => {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // Safe ignore
      }
    });
    activeNodesRef.current = [];
    setIsPlaying(false);
  }, []);

  // Cleanup audio nodes and timers on unmount
  useEffect(() => {
    return () => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
      activeNodesRef.current.forEach((node) => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch {
          // Safe ignore
        }
      });
    };
  }, []);

  const playRandomRingtone = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return null;

      // Stop any currently ringing notes for crisp playback
      stopActiveSounds();

      // Pick a randomized ringtone (avoiding back-to-back duplicate if possible)
      let nextIdx = Math.floor(Math.random() * ALL_RINGTONES.length);
      if (ALL_RINGTONES.length > 1 && nextIdx === lastRingtoneIdxRef.current) {
        nextIdx = (nextIdx + 1 + Math.floor(Math.random() * (ALL_RINGTONES.length - 1))) % ALL_RINGTONES.length;
      }
      lastRingtoneIdxRef.current = nextIdx;

      const ringtone = ALL_RINGTONES[nextIdx];
      const now = ctx.currentTime;
      const createdNodes = [];
      let maxEndTime = 0;

      // Render each note according to the ringtone's instrument style
      ringtone.notes.forEach(({ freq, time, dur }) => {
        const startTime = now + time;
        const endTime = startTime + dur;
        if (time + dur > maxEndTime) {
          maxEndTime = time + dur;
        }

        if (ringtone.instrument === 'marimba') {
          // Marimba: sine fundamental + rapid decaying 3rd harmonic for the mallet strike
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(freq, startTime);

          const osc2 = ctx.createOscillator();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq * 3, startTime);

          const gain1 = ctx.createGain();
          gain1.gain.setValueAtTime(0.0001, startTime);
          gain1.gain.exponentialRampToValueAtTime(0.35, startTime + 0.008);
          gain1.gain.exponentialRampToValueAtTime(0.0001, endTime);

          const gain2 = ctx.createGain();
          gain2.gain.setValueAtTime(0.0001, startTime);
          gain2.gain.exponentialRampToValueAtTime(0.12, startTime + 0.004);
          gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + dur * 0.35);

          osc1.connect(gain1);
          osc2.connect(gain2);
          gain1.connect(ctx.destination);
          gain2.connect(ctx.destination);

          osc1.start(startTime);
          osc2.start(startTime);
          osc1.stop(endTime);
          osc2.stop(endTime);

          createdNodes.push(osc1, osc2, gain1, gain2);
        } else if (ringtone.instrument === 'digital') {
          // Digital pulse: sine with fast pitch envelope + soft overtone
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(freq * 1.02, startTime);
          osc1.frequency.exponentialRampToValueAtTime(freq, startTime + 0.03);

          const osc2 = ctx.createOscillator();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq * 2, startTime);

          const gain1 = ctx.createGain();
          gain1.gain.setValueAtTime(0.0001, startTime);
          gain1.gain.exponentialRampToValueAtTime(0.32, startTime + 0.006);
          gain1.gain.exponentialRampToValueAtTime(0.0001, endTime);

          const gain2 = ctx.createGain();
          gain2.gain.setValueAtTime(0.0001, startTime);
          gain2.gain.exponentialRampToValueAtTime(0.08, startTime + 0.006);
          gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + dur * 0.5);

          osc1.connect(gain1);
          osc2.connect(gain2);
          gain1.connect(ctx.destination);
          gain2.connect(ctx.destination);

          osc1.start(startTime);
          osc2.start(startTime);
          osc1.stop(endTime);
          osc2.stop(endTime);

          createdNodes.push(osc1, osc2, gain1, gain2);
        } else if (ringtone.instrument === 'crystal') {
          // Crystal bells: dual sine with subtle chorus detune & high sparkle
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(freq, startTime);

          const osc2 = ctx.createOscillator();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(freq * 2.004, startTime);

          const osc3 = ctx.createOscillator();
          osc3.type = 'sine';
          osc3.frequency.setValueAtTime(freq * 4.01, startTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.exponentialRampToValueAtTime(0.24, startTime + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

          const sparkleGain = ctx.createGain();
          sparkleGain.gain.setValueAtTime(0.0001, startTime);
          sparkleGain.gain.exponentialRampToValueAtTime(0.05, startTime + 0.01);
          sparkleGain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur * 0.45);

          osc1.connect(gain);
          osc2.connect(gain);
          osc3.connect(sparkleGain);
          sparkleGain.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(startTime);
          osc2.start(startTime);
          osc3.start(startTime);
          osc1.stop(endTime);
          osc2.stop(endTime);
          osc3.stop(endTime);

          createdNodes.push(osc1, osc2, osc3, gain, sparkleGain);
        } else if (ringtone.instrument === 'kalimba') {
          // Kalimba: warm acoustic tines with rounded fundamental
          const osc1 = ctx.createOscillator();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(freq, startTime);

          const osc2 = ctx.createOscillator();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(freq, startTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.exponentialRampToValueAtTime(0.30, startTime + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(startTime);
          osc2.start(startTime);
          osc1.stop(endTime);
          osc2.stop(endTime);

          createdNodes.push(osc1, osc2, gain);
        } else {
          // Retro fanfare: filtered bright tone with snappy attack
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          const oscSub = ctx.createOscillator();
          oscSub.type = 'sine';
          oscSub.frequency.setValueAtTime(freq * 0.5, startTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.exponentialRampToValueAtTime(0.28, startTime + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

          const gainSub = ctx.createGain();
          gainSub.gain.setValueAtTime(0.0001, startTime);
          gainSub.gain.exponentialRampToValueAtTime(0.10, startTime + 0.005);
          gainSub.gain.exponentialRampToValueAtTime(0.0001, startTime + dur * 0.7);

          osc.connect(gain);
          oscSub.connect(gainSub);
          gain.connect(ctx.destination);
          gainSub.connect(ctx.destination);

          osc.start(startTime);
          oscSub.start(startTime);
          osc.stop(endTime);
          oscSub.stop(endTime);

          createdNodes.push(osc, oscSub, gain, gainSub);
        }
      });

      activeNodesRef.current = createdNodes;
      setIsPlaying(true);

      // Auto-reset isPlaying state when ringtone completes (~10s)
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
      stopTimeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
        activeNodesRef.current = [];
      }, Math.ceil((maxEndTime + 0.2) * 1000));

      return ringtone.name;
    } catch (err) {
      console.warn('AudioContext playback error:', err);
      setIsPlaying(false);
      return null;
    }
  }, [getAudioContext, stopActiveSounds]);

  // playChime is kept as an alias to playRandomRingtone for backward compatibility
  const playChime = playRandomRingtone;

  return {
    playRandomRingtone,
    playChime,
    getAudioContext,
    stopActiveSounds,
    isPlaying,
  };
}
