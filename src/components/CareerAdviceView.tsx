import React from "react";
import { Compass, Sparkles, TrendingUp, DollarSign, Award, Target } from "lucide-react";
import { AgentReport } from "../types.js";

interface CareerAdviceViewProps {
  report: AgentReport;
}

export default function CareerAdviceView({ report }: CareerAdviceViewProps) {
  const careerAdvice = report.careerAdvice;
  if (!careerAdvice) return null;

  return (
    <div className="space-y-6">
      {/* Target Role & Future Outlook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Target Role Outlook</span>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
              Future Prospects for {report.targetRole}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Growth trends, automation impacts, and career trajectory analysis.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {careerAdvice.futureOutlook}
          </div>
        </div>

        {/* Salary Estimates Card */}
        <div className="p-6 bg-gradient-to-br from-indigo-50/20 to-indigo-100/10 dark:from-indigo-950/20 dark:to-indigo-900/10 rounded-2xl border border-indigo-100/30 dark:border-indigo-900/30 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>Est. Compensation</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-indigo-100/20">
                <span className="text-xs font-semibold text-slate-500">Entry Level</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">{careerAdvice.salaryExpectations.entry}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-indigo-100/20">
                <span className="text-xs font-semibold text-slate-500">Mid-Level Career</span>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{careerAdvice.salaryExpectations.mid}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Senior Staff / Lead</span>
                <span className="text-sm font-black text-emerald-500">{careerAdvice.salaryExpectations.senior}</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 italic mt-6 text-center">
            Rates are estimated in {careerAdvice.salaryExpectations.currency} based on top global technology hub requirements.
          </p>
        </div>
      </div>

      {/* Recommended Certifications & Learning Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Realistic Job Matching Titles */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-500" />
            Parallel Role Opportunities
          </h3>
          <div className="space-y-3.5">
            {careerAdvice.roles.map((item, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4"
              >
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
                <div className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold rounded-lg flex flex-col items-center shrink-0">
                  <span>{item.matchPercentage}%</span>
                  <span className="text-[8px] uppercase font-bold tracking-wider text-slate-400 block mt-0.5">Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Next Certificates */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-indigo-500" />
              Strategic Certifications to Target
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {careerAdvice.nextCertifications.map((cert, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-indigo-500" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Top Mentoring Core Priorities
            </h3>
            <div className="space-y-2">
              {careerAdvice.learningPriorities.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    {idx + 1}
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
