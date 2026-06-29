import React from "react";
import { CheckCircle2, AlertTriangle, Cpu, GraduationCap, ArrowUpRight } from "lucide-react";
import { AgentReport } from "../types.js";

interface SkillRadarProps {
  report: AgentReport;
}

export default function SkillRadar({ report }: SkillRadarProps) {
  const skillGap = report.skillGap;
  if (!skillGap) return null;

  const totalMatch = skillGap.matchingSkills.length;
  const totalMissing = skillGap.missingSkills.length;
  const matchRate = totalMatch + totalMissing > 0 
    ? Math.round((totalMatch / (totalMatch + totalMissing)) * 100) 
    : 50;

  return (
    <div className="space-y-6">
      {/* Visual Matching Rate Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Skill Match Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-800 dark:text-slate-100">{matchRate}%</span>
            <span className="text-sm text-emerald-500 font-semibold flex items-center gap-0.5">
              Matched <CheckCircle2 className="w-3.5 h-3.5 inline" />
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${matchRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Analyzing {totalMatch} matching technologies and {totalMissing} critical gaps for the role of <strong className="text-slate-600 dark:text-slate-300">{report.targetRole}</strong>.
          </p>
        </div>

        {/* Matching Skills Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-emerald-500 font-semibold text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Strengths ({totalMatch})</span>
          </div>
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-40 pr-1">
            {skillGap.matchingSkills.length > 0 ? (
              skillGap.matchingSkills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/30"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-xs italic">No matching skills identified. Let's add some under learning.</span>
            )}
          </div>
        </div>

        {/* Missing Skills Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-rose-500 font-semibold text-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Gaps ({totalMissing})</span>
          </div>
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-40 pr-1">
            {skillGap.missingSkills.length > 0 ? (
              skillGap.missingSkills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 rounded-full border border-rose-100 dark:border-rose-900/30"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-xs italic">Perfect match! No critical skill gaps identified.</span>
            )}
          </div>
        </div>
      </div>

      {/* Priority Actions and Technology Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Priority Actions Checklist */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-indigo-500" />
            Priority Action Plan
          </h3>
          <div className="space-y-3.5">
            {skillGap.prioritySkills && skillGap.prioritySkills.length > 0 ? (
              skillGap.prioritySkills.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3"
                >
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded mt-0.5 ${
                    item.priority === 'High' 
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400' 
                      : item.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400'
                  }`}>
                    {item.priority}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.reason}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs italic">No priority roadmap actions required.</p>
            )}
          </div>
        </div>

        {/* Recommended Tech & Certifications */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-emerald-500" />
              Suggested Stack Extensions
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillGap.recommendedTechnologies && skillGap.recommendedTechnologies.length > 0 ? (
                skillGap.recommendedTechnologies.map((tech, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg"
                  >
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    {tech}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-xs italic">No extra tools recommended.</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              Target Certifications
            </h3>
            <div className="space-y-2">
              {skillGap.importantCertifications && skillGap.importantCertifications.length > 0 ? (
                skillGap.importantCertifications.map((cert, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{cert}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs italic">No special certifications required. Prioritize hands-on projects!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
