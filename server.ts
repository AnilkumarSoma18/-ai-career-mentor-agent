import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
// @ts-ignore
import pdf from "pdf-parse";
import {
  runSupervisor,
  runResumeAnalyzer,
  runSkillGap,
  runLearningRoadmap,
  runInterviewAgent,
  runResumeRewrite,
  runProjectRecommendation,
  runCareerAdvice
} from "./server/agents.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use increased limit to support large PDF uploads easily
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));

  // API 1: Parse PDF/TXT Resume Text
  app.post("/api/parse-resume", async (req, res) => {
    try {
      const { fileBase64, fileName, fileText } = req.body;

      if (fileText) {
        // Already plain text
        return res.json({ text: fileText });
      }

      if (!fileBase64) {
        return res.status(400).json({ error: "No file content provided" });
      }

      if (fileName && fileName.toLowerCase().endsWith(".pdf")) {
        const dataBuffer = Buffer.from(fileBase64, "base64");
        const parsed = await pdf(dataBuffer);
        
        if (!parsed || !parsed.text) {
          return res.status(400).json({ error: "Failed to extract text from PDF. Ensure the file contains text and is not an image scan." });
        }
        
        return res.json({ text: parsed.text });
      } else {
        // Plain text fallback
        const decodedText = Buffer.from(fileBase64, "base64").toString("utf-8");
        return res.json({ text: decodedText });
      }
    } catch (err: any) {
      console.error("Resume parsing error:", err);
      res.status(500).json({ error: err.message || "Error parsing resume file." });
    }
  });

  // API 2: Agent Query Router
  app.post("/api/agent-query", async (req, res) => {
    try {
      const { resumeText, targetRole, customGoal, selectedAgent, userQuery } = req.body;

      if (!resumeText) {
        return res.status(400).json({ error: "Resume text is required to start mentoring." });
      }
      if (!targetRole) {
        return res.status(400).json({ error: "Target career role is required." });
      }

      const query = userQuery || `Perform career mentoring for role: ${targetRole}`;

      // 1. Determine which agent to run using Supervisor
      let activeAgent = selectedAgent;
      if (!activeAgent || activeAgent === "Supervisor") {
        const featureMapping: Record<string, string> = {
          analyze: "Resume Analyzer Agent",
          skill_gap: "Skill Gap Agent",
          roadmap: "Learning Roadmap Agent",
          interview: "Interview Agent",
          rewrite: "Resume Rewrite Agent",
          projects: "Project Recommendation Agent",
          career: "Career Advice Agent"
        };
        
        // If a specific agent wasn't requested, we can let supervisor decide or map it from feature
        const supervisorDecided = await runSupervisor(query, resumeText, targetRole, req.body.currentFeature || "analyze");
        activeAgent = supervisorDecided;
      }

      console.log(`Routing query to agent: [${activeAgent}] for target role: [${targetRole}]`);

      // 2. Execute selected Agent
      let reportData = {};
      
      switch (activeAgent) {
        case "Resume Analyzer Agent":
          reportData = await runResumeAnalyzer(resumeText, targetRole);
          break;
        case "Skill Gap Agent":
          reportData = await runSkillGap(resumeText, targetRole);
          break;
        case "Learning Roadmap Agent":
          reportData = await runLearningRoadmap(resumeText, targetRole);
          break;
        case "Interview Agent":
          reportData = await runInterviewAgent(resumeText, targetRole);
          break;
        case "Resume Rewrite Agent":
          reportData = await runResumeRewrite(resumeText, targetRole);
          break;
        case "Project Recommendation Agent":
          reportData = await runProjectRecommendation(resumeText, targetRole);
          break;
        case "Career Advice Agent":
          reportData = await runCareerAdvice(resumeText, targetRole);
          break;
        default:
          reportData = await runResumeAnalyzer(resumeText, targetRole);
          activeAgent = "Resume Analyzer Agent";
      }

      // Add metadata to the report
      const fullReport = {
        agentName: activeAgent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        targetRole,
        ...reportData
      };

      res.json({
        agentName: activeAgent,
        report: fullReport,
        message: `Mentoring session complete. Analysis conducted by: **${activeAgent}**.`
      });
    } catch (err: any) {
      console.error("Agent query error:", err);
      res.status(500).json({ error: err.message || "An error occurred during Agent processing. Please verify your GEMINI_API_KEY in Secrets." });
    }
  });

  // Vite dev server vs production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
