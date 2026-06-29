import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, CheckSquare, Briefcase, Award } from "lucide-react";
import { AgentReport } from "../types.js";

interface RoadmapViewProps {
  report: AgentReport;
}

export default function RoadmapView({ report }: RoadmapViewProps) {
  const roadmap = report.roadmap;
  if (!roadmap || !roadmap.weeks) return null;

  // Track completion of weeks
  const [completedWeeks, setCompletedWeeks] = useState<Record<number, boolean>>({});
  // Track expanded weeks
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true });

  const toggleWeekExpand = (weekNum: number) => {
    setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const toggleWeekComplete = (weekNum: number) => {
    setCompletedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const completedCount = Object.values(completedWeeks).filter(Boolean).length;
  const totalWeeks = roadmap.weeks.length;
  const progressPercent = Math.round((completedCount / totalWeeks) * 100);

  return (
    <div className="space-y-6">
      {/* Roadmap header & progress bar */}
      <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">8-Week Learning Journey</h3>
            <p className="text-xs text-slate-400 mt-1">
              Personalized transition roadmap for <strong className="text-slate-600 dark:text-slate-300">{report.targetRole}</strong>
            </p>
          </div>
          <div className="flex items-center gap-4 min-w-[200px]">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-500 font-bold mb-1">
                <span>Progress Tracker</span>
                <span>{completedCount} / {totalWeeks} Weeks</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-black text-lg rounded-xl flex items-center justify-center">
              {progressPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Week items list */}
      <div className="space-y-4">
        {roadmap.weeks.map((week) => {
          const isExpanded = !!expandedWeeks[week.weekNumber];
          const isCompleted = !!completedWeeks[week.weekNumber];

          return (
            <div 
              key={week.weekNumber} 
              className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 ${
                isCompleted 
                  ? "border-emerald-200 dark:border-emerald-900/30 shadow-none bg-emerald-50/5" 
                  : isExpanded 
                  ? "border-indigo-100 dark:border-indigo-900/30 shadow-md" 
                  : "border-slate-100 dark:border-slate-800 hover:border-slate-200 shadow-sm"
              }`}
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleWeekExpand(week.weekNumber)}>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleWeekComplete(week.weekNumber);
                    }}
                    className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        Week {week.weekNumber}
                      </span>
                      {isCompleted && (
                        <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          Complete
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{week.title}</h4>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Expended Body Content */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 rounded-b-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Topics and Resources */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        Core Topics to Study
                      </h5>
                      <ul className="space-y-1.5">
                        {week.topics.map((topic, index) => (
                          <li key={index} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        Recommended Study Resources
                      </h5>
                      <ul className="space-y-1.5">
                        {week.resources.map((res, index) => (
                          <li key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <span className="text-xs text-indigo-500 font-bold">📚</span>
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Practice Tasks and Mini Project */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                        Practice Assignments
                      </h5>
                      <ul className="space-y-1.5">
                        {week.practiceTasks.map((task, index) => (
                          <li key={index} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-[10px] text-indigo-500 font-black mt-0.5">✔</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {week.miniProject && (
                      <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/10 rounded-xl border border-indigo-100/30 dark:border-indigo-900/10">
                        <h5 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          Weekly Action Project
                        </h5>
                        <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200">{week.miniProject.title}</h6>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {week.miniProject.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {week.miniProject.skillsLearned.map((skill, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-0.5 text-[9px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded border border-slate-100 dark:border-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
