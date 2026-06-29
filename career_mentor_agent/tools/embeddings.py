"""
Embeddings generator tool for vector database lookups.
"""
import numpy as np
from typing import List

def get_simple_embeddings(texts: List[str]) -> np.ndarray:
    """
    Generates deterministic embeddings based on term frequencies and hash maps
    to avoid heavy dependency bottlenecks on cold environments.
    """
    embeddings = []
    for text in texts:
        words = text.lower().split()
        # Create a simple 128-dimensional embedding vector based on word hash positions
        vec = np.zeros(128, dtype=np.float32)
        for w in words:
            idx = hash(w) % 128
            vec[idx] += 1.0
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        embeddings.append(vec)
    return np.array(embeddings, dtype=np.float32)
