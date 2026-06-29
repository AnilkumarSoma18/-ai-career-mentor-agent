"""
Interview Preparation Agent Node.
"""
from typing import Dict, Any
import json
from career_mentor_agent.tools.gemini_client import get_gemini_client

def run_interview_agent(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Generates tailored mock interview questions and model answers.
    """
    client = get_gemini_client()
    if not client:
        return {"error": "API Key not configured."}
        
    prompt = (
        f"Synthesize custom interview questions with standard model answers for role: {target_role}.\n"
        "Return a valid JSON object matching this schema:\n"
        "{\n"
        "  \"interviewPrep\": {\n"
        "    \"questions\": [\n"
        "      {\n"
        "        \"id\": \"q1\",\n"
        "        \"category\": \"Technical\",\n"
        "        \"question\": \"Question string\",\n"
        "        \"modelAnswer\": \"Professional answer strategy...\",\n"
        "        \"difficulty\": \"Medium\"\n"
        "      }\n"
        "    ]\n"
        "  }\n"
        "}\n\n"
        f"Resume context:\n{resume_text}"
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
