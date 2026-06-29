"""
Skill Gap Agent Node.
"""
from typing import Dict, Any
import json
from career_mentor_agent.tools.gemini_client import get_gemini_client

def run_skill_gap_analyzer(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Compares resume technologies with target role expectations.
    """
    client = get_gemini_client()
    if not client:
        return {"error": "API Key not configured."}
        
    prompt = (
        f"Analyze skills gap between this resume and target role: {target_role}.\n"
        "Return a valid JSON object matching this schema:\n"
        "{\n"
        "  \"skillGap\": {\n"
        "    \"matchingSkills\": [\"Skill 1\"],\n"
        "    \"missingSkills\": [\"Missing 1\"],\n"
        "    \"recommendedTechnologies\": [\"Tech 1\"],\n"
        "    \"importantCertifications\": [\"Cert 1\"],\n"
        "    \"prioritySkills\": [\n"
        "      { \"name\": \"Skill\", \"priority\": \"High\", \"reason\": \"Reason...\" }\n"
        "    ]\n"
        "  }\n"
        "}\n\n"
        f"Resume:\n{resume_text}"
    )
    
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config={"response_mime_type": "application/json", "temperature": 0.2}
        )
        return json.loads(response.text)
    except Exception as e:
        return {"error": str(e)}
