import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Briefcase, Sparkles, BookOpen, MessageSquare, FolderGit2, 
  TrendingUp, PlusCircle, Download, UploadCloud, ShieldCheck, 
  Trash2, Menu, X, ChevronRight, FileText, CheckCircle2, 
  AlertTriangle, RefreshCw, Send, Sparkle, LogOut
} from "lucide-react";

import { UserProfile, ChatMessage, AgentReport } from "./types.js";
import { SAMPLE_PROFILE } from "./utils/sampleData.js";

// Firebase and Auth imports
import { auth, db } from "./lib/firebase.js";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AuthScreen from "./components/AuthScreen.js";

// Import custom visual components
import ResumeScoreMeter from "./components/ResumeScoreMeter.js";
import SkillRadar from "./components/SkillRadar.js";
import RoadmapView from "./components/RoadmapView.js";
import InterviewView from "./components/InterviewView.js";
import RewriteView from "./components/RewriteView.js";
import ProjectsView from "./components/ProjectsView.js";
import CareerAdviceView from "./components/CareerAdviceView.js";
import ChatView from "./components/ChatView.js";

const POPULAR_ROLES = [
  "AI Engineer",
  "ML Engineer",
  "Data Scientist",
  "Software Engineer",
  "Backend Developer",
  "Cloud Engineer",
  "Product Manager",
  "DevOps Engineer"
];

const INITIAL_EMPTY_PROFILE: UserProfile = {
  resumeText: "",
  resumeFileName: undefined,
  targetRole: "AI Engineer",
  customGoal: "",
  reports: {},
  chatHistory: [
    {
      id: "sys1",
      role: "assistant",
      agentName: "Supervisor Agent",
      text: "Hello! Welcome to your secure personal AI Career Mentor. Upload your resume or paste its text in the sidebar, choose your target role, and let's analyze it to build your path to success!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]
};

export default function App() {
  // Auth States
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Main State
  const [profile, setProfileInternal] = useState<UserProfile>(INITIAL_EMPTY_PROFILE);

  // Sanitizer to convert undefined properties to null to satisfy Firestore specifications
  const sanitizeForFirestore = (obj: any): any => {
    if (obj === undefined) return null;
    if (obj === null) return null;
    if (Array.isArray(obj)) {
      return obj.map(sanitizeForFirestore);
    }
    if (typeof obj === "object") {
      const res: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const val = obj[key];
          if (val !== undefined) {
            res[key] = sanitizeForFirestore(val);
          }
        }
      }
      return res;
    }
    return obj;
  };

  // Sync state to Firestore helper
  const syncProfileToFirestore = async (newProfile: UserProfile, userId: string) => {
    try {
      const docRef = doc(db, "users", userId);
      const sanitized = sanitizeForFirestore(newProfile);
      await setDoc(docRef, sanitized);
    } catch (err) {
      console.error("Error saving user profile to Firestore:", err);
    }
  };

  // Intercept state changes to auto-sync with Firebase
  const setProfile = (value: UserProfile | ((prev: UserProfile) => UserProfile)) => {
    setProfileInternal(prev => {
      const next = typeof value === "function" ? value(prev) : value;
      if (auth.currentUser) {
        syncProfileToFirestore(next, auth.currentUser.uid);
      }
      return next;
    });
  };

  const [currentFeature, setCurrentFeature] = useState<
    "analyze" | "skill_gap" | "roadmap" | "interview" | "rewrite" | "projects" | "career"
  >("analyze");

  // App UI/Control State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState(profile.customGoal || "");
  const [selectedRole, setSelectedRole] = useState(profile.targetRole || "AI Engineer");
  const [inputTextResume, setInputTextResume] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Listen for Authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch existing profile or initialize
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setProfileInternal(data);
            setSelectedRole(data.targetRole || "AI Engineer");
            setCustomGoal(data.customGoal || "");
          } else {
            // First time user, save initial profile
            await setDoc(docRef, INITIAL_EMPTY_PROFILE);
            setProfileInternal(INITIAL_EMPTY_PROFILE);
            setSelectedRole("AI Engineer");
            setCustomGoal("");
          }
        } catch (err) {
          console.error("Error loading user profile:", err);
          setErrorMsg("Could not load your secure profile from Firestore.");
        }
      } else {
        // Logged out
        setProfileInternal(INITIAL_EMPTY_PROFILE);
        setSelectedRole("AI Engineer");
        setCustomGoal("");
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSuccessMsg("Successfully logged out securely.");
    } catch (err) {
      console.error("Logout error:", err);
      setErrorMsg("Failed to sign out.");
    }
  };

  // Keep input fields synchronized with profile state shifts
  useEffect(() => {
    if (profile) {
      setSelectedRole(profile.targetRole || "AI Engineer");
      setCustomGoal(profile.customGoal || "");
    }
  }, [profile.targetRole, profile.customGoal]);

  // Auto-clear messages
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Load sample profile helper
  const handleLoadSample = () => {
    setProfile(SAMPLE_PROFILE);
    setSelectedRole(SAMPLE_PROFILE.targetRole);
    setCustomGoal(SAMPLE_PROFILE.customGoal || "");
    setSuccessMsg("Successfully loaded the sample profile of Jane Doe!");
  };

  // Reset to empty state helper
  const handleClearData = () => {
    setProfile({
      resumeText: "",
      resumeFileName: undefined,
      targetRole: "AI Engineer",
      customGoal: "",
      reports: {},
      chatHistory: [
        {
          id: "sys1",
          role: "assistant",
          agentName: "Supervisor Agent",
          text: "Hello! Welcome to the AI Career Mentor Agent. To get started, please upload your resume or paste its text in the sidebar, choose your target role, and click 'Engage Career Mentor'!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]
    });
    setSelectedRole("AI Engineer");
    setCustomGoal("");
    setInputTextResume("");
    setSuccessMsg("Cleared all current session data.");
  };

  // Drag-and-drop / Upload file parsing handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const reader = new FileReader();

      if (file.name.endsWith(".pdf")) {
        // PDF parser is server-side, read as base64 and pass to backend
        reader.onload = async () => {
          const base64 = (reader.result as string).split(",")[1];
          try {
            const response = await fetch("/api/parse-resume", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileBase64: base64, fileName: file.name })
            });

            const data = await response.json();
            if (response.ok && data.text) {
              setProfile(prev => ({
                ...prev,
                resumeText: data.text,
                resumeFileName: file.name
              }));
              setInputTextResume(data.text);
              setSuccessMsg(`Parsed PDF: ${file.name} successfully! Click 'Engage Mentor' to analyze.`);
            } else {
              throw new Error(data.error || "Failed to extract text from PDF.");
            }
          } catch (serverErr: any) {
            setErrorMsg(serverErr.message || "Error parsing PDF on server.");
          } finally {
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Read TXT or generic text file on the client directly
        reader.onload = async () => {
          const text = reader.result as string;
          setProfile(prev => ({
            ...prev,
            resumeText: text,
            resumeFileName: file.name
          }));
          setInputTextResume(text);
          setSuccessMsg(`Loaded text file: ${file.name}! Click 'Engage Mentor' to analyze.`);
          setIsUploading(false);
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      setErrorMsg("File upload failed: " + err.message);
      setIsUploading(false);
    }
  };

  // Manual resume text submit handler
  const handleTextResumeSubmit = () => {
    if (!inputTextResume.trim()) {
      setErrorMsg("Please write or paste your resume text first.");
      return;
    }
    setProfile(prev => ({
      ...prev,
      resumeText: inputTextResume,
      resumeFileName: "Pasted_Resume.txt"
    }));
    setIsEditorOpen(false);
    setSuccessMsg("Resume text submitted successfully! Ready to engage.");
  };

  // Run Mentor Agent feature process flow
  const handleEngageMentor = async (forceFeature?: typeof currentFeature) => {
    const featureToRun = forceFeature || currentFeature;

    if (!profile.resumeText) {
      setErrorMsg("Please upload your resume (PDF/TXT) or paste your resume in the sidebar first.");
      return;
    }

    setIsPending(true);
    setErrorMsg(null);

    // Map feature to corresponding agent names
    const agentMap: Record<string, string> = {
      analyze: "Resume Analyzer Agent",
      skill_gap: "Skill Gap Agent",
      roadmap: "Learning Roadmap Agent",
      interview: "Interview Agent",
      rewrite: "Resume Rewrite Agent",
      projects: "Project Recommendation Agent",
      career: "Career Advice Agent"
    };

    const targetAgent = agentMap[featureToRun];

    try {
      const response = await fetch("/api/agent-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: profile.resumeText,
          targetRole: selectedRole,
          customGoal,
          selectedAgent: targetAgent,
          currentFeature: featureToRun
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred with the AI Agent.");
      }

      // Add report to profile
      const updatedReports = {
        ...profile.reports,
        [data.agentName]: data.report
      };

      // Create success response chat message
      const botMessage: ChatMessage = {
        id: `m_${Date.now()}`,
        role: "assistant",
        agentName: data.agentName,
        text: data.message || `I have successfully compiled your customized ${data.agentName} report!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isReport: true,
        reportData: data.report
      };

      setProfile(prev => ({
        ...prev,
        targetRole: selectedRole,
        customGoal,
        reports: updatedReports,
        chatHistory: [...prev.chatHistory, botMessage]
      }));

      setSuccessMsg(`Compiled report from: ${data.agentName}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to communicate with AI Agents. Make sure your GEMINI_API_KEY is correctly set in Settings.");
    } finally {
      setIsPending(false);
    }
  };

  // Handle follow-up chat messages
  const handleSendMessage = async (text: string) => {
    // Add user message to history
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedHistory = [...profile.chatHistory, userMsg];
    setProfile(prev => ({ ...prev, chatHistory: updatedHistory }));

    setIsPending(true);

    // Map feature to corresponding agent names
    const agentMap: Record<string, string> = {
      analyze: "Resume Analyzer Agent",
      skill_gap: "Skill Gap Agent",
      roadmap: "Learning Roadmap Agent",
      interview: "Interview Agent",
      rewrite: "Resume Rewrite Agent",
      projects: "Project Recommendation Agent",
      career: "Career Advice Agent"
    };

    try {
      const response = await fetch("/api/agent-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: profile.resumeText || SAMPLE_PROFILE.resumeText, // Fallback to sample if none
          targetRole: profile.targetRole || selectedRole,
          customGoal: profile.customGoal || customGoal,
          selectedAgent: agentMap[currentFeature],
          userQuery: text,
          currentFeature
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error compiling agent response.");
      }

      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        role: "assistant",
        agentName: data.agentName,
        text: data.message || (data.report?.summary) || "I've processed your query. Let me know if you need any adjustments!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setProfile(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, botMsg]
      }));
    } catch (err: any) {
      setErrorMsg(err.message || "Error getting response from Chat Agent.");
    } finally {
      setIsPending(false);
    }
  };

  // Auto trigger analysis on tab switch if report doesn't exist
  const handleTabSwitch = (feature: typeof currentFeature) => {
    setCurrentFeature(feature);
    const agentNames: Record<string, string> = {
      analyze: "Resume Analyzer Agent",
      skill_gap: "Skill Gap Agent",
      roadmap: "Learning Roadmap Agent",
      interview: "Interview Agent",
      rewrite: "Resume Rewrite Agent",
      projects: "Project Recommendation Agent",
      career: "Career Advice Agent"
    };

    const targetAgentName = agentNames[feature];
    if (profile.resumeText && !profile.reports[targetAgentName]) {
      // Auto run agent for this tab to keep it smooth
      handleEngageMentor(feature);
    }
  };

  // Export recommendations as Markdown helper
  const handleExportMarkdown = () => {
    let content = `# AI Career Mentor Agent Report\n\n`;
    content += `**Target Career Role**: ${profile.targetRole}\n`;
    content += `**Custom Goal Focus**: ${profile.customGoal || "None"}\n`;
    content += `**Date generated**: ${new Date().toLocaleDateString()}\n\n`;
    content += `=========================================\n\n`;

    Object.entries(profile.reports).forEach(([agentName, rawReport]) => {
      const report = rawReport as AgentReport;
      content += `## ${agentName} Summary\n\n`;
      if (report.summary) content += `${report.summary}\n\n`;

      if (report.strengths) {
        content += `### Strengths Identified\n`;
        report.strengths.forEach(s => { content += `- ${s}\n`; });
        content += `\n`;
      }

      if (report.weaknesses) {
        content += `### Identified Gaps / Weaknesses\n`;
        report.weaknesses.forEach(w => { content += `- ${w}\n`; });
        content += `\n`;
      }

      if (report.skillGap) {
        content += `### Skill Gap Matrix\n`;
        content += `**Matching Skills**: ${report.skillGap.matchingSkills.join(", ")}\n\n`;
        content += `**Missing Skills**: ${report.skillGap.missingSkills.join(", ")}\n\n`;
        content += `**Priority Technologies**: ${report.skillGap.recommendedTechnologies.join(", ")}\n\n`;
      }

      content += `=========================================\n\n`;
    });

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `career_mentor_full_report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Get current active report based on selected tab
  const getActiveReport = (): AgentReport | undefined => {
    const agentMap: Record<string, string> = {
      analyze: "Resume Analyzer Agent",
      skill_gap: "Skill Gap Agent",
      roadmap: "Learning Roadmap Agent",
      interview: "Interview Agent",
      rewrite: "Resume Rewrite Agent",
      projects: "Project Recommendation Agent",
      career: "Career Advice Agent"
    };
    return profile.reports[agentMap[currentFeature]];
  };

  const activeReport = getActiveReport();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#64748B] font-semibold animate-pulse uppercase tracking-widest text-center">
          Securing Connection...
        </p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans text-[#1E293B] dark:text-slate-100 flex flex-col">
      
      {/* Top Professional Header Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-[#E2E8F0] dark:border-slate-800 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-lg lg:hidden"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white font-extrabold shadow-sm shadow-blue-500/20">
            <Sparkles className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black font-sans uppercase tracking-wider text-[#0F172A] dark:text-slate-100">
                AI Career Mentor
              </h1>
              <span className="px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest uppercase bg-[#EFF6FF] dark:bg-indigo-950/40 text-[#3B82F6] dark:text-indigo-400 rounded">
                Multi-Agent
              </span>
            </div>
            <p className="text-[10px] text-[#64748B]">Kaggle AI Agents Capstone Project Showcase</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] dark:bg-slate-800/60 rounded-xl border border-[#E2E8F0] dark:border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-[#475569] dark:text-slate-300 max-w-[140px] truncate">
                {user.email}
              </span>
            </div>
          )}

          <button
            onClick={handleLoadSample}
            className="px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] dark:bg-slate-800 dark:hover:bg-slate-700 text-[#475569] dark:text-slate-300 text-xs font-bold rounded-xl border border-[#E2E8F0] dark:border-slate-800 transition-colors cursor-pointer"
          >
            Demo Profile
          </button>
          
          <button
            onClick={handleClearData}
            className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl transition-colors cursor-pointer"
            title="Reset Profile"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Component */}
        <aside className={`w-80 border-r border-[#1E293B] bg-[#0F172A] text-[#F8FAFC] overflow-y-auto px-5 py-6 space-y-6 shrink-0 z-30 lg:translate-x-0 transition-transform duration-300 absolute lg:relative inset-y-0 left-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          {/* Section 1: Upload Resume */}
          <div className="space-y-3">
            <h3 className="text-2xs font-extrabold text-[#94A3B8] uppercase tracking-wider">
              Step 1: Upload Resume Profile
            </h3>
            
            {/* Visual Drag/Click Area */}
            <div className="border-2 border-dashed border-[#1E293B] rounded-2xl p-4 text-center hover:border-[#3B82F6] hover:bg-[#1E293B]/40 transition-all relative">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.txt"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#1E293B] text-[#3B82F6] flex items-center justify-center">
                  {isUploading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold block text-slate-200">
                    {profile.resumeFileName ? profile.resumeFileName : "Upload PDF or TXT"}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block mt-0.5">
                    Drag-and-drop or select file
                  </span>
                </div>
              </div>
            </div>

            {/* Paste resume backup trigger */}
            <div className="text-center">
              <button 
                onClick={() => setIsEditorOpen(true)}
                className="text-[11px] text-[#3B82F6] hover:text-blue-400 font-semibold underline cursor-pointer"
              >
                Or manually paste resume text
              </button>
            </div>
          </div>

          {/* Section 2: Career Goal */}
          <div className="space-y-3.5">
            <h3 className="text-2xs font-extrabold text-[#94A3B8] uppercase tracking-wider">
              Step 2: Target Career Goal
            </h3>
            
            <div>
              <label className="text-[10px] text-[#94A3B8] block mb-1">Target Job Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1E293B] border border-[#334155] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-white"
              >
                {POPULAR_ROLES.map((role) => (
                  <option key={role} value={role} className="bg-[#0F172A] text-white">{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#94A3B8] block mb-1">Custom Goal Context</label>
              <textarea
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="E.g., Transition from general QA. Target remote startups."
                rows={3}
                className="w-full px-3 py-2 text-xs bg-[#1E293B] border border-[#334155] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-white placeholder-slate-500 resize-none"
              />
            </div>
          </div>

          {/* Section 3: Run Flow */}
          <div className="pt-2">
            <button
              onClick={() => handleEngageMentor()}
              disabled={isPending || isUploading || !profile.resumeText}
              className="w-full py-3 bg-[#3B82F6] hover:bg-blue-600 disabled:bg-[#1E293B] disabled:text-slate-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Agents Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Engage Career Mentor</span>
                </>
              )}
            </button>
            {!profile.resumeText && (
              <span className="text-[9px] text-[#94A3B8] text-center block mt-2 italic">
                * Please upload a resume or click "Demo Profile" above to begin.
              </span>
            )}
          </div>
        </aside>

        {/* Backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-20 lg:hidden"
          />
        )}

        {/* Workspace Main Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          
          {/* Alert messages section */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <strong className="block font-bold">Execution Warning</strong>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Core Visual Summary Dashboard */}
          {profile.reports["Resume Analyzer Agent"] && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Radial score meters */}
              <div className="lg:col-span-1 grid grid-cols-1 gap-6">
                <ResumeScoreMeter 
                  score={profile.reports["Resume Analyzer Agent"].score || 80} 
                  label="Resume Match Rating" 
                  subLabel={`Aligned with ${profile.targetRole}`} 
                />
              </div>

              {/* Strengths & Weaknesses quick overview */}
              <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider">
                      Agent Executive Summary
                    </h3>
                    <p className="text-xs text-[#475569] dark:text-slate-300 mt-1.5 leading-relaxed">
                      {profile.reports["Resume Analyzer Agent"].summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <h4 className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                      </h4>
                      <ul className="space-y-1">
                        {profile.reports["Resume Analyzer Agent"].strengths?.slice(0, 3).map((st, i) => (
                          <li key={i} className="text-[11px] text-[#475569] dark:text-slate-400 flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Critical Gaps
                      </h4>
                      <ul className="space-y-1">
                        {profile.reports["Resume Analyzer Agent"].weaknesses?.slice(0, 3).map((wk, i) => (
                          <li key={i} className="text-[11px] text-[#475569] dark:text-slate-400 flex items-start gap-1.5">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{wk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 dark:border-slate-800/60 mt-4 flex justify-between items-center text-[11px] text-[#64748B] font-medium">
                  <span>Targeting: <strong className="text-[#1E293B] dark:text-slate-300">{profile.targetRole}</strong></span>
                  <span>Evaluated at {profile.reports["Resume Analyzer Agent"].timestamp}</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Feature Feature Selection Tab Container */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
            {/* Tab header */}
            <div className="border-b border-[#E2E8F0] dark:border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-wider">
                  Specialized Agent Workspaces
                </h3>
                <p className="text-[10px] text-[#64748B]">Select a specialized advisor to inspect details or run flow</p>
              </div>

              {/* Export Full Report button */}
              {Object.keys(profile.reports).length > 0 && (
                <button
                  onClick={handleExportMarkdown}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full Report (.md)</span>
                </button>
              )}
            </div>

            {/* Workspace tabs navigator */}
            <div className="flex border-b border-slate-50 dark:border-slate-800/60 overflow-x-auto bg-[#F8FAFC]/50 dark:bg-slate-950/20">
              {[
                { id: "analyze", label: "Resume Audit", icon: FileText },
                { id: "skill_gap", label: "Skill Gap", icon: CheckCircle2 },
                { id: "roadmap", label: "8-Week Study", icon: BookOpen },
                { id: "interview", label: "Mock Prep", icon: MessageSquare },
                { id: "rewrite", label: "ATS Rewrites", icon: Sparkles },
                { id: "projects", label: "Projects", icon: FolderGit2 },
                { id: "career", label: "Career advice", icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSwitch(tab.id as any)}
                    className={`px-5 py-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
                      currentFeature === tab.id
                        ? "border-[#3B82F6] text-[#3B82F6] dark:text-blue-400 bg-white dark:bg-slate-900"
                        : "border-transparent text-[#64748B] hover:text-[#0F172A] dark:hover:text-slate-300 hover:bg-slate-50/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Workspace Viewport */}
            <div className="p-6">
              {activeReport ? (
                <div>
                  {currentFeature === "analyze" && (
                    <div className="space-y-6">
                      <div className="p-5 bg-[#F8FAFC] dark:bg-slate-950 rounded-2xl border border-[#E2E8F0] dark:border-slate-800">
                        <h4 className="text-xs font-extrabold text-[#3B82F6] uppercase tracking-wider mb-2">Resume Analyzer Audit</h4>
                        <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">{activeReport.summary}</p>
                      </div>

                      {activeReport.atsReport && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-5 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
                            <h5 className="text-xs font-extrabold text-[#0F172A] dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              ATS Scanner Diagnostics
                            </h5>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-bold text-[#475569] dark:text-slate-300">
                                <span>ATS Scannability Score</span>
                                <span>{activeReport.atsReport.score}%</span>
                              </div>
                              <div className="w-full bg-[#F1F5F9] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{ width: `${activeReport.atsReport.score}%` }} />
                              </div>
                            </div>
                            <div className="space-y-1.5 pt-2">
                              <span className="text-[10px] text-[#64748B] font-extrabold uppercase block">Formatting Issues found</span>
                              {activeReport.atsReport.issues.map((iss, i) => (
                                <div key={i} className="text-xs text-rose-500 font-medium flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  <span>{iss}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-5 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
                            <h5 className="text-xs font-extrabold text-[#0F172A] dark:text-slate-200 uppercase tracking-wider">
                              Missing Essential Keywords
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {activeReport.atsReport.missingKeywords.map((kw, i) => (
                                <span key={i} className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 rounded-lg border border-rose-100/50 dark:border-rose-900/10">
                                  {kw}
                                </span>
                              ))}
                            </div>
                            <div className="pt-2">
                              <span className="text-[10px] text-[#64748B] font-extrabold uppercase block mb-1">Formatting & Scan Tips</span>
                              {activeReport.atsReport.formattingTips.map((tip, i) => (
                                <p key={i} className="text-xs text-[#475569] leading-relaxed">• {tip}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {currentFeature === "skill_gap" && <SkillRadar report={activeReport} />}
                  {currentFeature === "roadmap" && <RoadmapView report={activeReport} />}
                  {currentFeature === "interview" && <InterviewView report={activeReport} />}
                  {currentFeature === "rewrite" && <RewriteView report={activeReport} />}
                  {currentFeature === "projects" && <ProjectsView report={activeReport} />}
                  {currentFeature === "career" && <CareerAdviceView report={activeReport} />}
                </div>
              ) : (
                <div className="text-center py-12 space-y-4 max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded-full bg-[#EFF6FF] dark:bg-slate-950/20 text-[#3B82F6] flex items-center justify-center mx-auto">
                    <Sparkle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-300">
                      Workspace Ready
                    </h4>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      This specialized workspace requires execution. Click below to activate the advisor and generate tailored diagnostics.
                    </p>
                  </div>
                  <button
                    onClick={() => handleEngageMentor()}
                    disabled={isPending || !profile.resumeText}
                    className="px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 disabled:bg-[#F1F5F9] dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Generate Diagnostic Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Chat Panel (Conversation Memory) */}
          <ChatView 
            chatHistory={profile.chatHistory}
            onSendMessage={handleSendMessage}
            isPending={isPending}
            activeAgent={
              currentFeature === "analyze" ? "Resume Analyzer Agent" :
              currentFeature === "skill_gap" ? "Skill Gap Agent" :
              currentFeature === "roadmap" ? "Learning Roadmap Agent" :
              currentFeature === "interview" ? "Interview Agent" :
              currentFeature === "rewrite" ? "Resume Rewrite Agent" :
              currentFeature === "projects" ? "Project Recommendation Agent" : "Career Advice Agent"
            }
          />
        </main>
      </div>

      {/* Manual Resume Editor Dialog / Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-2xl p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3B82F6]" />
                <h4 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100 uppercase tracking-wider">
                  Paste Resume Profile Text
                </h4>
              </div>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="p-1 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={inputTextResume}
              onChange={(e) => setInputTextResume(e.target.value)}
              placeholder="Paste your professional summary, experiences, key technical tools, and projects here..."
              rows={12}
              className="w-full p-4 text-xs bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-[#1E293B] dark:text-slate-100 font-mono resize-none"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 bg-[#F8FAFC] hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#475569] dark:text-slate-300 text-xs font-bold rounded-xl border border-[#E2E8F0] dark:border-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleTextResumeSubmit}
                className="px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Submit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
