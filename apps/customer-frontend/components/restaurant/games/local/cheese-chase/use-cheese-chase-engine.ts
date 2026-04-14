import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  CHEESE_CHASE_CONFIG, 
  GameState, 
  getLevelConfig, 
  calculateAwardPoints 
} from './cheese-chase-model';

interface EngineProps {
  onAward: (award: { points: number; score: number; label: string }) => void;
}

export function useCheeseChaseEngine({ onAward }: EngineProps) {
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [level, setLevel] = useState(1);
  const [maze, setMaze] = useState<boolean[][][]>([]);
  const [mousePos, setMousePos] = useState({ col: 0, row: 0 });
  const [cheesePos, setCheesePos] = useState({ col: 0, row: 0 });
  const [traps, setTraps] = useState<{ col: number; row: number }[]>([]);
  const [isStuck, setIsStuck] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | undefined>();
  const [score, setScore] = useState(0);

  const containerRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Maze Generation (Recursive Backtracking)
  const generateMaze = useCallback((cols: number, rows: number) => {
    // Initialize maze: all walls true [top, right, bottom, left]
    const grid: boolean[][][] = Array.from({ length: rows }, () => 
      Array.from({ length: cols }, () => [true, true, true, true])
    );

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const stack: [number, number][] = [];

    const startR = 0;
    const startC = 0;
    visited[startR][startC] = true;
    stack.push([startR, startC]);

    while (stack.length > 0) {
      const [r, c] = stack[stack.length - 1];
      const neighbors: [number, number, number][] = []; // [row, col, wallIndex]

      // Find unvisited neighbors
      if (r > 0 && !visited[r - 1][c]) neighbors.push([r - 1, c, 0]); // Top
      if (c < cols - 1 && !visited[r][c + 1]) neighbors.push([r, c + 1, 1]); // Right
      if (r < rows - 1 && !visited[r + 1][c]) neighbors.push([r + 1, c, 2]); // Bottom
      if (c > 0 && !visited[r][c - 1]) neighbors.push([r, c - 1, 3]); // Left

      if (neighbors.length > 0) {
        const [nextR, nextC, wallIdx] = neighbors[Math.floor(Math.random() * neighbors.length)];
        // Remove walls
        grid[r][c][wallIdx] = false;
        grid[nextR][nextC][(wallIdx + 2) % 4] = false;

        visited[nextR][nextC] = true;
        stack.push([nextR, nextC]);
      } else {
        stack.pop();
      }
    }

    return grid;
  }, []);

  const spawnTraps = useCallback((cols: number, rows: number, count: number) => {
    const newTraps: { col: number; row: number }[] = [];
    for (let i = 0; i < count; i++) {
       newTraps.push({
          col: Math.floor(Math.random() * (cols - 1)) + 1,
          row: Math.floor(Math.random() * (rows - 1)) + 1
       });
    }
    return newTraps;
  }, []);

  const startLevel = useCallback((l: number) => {
    const config = getLevelConfig(l);
    const newMaze = generateMaze(config.gridSize.cols, config.gridSize.rows);
    const newTraps = spawnTraps(config.gridSize.cols, config.gridSize.rows, config.traps ?? 0);
    
    setMaze(newMaze);
    setTraps(newTraps);
    setIsStuck(false);
    setMousePos({ col: 0, row: 0 });
    // Cheese is always at the bottom-right corner or random far point
    setCheesePos({ 
      col: config.gridSize.cols - 1, 
      row: config.gridSize.rows - 1 
    });
    setTimeLeft(config.timeLimit);
    setGameState('PLAYING');
  }, [generateMaze]);

  // Initial Level Generation
  useEffect(() => {
    startLevel(1);
  }, [startLevel]);

  const startGame = useCallback(() => {
    setLevel(1);
    setScore(0);
    startLevel(1);
  }, [startLevel]);

  const moveMouse = useCallback((dCol: number, dRow: number) => {
    if (gameState !== 'PLAYING' || isStuck) return;

    setMousePos(prev => {
      const { col, row } = prev;
      const nextCol = col + dCol;
      const nextRow = row + dRow;

      // Check bounds
      if (nextCol < 0 || nextRow < 0 || nextRow >= maze.length || nextCol >= maze[0].length) return prev;

      // Check walls
      const walls = maze[row][col];
      if (dRow === -1 && walls[0]) return prev; // Up
      if (dCol === 1 && walls[1]) return prev; // Right
      if (dRow === 1 && walls[2]) return prev; // Down
      if (dCol === -1 && walls[3]) return prev; // Left

      // Check Traps
      const hitTrap = traps.some(t => t.col === nextCol && t.row === nextRow);
      if (hitTrap) {
         setIsStuck(true);
         setTimeout(() => setIsStuck(false), 800);
      }

      // Check for win
      if (nextCol === cheesePos.col && nextRow === cheesePos.row) {
        if (level >= CHEESE_CHASE_CONFIG.MAX_LEVEL) {
           setGameState('GAMEOVER');
        } else {
           setGameState('INTER-LEVEL');
           setScore(s => s + 1);
        }
      }

      return { col: nextCol, row: nextRow };
    });
  }, [gameState, maze, cheesePos, level, traps, isStuck]);

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w': moveMouse(0, -1); break;
        case 'ArrowDown':
        case 's': moveMouse(0, 1); break;
        case 'ArrowLeft':
        case 'a': moveMouse(-1, 0); break;
        case 'ArrowRight':
        case 'd': moveMouse(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveMouse]);

  // Handle Timer
  useEffect(() => {
    if (gameState === 'PLAYING' && timeLeft !== undefined) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev !== undefined && prev <= 1) {
            setGameState('GAMEOVER');
            return 0;
          }
          return prev !== undefined ? prev - 1 : undefined;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, timeLeft]);

  // Handle Level Up
  useEffect(() => {
    if (gameState === 'INTER-LEVEL') {
      const nextLevel = level + 1;
      const timer = setTimeout(() => {
        setLevel(nextLevel);
        startLevel(nextLevel);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, level, startLevel]);

  // Handle Game Over
  useEffect(() => {
    if (gameState === 'GAMEOVER') {
      const points = calculateAwardPoints(level + (level >= CHEESE_CHASE_CONFIG.MAX_LEVEL ? 1 : 0));
      onAward({
        points,
        score: level,
        label: `LEVEL ${level} REACHED`
      });
    }
  }, [gameState, level, onAward]);

  return {
    gameState,
    level,
    maze,
    mousePos,
    cheesePos,
    timeLeft,
    score,
    traps,
    isStuck,
    startGame,
    moveMouse,
    containerRef,
    config: getLevelConfig(level)
  };
}
