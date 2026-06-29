"""
Learning Roadmap Agent Node.
"""
from typing import Dict, Any
import json
from career_mentor_agent.tools.gemini_client import get_gemini_client

def run_learning_roadmap(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Generates a targeted 8-week course curriculum to bridge skills gaps.
    """
    client = get_gemini_client()
    if not client:
        return {"error": "API Key not configured."}
        
    prompt = (
        f"Generate a robust 8-week learning roadmap for a candidate transitioning to: {target_role}.\n"
        "Return a valid JSON object matching this schema:\n"
        "{\n"
        "  \"roadmap\": {\n"
        "    \"weeks\": [\n"
        "      {\n"
        "        \"weekNumber\": 1,\n"
        "        \"title\": \"Theme\",\n"
        "        \"topics\": [\"Topic 1\"],\n"
        "        \"resources\": [\"Course/Book\"],\n"
        "        \"practiceTasks\": [\"Task 1\"],\n"
        "        \"miniProject\": {\n"
        "          \"title\": \"Title\",\n"
        "          \"description\": \"Details...\",\n"
        "          \"skillsLearned\": [\"Skill\"]\n"
        "        }\n"
        "      }\n"
        "    ]\n"
        "  }\n"
        "}\n\n"
        f"Resume Context:\n{resume_text}"
    )
    
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config={"response_mime_type": "application/json", "temperature": 0.3}
        )
        return json.loads(response.text)
    except Exception as e:
        return {"error": str(e)}
