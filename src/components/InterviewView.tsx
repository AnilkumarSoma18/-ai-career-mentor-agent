import React, { useState } from "react";
import { MessageSquare, HelpCircle, Eye, EyeOff, AlertCircle } from "lucide-react";
import { AgentReport } from "../types.js";

interface InterviewViewProps {
  report: AgentReport;
}

export default function InterviewView({ report }: InterviewViewProps) {
  const interviewPrep = report.interviewPrep;
  if (!interviewPrep || !interviewPrep.questions) return null;

  // Track expanded questions
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const toggleAnswerReveal = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Coding": return "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/20";
      case "Technical": return "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/20";
      case "System Design": return "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/20";
      case "Behavioral": return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/20";
      default: return "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/20";
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Hard": return "text-rose-500 font-bold";
      case "Medium": return "text-amber-500 font-bold";
      default: return "text-emerald-500 font-bold";
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro info box */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Tailored Mock Interview Coach</h4>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            These questions have been custom-synthesized by your Mentor Agent. They represent common screens and technical challenges tailored to your exact profile and the standards expected of a modern <strong className="text-slate-600 dark:text-slate-300">{report.targetRole}</strong>.
          </p>
        </div>
      </div>

      {/* Question Cards Grid */}
      <div className="space-y-4">
        {interviewPrep.questions.map((item, index) => {
          const isRevealed = !!revealedAnswers[item.id];

          return (
            <div 
              key={item.id || index}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 shadow-sm transition-all overflow-hidden"
            >
              {/* Card Header Info */}
              <div className="p-4 bg-slate-50/40 dark:bg-slate-950/20 border-b border-slate-100/50 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase border rounded-full ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Difficulty: <span className={getDifficultyColor(item.difficulty)}>{item.difficulty}</span>
                  </span>
                </div>
                <button 
                  onClick={() => toggleAnswerReveal(item.id || `${index}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-lg transition-colors cursor-pointer dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide Answer</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Reveal Model Answer</span>
                    </>
                  )}
                </button>
              </div>

              {/* Question Text */}
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                    {item.question}
                  </h4>
                </div>

                {/* Answer Reveal Panel */}
                {isRevealed && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Model Answer Strategy</span>
                    </div>
                    <div className="p-4 bg-emerald-50/10 dark:bg-emerald-950/5 border border-emerald-100/30 dark:border-emerald-900/20 rounded-xl">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {item.modelAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
