"""
AI Career Mentor Agent - Streamlit Dashboard Portal
"""
import streamlit as tf
import os
import json
from dotenv import load_dotenv

from career_mentor_agent.tools.pdf_reader import extract_text_from_pdf
from career_mentor_agent.tools.resume_parser import simple_resume_parser
from career_mentor_agent.agents.supervisor import run_supervisor_agent
from career_mentor_agent.agents.resume_agent import run_resume_analyzer
from career_mentor_agent.agents.skill_gap_agent import run_skill_gap_analyzer
from career_mentor_agent.agents.roadmap_agent import run_learning_roadmap
from career_mentor_agent.agents.interview_agent import run_interview_agent
from career_mentor_agent.agents.rewrite_agent import run_resume_rewrite
from career_mentor_agent.agents.project_agent import run_project_advisor
from career_mentor_agent.agents.career_agent import run_career_advisor

load_dotenv()

# Setup professional streamlit tab configs
tf.set_page_config(
    page_title="AI Career Mentor Agent",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Render customized beautiful styling rules
tf.markdown("""
<style>
    .metric-card {
        background-color: #f8fafc;
        padding: 20px;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        text-align: center;
    }
    .metric-val {
        font-size: 36px;
        font-weight: 900;
        color: #4f46e5;
    }
    .metric-label {
        font-size: 12px;
        color: #64748b;
        text-transform: uppercase;
        font-weight: 700;
        margin-top: 5px;
    }
</style>
""", unsafe_allow_code=True)

tf.title("⚡ AI Career Mentor Agent")
tf.caption("Production-grade Multi-Agent Mentorship Dashboard powered by LangGraph & Gemini 3.5 Flash")

# Initialize Session states
if "resume_text" not in tf.session_state:
    tf.session_state.resume_text = ""
if "resume_name" not in tf.session_state:
    tf.session_state.resume_name = ""
if "reports" not in tf.session_state:
    tf.session_state.reports = {}
if "chat_history" not in tf.session_state:
    tf.session_state.chat_history = []

# =========================================================
# SIDEBAR CONTROLS
# =========================================================
with tf.sidebar:
    tf.header("📋 Target Career Settings")
    
    # 1. Upload Section
    uploaded_file = tf.file_uploader("Upload Resume (PDF or TXT)", type=["pdf", "txt"])
    if uploaded_file is not None:
        if uploaded_file.name != tf.session_state.resume_name:
            # Save file to a temp path and parse text
            temp_path = os.path.join(".", uploaded_file.name)
            with open(temp_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
                
            if uploaded_file.name.endswith(".pdf"):
                extracted = extract_text_from_pdf(temp_path)
            else:
                with open(temp_path, "r", encoding="utf-8") as f:
                    extracted = f.read()
                    
            if extracted:
                tf.session_state.resume_text = extracted
                tf.session_state.resume_name = uploaded_file.name
                tf.success(f"Parsed {uploaded_file.name} successfully!")
            
            # Remove temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    # 2. Select Goal
    role_options = ["AI Engineer", "ML Engineer", "Data Scientist", "Software Engineer", "Backend Developer", "Cloud Engineer", "Product Manager"]
    target_role = tf.selectbox("Target Career Goal", role_options)
    custom_goal = tf.text_area("Optional transition details:", placeholder="E.g. Transitioning from non-tech.")
    
    # 3. Action Engage
    engage = tf.button("⚡ Engage Career Mentor", use_container_width=True)

# =========================================================
# MAIN SCREEN DASHBOARD
# =========================================================
if tf.session_state.resume_text:
    tf.info(f"Loaded Profile: **{tf.session_state.resume_name}** | Target: **{target_role}**")
    
    # Run Agent analysis if requested
    if engage:
        with tf.spinner("Specialized Career Agents collaborating..."):
            # 1. Run Resume Analyzer Node
            analysis = run_resume_analyzer(tf.session_state.resume_text, target_role)
            # 2. Run Skill Gaps Node
            skills = run_skill_gap_analyzer(tf.session_state.resume_text, target_role)
            # 3. Run Roadmap Node
            roadmap = run_learning_roadmap(tf.session_state.resume_text, target_role)
            # 4. Run Interview Node
            interview = run_interview_agent(tf.session_state.resume_text, target_role)
            # 5. Run Rewrite Node
            rewrite = run_resume_rewrite(tf.session_state.resume_text, target_role)
            # 6. Run Projects Node
            projects = run_project_advisor(tf.session_state.resume_text, target_role)
            # 7. Run Career Strategy Node
            career = run_career_advisor(tf.session_state.resume_text, target_role)
            
            # Save into reports dict
            tf.session_state.reports = {
                "analyze": analysis,
                "skill_gap": skills,
                "roadmap": roadmap,
                "interview": interview,
                "rewrite": rewrite,
                "projects": projects,
                "career": career
            }
            tf.success("All Career Mentoring diagnostics successfully compiled!")

    reports = tf.session_state.reports
    
    if "analyze" in reports:
        # Display Top KPI Scoreboards
        col1, col2, col3 = tf.columns(3)
        with col1:
            score = reports["analyze"].get("score", 75)
            tf.markdown(f"<div class='metric-card'><div class='metric-val'>{score}</div><div class='metric-label'>Overall Match Score</div></div>", unsafe_allow_code=True)
        with col2:
            ats_score = reports["analyze"].get("atsReport", {}).get("score", 70)
            tf.markdown(f"<div class='metric-card'><div class='metric-val'>{ats_score}%</div><div class='metric-label'>ATS Scannability</div></div>", unsafe_allow_code=True)
        with col3:
            verb_score = reports["analyze"].get("atsReport", {}).get("actionVerbsScore", 75)
            tf.markdown(f"<div class='metric-card'><div class='metric-val'>{verb_score}%</div><div class='metric-label'>Action Verbs Level</div></div>", unsafe_allow_code=True)
            
        tf.write("") # Spacing
        
        # Tabs for specialized Agent workspaces
        tabs = tf.tabs(["📋 Resume Diagnostics", "🎯 Skill Gaps", "🗓️ 8-Week study path", "💬 Mock Interview Prep", "✨ Resume Rewrite", "📁 Portfolio projects", "🚀 Career advice"])
        
        # Tab 1: Diagnostics
        with tabs[0]:
            tf.subheader("Resume Diagnostics & Diagnostics Reports")
            tf.write(reports["analyze"].get("summary", "No summary available."))
            
            col_st, col_wk = tf.columns(2)
            with col_st:
                tf.markdown("### 👍 Strengths")
                for s in reports["analyze"].get("strengths", []):
                    tf.write(f"- {s}")
            with col_wk:
                tf.markdown("### ⚠️ Critical Gaps")
                for w in reports["analyze"].get("weaknesses", []):
                    tf.write(f"- {w}")

        # Tab 2: Skill Gaps
        with tabs[1]:
            if "skill_gap" in reports:
                sg = reports["skill_gap"].get("skill_gap", {})
                tf.subheader("Skill Match Matrix")
                
                col_match, col_miss = tf.columns(2)
                with col_match:
                    tf.markdown("**Verified Strengths**")
                    tf.write(", ".join(sg.get("matchingSkills", [])))
                with col_miss:
                    tf.markdown("**Identified Missing Skills**")
                    tf.write(", ".join(sg.get("missingSkills", [])))
                
                tf.subheader("Recommended Stack Extensions")
                tf.write(", ".join(sg.get("recommendedTechnologies", [])))

        # Tab 3: Study Roadmap
        with tabs[2]:
            if "roadmap" in reports:
                rm = reports["roadmap"].get("roadmap", {})
                tf.subheader("Structured 8-Week Transition Syllabus")
                
                for week in rm.get("weeks", []):
                    with tf.expander(f"📅 Week {week.get('weekNumber')}: {week.get('title')}"):
                        tf.write("**Topics to Study:**")
                        tf.write(", ".join(week.get("topics", [])))
                        tf.write("**Study Resources:**")
                        for r in week.get("resources", []):
                            tf.write(f"- {r}")
                        
                        mp = week.get("miniProject", {})
                        if mp:
                            tf.info(f"**Action Project:** {mp.get('title')} — {mp.get('description')}")

        # Tab 4: Interview Prep
        with tabs[3]:
            if "interview" in reports:
                prep = reports["interview"].get("interviewPrep", {})
                tf.subheader("Mock Interview Preparation Coach")
                
                for idx, q in enumerate(prep.get("questions", [])):
                    with tf.expander(f"❓ [{q.get('category')}] {q.get('question')}"):
                        tf.markdown(f"**Difficulty Level**: `{q.get('difficulty')}`")
                        tf.success(f"**Sample Model Answer Strategy:**\n\n{q.get('modelAnswer')}")

        # Tab 5: Resume Rewrites
        with tabs[4]:
            if "rewrite" in reports:
                rw = reports["rewrite"].get("rewrittenResume", {})
                tf.subheader("ATS-Optimized Phrasings")
                
                summary = rw.get("summary", {})
                if summary:
                    with tf.expander("📝 Professional Summary Rewrite"):
                        tf.markdown("**Original:**")
                        tf.caption(summary.get("original", "None"))
                        tf.markdown("**ATS Rewrite:**")
                        tf.write(summary.get("rewritten", "None"))
                        tf.markdown(f"*Explanation:* {summary.get('explanation')}")

        # Tab 6: Portfolio Projects
        with tabs[5]:
            if "projects" in reports:
                projs = reports["projects"].get("projects", [])
                tf.subheader("Recommended Portfolio Builders")
                
                for p in projs:
                    tf.markdown(f"### 📁 {p.get('title')} (`{p.get('level')}`)")
                    tf.write(p.get("description"))
                    tf.write(f"**Est. Duration:** {p.get('duration')} | **Difficulty:** {p.get('difficulty')}")
                    tf.write(f"**Skills targeted:** {', '.join(p.get('skillsLearned', []))}")
                    tf.write("---")

        # Tab 7: Career Advice
        with tabs[6]:
            if "career" in reports:
                adv = reports["career"].get("careerAdvice", {})
                tf.subheader("Strategic Career Trajectory")
                tf.write(adv.get("futureOutlook"))
                
                tf.subheader("Parallel Target Opportunities")
                for r in adv.get("roles", []):
                    tf.write(f"- **{r.get('title')}** ({r.get('matchPercentage')}% match) — {r.get('description')}")
                    
                sal = adv.get("salaryExpectations", {})
                if sal:
                    tf.subheader(f"Est. Salary scale ({sal.get('currency', 'USD')})")
                    tf.write(f"Entry: `{sal.get('entry')}` | Mid: `{sal.get('mid')}` | Senior: `{sal.get('senior')}`")

else:
    tf.warning("👈 Please upload a PDF resume or type your experience details in the sidebar to load the Mentor cockpit.")
