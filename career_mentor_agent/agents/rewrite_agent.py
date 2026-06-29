"""
Resume Rewrite Agent Node.
"""
from typing import Dict, Any
import json
from career_mentor_agent.tools.gemini_client import get_gemini_client

def run_resume_rewrite(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Rewrites resume sections for optimal ATS scannability.
    """
    client = get_gemini_client()
    if not client:
        return {"error": "API Key not configured."}
        
    prompt = (
        f"Rewrite key resume elements (summary, bullets) to match the keyword frequency of target role: {target_role}.\n"
        "Return a valid JSON object matching this schema:\n"
        "{\n"
        "  \"rewrittenResume\": {\n"
        "    \"summary\": { \"original\": \"...\", \"rewritten\": \"...\", \"explanation\": \"...\" },\n"
        "    \"experience\": [{ \"original\": \"...\", \"rewritten\": \"...\", \"explanation\": \"...\" }],\n"
        "    \"projects\": [{ \"original\": \"...\", \"rewritten\": \"...\", \"explanation\": \"...\" }],\n"
        "    \"skills\": { \"original\": \"...\", \"rewritten\": \"...\", \"explanation\": \"...\" }\n"
        "  }\n"
        "}\n\n"
        f"Resume:\n{resume_text}"
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
