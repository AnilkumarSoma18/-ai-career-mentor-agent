"""
Resume Parser utility to extract metadata from resumes.
"""
import re
from typing import Dict, Any

def simple_resume_parser(text: str) -> Dict[str, Any]:
    """
    Parses name, email, phone and general key elements from resume text.
    """
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    phone_match = re.search(r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
    
    email = email_match.group(0) if email_match else "Unknown Email"
    phone = phone_match.group(0) if phone_match else "Unknown Phone"
    
    # Try to extract name (usually first line)
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    name = lines[0] if lines else "Candidate Name"
    
    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": [],
        "experience": []
    }
