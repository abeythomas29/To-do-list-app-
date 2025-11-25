import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const DayProgress: React.FC = () => {
  const [percentage, setPercentage] = useState(0);
  const [timeLeftStr, setTimeLeftStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const total = endOfDay.getTime() - startOfDay.getTime();
      const current = now.getTime() - startOfDay.getTime();
      const p = Math.min(100, Math.max(0, (current / total) * 100));
      
      setPercentage(p);

      const hoursLeft = 24 - now.getHours();
      setTimeLeftStr(`${hoursLeft} hours left`);
    };

    update();
    const interval = setInterval(update, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Day Wasted Meter</span>
            <span className="text-xs font-bold text-red-600">{timeLeftStr} to regret today</span>
        </div>
        <div className="relative w-full h-8 bg-gray-300 rounded-full border-2 border-black overflow-hidden shadow-inner">
            <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 transition-all duration-1000"
                style={{ width: `${percentage}%` }}
            >
                <div className="absolute right-1 top-1/2 -translate-y-1/2 animate-spin-slow">
                     {percentage > 50 ? <Moon size={16} className="text-white" /> : <Sun size={16} className="text-yellow-100" />}
                </div>
            </div>
        </div>
        <p className="text-center text-xs mt-1 italic opacity-70">
            {percentage < 50 ? "The sun is high, expectations are low." : "The sun is dying. So are your chances."}
        </p>
    </div>
  );
};

export default DayProgress;
