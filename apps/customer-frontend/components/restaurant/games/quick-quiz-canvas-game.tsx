"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { themeRgb, themeRgba } from './canvas-theme';
import type { GameAwardHandler } from './game-award';

type QuickQuizCanvasGameProps = {
  onAward: GameAwardHandler;
};

type QuizQuestion = {
  prompt: string;
  options: [string, string, string, string];
  answerIndex: number;
};

type OptionArea = {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ');
  let line = '';
  let cursorY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
      continue;
    }

    line = testLine;
  }

  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }

  return cursorY;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function QuickQuizCanvasGame({ onAward }: QuickQuizCanvasGameProps) {
  const questions = useMemo<QuizQuestion[]>(
    () => [
      {
        prompt: 'What is hummus mainly made from?',
        options: ['Chickpeas', 'Potatoes', 'Beef', 'Rice'],
        answerIndex: 0,
      },
      {
        prompt: 'Which one is usually a dessert?',
        options: ['Panna cotta', 'Halloumi', 'Fattoush', 'Salmon'],
        answerIndex: 0,
      },
      {
        prompt: "Which spice mix is common in Middle Eastern cuisine?",
        options: ["Za'atar", 'Curry powder', 'Paprika only', 'Wasabi'],
        answerIndex: 0,
      },
      {
        prompt: 'Which drink is usually non-alcoholic here?',
        options: ['Mocktail spritz', 'Whisky', 'Wine', 'Beer'],
        answerIndex: 0,
      },
    ],
    [],
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const areasRef = useRef<OptionArea[]>([]);
  const awardedRef = useRef(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const pointsPerCorrect = 30;
  const maxPoints = questions.length * pointsPerCorrect;

  const themeRef = useRef({
    brand: 'rgb(15, 118, 110)',
    accent: 'rgb(245, 170, 66)',
    ink: 'rgb(15, 23, 42)',
    muted: 'rgb(94, 108, 132)',
    surface: 'rgb(255, 255, 255)',
    soft: 'rgba(15, 118, 110, 0.12)',
    border: 'rgba(226, 232, 240, 0.9)',
  });

  useEffect(() => {
    themeRef.current = {
      brand: themeRgb('--brand', '15 118 110'),
      accent: themeRgb('--accent', '245 170 66'),
      ink: themeRgb('--ink', '15 23 42'),
      muted: themeRgb('--muted', '94 108 132'),
      surface: themeRgb('--surface', '255 255 255'),
      soft: themeRgba('--brand', '15 118 110', 0.12),
      border: themeRgba('--border', '226 232 240', 0.9),
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    areasRef.current = [];

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = themeRef.current.soft;
    ctx.fillRect(0, 0, width, height);

    const isComplete = questionIndex >= questions.length;

    const padding = 46;
    const cardX = padding;
    const cardY = padding;
    const cardW = width - padding * 2;
    const cardH = height - padding * 2;

    roundRect(ctx, cardX, cardY, cardW, cardH, 34);
    ctx.fillStyle = themeRgba('--card-surface', '255 255 255', 0.92);
    ctx.fill();
    ctx.strokeStyle = themeRef.current.border;
    ctx.lineWidth = 5;
    ctx.stroke();

    const titleY = cardY + 56;

    ctx.fillStyle = themeRef.current.brand;
    ctx.font = '800 18px ui-sans-serif, system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      isComplete
        ? `Quick Quiz • Complete`
        : `Quick Quiz • Q${questionIndex + 1}/${questions.length}`,
      cardX + 32,
      titleY,
    );

    if (isComplete) {
      const points = Math.min(score * pointsPerCorrect, maxPoints);

      ctx.save();
      ctx.fillStyle = themeRef.current.ink;
      ctx.font = '900 44px ui-sans-serif, system-ui';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('Quiz complete!', cardX + 32, titleY + 48);

      ctx.fillStyle = themeRef.current.muted;
      ctx.font = '800 26px ui-sans-serif, system-ui';
      ctx.fillText(`Correct: ${score}/${questions.length}`, cardX + 32, titleY + 116);
      ctx.fillText(`Points: +${points}`, cardX + 32, titleY + 154);

      ctx.fillStyle = themeRef.current.muted;
      ctx.font = '700 18px ui-sans-serif, system-ui';
      wrapText(
        ctx,
        'Restart any time to try again and improve your score.',
        cardX + 32,
        titleY + 210,
        cardW - 64,
        26,
      );
      ctx.restore();
      return;
    }

    const current = questions[questionIndex];
    ctx.fillStyle = themeRef.current.ink;
    ctx.font = '800 30px ui-sans-serif, system-ui';
    const questionBottom = wrapText(
      ctx,
      current.prompt,
      cardX + 32,
      titleY + 36,
      cardW - 64,
      38,
    );

    const optionTop = questionBottom + 22;
    const optionGap = 16;
    const optionH = 86;

    for (let index = 0; index < current.options.length; index += 1) {
      const x = cardX + 32;
      const y = optionTop + index * (optionH + optionGap);
      const w = cardW - 64;
      const h = optionH;

      const isSelected = selectedIndex === index;
      const isCorrect = index === current.answerIndex;
      const showFeedback = selectedIndex !== null;

      let fill = themeRgba('--card-surface', '255 255 255', 0.88);
      let stroke = themeRef.current.border;
      let text = themeRef.current.ink;

      if (showFeedback && isSelected && isCorrect) {
        fill = 'rgba(16, 185, 129, 0.22)';
        stroke = 'rgba(16, 185, 129, 0.6)';
        text = 'rgb(6, 95, 70)';
      } else if (showFeedback && isSelected && !isCorrect) {
        fill = 'rgba(239, 68, 68, 0.18)';
        stroke = 'rgba(239, 68, 68, 0.55)';
        text = 'rgb(127, 29, 29)';
      } else if (showFeedback && isCorrect) {
        fill = 'rgba(16, 185, 129, 0.12)';
        stroke = 'rgba(16, 185, 129, 0.35)';
      } else if (isSelected) {
        fill = themeRgba('--brand', '15 118 110', 0.12);
        stroke = themeRgba('--brand', '15 118 110', 0.55);
      }

      roundRect(ctx, x, y, w, h, 24);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = text;
      ctx.font = '700 22px ui-sans-serif, system-ui';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      wrapText(ctx, current.options[index], x + 22, y + h / 2 - 12, w - 44, 26);

      areasRef.current.push({ index, x, y, w, h });
    }

    ctx.save();
    ctx.fillStyle = themeRef.current.muted;
    ctx.font = '700 18px ui-sans-serif, system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(`Score: ${score}/${questions.length}`, cardX + 32, cardY + cardH - 34);
    ctx.textAlign = 'right';
    ctx.fillText(`Max: ${maxPoints} pts`, cardX + cardW - 32, cardY + cardH - 34);
    ctx.restore();
  }, [maxPoints, pointsPerCorrect, questionIndex, questions, score, selectedIndex]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleSelect = useCallback((optionIndex: number) => {
    if (isLocked) return;
    if (questionIndex >= questions.length) return;

    const current = questions[questionIndex];
    setIsLocked(true);
    setSelectedIndex(optionIndex);

    const isCorrect = optionIndex === current.answerIndex;
    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(nextScore);

    window.setTimeout(() => {
      const nextQuestion = questionIndex + 1;

      if (nextQuestion >= questions.length) {
        const points = Math.min(nextScore * pointsPerCorrect, maxPoints);
        if (!awardedRef.current) {
          awardedRef.current = true;
          onAward({ points, score: nextScore, label: 'Quick Quiz' });
        }
        setQuestionIndex(nextQuestion);
        setIsLocked(false);
        return;
      }

      setQuestionIndex(nextQuestion);
      setSelectedIndex(null);
      setIsLocked(false);
    }, 750);
  }, [isLocked, maxPoints, onAward, pointsPerCorrect, questionIndex, questions, score]);

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (questionIndex >= questions.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const area = areasRef.current.find((item) => x >= item.x && x <= item.x + item.w && y >= item.y && y <= item.y + item.h);
    if (!area) return;
    handleSelect(area.index);
  }, [handleSelect, questionIndex, questions.length]);

  const restart = useCallback(() => {
    awardedRef.current = false;
    setQuestionIndex(0);
    setScore(0);
    setSelectedIndex(null);
    setIsLocked(false);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <canvas
        ref={canvasRef}
        width={640}
        height={720}
        onPointerDown={onPointerDown}
        className="h-auto w-full touch-none select-none overflow-hidden rounded-[32px] border border-[rgba(var(--card-border),0.9)] bg-white/80 shadow-sm"
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={restart}
          className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(var(--border),0.9)] bg-white/70 px-4 py-2.5 text-sm font-medium text-[rgb(var(--ink))] transition-all hover:bg-white"
        >
          Restart quiz
        </button>
        <div className="rounded-full bg-[rgba(var(--brand-soft),0.35)] px-4 py-2.5 text-center text-sm font-semibold text-[rgb(var(--ink))]">
          Points per correct: {pointsPerCorrect}
        </div>
      </div>
    </div>
  );
}
