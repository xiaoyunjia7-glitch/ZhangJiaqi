import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Timer, 
  RotateCcw, 
  Play, 
  Info, 
  ChevronRight,
  Eye,
  Zap
} from 'lucide-react';

// --- Types ---
interface Color {
  r: number;
  g: number;
  b: number;
}

enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

// --- Constants ---
const GRID_SIZE = 5; // 5x5 as requested
const INITIAL_TIME = 30;
const INITIAL_DIFF = 40;
const MIN_DIFF = 2;

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [level, setLevel] = useState(1);
  const [colors, setColors] = useState<{ base: Color; target: Color; targetIndex: number }>({
    base: { r: 0, g: 0, b: 0 },
    target: { r: 0, g: 0, b: 0 },
    targetIndex: 0
  });
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastDiff, setLastDiff] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Helpers ---
  const generateLevel = useCallback(() => {
    const r = Math.floor(Math.random() * 200) + 20;
    const g = Math.floor(Math.random() * 200) + 20;
    const b = Math.floor(Math.random() * 200) + 20;
    
    // Difficulty scaling: difference decreases as level increases
    const diff = Math.max(MIN_DIFF, INITIAL_DIFF - Math.floor(level / 2));
    setLastDiff(diff);

    const isPositive = Math.random() > 0.5;
    const targetR = isPositive ? Math.min(255, r + diff) : Math.max(0, r - diff);
    const targetG = isPositive ? Math.min(255, g + diff) : Math.max(0, g - diff);
    const targetB = isPositive ? Math.min(255, b + diff) : Math.max(0, b - diff);

    setColors({
      base: { r, g, b },
      target: { r: targetR, g: targetG, b: targetB },
      targetIndex: Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE))
    });
  }, [level]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(INITIAL_TIME);
    setGameState(GameState.PLAYING);
    generateLevel();
  };

  const handleBlockClick = (index: number) => {
    if (gameState !== GameState.PLAYING) return;

    if (index === colors.targetIndex) {
      // Correct choice
      setScore(prev => prev + 1);
      setLevel(prev => prev + 1);
      setTimeLeft(prev => Math.min(INITIAL_TIME, prev + 2)); // Bonus time
      generateLevel();
    } else {
      // Wrong choice
      setTimeLeft(prev => Math.max(0, prev - 3)); // Penalty
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (gameState === GameState.PLAYING && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState(GameState.GAMEOVER);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  // --- Render Helpers ---
  const colorToCss = (c: Color) => `rgb(${c.r}, ${c.g}, ${c.b})`;

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <Eye className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">Color Sense</h1>
        </div>
        
        {gameState === GameState.PLAYING && (
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-black/40 tracking-widest">Score</span>
              <span className="text-2xl font-black tabular-nums">{score}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-black/40 tracking-widest">Time</span>
              <span className={`text-2xl font-black tabular-nums ${timeLeft < 10 ? 'text-red-500' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {gameState === GameState.START && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center py-20"
            >
              <div className="mb-8 relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border-4 border-dashed border-black/10"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-5xl font-black mb-6 tracking-tighter uppercase">
                艺术生的<br />色彩敏感度挑战
              </h2>
              <p className="text-black/60 max-w-md mb-12 leading-relaxed">
                在 5x5 的色块矩阵中寻找那个唯一的“异类”。随着关卡提升，色差将变得微乎其微。准备好挑战你的视觉极限了吗？
              </p>
              <button 
                onClick={startGame}
                className="group relative px-10 py-4 bg-black text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="flex items-center gap-2 relative z-10">
                  <Play className="w-5 h-5 fill-current" />
                  立即开始挑战
                </div>
                <motion.div 
                  className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                />
              </button>
            </motion.div>
          )}

          {gameState === GameState.PLAYING && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Grid */}
              <div 
                className="grid gap-2 w-full max-w-[500px] aspect-square p-2 bg-white rounded-3xl shadow-2xl shadow-black/5"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
              >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBlockClick(i)}
                    className="rounded-xl transition-colors duration-200"
                    style={{ 
                      backgroundColor: i === colors.targetIndex 
                        ? colorToCss(colors.target) 
                        : colorToCss(colors.base) 
                    }}
                  />
                ))}
              </div>

              <div className="mt-12 flex items-center gap-4 text-black/40 text-xs font-bold uppercase tracking-widest">
                <Info className="w-4 h-4" />
                当前色差等级: {lastDiff} RGB 单位
              </div>
            </motion.div>
          )}

          {gameState === GameState.GAMEOVER && (
            <motion.div 
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-12"
            >
              <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-8 rotate-3">
                <Trophy className="text-white w-10 h-10" />
              </div>
              <h2 className="text-4xl font-black mb-2 tracking-tight uppercase">挑战结束</h2>
              <p className="text-black/40 mb-12 font-medium">你的色彩感知能力令人惊叹</p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
                <div className="bg-white p-8 rounded-3xl border border-black/5">
                  <span className="text-[10px] uppercase font-bold text-black/40 tracking-widest block mb-2">最终得分</span>
                  <span className="text-5xl font-black tracking-tighter">{score}</span>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-black/5">
                  <span className="text-[10px] uppercase font-bold text-black/40 tracking-widest block mb-2">最高关卡</span>
                  <span className="text-5xl font-black tracking-tighter">{level}</span>
                </div>
              </div>

              {/* Visualization Explanation */}
              <div className="w-full max-w-md bg-white p-6 rounded-3xl border border-black/5 mb-12 text-left">
                <button 
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center justify-between w-full"
                >
                  <span className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                    <Eye className="w-4 h-4" /> 色彩差异可视化说明
                  </span>
                  <ChevronRight className={`w-5 h-5 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 space-y-4">
                        <p className="text-xs text-black/60 leading-relaxed">
                          在最后一关中，基础色与目标色的 RGB 差值为 <span className="font-bold text-black">{lastDiff}</span>。
                          这意味着在 0-255 的色域中，两者的差异仅占总范围的 <span className="font-bold text-black">{(lastDiff / 255 * 100).toFixed(2)}%</span>。
                        </p>
                        <div className="flex gap-2 h-12">
                          <div className="flex-1 rounded-lg flex items-center justify-center text-[10px] font-bold text-white/50" style={{ backgroundColor: colorToCss(colors.base) }}>BASE</div>
                          <div className="flex-1 rounded-lg flex items-center justify-center text-[10px] font-bold text-white/50" style={{ backgroundColor: colorToCss(colors.target) }}>TARGET</div>
                        </div>
                        <p className="text-[10px] text-black/40 italic">
                          * 这种微小的差异通常只有经过专业训练的艺术生或设计师才能敏锐捕捉。
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button 
                  onClick={startGame}
                  className="flex-1 py-4 bg-black text-white rounded-full font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" /> 重新挑战
                </button>
                <button 
                  onClick={() => setGameState(GameState.START)}
                  className="flex-1 py-4 bg-white border border-black/10 rounded-full font-bold transition-transform hover:scale-105"
                >
                  返回主页
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 w-full p-6 pointer-events-none">
        <div className="max-w-4xl mx-auto flex justify-between items-end">
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 text-[10px] font-bold uppercase tracking-widest pointer-events-auto">
            Art Student Edition v1.0
          </div>
        </div>
      </footer>
    </div>
  );
}
