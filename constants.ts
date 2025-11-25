import { ThemeMode, MascotType } from './types';

export const THEMES = {
  [ThemeMode.CARTOON]: {
    bg: 'bg-yellow-300',
    card: 'bg-white',
    primary: 'bg-blue-500',
    accent: 'bg-pink-500',
    text: 'text-black',
    border: 'border-black border-4',
    shadow: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    font: 'font-cartoon',
  },
  [ThemeMode.DARK_SARCASTIC]: {
    bg: 'bg-gray-900',
    card: 'bg-gray-800',
    primary: 'bg-purple-600',
    accent: 'bg-green-500',
    text: 'text-gray-200',
    border: 'border-gray-600 border-2',
    shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]',
    font: 'font-mono',
  },
  [ThemeMode.CUTE_SILLY]: {
    bg: 'bg-pink-100',
    card: 'bg-white',
    primary: 'bg-teal-300',
    accent: 'bg-orange-300',
    text: 'text-gray-700',
    border: 'border-pink-300 border-4 rounded-3xl',
    shadow: 'shadow-lg',
    font: 'font-cartoon',
  },
};

export const MASCOTS = {
  [MascotType.SLOTH]: {
    name: 'Sid the Sloth',
    emoji: '🦥',
    description: 'Slow but... well, just slow.',
  },
  [MascotType.ROBOT]: {
    name: 'SarcasmBot 3000',
    emoji: '🤖',
    description: 'Calculates your failure probability.',
  },
  [MascotType.COACH]: {
    name: 'Coach Karen',
    emoji: '🧢',
    description: 'Yells at you for breathing wrong.',
  },
};

export const FUNNY_MESSAGES = {
  addTask: [
    "Ah yes, another promise you plan to ignore.",
    "This looks doable... theoretically.",
    "Adding to the pile of shame?",
    "Sure, you'll definitely do this one.",
  ],
  timerStart: [
    "Okay champ, impress me.",
    "Time to earn adulting points.",
    "Don't screw this up.",
    "Focus! The productivity gods are watching.",
  ],
  timerPause: [
    "Really? Again?",
    "Taking a break from doing nothing?",
    "Your future self hates you right now.",
    "I saw that. Back to work.",
  ],
  complete: [
    "OMG YOU DID IT! Miracles exist!",
    "This deserves a victory dance.",
    "Finally. I was aging waiting for that.",
    "One step closer to being a functioning adult.",
  ],
  idle: [
    "I'm bored. Do something.",
    "Are you still there? Or did you give up?",
    "Tick tock. Life is short.",
    "Your procrastination requires medication.",
  ]
};

export const BADGES = [
  "Certified Adult 🥉",
  "Task Warrior ⚔️",
  "Procrastination Survivor 🏝️",
  "Minimal Effort Award 🎗️",
  "Speed Demon 🏎️",
];
