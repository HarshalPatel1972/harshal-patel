"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import { createTimeline } from "animejs";
import { mappaQuotesList, characterRegistry } from "@/data/quotes";
import { useLanguage } from "@/context/LanguageContext";
import { Fraunces, Outfit } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-outfit",
  display: "swap",
});

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [complete, setComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);
  const polaroidRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // WebGL & Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const requestRef = useRef<number | null>(null);

  const dispCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const rawMouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const rawGazeRef = useRef({ x: 0.5, y: 0.5 });
  const smoothGazeRef = useRef({ x: 0.5, y: 0.5 });

  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pick a random quote ONCE - using lazy initialization
  const [selectedQuote] = useState(() => {
    const lastQuoteId = typeof window !== 'undefined' ? sessionStorage.getItem('last_quote_id') : null;
    let filtered = mappaQuotesList.filter(q => q.charId !== 'ROCKY'); // Rocky only shows in Eridian mode
    
    if (filtered.length > 1 && lastQuoteId) {
      const deduplicated = filtered.filter(q => `${q.charId}-${q.en.slice(0, 10)}` !== lastQuoteId);
      if (deduplicated.length > 0) filtered = deduplicated;
    }
    
    const picked = filtered[Math.floor(Math.random() * filtered.length)];
    if (typeof window !== 'undefined' && picked) {
      sessionStorage.setItem('last_quote_id', `${picked.charId}-${picked.en.slice(0, 10)}`);
    }
    return picked;
  });

  const rockyQuote = mappaQuotesList.find(q => q.charId === 'ROCKY');
  const activeQuote = language === 'eridian' ? (rockyQuote ?? selectedQuote) : selectedQuote;
  
  const quoteData = useMemo(() => {
    if (!activeQuote) return null;
    const character = characterRegistry[activeQuote.charId];
    
    return {
      text: language === 'eridian' ? (activeQuote.eridian || activeQuote.en) :
            language === 'ja' ? activeQuote.ja : 
            language === 'ko' ? activeQuote.ko : 
            language === 'zh-tw' ? activeQuote["zh-tw"] : 
            language === 'hi' ? (activeQuote.hi || activeQuote.en) :
            language === 'fr' ? activeQuote.fr :
            language === 'id' ? activeQuote.id :
            language === 'de' ? activeQuote.de :
            language === 'it' ? activeQuote.it :
            language === 'pt-br' ? activeQuote["pt-br"] :
            language === 'es-419' ? activeQuote["es-419"] :
            language === 'es' ? activeQuote.es :
            activeQuote.en,
      author: language === 'eridian' ? character.en.name :
              language === 'ja' ? character.ja.name : 
              language === 'ko' ? character.ko.name : 
              language === 'zh-tw' ? character["zh-tw"].name : 
              language === 'hi' ? (character.hi?.name || character.en.name) :
              language === 'fr' ? character.fr.name :
              language === 'id' ? character.id.name :
              language === 'de' ? character.de.name :
              language === 'it' ? character.it.name :
              language === 'pt-br' ? character["pt-br"].name :
              language === 'es-419' ? character["es-419"].name :
              language === 'es' ? character.es.name :
              character.en.name,
      image: character.image,
      overrideOpacity: character.opacity
    };
  }, [language, activeQuote]);

  const { text: quote = "", author: source = "", image: bgImage = "", overrideOpacity = 0.3 } = quoteData || {};

  const readTime = 3500;

  const quoteLines = useMemo(() => {
    if (!quote) return [];
    const isCJK = language === 'ja' || language === 'ko' || language === 'zh-tw';
    if (isCJK) {
      const lines: string[] = [];
      for (let i = 0; i < quote.length; i += 18) {
        lines.push(quote.slice(i, i + 18));
      }
      return lines;
    }
    const words = quote.split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";
    
    words.forEach(word => {
      if ((currentLine + " " + word).trim().length > 38) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = (currentLine + " " + word).trim();
      }
    });
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    return lines;
  }, [quote, language]);

  const playBrushNoise = () => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;
    try {
      const bufferSize = audioCtx.sampleRate * 2.5; 
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(180, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(650, audioCtx.currentTime + 1.2);
      filter.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 2.5);
      
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 1.0);
      gainNode.gain.linearRampToValueAtTime(0.0, audioCtx.currentTime + 2.5);
      
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      source.start();
    } catch(e) {
      console.warn("Could not play brush sound:", e);
    }
  };

  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
        }, 1300);
      } catch(e) {
        console.warn("Audio Context clean up error:", e);
      }
    }
  };

  const dismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    fadeOutAudio();
    
    const exitTl = createTimeline({
      defaults: {
        ease: 'easeInQuad'
      },
      onComplete: () => {
        setComplete(true);
        onComplete?.();
        document.body.style.overflow = "";
      }
    });

    // Fade out text elements
    exitTl.add('.reveal-wipe, .attribution, .skip-btn', {
      opacity: 0,
      translateY: -20,
      duration: 600,
      ease: 'easeInCubic'
    }, 0);

    // Photo unpins: tilts and drops (translateY 40px, rotate 8deg, opacity 0)
    if (polaroidRef.current) {
      exitTl.add(polaroidRef.current, {
        opacity: 0,
        translateY: 40,
        rotate: 8,
        scale: 0.95,
        duration: 1000,
        ease: 'easeInBack'
      }, 100);
    }

    // Lamp fades out
    if (lampRef.current) {
      exitTl.add(lampRef.current, {
        opacity: 0,
        scale: 0.75,
        duration: 800,
        ease: 'easeInQuad'
      }, 300);
    }
  }, [exiting, onComplete]);

  // Main UI staggered entrance timeline
  useEffect(() => {
    if (complete || !mounted) return;
    document.body.style.overflow = "hidden";

    // Setup timeline
    const initTimeout = setTimeout(() => {
      const tl = createTimeline({
        defaults: {
          ease: 'easeOutQuint'
        }
      });
      timelineRef.current = tl;

      // Lamp light fades in and grows
      if (lampRef.current) {
        tl.add(lampRef.current, {
          opacity: [0, 1],
          scale: [0.75, 1.2],
          duration: 800,
          ease: 'easeOutQuad'
        }, 0);
      }

      // Polaroid photo unpins / scales up from 0.92 to 1.0, tilts to -2deg
      if (polaroidRef.current) {
        tl.add(polaroidRef.current, {
          opacity: [0, 1],
          scale: [0.92, 1.0],
          rotate: [0, -2],
          duration: 1200,
          ease: 'easeOutQuart'
        }, 150);
      }

      exitTimeoutRef.current = setTimeout(dismiss, readTime);
    }, 50);

    return () => {
      clearTimeout(initTimeout);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
      if (timelineRef.current) timelineRef.current.pause();
    };
  }, [complete, mounted, readTime, dismiss]);

  // WebGL Background rendering
  useEffect(() => {
    if (!mounted) return;

    // Track user clicks to initialize/activate WebAudio Drone
    const handleUserInteraction = () => {
      initAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    };
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchmove", handleUserInteraction);

    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let material: THREE.ShaderMaterial;
    let geometry: THREE.PlaneGeometry;
    let textureMesh: THREE.Mesh;
    let dispTexture: THREE.CanvasTexture;
    let portraitTexture: THREE.Texture;

    // 2D displacement paint board (1024x1024)
    const dispCanvas = document.createElement('canvas');
    dispCanvas.width = 1024;
    dispCanvas.height = 1024;
    const dispCtx = dispCanvas.getContext('2d');
    if (!dispCtx) return;

    dispCanvasRef.current = dispCanvas;
    dispCtxRef.current = dispCtx;

    // Displacement update loop (fading trails)
    const updateDisplacement = () => {
      // Fade out past trails over time
      dispCtx.fillStyle = 'rgba(0, 0, 0, 0.035)';
      dispCtx.fillRect(0, 0, 1024, 1024);

      // Draw mouse smear Green Channel
      dispCtx.fillStyle = 'rgba(0, 255, 0, 0.16)';
      dispCtx.beginPath();
      dispCtx.arc(smoothMouseRef.current.x * 1024, (1.0 - smoothMouseRef.current.y) * 1024, 45, 0, Math.PI * 2);
      dispCtx.fill();
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Grayscale + Dim overlay (with character-specific opacity) + Abyss Dark Tint + Vignette applied directly inside Fragment Shader
    const fragmentShader = `
      uniform sampler2D u_portrait;
      uniform sampler2D u_displacement;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_gaze;
      uniform vec2 u_uv_scale;
      uniform float u_blink;
      uniform float u_opacity;
      varying vec2 vUv;

      float waveNoise(vec2 p) {
        float t = u_time * 0.02;
        float n = sin(p.x * 6.0 + t) * cos(p.y * 6.0 + t);
        n += sin(p.x * 12.0 - t) * cos(p.y * 10.0 + t) * 0.5;
        n += sin(p.x * 24.0 + t * 1.5) * cos(p.y * 18.0 - t * 1.5) * 0.25;
        return n / 1.75;
      }

      void main() {
        vec2 uv = (vUv - 0.5) * u_uv_scale + 0.5;
        float n = waveNoise(uv);
        vec2 noiseOffset = vec2(n, waveNoise(uv + vec2(13.0, 37.0))) * 0.002;

        vec2 texel = vec2(1.0 / 1024.0);
        float dM = texture2D(u_displacement, vUv).g; // Green mouse trail

        float hL = texture2D(u_displacement, vUv - vec2(texel.x, 0.0)).g * 0.5;
        float hR = texture2D(u_displacement, vUv + vec2(texel.x, 0.0)).g * 0.5;
        float hD = texture2D(u_displacement, vUv - vec2(0.0, texel.y)).g * 0.5;
        float hU = texture2D(u_displacement, vUv + vec2(0.0, texel.y)).g * 0.5;
        
        vec3 normal = normalize(vec3(hL - hR, hD - hU, 0.075));
        vec2 pushDir = vec2(hR - hL, hU - hD) * 0.015;

        // Gaze shifts
        vec2 faceCenter = vec2(0.5, 0.62);
        float distToFace = distance(uv, faceCenter);
        vec2 gazeOffset = vec2(0.0);
        if (distToFace < 0.28) {
          float fWeight = smoothstep(0.28, 0.0, distToFace);
          gazeOffset = (u_gaze - 0.5) * 0.011 * fWeight;
        }

        // Blinking
        vec2 finalUV = uv + noiseOffset - pushDir + gazeOffset;
        if (u_blink > 0.0) {
          float eyeBand = smoothstep(0.035, 0.0, abs(uv.y - 0.635)) * smoothstep(0.18, 0.0, abs(uv.x - 0.5));
          finalUV.y = mix(finalUV.y, 0.635, u_blink * eyeBand * 0.9);
        }

        vec4 portraitColor = texture2D(u_portrait, finalUV);

        // Keep in color (dimmed slightly)
        vec3 color = portraitColor.rgb;

        // Dim & Tint (Overlay effect matching var(--bg-abyss))
        vec3 targetBg = color * u_opacity;
        vec3 tintColor = vec3(0.012, 0.012, 0.02);
        vec3 dimPortrait = mix(tintColor, targetBg, 0.82);

        // Vignette
        vec2 distFromCenter = uv - 0.5;
        float vignette = smoothstep(0.8, 0.38, length(distFromCenter));
        dimPortrait *= vignette;

        // Blend dim vignetted portrait without coloring trails
        vec3 finalRGB = dimPortrait;

        gl_FragColor = vec4(finalRGB, 1.0);
      }
    `;

    // Unified cleanup handler for WebGL
    let cleanupWebGL: (() => void) | null = null;

    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const img = new window.Image();
      portraitTexture = new THREE.Texture(img);
      portraitTexture.minFilter = THREE.LinearFilter;
      portraitTexture.magFilter = THREE.LinearFilter;

      let imgAspect = 0.75;
      img.onload = () => {
        portraitTexture.needsUpdate = true;
        imgAspect = img.naturalWidth / img.naturalHeight;
        handleResize();
      };
      img.onerror = () => {
        setImgFailed(true);
      };
      img.src = bgImage;

      if (!bgImage) {
        setImgFailed(true);
      }

      dispTexture = new THREE.CanvasTexture(dispCanvas);
      dispTexture.minFilter = THREE.LinearFilter;
      dispTexture.magFilter = THREE.LinearFilter;

      material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          u_portrait: { value: portraitTexture },
          u_displacement: { value: dispTexture },
          u_time: { value: 0 },
          u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
          u_gaze: { value: new THREE.Vector2(0.5, 0.5) },
          u_uv_scale: { value: new THREE.Vector2(1.0, 1.0) },
          u_blink: { value: 0 },
          u_opacity: { value: overrideOpacity }
        }
      });

      geometry = new THREE.PlaneGeometry(2, 2);
      textureMesh = new THREE.Mesh(geometry, material);
      scene.add(textureMesh);

      const handleResize = () => {
        const currentCanvas = canvasRef.current;
        if (!renderer || !material || !currentCanvas) return;
        
        const rect = currentCanvas.getBoundingClientRect();
        const w = currentCanvas.clientWidth || rect.width || 296;
        const h = currentCanvas.clientHeight || rect.height || 360;
        
        renderer.setSize(w, h, false);
        
        const aspectCanvas = w / h;
        let scaleX = 1;
        let scaleY = 1;
        
        if (aspectCanvas > imgAspect) {
          scaleX = 1;
          scaleY = imgAspect / aspectCanvas;
        } else {
          scaleX = aspectCanvas / imgAspect;
          scaleY = 1;
        }
        material.uniforms.u_uv_scale.value.set(scaleX, scaleY);
      };
      window.addEventListener("resize", handleResize);
      
      // Compute correct initial size
      handleResize();

      const handleMouseMove = (e: MouseEvent) => {
        // Window-relative gaze coordinates
        rawGazeRef.current.x = e.clientX / window.innerWidth;
        rawGazeRef.current.y = 1.0 - (e.clientY / window.innerHeight);

        // Canvas-relative mouse coordinates
        const currentCanvas = canvasRef.current;
        if (currentCanvas) {
          const rect = currentCanvas.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = 1.0 - ((e.clientY - rect.top) / rect.height);
          
          rawMouseRef.current.x = Math.max(0, Math.min(1, x));
          rawMouseRef.current.y = Math.max(0, Math.min(1, y));
          
          if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
            if (audioCtxRef.current && Math.random() < 0.08) {
              playBrushNoise();
            }
          }
        }
      };
      window.addEventListener("mousemove", handleMouseMove);

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          rawGazeRef.current.x = touch.clientX / window.innerWidth;
          rawGazeRef.current.y = 1.0 - (touch.clientY / window.innerHeight);

          const currentCanvas = canvasRef.current;
          if (currentCanvas) {
            const rect = currentCanvas.getBoundingClientRect();
            const x = (touch.clientX - rect.left) / rect.width;
            const y = 1.0 - ((touch.clientY - rect.top) / rect.height);
            
            rawMouseRef.current.x = Math.max(0, Math.min(1, x));
            rawMouseRef.current.y = Math.max(0, Math.min(1, y));
          }
        }
      };
      window.addEventListener("touchmove", handleTouchMove, { passive: true });

      let blinkCounter = 0;
      let blinkVal = 0.0;

      const animate = () => {
        requestRef.current = requestAnimationFrame(animate);

        // Smooth mouse coordinates
        smoothMouseRef.current.x += (rawMouseRef.current.x - smoothMouseRef.current.x) * 0.08;
        smoothMouseRef.current.y += (rawMouseRef.current.y - smoothMouseRef.current.y) * 0.08;

        smoothGazeRef.current.x += (rawGazeRef.current.x - smoothGazeRef.current.x) * 0.08;
        smoothGazeRef.current.y += (rawGazeRef.current.y - smoothGazeRef.current.y) * 0.08;

        // Blink controller
        blinkCounter++;
        if (blinkCounter > 260) {
          if (blinkCounter < 272) {
            blinkVal = Math.sin((blinkCounter - 260) * Math.PI / 12);
          } else {
            blinkVal = 0.0;
            blinkCounter = 0;
          }
        }

        updateDisplacement();
        dispTexture.needsUpdate = true;

        if (material) {
          material.uniforms.u_time.value = performance.now() * 0.001;
          material.uniforms.u_mouse.value.set(smoothMouseRef.current.x, smoothMouseRef.current.y);
          material.uniforms.u_gaze.value.set(smoothGazeRef.current.x, smoothGazeRef.current.y);
          material.uniforms.u_blink.value = blinkVal;
        }

        renderer.render(scene, camera);
      };

      animate();

      cleanupWebGL = () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
        if (renderer) renderer.dispose();
        if (geometry) geometry.dispose();
        if (material) material.dispose();
        if (portraitTexture) portraitTexture.dispose();
        if (dispTexture) dispTexture.dispose();
      };
    } catch(e) {
      console.warn("WebGL initialization failed:", e);
      setImgFailed(true);
    }

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchmove", handleUserInteraction);
      if (cleanupWebGL) cleanupWebGL();
    };
  }, [mounted, bgImage, overrideOpacity]);

  if (complete || !quoteData) return null;

  return (
    <div 
      ref={containerRef} 
      onClick={() => dismiss()}
      className={`fixed inset-0 z-[999999] bg-[#030305] flex flex-col md:flex-row items-center justify-center overflow-hidden px-8 md:px-24 cursor-pointer select-none ${fraunces.variable} ${outfit.variable}`}
    >
      {/* Radial Lamp spotlight overlay */}
      <div 
        ref={lampRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,112,58,0.14)_0%,transparent_70%)] pointer-events-none z-10 transition-all duration-[800ms]"
        style={{ transformOrigin: 'top center' }}
      />

      {/* Polaroid photo display printout container */}
      <div className="relative z-20 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
        
        {/* Left Side: Polaroid frame under spotlight */}
        <div className="flex-shrink-0 flex items-center justify-center w-full md:w-auto">
          <div 
            ref={polaroidRef}
            className="w-[260px] h-[340px] md:w-[320px] md:h-[420px] bg-[#EDE4D3] p-3 pb-12 shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/5 overflow-hidden rotate-[-2deg] opacity-0"
            style={{ transformOrigin: 'center center' }}
          >
            {imgFailed ? (
              <div 
                className="w-full h-full bg-gradient-to-tr from-[#050505] via-[#12100e] to-[#1e130f] flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,112,58,0.2)_0%,transparent_80%)] animate-[pulse_3s_infinite_ease-in-out]" />
                <span className="text-[#8A7F72]/50 font-mono text-[9px] uppercase tracking-widest z-10 select-none">{"// DATA_OFFLINE"}</span>
              </div>
            ) : (
              <canvas 
                ref={canvasRef} 
                id="webgl-canvas"
                className="w-full h-full block pointer-events-none" 
              />
            )}
          </div>
        </div>

        {/* Right Side: Typography under spotlight */}
        <div className="flex-grow max-w-xl flex flex-col items-start text-left">
          <div className="flex flex-col gap-4">
            {quoteLines.map((line, idx) => (
              <div 
                key={idx}
                className="font-serif italic text-2xl md:text-3xl lg:text-[2.2rem] text-[#EDE4D3]/90 text-left leading-relaxed tracking-wide reveal-wipe"
                style={{ animationDelay: `${idx * 200 + 400}ms` }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Attribution & thin Forge-Orange separator line */}
          <div 
            ref={sourceRef}
            className="attribution mt-8 flex flex-col items-start gap-3"
            style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards 1.2s', opacity: 0 }}
          >
            <div className="w-[60px] h-[2px] bg-[var(--forge-orange)]" />
            <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--muted-label)]">
              {source}
            </div>
          </div>
        </div>

      </div>

      {/* Skip button corner indicator */}
      <button 
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        className="skip-btn absolute bottom-8 right-8 z-30 pointer-events-auto font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-[var(--muted-label)] hover:text-[#EDE4D3] transition-colors duration-300 bg-transparent border-none outline-none cursor-pointer"
      >
        skip ↗
      </button>

      {/* Progress bar line at the very bottom */}
      <div className="progress-container absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-20">
        <div className="progress-fill h-full bg-[var(--forge-orange)]" />
      </div>

      {/* Texture Overlays */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.08] grain-overlay mix-blend-overlay" />

      <style jsx global>{`
        .reveal-wipe {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
          animation: revealWipe 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes revealWipe {
          to {
            opacity: 1;
            clip-path: inset(0 0 0 0);
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .grain-overlay {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 50;
          pointer-events: none;
          opacity: 0.015;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        .progress-fill {
          width: 0%;
          animation: progressFill 3.5s linear forwards;
        }

        @keyframes progressFill {
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
