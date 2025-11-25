import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trophy, Zap, Trash2, CheckCircle, Settings, AlertTriangle, Play, Pause } from 'lucide-react';
import { Task, ThemeMode, MascotType, UserStats, MascotMessage } from './types';
import { THEMES, MASCOTS, FUNNY_MESSAGES, BADGES } from './constants';
import { generateMascotComment, generateTaskBadge } from './services/geminiService';
import Mascot from './components/Mascot';
import Timer from './components/Timer';
import DayProgress from './components/DayProgress';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pp_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('pp_stats');
    return saved ? JSON.parse(saved) : { xp: 0, level: 1, tasksCompleted: 0, streakDays: 0, badges: [] };
  });

  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.CARTOON);
  const [mascot, setMascot] = useState<MascotType>(MascotType.ROBOT);
  const [mascotMessage, setMascotMessage] = useState<MascotMessage>({ text: "I'm watching you.", emotion: 'judging' });
  
  // Active Task for Timer
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isPanicMode, setIsPanicMode] = useState(false);

  // New Task Inputs
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(15);
  const [showSettings, setShowSettings] = useState(false);

  // Visibility Tracking for "Procrastination Detector"
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeTaskId) {
         // User Tabbed out!
         handleMascotSpeak("Where are you going? Your task is crying!", 'angry');
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [activeTaskId]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('pp_tasks', JSON.stringify(tasks));
    localStorage.setItem('pp_stats', JSON.stringify(stats));
  }, [tasks, stats]);

  // Helper: Mascot Speak
  const handleMascotSpeak = useCallback(async (text: string, emotion: MascotMessage['emotion'], useAI = false, context = "") => {
    if (useAI) {
        setMascotMessage({ text: "Thinking of a roast...", emotion: 'judging' });
        const aiText = await generateMascotComment(
            context as any, 
            text, // Using text param as prompt context usually, reusing params for simplicity
            mascot
        );
        setMascotMessage({ text: aiText, emotion });
    } else {
        setMascotMessage({ text, emotion });
    }
  }, [mascot]);

  // Task Handlers
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newId = Date.now().toString();
    const tempTask: Task = {
      id: newId,
      text: newTaskText,
      category: 'General',
      durationMinutes: newTaskDuration,
      timeLeft: newTaskDuration * 60,
      completed: false,
      createdAt: Date.now(),
      priority: 'medium',
      aiRoast: 'Loading roast...'
    };

    setTasks([...tasks, tempTask]);
    setNewTaskText('');
    
    // AI Enhancements
    handleMascotSpeak(newTaskText, 'judging', true, 'add_task');
    const badge = await generateTaskBadge(newTaskText);
    
    setTasks(prev => prev.map(t => t.id === newId ? { ...t, aiRoast: badge } : t));
  };

  const toggleTaskTimer = (id: string) => {
    if (activeTaskId === id) {
        setActiveTaskId(null);
        handleMascotSpeak("Giving up already?", 'bored');
    } else {
        setActiveTaskId(id);
        const randomMsg = FUNNY_MESSAGES.timerStart[Math.floor(Math.random() * FUNNY_MESSAGES.timerStart.length)];
        handleMascotSpeak(randomMsg, 'happy');
    }
  };

  const completeTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setTasks(tasks.map(t => t.id === id ? { ...t, completed: true } : t));
    setActiveTaskId(null);
    setIsPanicMode(false); // End panic if task done

    // Stats
    const xpGain = isPanicMode ? 50 : 20;
    setStats(prev => ({
        ...prev,
        xp: prev.xp + xpGain,
        tasksCompleted: prev.tasksCompleted + 1,
    }));

    // Celebration
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
    
    handleMascotSpeak(task.text, 'happy', true, 'complete_task');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  const triggerPanicMode = () => {
    setIsPanicMode(true);
    handleMascotSpeak("PANIC MODE ACTIVATED! MOVE MOVE MOVE!", 'panic', true, 'panic');
    
    // Auto start the first available task if none active
    if (!activeTaskId) {
        const firstTodo = tasks.find(t => !t.completed);
        if (firstTodo) setActiveTaskId(firstTodo.id);
    }

    // End panic mode after 2 minutes automatically
    setTimeout(() => {
        setIsPanicMode(false);
        handleMascotSpeak("Panic over. Did you survive?", 'bored');
    }, 120000);
  };

  // Timer Tick
  const onTick = useCallback(() => {
    if (!activeTaskId) return;
    
    setTasks(prev => prev.map(t => {
        if (t.id === activeTaskId) {
            if (t.timeLeft <= 0) {
                // Time up!
                return t; 
            }
            return { ...t, timeLeft: t.timeLeft - 1 };
        }
        return t;
    }));
  }, [activeTaskId]);

  const currentTheme = THEMES[theme];
  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isPanicMode ? 'bg-red-500 animate-pulse' : currentTheme.bg} ${currentTheme.text} ${currentTheme.font} p-4 md:p-8 pb-32`}>
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
            <h1 className={`text-3xl md:text-5xl font-display uppercase tracking-widest ${isPanicMode ? 'text-white' : ''}`}>
                Procrastination Police
            </h1>
            <p className={`text-sm md:text-base opacity-80 ${isPanicMode ? 'text-white' : ''}`}>
                {isPanicMode ? "HURRY UP OR ELSE!" : "We roast, you work."}
            </p>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full border-2 border-black bg-white hover:bg-gray-100">
            <Settings size={24} className="text-black" />
        </button>
      </header>

      {/* Settings Modal (Simplified as a dropdown/panel for single file) */}
      {showSettings && (
        <div className={`mb-8 p-4 rounded-xl border-4 border-black bg-white shadow-xl relative z-10`}>
            <h3 className="font-bold text-lg mb-2 text-black">App Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">Theme</label>
                    <div className="flex gap-2 mt-1">
                        {Object.keys(THEMES).map(t => (
                            <button 
                                key={t} 
                                onClick={() => setTheme(t as ThemeMode)}
                                className={`px-3 py-1 rounded border-2 border-black text-xs ${theme === t ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                            >
                                {t.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">Mascot</label>
                    <div className="flex gap-2 mt-1">
                        {Object.keys(MASCOTS).map(m => (
                            <button 
                                key={m} 
                                onClick={() => setMascot(m as MascotType)}
                                className={`px-3 py-1 rounded border-2 border-black text-xs ${mascot === m ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                            >
                                {MASCOTS[m as MascotType].name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">XP: {stats.xp} | Lvl: {Math.floor(stats.xp / 100) + 1}</p>
            </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="max-w-4xl mx-auto">
        
        <DayProgress />

        {/* Panic Button */}
        {!isPanicMode && (
            <button 
                onClick={triggerPanicMode}
                className="w-full mb-8 py-4 bg-red-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl flex items-center justify-center gap-2 hover:translate-y-1 hover:shadow-none transition-all active:bg-red-600 group"
            >
                <AlertTriangle size={32} className="text-yellow-300 group-hover:animate-shake" />
                <span className="text-2xl font-bold text-white uppercase font-display">Panic Mode (2 Min)</span>
            </button>
        )}

        {/* Active Timer Display */}
        {activeTask && (
            <Timer 
                taskId={activeTask.id}
                totalTime={activeTask.durationMinutes}
                timeLeft={activeTask.timeLeft}
                isActive={!!activeTaskId}
                onTick={onTick}
                onToggle={() => setActiveTaskId(null)}
                onStop={() => setActiveTaskId(null)}
                theme={theme}
                themeClasses={currentTheme}
            />
        )}

        {/* Task Input */}
        <form onSubmit={addTask} className={`flex gap-2 mb-8 ${currentTheme.card} p-2 rounded-full border-2 border-black shadow-lg`}>
            <input 
                type="text" 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What are you avoiding today?"
                className="flex-1 bg-transparent px-4 outline-none text-black placeholder-gray-500"
            />
            <select 
                value={newTaskDuration} 
                onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                className="bg-gray-100 rounded-lg px-2 text-sm border border-gray-300 text-black hidden md:block"
            >
                <option value={5}>5m</option>
                <option value={15}>15m</option>
                <option value={30}>30m</option>
                <option value={60}>1h</option>
            </select>
            <button type="submit" className={`${currentTheme.primary} text-white p-3 rounded-full border-2 border-black hover:scale-110 transition-transform`}>
                <Plus size={24} />
            </button>
        </form>

        {/* Task List */}
        <div className="space-y-4">
            {tasks.length === 0 && (
                <div className="text-center opacity-50 py-10">
                    <p className="text-xl">No tasks? You're either efficient or lying.</p>
                </div>
            )}
            
            {tasks.filter(t => !t.completed).map(task => (
                <div key={task.id} className={`${currentTheme.card} ${currentTheme.border} ${currentTheme.shadow} p-4 rounded-xl flex items-center gap-4 transition-all hover:-translate-y-1 relative group`}>
                    
                    {/* Badge */}
                    <div className="absolute -top-3 -right-2 bg-yellow-200 text-black text-[10px] font-bold px-2 py-1 border-2 border-black rounded shadow-sm transform rotate-3 max-w-[150px] truncate">
                        {task.aiRoast || "Loading..."}
                    </div>

                    <button 
                        onClick={() => completeTask(task.id)}
                        className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center hover:bg-green-400 transition-colors"
                    >
                        <CheckCircle size={16} className="text-transparent hover:text-black" />
                    </button>

                    <div className="flex-1">
                        <h3 className={`font-bold text-lg leading-none ${currentTheme.text === 'text-gray-200' ? 'text-gray-900 dark:text-gray-100' : 'text-black'}`}>{task.text}</h3>
                        <p className="text-xs opacity-60 mt-1">{task.durationMinutes} min • {Math.floor(task.timeLeft / 60)}m left</p>
                    </div>

                    <div className="flex gap-2">
                         <button 
                            onClick={() => toggleTaskTimer(task.id)}
                            className={`p-2 rounded-lg border-2 border-black ${activeTaskId === task.id ? 'bg-yellow-400' : 'bg-gray-100'} hover:bg-yellow-300`}
                        >
                            {activeTaskId === task.id ? <Pause size={18} className="text-black"/> : <Play size={18} className="text-black"/>}
                        </button>
                        <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-2 rounded-lg border-2 border-black bg-red-100 hover:bg-red-400 group-hover:opacity-100 opacity-0 transition-all"
                        >
                            <Trash2 size={18} className="text-black" />
                        </button>
                    </div>
                </div>
            ))}
            
            {/* Completed Section (Collapsed by default logic visual only) */}
            {tasks.some(t => t.completed) && (
                 <div className="mt-8 pt-8 border-t-4 border-dashed border-gray-400 opacity-60">
                    <h4 className="font-bold mb-4 uppercase">Graveyard of Completed Tasks</h4>
                    {tasks.filter(t => t.completed).map(task => (
                        <div key={task.id} className="flex items-center gap-2 mb-2 line-through decoration-2">
                             <CheckCircle size={16} />
                             <span>{task.text}</span>
                        </div>
                    ))}
                 </div>
            )}
        </div>

      </div>

      {/* Floating Mascot */}
      <Mascot 
        type={mascot} 
        message={mascotMessage} 
        theme={theme}
        isPanic={isPanicMode}
      />
      
    </div>
  );
};

export default App;