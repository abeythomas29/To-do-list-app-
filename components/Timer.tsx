import React, { useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { ThemeMode } from '../types';

interface TimerProps {
  taskId: string;
  totalTime: number; // minutes
  timeLeft: number; // seconds
  isActive: boolean;
  onTick: () => void;
  onToggle: () => void;
  onStop: () => void;
  theme: ThemeMode;
  themeClasses: any;
}

const Timer: React.FC<TimerProps> = ({ 
  taskId, 
  totalTime, 
  timeLeft, 
  isActive, 
  onTick, 
  onToggle, 
  onStop,
  theme,
  themeClasses
}) => {

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(onTick, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 100 - (timeLeft / (totalTime * 60)) * 100;

  return (
    <div className={`p-4 rounded-xl border-2 ${themeClasses.border} ${themeClasses.card} mb-4 flex flex-col items-center justify-center gap-4`}>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border-2 border-black">
            <div 
                className={`h-full transition-all duration-1000 ${isActive ? 'animate-pulse' : ''} ${theme === ThemeMode.DARK_SARCASTIC ? 'bg-purple-600' : 'bg-green-500'}`} 
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        <div className={`text-5xl ${themeClasses.font} font-bold tabular-nums tracking-widest`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex gap-4">
            <button 
                onClick={onToggle}
                className={`p-3 rounded-full border-2 border-black hover:scale-105 active:scale-95 transition-transform ${isActive ? 'bg-yellow-400' : 'bg-green-400'}`}
            >
                {isActive ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button 
                onClick={onStop}
                className="p-3 rounded-full border-2 border-black bg-red-400 hover:scale-105 active:scale-95 transition-transform"
            >
                <Square size={24} />
            </button>
        </div>
        
        {isActive && (
            <p className="text-sm font-bold animate-pulse text-center">
                🚫 NO INSTAGRAM allowed!
            </p>
        )}
    </div>
  );
};

export default Timer;