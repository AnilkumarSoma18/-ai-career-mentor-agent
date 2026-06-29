"""
Utility helper functions for python execution.
"""
from typing import Dict, Any

def clean_markdown_fences(json_str: str) -> str:
    """
    Cleans markdown code fences to expose clean raw JSON.
    """
    cleaned = json_str.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()
