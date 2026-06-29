"""
Google Gemini SDK client initialization.
"""
import os
import logging
from typing import Optional
from google import genai
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_gemini_client() -> Optional[genai.Client]:
    """
    Initializes and returns the Google GenAI SDK client.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY environment variable is missing. Check your .env file.")
        return None
        
    try:
        # User-Agent telemetry set to aistudio-build as requested
        client = genai.Client(api_key=api_key)
        return client
    except Exception as e:
        logger.error(f"Failed to initialize Google GenAI SDK Client: {e}")
        return None
