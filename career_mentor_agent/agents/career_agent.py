"""
Career Strategy Advisor Agent Node.
"""
from typing import Dict, Any
import json
from career_mentor_agent.tools.gemini_client import get_gemini_client

def run_career_advisor(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Strategically advises on general matches, salaries, and future growth trajectories.
    """
    client = get_gemini_client()
    if not client:
        return {"error": "API Key not configured."}
        
    prompt = (
        f"Provide high-level strategic career transition advice for target role: {target_role}.\n"
        "Return a valid JSON object matching this schema:\n"
        "{\n"
        "  \"careerAdvice\": {\n"
        "    \"roles\": [\n"
        "      { \"title\": \"Job Title\", \"matchPercentage\": 80, \"description\": \"Details...\" }\n"
        "    ],\n"
        "    \"salaryExpectations\": {\n"
        "      \"entry\": \"$80k - $100k\",\n"
        "      \"mid\": \"$110k - $130k\",\n"
        "      \"senior\": \"$150k+\",\n"
        "      \"currency\": \"USD\"\n"
        "    },\n"
        "    \"learningPriorities\": [\"Priority 1\"],\n"
        "    \"nextCertifications\": [\"Cert 1\"],\n"
        "    \"futureOutlook\": \"Outlook summary...\"\n"
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
