"""
Project Recommendation Agent Node.
"""
from typing import Dict, Any
import json
from career_mentor_agent.tools.gemini_client import get_gemini_client

def run_project_advisor(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Suggests high-quality portfolio projects at Beginner, Intermediate, and Advanced levels.
    """
    client = get_gemini_client()
    if not client:
        return {"error": "API Key not configured."}
        
    prompt = (
        f"Recommend three customized portfolio projects at different levels for the role of {target_role}.\n"
        "Return a valid JSON object matching this schema:\n"
        "{\n"
        "  \"projects\": [\n"
        "    {\n"
        "      \"level\": \"Beginner\",\n"
        "      \"title\": \"Title\",\n"
        "      \"description\": \"Details...\",\n"
        "      \"skillsLearned\": [\"Skill\"],\n"
        "      \"duration\": \"1 week\",\n"
        "      \"difficulty\": \"Easy\"\n"
        "    }\n"
        "  ]\n"
        "}\n\n"
        f"Resume Background:\n{resume_text}"
    )
    
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config={"response_mime_type": "application/json", "temperature": 0.4}
        )
        return json.loads(response.text)
    except Exception as e:
        return {"error": str(e)}
