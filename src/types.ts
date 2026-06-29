export interface ResumeData {
  text: string;
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: string[];
  education: string[];
  extractedRole?: string;
}

export interface AgentReport {
  agentName: string;
  timestamp: string;
  targetRole: string;
  score?: number; // resume score out of 100
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  atsReport?: {
    score: number;
    issues: string[];
    missingKeywords: string[];
    actionVerbsScore: number;
    formattingTips: string[];
  };
  skillGap?: {
    matchingSkills: string[];
    missingSkills: string[];
    recommendedTechnologies: string[];
    importantCertifications: string[];
    prioritySkills: { name: string; priority: 'High' | 'Medium' | 'Low'; reason: string }[];
  };
  roadmap?: {
    weeks: {
      weekNumber: number;
      title: string;
      topics: string[];
      resources: string[];
      practiceTasks: string[];
      miniProject: {
        title: string;
        description: string;
        skillsLearned: string[];
      };
    }[];
  };
  interviewPrep?: {
    questions: {
      id: string;
      category: 'HR' | 'Technical' | 'Coding' | 'Behavioral' | 'System Design';
      question: string;
      modelAnswer: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
    }[];
  };
  rewrittenResume?: {
    summary: { original: string; rewritten: string; explanation: string };
    experience: { original: string; rewritten: string; explanation: string }[];
    projects: { original: string; rewritten: string; explanation: string }[];
    skills: { original: string; rewritten: string; explanation: string };
  };
  projects?: {
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    title: string;
    description: string;
    skillsLearned: string[];
    duration: string;
    difficulty: string;
  }[];
  careerAdvice?: {
    roles: { title: string; matchPercentage: number; description: string }[];
    salaryExpectations: { entry: string; mid: string; senior: string; currency: string };
    learningPriorities: string[];
    nextCertifications: string[];
    futureOutlook: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  agentName?: string;
  timestamp: string;
  isReport?: boolean;
  reportData?: AgentReport;
}

export interface UserProfile {
  resumeText: string;
  resumeFileName?: string;
  targetRole: string;
  customGoal?: string;
  parsedData?: ResumeData;
  reports: Record<string, AgentReport>; // Keyed by agentName or feature
  chatHistory: ChatMessage[];
}
