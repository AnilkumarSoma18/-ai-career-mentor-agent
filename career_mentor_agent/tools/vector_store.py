"""
FAISS Vector Store wrapper for indexing resume chunks and learning resources.
"""
import faiss
import numpy as np
from typing import List, Dict, Any
from career_mentor_agent.tools.embeddings import get_simple_embeddings

class LocalVectorStore:
    """
    In-memory vector store using FAISS and simple hashing embeddings.
    """
    def __init__(self, dimension: int = 128):
        self.dimension = dimension
        self.index = faiss.IndexFlatIP(dimension)  # Inner Product similarity
        self.metadata: List[Dict[str, Any]] = []

    def add_texts(self, texts: List[str], metadatas: List[Dict[str, Any]]):
        """
        Embeds and indexes texts inside FAISS.
        """
        if not texts:
            return
        embeddings = get_simple_embeddings(texts)
        self.index.add(embeddings)
        self.metadata.extend(metadatas)

    def similarity_search(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """
        Performs semantic similarity search.
        """
        if self.index.ntotal == 0:
            return []
        query_vector = get_simple_embeddings([query])
        distances, indices = self.index.search(query_vector, k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1 or idx >= len(self.metadata):
                continue
            results.append({
                "metadata": self.metadata[idx],
                "score": float(distances[0][i])
            })
        return results
