import React from "react";
import { motion } from "motion/react";

interface ScoreMeterProps {
  score: number;
  label: string;
  subLabel?: string;
}

export default function ResumeScoreMeter({ score, label, subLabel }: ScoreMeterProps) {
  // Determine color theme based on score
  const getColorClass = (val: number) => {
    if (val >= 80) return "text-emerald-500 stroke-emerald-500 bg-emerald-500/10";
    if (val >= 60) return "text-amber-500 stroke-amber-500 bg-amber-500/10";
    return "text-rose-500 stroke-rose-500 bg-rose-500/10";
  };

  const getStrokeColor = (val: number) => {
    if (val >= 80) return "#10b981"; // emerald-500
    if (val >= 60) return "#f59e0b"; // amber-500
    return "#f43f5e"; // rose-500
  };

  const strokeDashoffset = 251.2 - (251.2 * score) / 100;
  const colorClass = getColorClass(score);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Outer Circular Track */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated score ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke={getStrokeColor(score)}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute text-center">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl font-bold font-sans tracking-tight text-slate-800 dark:text-slate-100"
          >
            {score}
          </motion.span>
          <span className="text-xs block text-slate-400 font-medium">/ 100</span>
        </div>
      </div>

      <div className="text-center mt-4">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{label}</h3>
        {subLabel && <p className="text-xs text-slate-400 mt-1">{subLabel}</p>}
      </div>
    </div>
  );
}
