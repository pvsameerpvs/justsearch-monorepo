"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameAwardHandler } from './game-award';

type RunnerCanvasGameProps = {
  onAward: GameAwardHandler;
};

type Obstacle = {
  x: number;
  width: number;
  height: number;
};

export function RunnerCanvasGame({ onAward }: RunnerCanvasGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const awardedRef = useRef(false);

  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');

  // Game state refs (to avoid deps in draw loop)
  const playerRef = useRef({ y: 0, velocity: 0, isGrounded: true });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const speedRef = useRef(300); // pixels per second

  const GRAVITY = 1500;
  const JUMP_FORCE = -600;

  const resetGame = useCallback(() => {
    playerRef.current = { y: 0, velocity: 0, isGrounded: true };
    obstaclesRef.current = [];
    scoreRef.current = 0;
    speedRef.current = 300;
    awardedRef.current = false;
  }, []);

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dt = Math.min((now - (lastTimeRef.current || now)) / 1000, 0.1);
    lastTimeRef.current = now;

    const { width, height } = canvas;
    const floorY = height - 50;

    // Logic update (only if running)
    if (status === 'running') {
      const player = playerRef.current;

      // Gravity
      player.velocity += GRAVITY * dt;
      player.y += player.velocity * dt;

      // Floor collision
      if (player.y >= floorY - 30) {
        player.y = floorY - 30;
        player.velocity = 0;
        player.isGrounded = true;
      }

      // Obstacles
      speedRef.current += dt * 10; // increase speed over time
      
      let obstacles = obstaclesRef.current;
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= speedRef.current * dt;
      }

      // Remove off-screen obstacles and add score
      if (obstacles.length > 0 && obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
        scoreRef.current += 10;
      }

      // Spawn new obstacles
      const lastObstacle = obstacles[obstacles.length - 1];
      if (!lastObstacle || lastObstacle.x < width - 400 - Math.random() * 300) {
        obstacles.push({
          x: width,
          width: 30,
          height: 30 + Math.random() * 40,
        });
      }

      // Collision detection
      const px = 100; // player fixed x
      const py = player.y;
      const pw = 30;
      const ph = 30;

      for (const obs of obstacles) {
        const ox = obs.x;
        const oy = floorY - obs.height;
        const ow = obs.width;
        const oh = obs.height;

        if (
          px < ox + ow &&
          px + pw > ox &&
          py < oy + oh &&
          py + ph > oy
        ) {
          // Hit an obstacle!
          setStatus('finished');
          if (!awardedRef.current) {
            awardedRef.current = true;
            onAward({
              points: Math.min(scoreRef.current, 500),
              score: scoreRef.current,
              label: 'Endless Runner',
            });
          }
        }
      }
    } else if (status === 'idle' && playerRef.current.y === 0) {
      playerRef.current.y = floorY - 30;
    }

    // Draw background
    ctx.clearRect(0, 0, width, height);
    
    // Gradient sky
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#c084fc');
    gradient.addColorStop(1, '#93c5fd');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw floor
    ctx.fillStyle = '#000';
    ctx.fillRect(0, floorY, width, height - floorY);

    // Draw obstacles
    ctx.fillStyle = '#000';
    for (const obs of obstaclesRef.current) {
      ctx.beginPath();
      // Draw as triangles for spikes
      ctx.moveTo(obs.x, floorY);
      ctx.lineTo(obs.x + obs.width / 2, floorY - obs.height);
      ctx.lineTo(obs.x + obs.width, floorY);
      ctx.fill();
    }

    // Draw player
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillRect(100, playerRef.current.y, 30, 30);
    ctx.shadowBlur = 0;

    // Draw UI
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '800 24px ui-sans-serif, system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${scoreRef.current}`, 20, 20);

    if (status === 'idle') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#fff';
      ctx.font = '700 28px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Tap or Space to Jump!', width / 2, height / 2);
    } else if (status === 'finished') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#fff';
      ctx.font = '800 36px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', width / 2, height / 2 - 20);
      ctx.font = '600 20px ui-sans-serif, system-ui';
      ctx.fillText(`Final Score: ${scoreRef.current}`, width / 2, height / 2 + 20);
      ctx.fillText(`Points Added: +${Math.min(scoreRef.current, 500)}`, width / 2, height / 2 + 50);
    }

  }, [status, onAward]);

  useEffect(() => {
    const loop = (now: number) => {
      draw(now);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [draw]);

  const jump = useCallback(() => {
    if (status === 'idle') {
      resetGame();
      setStatus('running');
      return;
    }
    if (status === 'finished') {
      // Could let them restart here, or we enforce reset via external button
      return;
    }
    if (playerRef.current.isGrounded) {
      playerRef.current.velocity = JUMP_FORCE;
      playerRef.current.isGrounded = false;
    }
  }, [status, resetGame]);

  const onPointerDown = () => jump();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [jump]);

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        onPointerDown={onPointerDown}
        className="h-auto w-full touch-none select-none overflow-hidden rounded-[32px] border border-[rgb(var(--card-border)/0.9)] bg-[#0f172a] shadow-sm cursor-pointer"
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={jump}
          className="inline-flex h-14 w-full items-center justify-center rounded-full bg-white shadow-lg active:scale-95 transition-transform"
        >
          <span className="text-xl font-black italic tracking-tighter text-[#1e293b]">
            {status === 'idle' ? 'START' : 'JUMP'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            resetGame();
            setStatus('idle');
          }}
          className="inline-flex h-14 w-full items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md"
        >
          <span className="font-bold">RESET</span>
        </button>
      </div>

      <p className="mt-4 text-center text-xs font-medium text-white/40">
        Tap the screen to jump. Points are saved to your account!
      </p>
    </div>
  );
}
