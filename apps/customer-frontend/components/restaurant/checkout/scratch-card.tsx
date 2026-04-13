"use client";

import React, { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';

type ScratchCardProps = {
  onComplete?: () => void;
  rewardText?: string;
  onClose: () => void;
};

export function ScratchCard({ 
  onComplete, 
  onClose 
}: Pick<ScratchCardProps, 'onComplete' | 'onClose'>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Randomize the reward text on mount
  const reward = React.useMemo(() => {
    const rewards = [
      "YOU WON 15% OFF!",
      "FREE DELIVERY WON!",
      "YOU WON AED 20 OFF!",
      "500 LOYALTY POINTS!",
      "FREE DESSERT UNLOCKED!"
    ];
    return rewards[Math.floor(Math.random() * rewards.length)];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set dimensions
    const width = 300;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // Draw the "Scratch" surface (the sticker)
    // 1. Fill background with a Metallic Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#e5e5e5'); // Silver
    gradient.addColorStop(0.5, '#ffffff'); // Shine
    gradient.addColorStop(1, '#d4d4d4'); // Darker silver
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add some noise/texture for that "glitter" look
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 1.5;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.05)';
        ctx.fillRect(x, y, size, size);
    }

    // 2. Add some "texture" or the hand-drawn elements from the image
    // Hand-drawn "SCRAAATCH ME" box
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.moveTo(160, 40);
    ctx.lineTo(260, 35);
    ctx.lineTo(270, 70);
    ctx.lineTo(170, 80);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('SCRAAATCH', 175, 58);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#222';
    ctx.fillText('ME', 245, 100);

    // Orange "Paint" stroke
    ctx.fillStyle = '#FFB800';
    ctx.beginPath();
    ctx.ellipse(150, 180, 120, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hand-drawn stars (simplified)
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5;
    const drawStar = (x: number, y: number, r: number) => {
        ctx.beginPath();
        for(let i=0; i<5; i++) {
            ctx.lineTo(Math.cos((18+72*i)/180*Math.PI)*r + x, -Math.sin((18+72*i)/180*Math.PI)*r + y);
            ctx.lineTo(Math.cos((54+72*i)/180*Math.PI)*(r/2) + x, -Math.sin((54+72*i)/180*Math.PI)*(r/2) + y);
        }
        ctx.closePath();
        ctx.stroke();
    };
    drawStar(140, 120, 20);
    drawStar(180, 100, 15);
    drawStar(210, 130, 12);

    // Smiley
    ctx.beginPath();
    ctx.arc(200, 180, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(185, 170, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(215, 170, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(200, 185, 20, 0, Math.PI);
    ctx.stroke();

    // Composite mode for scratching
    ctx.globalCompositeOperation = 'destination-out';

    const scratch = (x: number, y: number) => {
      ctx.lineWidth = 40;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();
      checkPercentage();
    };

    const checkPercentage = () => {
      const pixels = ctx.getImageData(0, 0, width, height).data;
      let count = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) count++;
      }
      const p = (count / (pixels.length / 4)) * 100;
      if (p > 50 && !isScratched) {
        setIsScratched(true);
        onComplete?.();
        
        // Launch Celebration!
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFB800', '#222', '#FFFFFF'],
          zIndex: 200000,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isScratched) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (e.buttons === 1) {
        scratch(x, y);
        // Add subtle haptic feedback for mobile users
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(5);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isScratched) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      scratch(x, y);
      
      // Haptic feedback on touch
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(8);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isScratched, onComplete]);

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
        className="relative shadow-[0_0_60px_rgba(255,184,0,0.3)]"
      >
        {/* Background Result */}
        <div className="flex h-[300px] w-[300px] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-inner">
           <span className="text-4xl">🎉</span>
           <h3 className="mt-4 text-xl font-black tracking-tight text-slate-800">
             {reward}
           </h3>
           <p className="mt-2 text-sm text-slate-500">
             Redeem this code at checkout on your next visit!
           </p>
           <div className="mt-4 flex flex-col items-center gap-3">
             <div className="relative group cursor-pointer" onClick={() => {
               navigator.clipboard.writeText("JUST50OFF");
               setIsCopied(true);
               setTimeout(() => setIsCopied(false), 2000);
             }}>
               <AnimatePresence>
                 {isCopied && (
                   <motion.div 
                     initial={{ opacity: 0, y: 0 }}
                     animate={{ opacity: 1, y: -40 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-x-0 -top-2 px-2 py-1 rounded bg-black text-white text-[10px] font-bold text-center pointer-events-none"
                   >
                     COPIED! 🎉
                   </motion.div>
                 )}
               </AnimatePresence>
               <div className="rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 px-6 py-2 font-mono text-lg font-bold text-amber-700 transition-all hover:scale-105 active:scale-95">
                 JUST50OFF
               </div>
               <div className="mt-1 text-[10px] font-bold uppercase text-amber-600 opacity-60">
                 Tap to copy
               </div>
             </div>
             
             <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
               <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
               EXPIRES IN 2 HOURS
             </div>
           </div>
        </div>

        {/* Scratch Surface */}
        <AnimatePresence>
          {!isScratched && (
            <motion.canvas
              ref={canvasRef}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 cursor-crosshair rounded-xl shadow-2xl touch-none"
              style={{
                // Zigzag border simulation via clip-path
                clipPath: "polygon(5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 10%, 95% 15%, 100% 20%, 95% 25%, 100% 30%, 95% 35%, 100% 40%, 95% 45%, 100% 50%, 95% 55%, 100% 60%, 95% 65%, 100% 70%, 95% 75%, 100% 80%, 95% 85%, 100% 90%, 95% 95%, 100% 100%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%, 0% 90%, 5% 85%, 0% 80%, 5% 75%, 0% 70%, 5% 65%, 0% 60%, 5% 55%, 0% 50%, 5% 45%, 0% 40%, 5% 35%, 0% 30%, 5% 25%, 0% 20%, 5% 15%, 0% 10%, 5% 5%, 0% 0%)"
              }}
            />
          )}
        </AnimatePresence>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -right-4 -top-4 rounded-full bg-white p-2 shadow-xl ring-1 ring-slate-200"
        >
          <X className="h-4 w-4 text-slate-600" />
        </button>

         {/* Hint / Claim Button */}
         <AnimatePresence>
           {!isScratched ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-10 left-0 right-0 text-center text-sm font-bold text-white/60"
              >
                Scratch to reveal your surprise!
              </motion.div>
           ) : (
             <motion.button
               initial={{ opacity: 0, scale: 0.8, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 40 }}
               onClick={onClose}
               className="absolute -bottom-4 left-4 right-4 rounded-xl bg-[rgb(var(--brand))] py-4 text-sm font-black text-white shadow-[0_10px_30px_rgba(var(--brand-glow),0.4)] transition-all hover:scale-105 active:scale-95"
             >
               CLAIM & CONTINUE
             </motion.button>
           )}
         </AnimatePresence>
      </motion.div>
    </div>
  );
}
