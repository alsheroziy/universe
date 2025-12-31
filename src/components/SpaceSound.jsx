/** @format */

import React, { useState, useRef, useEffect } from "react";

const SpaceSound = () => {
  const [muted, setMuted] = useState(true);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      const ctx = audioContextRef.current;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Space Echo (Delay)
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.7;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.4;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(masterGain);
      feedback.connect(masterGain);

      // Deep Drone (Bass)
      const droneOsc = ctx.createOscillator();
      droneOsc.type = "sawtooth";
      droneOsc.frequency.value = 55; // Low A
      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = "lowpass";
      droneFilter.frequency.value = 120;
      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.15;

      droneOsc.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(masterGain);
      droneOsc.start();

      // Atmospheric Noise (Wind)
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 300;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.05;

      // LFO for noise modulation
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.1;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 100;
      lfo.connect(lfoGain);
      lfoGain.connect(noiseFilter.frequency);
      lfo.start();

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start();

      // Random Space Melodies
      const playSpaceNote = () => {
        if (ctx.state === "suspended") return;

        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.connect(noteGain);
        noteGain.connect(delay); // Send to delay for echo
        noteGain.connect(masterGain);

        // Pentatonic frequencies (approx)
        const notes = [220, 261.63, 329.63, 392, 440, 523.25, 659.25];
        const freq =
          notes[Math.floor(Math.random() * notes.length)] *
          (Math.random() > 0.7 ? 2 : 1);

        osc.frequency.value = freq;
        osc.type = Math.random() > 0.6 ? "sine" : "triangle";

        const now = ctx.currentTime;
        const duration = 1 + Math.random() * 3;

        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.05, now + duration * 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.start(now);
        osc.stop(now + duration);
      };

      intervalRef.current = setInterval(() => {
        if (Math.random() > 0.6) playSpaceNote();
      }, 2000);
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  };

  const toggleMute = () => {
    if (muted) {
      initAudio();
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(
          0.4,
          audioContextRef.current.currentTime,
          2
        );
      }
    } else {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(
          0,
          audioContextRef.current.currentTime,
          0.5
        );
      }
    }
    setMuted(!muted);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <button
      onClick={toggleMute}
      className={`absolute bottom-5 right-5 z-20 px-6 py-3 rounded-full font-bold transition-all duration-300 backdrop-blur-md flex items-center gap-2 ${
        muted
          ? "bg-white/10 text-white/50 border border-white/20 hover:bg-white/20"
          : "bg-blue-500/20 text-blue-300 border border-blue-500/50 hover:bg-blue-500/30"
      }`}
    >
      <span className='text-xl'>{muted ? "🔇" : "🎵"}</span>
      <span>{muted ? "Play Space Ambient" : "Space Music Playing"}</span>
    </button>
  );
};

export default SpaceSound;
