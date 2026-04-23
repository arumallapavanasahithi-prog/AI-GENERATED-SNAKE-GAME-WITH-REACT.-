import { useEffect, useRef, useState, useCallback } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 25;
const CELL_SIZE = 20; // 500 / 25
const FPS = 10;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Directions
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const pendingDirRef = useRef<Point>({ x: 1, y: 0 });
  
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
  const foodRef = useRef<Point>({ x: 15, y: 15 });
  
  const generateFoodFrame = useCallback(() => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      if (!snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    foodRef.current = newFood;
  }, []);

  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dirRef.current = { x: 1, y: 0 };
    pendingDirRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFoodFrame();
  }, [generateFoodFrame]);

  useEffect(() => {
    generateFoodFrame();
  }, [generateFoodFrame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      const currentDir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y === 0) pendingDirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y === 0) pendingDirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x === 0) pendingDirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x === 0) pendingDirRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          if (!gameOver) setIsPaused(prev => !prev);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    let timeoutId: number;
    let lastTime = performance.now();
    
    const gameLoop = (time: number) => {
      if (time - lastTime >= 1000 / FPS) {
        lastTime = time;
        
        dirRef.current = pendingDirRef.current;
        const newDir = dirRef.current;
        const head = snakeRef.current[0];
        const newHead = { x: head.x + newDir.x, y: head.y + newDir.y };
        
        // Wall collision
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return;
        }
        
        // Self collision
        if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return;
        }
        
        const newSnake = [newHead, ...snakeRef.current];
        
        // Food collision
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          setScore(s => s + 10);
          generateFoodFrame();
        } else {
          newSnake.pop();
        }
        
        snakeRef.current = newSnake;
        
        // Draw
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Background
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Grid lines (subtle)
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 1;
            for (let i = 0; i <= canvas.width; i += CELL_SIZE) {
              ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }

            // Draw Food
            ctx.fillStyle = '#ec4899'; // pink-500
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ec4899';
            ctx.fillRect(foodRef.current.x * CELL_SIZE + 2, foodRef.current.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
            ctx.shadowBlur = 0;

            // Draw Snake
            newSnake.forEach((segment, index) => {
              ctx.fillStyle = index === 0 ? '#06b6d4' : '#22d3ee'; // cyan-500 : cyan-400
              if (index === 0) {
                 ctx.shadowBlur = 15;
                 ctx.shadowColor = '#06b6d4';
              } else {
                 ctx.shadowBlur = 5;
                 ctx.shadowColor = '#22d3ee';
              }
              ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
              ctx.shadowBlur = 0;
            });
          }
        }
      }
      
      timeoutId = requestAnimationFrame(gameLoop);
    };
    
    timeoutId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(timeoutId);
  }, [gameOver, isPaused, generateFoodFrame]);

  // Initial draw before loop starts or when game is over
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ec4899';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ec4899';
        ctx.fillRect(foodRef.current.x * CELL_SIZE + 2, foodRef.current.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        ctx.shadowBlur = 0;

        snakeRef.current.forEach((segment, index) => {
          ctx.fillStyle = index === 0 ? '#06b6d4' : '#22d3ee';
          ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        });
      }
    }
  }, [gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[500px] mb-4 text-cyan-400 font-mono tracking-widest text-xl drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
        <span>SCORE: {score.toString().padStart(4, '0')}</span>
        <span>{isPaused ? 'PAUSED' : 'SNAKE'}</span>
      </div>
      <div className="relative w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] border border-cyan-500/50 rounded shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={500} 
          className="w-full h-full bg-black block" 
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-pink-500 text-center mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] tracking-widest">SYSTEM<br/>CRASH</h2>
            <p className="text-cyan-400 font-mono mb-8 opacity-80">FINAL SCORE: {score}</p>
            <div className="relative w-full h-0 z-20 pointer-events-none flex justify-center">
              <span className="absolute text-[#93c5fd] font-sans font-bold text-2xl tracking-normal normal-case" style={{ WebkitTextStroke: '1px black', transform: 'translate(-45px, -30px)' }}>snake game</span>
              <span className="absolute text-[#93c5fd] font-sans font-bold text-2xl tracking-normal normal-case" style={{ WebkitTextStroke: '1px black', transform: 'translate(45px, -15px)' }}>snake game</span>
            </div>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-cyan-950/40 border border-cyan-400 text-cyan-400 font-mono tracking-widest hover:bg-cyan-900/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:text-white transition-all rounded"
            >
              REBOOT
            </button>
          </div>
        )}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
             <h2 className="text-3xl font-bold text-cyan-400 text-center drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] tracking-widest">PAUSED</h2>
             <p className="font-mono text-sm text-cyan-200 mt-4 opacity-70">Press SPACE to resume</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-neutral-500 justify-center">
        <span>[W, A, S, D] / [ARROWS] = MOVE</span>
        <span>[SPACE] = PAUSE</span>
      </div>
    </div>
  );
}
