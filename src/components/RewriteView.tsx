import React, { useState } from "react";
import { CheckCircle2, ChevronRight, HelpCircle, FileText, Sparkles } from "lucide-react";
import { AgentReport } from "../types.js";

interface RewriteViewProps {
  report: AgentReport;
}

export default function RewriteView({ report }: RewriteViewProps) {
  const rewrittenResume = report.rewrittenResume;
  if (!rewrittenResume) return null;

  const [activeTab, setActiveTab] = useState<"summary" | "experience" | "projects" | "skills">("summary");

  const tabs = [
    { id: "summary", label: "Professional Summary" },
    { id: "experience", label: "Experience Points" },
    { id: "projects", label: "Key Projects" },
    { id: "skills", label: "Skills Structure" }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 gap-1 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div className="space-y-6">
        {/* Professional Summary */}
        {activeTab === "summary" && rewrittenResume.summary && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original summary card */}
              <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Original Text</h4>
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    {rewrittenResume.summary.original || "No original summary was found in your resume."}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-4">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Unstructured or generic keywords.</span>
                </div>
              </div>

              {/* Rewritten summary card */}
              <div className="p-5 bg-indigo-50/5 dark:bg-indigo-950/5 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/30 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl -mr-6 -mt-6" />
                <div>
                  <h4 className="text-xs font-extrabold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    ATS-Optimized Version
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                    {rewrittenResume.summary.rewritten}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-4">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Packed with high-impact action verbs and target skills.</span>
                </div>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-extrabold text-indigo-500 uppercase tracking-wider block mb-1">Mentor Explanation</span>
              <p className="text-slate-500 leading-relaxed">{rewrittenResume.summary.explanation}</p>
            </div>
          </div>
        )}

        {/* Experience Points */}
        {activeTab === "experience" && rewrittenResume.experience && (
          <div className="space-y-6">
            {rewrittenResume.experience.map((exp, idx) => (
              <div key={idx} className="space-y-3.5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Original Bullet */}
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800">
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Original Highlight</h5>
                    <p className="text-xs text-slate-500 italic leading-relaxed">{exp.original}</p>
                  </div>

                  {/* Rewritten Bullet */}
                  <div className="p-4 bg-indigo-50/5 dark:bg-indigo-950/5 rounded-xl border border-indigo-100/30 dark:border-indigo-900/30">
                    <h5 className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Accomplishment Format (X-Y-Z)
                    </h5>
                    <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{exp.rewritten}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p><strong className="text-slate-700 dark:text-slate-300">Why this rewrite succeeds:</strong> {exp.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Key Projects */}
        {activeTab === "projects" && rewrittenResume.projects && (
          <div className="space-y-6">
            {rewrittenResume.projects.map((proj, idx) => (
              <div key={idx} className="space-y-3.5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Original project description */}
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800">
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Original Project</h5>
                    <p className="text-xs text-slate-500 italic leading-relaxed">{proj.original}</p>
                  </div>

                  {/* Rewritten project description */}
                  <div className="p-4 bg-indigo-50/5 dark:bg-indigo-950/5 rounded-xl border border-indigo-100/30 dark:border-indigo-900/30">
                    <h5 className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Optimized Portfolio Detail
                    </h5>
                    <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{proj.rewritten}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p><strong className="text-slate-700 dark:text-slate-300">Design strategy:</strong> {proj.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Structure */}
        {activeTab === "skills" && rewrittenResume.skills && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original skills listing */}
              <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Original List</h4>
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    {rewrittenResume.skills.original || "Comma separated list of skills."}
                  </p>
                </div>
              </div>

              {/* Rewritten skills section */}
              <div className="p-5 bg-indigo-50/5 dark:bg-indigo-950/5 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/30 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Structured Skill Taxonomy
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                    {rewrittenResume.skills.rewritten}
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-extrabold text-indigo-500 uppercase tracking-wider block mb-1">Taxonomy Explanation</span>
              <p className="text-slate-500 leading-relaxed">{rewrittenResume.skills.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
