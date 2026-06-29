import React from "react";
import { FolderGit2, Calendar, Hammer, Trophy, ArrowRight, Star } from "lucide-react";
import { AgentReport } from "../types.js";

interface ProjectsViewProps {
  report: AgentReport;
}

export default function ProjectsView({ report }: ProjectsViewProps) {
  const projects = report.projects;
  if (!projects || projects.length === 0) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Advanced": return "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/20";
      case "Intermediate": return "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/20";
      default: return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/20";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Advanced": return <Trophy className="w-4 h-4 text-red-500" />;
      case "Intermediate": return <Hammer className="w-4 h-4 text-indigo-500" />;
      default: return <Star className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-indigo-500" />
          Recommended Portfolio Projects
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Add these customized projects to your portfolio to demonstrate hands-on experience in critical technologies.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {projects.map((proj, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Header */}
              <div className="p-4 bg-slate-50/40 dark:bg-slate-950/20 border-b border-slate-100/50 dark:border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {getLevelIcon(proj.level)}
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{proj.level} Portfolio</span>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border rounded-md ${getLevelColor(proj.level)}`}>
                  {proj.level}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{proj.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      Duration: {proj.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hammer className="w-3.5 h-3.5 text-indigo-500" />
                      Difficulty: {proj.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {proj.description}
                </p>
              </div>
            </div>

            {/* Footer Tech Stack Tags */}
            <div className="p-5 pt-0">
              <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50">
                <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Skills to Demonstrate</h5>
                <div className="flex flex-wrap gap-1.5">
                  {proj.skillsLearned.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-[10px] font-semibold bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded border border-slate-100 dark:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
