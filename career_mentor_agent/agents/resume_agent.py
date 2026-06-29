"""
Resume Analyzer Agent Node.
"""
from typing import Dict, Any
import json
from career_mentor_agent.tools.gemini_client import get_gemini_client

def run_resume_analyzer(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Evaluates resume strengths, weaknesses, formatting, and ATS friendliness.
    """
    client = get_gemini_client()
    if not client:
        return {"error": "API Key not configured."}
        
    prompt = (
        f"Analyze the following resume against target role: {target_role}.\n"
        "Return a valid JSON object matching this schema:\n"
        "{\n"
        "  \"score\": 85,\n"
        "  \"summary\": \"Executive summary analysis...\",\n"
        "  \"strengths\": [\"Strength 1\", \"Strength 2\"],\n"
        "  \"weaknesses\": [\"Gap 1\", \"Gap 2\"],\n"
        "  \"atsReport\": {\n"
        "    \"score\": 80,\n"
        "    \"issues\": [\"Issue 1\"],\n"
        "    \"missingKeywords\": [\"Keyword 1\"],\n"
        "    \"actionVerbsScore\": 85,\n"
        "    \"formattingTips\": [\"Tip 1\"]\n"
        "  }\n"
        "}\n\n"
        f"Resume Text:\n{resume_text}"
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
