"""
Supervisor Agent coordinate routing in LangGraph.
"""
from typing import Dict, Any
from career_mentor_agent.tools.gemini_client import get_gemini_client

def run_supervisor_agent(query: str, target_role: str, active_feature: str) -> str:
    """
    Supervisor Agent that routes requests to specialized agents.
    """
    client = get_gemini_client()
    if not client:
        return "Resume Analyzer Agent" # Default fallback
        
    system_instruction = (
        "You are the Supervisor Coordinator of a Multi-Agent Career Mentor System. "
        "Based on user request, decide which agent should be executed next. "
        "Return ONLY the string of the selected agent. "
        "Available Agents:\n"
        "- Resume Analyzer Agent\n"
        "- Skill Gap Agent\n"
        "- Learning Roadmap Agent\n"
        "- Interview Agent\n"
        "- Resume Rewrite Agent\n"
        "- Project Recommendation Agent\n"
        "- Career Advice Agent\n"
    )
    
    prompt = f"Query: {query}. Selection: {active_feature}. Target Role: {target_role}."
    
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config={"system_instruction": system_instruction, "temperature": 0.1}
        )
        agent_name = response.text.strip()
        if "Analyzer" in agent_name: return "Resume Analyzer Agent"
        if "Gap" in agent_name: return "Skill Gap Agent"
        if "Roadmap" in agent_name: return "Learning Roadmap Agent"
        if "Interview" in agent_name: return "Interview Agent"
        if "Rewrite" in agent_name: return "Resume Rewrite Agent"
        if "Project" in agent_name: return "Project Recommendation Agent"
        if "Advice" in agent_name: return "Career Advice Agent"
        
        return "Resume Analyzer Agent"
    except Exception:
        return "Resume Analyzer Agent"
