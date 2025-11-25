import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MascotType, MascotMessage, ThemeMode } from '../types';
import { MASCOTS } from '../constants';

interface MascotProps {
  type: MascotType;
  message: MascotMessage;
  theme: ThemeMode;
  isPanic: boolean;
}

const Mascot: React.FC<MascotProps> = ({ type, message, theme, isPanic }) => {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    setBounce(true);
    const timeout = setTimeout(() => setBounce(false), 500);
    return () => clearTimeout(timeout);
  }, [message]);

  const mascotData = MASCOTS[type];

  // Map emotions to basic emojis or visual changes if we had assets
  const getEmotionEmoji = () => {
    if (isPanic) return "😱";
    switch (message.emotion) {
      case 'happy': return "🎉";
      case 'angry': return "😡";
      case 'bored': return "💤";
      case 'panic': return "🔥";
      case 'judging': return "🧐";
      default: return "";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none md:pointer-events-auto">
      <AnimatePresence mode="wait">
        {message.text && (
            <motion.div
            key={message.text}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`mb-4 mr-4 p-4 max-w-xs rounded-t-2xl rounded-bl-2xl shadow-xl border-4 border-black bg-white text-black font-bold relative`}
            >
            <p className="text-lg leading-tight">
                {message.text}
            </p>
            {/* Triangle for speech bubble */}
            <div className="absolute -bottom-4 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-black"></div>
            <div className="absolute -bottom-[13px] right-[4px] w-0 h-0 border-l-[16px] border-l-transparent border-t-[16px] border-t-white"></div>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={isPanic ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : { y: bounce ? -20 : 0 }}
        transition={isPanic ? { repeat: Infinity, duration: 0.5 } : { type: "spring", stiffness: 300 }}
        className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black flex items-center justify-center text-6xl shadow-xl bg-white overflow-hidden cursor-pointer`}
        onClick={() => setBounce(true)} // Interactive
      >
        <div className="relative">
             <span className="z-10 relative">{mascotData.emoji}</span>
             <motion.span 
                className="absolute -top-1 -right-4 text-3xl"
                animate={{ opacity: [0, 1, 0], y: -20 }}
                transition={{ repeat: Infinity, duration: 2 }}
             >
                {getEmotionEmoji()}
             </motion.span>
        </div>
      </motion.div>
    </div>
  );
};

export default Mascot;
