/**
 * Memory Match - Hook Engine
 * Main game logic for card matching.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GameState, 
  Card, 
  MEMORY_MATCH_CONFIG, 
  getLevelConfig, 
  calculateAwardPoints 
} from './memory-match-model';

interface MemoryMatchEngineProps {
  onAward: (award: { points: number; score: number; label: string }) => void;
}

export function useMemoryMatchEngine({ onAward }: MemoryMatchEngineProps) {
  const [gameState, setGameState] = useState<GameState>('START');
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const containerRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const config = getLevelConfig(level);

  // Auto-start on mount
  useEffect(() => {
    if (gameState === 'START') {
        initLevel(1);
    }
  }, []);

  // Initialize Level
  const initLevel = useCallback((lvl: number) => {
    const cfg = getLevelConfig(lvl);
    // Slice only the required number of symbols from the pool
    const selectedSymbols = MEMORY_MATCH_CONFIG.SYMBOL_POOL.slice(0, cfg.numPairs);
    const pairs = [...selectedSymbols, ...selectedSymbols].sort(() => Math.random() - 0.5);
    
    const newCards: Card[] = pairs.map((val, i) => ({
      id: i,
      value: val,
      isFlipped: false,
      isMatched: false,
      index: i,
    }));

    setCards(newCards);
    setFlippedIndices([]);
    setScore(0);
    setTimeLeft(cfg.timeLimit);
    setGameState('PLAYING');
    setIsProcessing(false);
  }, []);

  const startGame = () => {
    setLevel(1);
    initLevel(1);
  };

  const handleCardClick = (index: number) => {
    if (gameState !== 'PLAYING' || isProcessing) return;
    if (cards[index].isMatched || cards[index].isFlipped) return;
    if (flippedIndices.length >= 2) return;

    // Flip card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newFlipped;
      
      if (cards[firstIdx].value === cards[secondIdx].value) {
        // MATCH!
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            return updated;
          });
          setScore(s => s + MEMORY_MATCH_CONFIG.POINTS_PER_PAIR);
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 500);
      } else {
        // NO MATCH :(
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  // Check Win Condition
  useEffect(() => {
    if (gameState === 'PLAYING' && cards.length > 0 && cards.every(c => c.isMatched)) {
      setGameState('INTER-LEVEL');
      setTimeout(() => {
        setLevel(l => l + 1);
        initLevel(level + 1);
      }, 1500);
    }
  }, [cards, gameState, level, initLevel]);

  // Timer
  useEffect(() => {
    if (gameState !== 'PLAYING' || timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('GAMEOVER');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Award
  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      const pairsMatched = cards.filter(c => c.isMatched).length / 2;
      onAward({
        points: calculateAwardPoints(pairsMatched, level),
        score: score,
        label: `Solved ${level} Stages`
      });
    }
  }, [gameState, level, score, cards, onAward]);

  return {
    gameState,
    level,
    cards,
    score,
    timeLeft,
    startGame,
    handleCardClick,
    containerRef,
    config
  };
}
