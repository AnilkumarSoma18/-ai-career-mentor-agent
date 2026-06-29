"""
PDF Reader Tool to parse uploaded resume files.
"""
import logging
from typing import Optional
import PyPDF2

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str) -> Optional[str]:
    """
    Extracts plain text from a PDF file path.
    """
    try:
        text = ""
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        # Simple cleanup
        cleaned_text = " ".join(text.split())
        return cleaned_text
    except Exception as e:
        logger.error(f"Error reading PDF file at {file_path}: {e}")
        return None
