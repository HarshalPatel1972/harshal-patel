"use client";

import { useRef, useEffect } from "react";

export function useAudioDrone() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;
      
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gainNode = audioCtx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, audioCtx.currentTime);
      
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(55.4, audioCtx.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.07, audioCtx.currentTime + 3.0);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      droneGainRef.current = gainNode;
    } catch(e) {
      console.warn("Audio Context failed to initialize:", e);
    }
  };

  const fadeOutAudio = () => {
    if (audioCtxRef.current && droneGainRef.current) {
      try {
        const currTime = audioCtxRef.current.currentTime;
        droneGainRef.current.gain.setValueAtTime(droneGainRef.current.gain.value, currTime);
        droneGainRef.current.gain.exponentialRampToValueAtTime(0.0001, currTime + 1.2);
        
        setTimeout(() => {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
        }, 1300);
      } catch(e) {
        console.warn("Audio Context clean up error:", e);
      }
    }
  };

  useEffect(() => {
    // Clean up on unmount if it's still running
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const resumeAudio = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  return { initAudio, fadeOutAudio, resumeAudio };
}
