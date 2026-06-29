import React, { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth } from "../lib/firebase.js";
import { 
  Sparkles, Mail, Lock, LogIn, UserPlus, Shield, CheckCircle2 
} from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error("Auth error:", err);
      let friendlyMessage = "Authentication failed. Please check your inputs.";
      if (err.code === "auth/email-already-in-use") {
        friendlyMessage = "This email is already in use. Try logging in instead.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "Invalid email format. Please check your email.";
      } else if (err.code === "auth/weak-password") {
        friendlyMessage = "Password is too weak. Please use at least 6 characters.";
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        friendlyMessage = "Incorrect email or password. Please try again.";
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-[#1E293B] dark:text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Product Intro & Benefits */}
        <div className="bg-[#0F172A] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow decorative lines */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/20">
                <Sparkles className="w-5.5 h-5.5" />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-wider">
                  AI Career Mentor
                </h1>
                <p className="text-[10px] text-[#94A3B8]">Multi-Agent Intelligence Portal</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white leading-tight">
                Your Personal AI Advisory Board
              </h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Connect with highly specialized AI Agents designed to audit resumes, recommend projects, map weekly roadmaps, and conduct interactive interview simulations.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              {[
                "Personal Secure Profile & Career Goals",
                "Automated Resume ATS Audits",
                "Personalized Weekly Skill Roadmaps",
                "Real-time Mentor Advice Chats"
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 text-[10px] text-[#64748B] flex items-center gap-2 relative z-10 border-t border-slate-800">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure Enterprise Data Encryption & Isolation</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-[#0F172A] dark:text-white">
                {isSignUp ? "Create your Secure Account" : "Access Your Career Portal"}
              </h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                {isSignUp 
                  ? "Sign up to securely save your resumes, target roles, and agent reports." 
                  : "Welcome back! Enter your credentials to sync your advisor dashboard."}
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-100 dark:border-rose-900/40 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-[#475569] dark:text-slate-300 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-[#1E293B] dark:text-slate-100 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-[#475569] dark:text-slate-300 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-[#1E293B] dark:text-slate-100 placeholder-slate-400"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-[#475569] dark:text-slate-300 uppercase tracking-wider block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-[#1E293B] dark:text-slate-100 placeholder-slate-400"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#3B82F6] hover:bg-blue-600 disabled:bg-slate-100 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isSignUp ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Secure Account</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Secure Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-xs text-[#3B82F6] hover:text-blue-600 font-semibold cursor-pointer underline"
              >
                {isSignUp 
                  ? "Already have an account? Sign In" 
                  : "Don't have an account? Sign Up now"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
