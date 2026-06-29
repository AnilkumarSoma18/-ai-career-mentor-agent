import { GoogleGenAI, Type } from "@google/genai";
import { AgentReport } from "../src/types.js";

// Initialize the Gemini client on the server side
// We use process.env.GEMINI_API_KEY which is injected by AI Studio.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const MODEL_NAME = "gemini-3.5-flash";

/**
 * Clean up text content and remove markdown code fences if present.
 */
function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

/**
 * Supervisor Agent: Determines which agent is needed based on a prompt or selection,
 * and sets up the routing.
 */
export async function runSupervisor(
  userQuery: string,
  resumeText: string,
  targetRole: string,
  currentFeature: string
): Promise<string> {
  const systemInstruction = `You are the Coordinator/Supervisor of a Multi-Agent Career Mentor System.
Your job is to routing the user request to the correct specialized sub-agent.
The available sub-agents are:
1. "Resume Analyzer Agent": Best for analyzing strengths, weaknesses, ATS friendliness, action verbs, and formatting.
2. "Skill Gap Agent": Best for comparing the user's resume skills against industry requirements for a target role.
3. "Learning Roadmap Agent": Best for creating detailed week-by-week learning roadmaps.
4. "Interview Agent": Best for generating tailored interview questions and model answers.
5. "Resume Rewrite Agent": Best for rewriting sections (summary, experience, projects) to optimize for ATS.
6. "Project Recommendation Agent": Best for recommending hands-on portfolio projects at various levels.
7. "Career Advice Agent": Best for general career advice, certificates, job matches, and salary expectations.

Given the user query: "${userQuery}" and selected feature: "${currentFeature}", return ONLY the exact name of the selected agent from the list of 7.
Do not write anything else. Just the name.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Route query: "${userQuery}". Feature selected: "${currentFeature}".`,
      config: {
        systemInstruction,
        temperature: 0.1,
      }
    });

    const agentName = response.text?.trim() || "";
    // Fallback based on selected feature if LLM output is ambiguous
    if (agentName.includes("Analyzer") || currentFeature === "analyze") return "Resume Analyzer Agent";
    if (agentName.includes("Gap") || currentFeature === "skill_gap") return "Skill Gap Agent";
    if (agentName.includes("Roadmap") || currentFeature === "roadmap") return "Learning Roadmap Agent";
    if (agentName.includes("Interview") || currentFeature === "interview") return "Interview Agent";
    if (agentName.includes("Rewrite") || currentFeature === "rewrite") return "Resume Rewrite Agent";
    if (agentName.includes("Project") || currentFeature === "projects") return "Project Recommendation Agent";
    if (agentName.includes("Advice") || currentFeature === "career") return "Career Advice Agent";

    return "Resume Analyzer Agent"; // Default fallback
  } catch (err) {
    console.error("Supervisor Routing Error:", err);
    return "Resume Analyzer Agent";
  }
}

/**
 * Specialized Sub-Agents
 */

// 1. Resume Analyzer Agent
export async function runResumeAnalyzer(resumeText: string, targetRole: string): Promise<Partial<AgentReport>> {
  const prompt = `You are the Resume Analyzer Agent. Evaluate the following resume text against the target role: "${targetRole}".
Analyze strengths, weaknesses, ATS-friendliness, actionable verbs usage, formatting, and formatting issues.
Return a structured JSON object matching this schema:
{
  "score": 85, // Integer score out of 100 for overall quality
  "summary": "Brief executive summary of the resume quality.",
  "strengths": ["Strength 1", "Strength 2", ...],
  "weaknesses": ["Weakness 1", "Weakness 2", ...],
  "atsReport": {
    "score": 78, // ATS friendliness score out of 100
    "issues": ["Issue 1 (e.g. multi-column layout)", ...],
    "missingKeywords": ["Keyword 1", "Keyword 2", ...],
    "actionVerbsScore": 80, // Action verb usage score out of 100
    "formattingTips": ["Tip 1", "Tip 2", ...]
  }
}

Resume Text:
${resumeText}

Ensure your response is valid JSON. Do not include markdown code blocks, return ONLY the raw JSON string.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    }
  });

  return JSON.parse(cleanJsonString(response.text || "{}"));
}

// 2. Skill Gap Agent
export async function runSkillGap(resumeText: string, targetRole: string): Promise<Partial<AgentReport>> {
  const prompt = `You are the Skill Gap Agent. Compare the candidate's resume with standard industry expectations for the target role: "${targetRole}".
Analyze matching skills, missing technical/soft skills, recommended technologies to learn, important certifications, and rank priorities.
Return a structured JSON object matching this schema:
{
  "skillGap": {
    "matchingSkills": ["Skill A", "Skill B", ...],
    "missingSkills": ["Skill C", "Skill D", ...],
    "recommendedTechnologies": ["Tech X", "Tech Y", ...],
    "importantCertifications": ["Cert 1", "Cert 2", ...],
    "prioritySkills": [
      { "name": "Skill C", "priority": "High", "reason": "Extremely critical for targetRole" },
      ...
    ]
  }
}

Resume Text:
${resumeText}

Ensure your response is valid JSON. Do not include markdown code blocks, return ONLY the raw JSON string.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    }
  });

  return JSON.parse(cleanJsonString(response.text || "{}"));
}

// 3. Learning Roadmap Agent
export async function runLearningRoadmap(resumeText: string, targetRole: string): Promise<Partial<AgentReport>> {
  const prompt = `You are the Learning Roadmap Agent. Generate a custom, highly practical 8-week learning roadmap for a candidate with the provided resume who is transitioning to the target role: "${targetRole}".
The roadmap should focus heavily on bridging their skill gaps with actionable practice.
Return a structured JSON object matching this schema:
{
  "roadmap": {
    "weeks": [
      {
        "weekNumber": 1,
        "title": "Week 1 Theme/Title",
        "topics": ["Topic A", "Topic B", ...],
        "resources": ["Resource/Course A", "Resource/Course B", ...],
        "practiceTasks": ["Task 1", "Task 2", ...],
        "miniProject": {
          "title": "Mini Project Title",
          "description": "Brief description of hands-on mini project.",
          "skillsLearned": ["Skill X", "Skill Y"]
        }
      },
      ... up to week 8 (Weeks 1 to 8)
    ]
  }
}

Resume Text:
${resumeText}

Ensure your response is valid JSON. Do not include markdown code blocks, return ONLY the raw JSON string.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.3,
    }
  });

  return JSON.parse(cleanJsonString(response.text || "{}"));
}

// 4. Interview Agent
export async function runInterviewAgent(resumeText: string, targetRole: string): Promise<Partial<AgentReport>> {
  const prompt = `You are the Interview Preparation Agent. Generate targeted interview questions of different categories (HR, Technical, Coding, Behavioral, System Design) based on the candidate's resume and the target role: "${targetRole}".
For each question, provide a pristine "modelAnswer" explaining how the candidate should answer it utilizing their background.
Return a structured JSON object matching this schema:
{
  "interviewPrep": {
    "questions": [
      {
        "id": "q1",
        "category": "Technical", // Must be one of: HR, Technical, Coding, Behavioral, System Design
        "question": "The interview question text",
        "modelAnswer": "A highly detailed, professional sample answer showcasing Star method or technical excellence.",
        "difficulty": "Medium" // Easy, Medium, Hard
      },
      ... (generate at least 5-6 comprehensive questions)
    ]
  }
}

Resume Text:
${resumeText}

Ensure your response is valid JSON. Do not include markdown code blocks, return ONLY the raw JSON string.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4,
    }
  });

  return JSON.parse(cleanJsonString(response.text || "{}"));
}

// 5. Resume Rewrite Agent
export async function runResumeRewrite(resumeText: string, targetRole: string): Promise<Partial<AgentReport>> {
  const prompt = `You are the Resume Rewrite Agent. Help rewrite key sections of the resume to maximize ATS matching and professional impact for the target role: "${targetRole}".
Provide rewritten versions of the professional summary, experience bullet points, project descriptions, and skills list. Include explanations of the changes.
Return a structured JSON object matching this schema:
{
  "rewrittenResume": {
    "summary": {
      "original": "Original summary from resume or generated default if missing",
      "rewritten": "Prussian, high-impact rewritten summary with keywords",
      "explanation": "Why this rewritten summary is significantly better for ATS"
    },
    "experience": [
      {
        "original": "Original experience bullet or job description",
        "rewritten": "Rewritten bullet using action verbs (X-Y-Z formula: Accomplished [X], as measured by [Y], by doing [Z])",
        "explanation": "Why this format sells the achievement better"
      }
    ],
    "projects": [
      {
        "original": "Original project bullet/description",
        "rewritten": "ATS-friendly description highlighting core technologies used and business impact",
        "explanation": "How the new phrasing highlights crucial targetRole requirements"
      }
    ],
    "skills": {
      "original": "Original skills section listing",
      "rewritten": "Categorized, modern skills listing optimized for ATS scanners",
      "explanation": "Why indexing skills into categories (Core, Tools, Concepts) aids readability"
    }
  }
}

Resume Text:
${resumeText}

Ensure your response is valid JSON. Do not include markdown code blocks, return ONLY the raw JSON string.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.3,
    }
  });

  return JSON.parse(cleanJsonString(response.text || "{}"));
}

// 6. Project Recommendation Agent
export async function runProjectRecommendation(resumeText: string, targetRole: string): Promise<Partial<AgentReport>> {
  const prompt = `You are the Project Recommendation Agent. Based on the candidate's current background and target role "${targetRole}", suggest three distinct hands-on projects (Beginner, Intermediate, Advanced) that would strengthen their portfolio.
Return a structured JSON object matching this schema:
{
  "projects": [
    {
      "level": "Beginner", // Beginner, Intermediate, Advanced
      "title": "Project Title",
      "description": "Comprehensive project description, what to build, and architecture guidance.",
      "skillsLearned": ["Skill 1", "Skill 2"],
      "duration": "2 weeks",
      "difficulty": "Easy - Moderate"
    },
    ... (one for Beginner, one for Intermediate, one for Advanced)
  ]
}

Resume Text:
${resumeText}

Ensure your response is valid JSON. Do not include markdown code blocks, return ONLY the raw JSON string.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4,
    }
  });

  return JSON.parse(cleanJsonString(response.text || "{}"));
}

// 7. Career Advice Agent
export async function runCareerAdvice(resumeText: string, targetRole: string): Promise<Partial<AgentReport>> {
  const prompt = `You are the Career Advice Agent. Provide general, strategic career guidance for the user transitioning to target role: "${targetRole}".
Analyze realistic job titles, current salary expectations (entry, mid, senior levels), learning priorities, next certificates, and long term future outlook.
Return a structured JSON object matching this schema:
{
  "careerAdvice": {
    "roles": [
      { "title": "Job Title 1", "matchPercentage": 85, "description": "Why this is a strong match" },
      ...
    ],
    "salaryExpectations": {
      "entry": "$70k - $90k",
      "mid": "$100k - $130k",
      "senior": "$140k - $180k+",
      "currency": "USD"
    },
    "learningPriorities": ["Priority 1", "Priority 2", ...],
    "nextCertifications": ["AWS Certified Machine Learning", ...],
    "futureOutlook": "Detailed perspective on this role's growth and AI impact over the next 5-10 years."
  }
}

Resume Text:
${resumeText}

Ensure your response is valid JSON. Do not include markdown code blocks, return ONLY the raw JSON string.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.3,
    }
  });

  return JSON.parse(cleanJsonString(response.text || "{}"));
}
