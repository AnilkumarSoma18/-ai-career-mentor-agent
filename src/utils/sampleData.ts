import { UserProfile } from "../types.js";

export const SAMPLE_PROFILE: UserProfile = {
  resumeText: `JANE DOE
San Francisco, CA | jane.doe@email.com | (123) 456-7890 | github.com/janedoe

PROFESSIONAL SUMMARY
Highly motivated Software Engineer with 2+ years of experience building scalable web applications. Strong foundations in JavaScript, React, Node.js, and SQL. Actively transitioning into AI Engineering, with recent self-study in Python, PyTorch, and Large Language Model architectures. Experienced in agile processes and continuous integration.

PROFESSIONAL EXPERIENCE
Software Engineer | TechCorp Inc. | Jan 2024 - Present
- Maintained and optimized high-traffic client dashboard interfaces, resulting in a 25% reduction in frontend load time.
- Implemented responsive micro-frontend modules using React 18, enhancing cross-team agility.
- Authored automated Cypress integration test suites, boosting team deployment confidence.
- Engineered safe database migrations for complex PostgreSQL clusters.

Associate Developer | DevStudio LLC | Jun 2022 - Dec 2023
- Supported the development of RESTful web APIs using Express and Node.js.
- Developed visual reporting dashboards using D3.js and Tailwind CSS.
- Participated in code reviews and active pair-programming sessions.

EDUCATION
B.S. Computer Science | State University | Graduated 2022

PROJECTS
Smart-Summarizer Web App (Personal Project)
- Developed a full-stack document summarizer using Node.js and basic API integrations.
- Styled a sleek, responsive interface utilizing Tailwind CSS.

SKILLS
- Frontend: React, Redux, Tailwind CSS, HTML5, CSS3, TypeScript
- Backend: Node.js, Express, REST APIs, PostgreSQL, MongoDB
- Tools & Processes: Git, Docker, CI/CD, Agile/Scrum, Cypress`,
  resumeFileName: "jane_doe_software_engineer.pdf",
  targetRole: "AI Engineer",
  customGoal: "Transitioning from general frontend development to specialized AI/LLM engineering at a fast-growing startup.",
  reports: {
    "Resume Analyzer Agent": {
      agentName: "Resume Analyzer Agent",
      timestamp: "10:15 PM",
      targetRole: "AI Engineer",
      score: 82,
      summary: "Jane is a competent Frontend/Full-Stack engineer with robust core developer patterns (Git, databases, agile). However, the resume needs a substantial rewrite to re-focus her narrative towards AI. Currently, 90% of the resume highlights general web application tooling rather than systems reasoning, python pipelines, or vector databases. Her personal Smart-Summarizer project is a great seed to highlight model integrations.",
      strengths: [
        "Strong foundations in web architecture and databases (React, Express, PostgreSQL)",
        "Proven metric of success (optimized load times by 25%)",
        "Clear professional growth and experience with test suites (Cypress)"
      ],
      weaknesses: [
        "Lacks visual evidence of Python, PyTorch, or deep learning libraries",
        "Does not specify experience with vector databases (Pinecone, Chroma) or LLM orchestrations (LangChain, LangGraph)",
        "smart-summarizer description is generic and does not highlight LLM prompting or chunking strategies"
      ],
      atsReport: {
        score: 75,
        issues: [
          "Resume reads as 'Frontend Developer' - ATS algorithms for 'AI Engineer' will rank this lower.",
          "Missing modern search and embedding keywords."
        ],
        missingKeywords: ["LangChain", "Retrieval Augmented Generation (RAG)", "Vector DB", "Embeddings", "PyTorch", "Hugging Face"],
        actionVerbsScore: 84,
        formattingTips: [
          "Format skills into clear sub-disciplines: Web, Machine Learning, and DevOps.",
          "Utilize the X-Y-Z formula for the Personal Smart-Summarizer project to emphasize model latency improvements."
        ]
      }
    },
    "Skill Gap Agent": {
      agentName: "Skill Gap Agent",
      timestamp: "10:16 PM",
      targetRole: "AI Engineer",
      skillGap: {
        matchingSkills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Git", "Docker"],
        missingSkills: ["Python", "PyTorch", "LangChain / LangGraph", "Vector Databases", "Embeddings", "RAG Systems", "Prompt Engineering"],
        recommendedTechnologies: ["Python 3.11+", "LangChain / LangGraph", "Pinecone or Chroma", "Hugging Face Transformers", "OpenAI / Gemini SDKs"],
        importantCertifications: [
          "DeepLearning.AI Generative AI with LLMs",
          "Google Cloud Professional Machine Learning Engineer",
          "TensorFlow Developer Certificate"
        ],
        prioritySkills: [
          { name: "Python Programming", priority: "High", reason: "AI Pipelines, script testing, and LLM orchestration depend almost exclusively on Python." },
          { name: "LangChain / LangGraph", priority: "High", reason: "Standard tools for building custom multi-agent chains and RAG networks." },
          { name: "Vector Database Structuring", priority: "Medium", reason: "Critical for handling long-term context memory in commercial AI systems." }
        ]
      }
    },
    "Learning Roadmap Agent": {
      agentName: "Learning Roadmap Agent",
      timestamp: "10:17 PM",
      targetRole: "AI Engineer",
      roadmap: {
        weeks: [
          {
            weekNumber: 1,
            title: "Advanced Python & PyTorch Basics",
            topics: ["Object-Oriented Python", "Generators & Decorators", "PyTorch Tensors", "Basic Neural Networks"],
            resources: ["Python for Everybody (Coursera)", "PyTorch Official Tutorials"],
            practiceTasks: ["Write a custom generator for chunking datasets", "Train a linear regression model in PyTorch"],
            miniProject: {
              title: "Tensor Manipulator",
              description: "Build a dataset preprocessor that normalizes training sets and filters anomalies using NumPy.",
              skillsLearned: ["NumPy", "PyTorch", "Data Cleansing"]
            }
          },
          {
            weekNumber: 2,
            title: "Large Language Model API Integration",
            topics: ["Gemini API", "Prompt Engineering Concepts", "API Key Security", "Structured JSON Outputs"],
            resources: ["DeepLearning.AI - Prompt Engineering for Developers", "Google AI Studio Quickstarts"],
            practiceTasks: ["Configure safe server-side API calls", "Build an automated prompt expander"],
            miniProject: {
              title: "AI Email Assistant",
              description: "Create an Express proxy endpoint that takes customer complaints and outputs structured JSON classification emails using Gemini 3.5 Flash.",
              skillsLearned: ["Gemini SDK", "JSON Schemas", "Express"]
            }
          },
          {
            weekNumber: 3,
            title: "Vector Embeddings & Semantic Search",
            topics: ["Semantic Distance (Cosine, L2)", "Generating Embeddings", "FAISS Vector Database", "Chunking Strategies"],
            resources: ["Hugging Face Embeddings Guide", "Pinecone Vector Academy"],
            practiceTasks: ["Compare cosine similarity of test sentences", "Implement custom sliding window text chunker"],
            miniProject: {
              title: "FAQ Semantic Finder",
              description: "Create a CLI tool using Python and FAISS that matches user search strings against a corporate FAQ knowledge base with sub-second retrieval.",
              skillsLearned: ["FAISS", "Sentence Transformers", "Semantic Search"]
            }
          },
          {
            weekNumber: 4,
            title: "Building Retrieval Augmented Generation (RAG)",
            topics: ["RAG Architecture", "Query Expansion", "Metadata Filtering", "Response Synthesis"],
            resources: ["LangChain Documentation - Retrieval", "RAG Triad Evaluation (TruLens)"],
            practiceTasks: ["Assemble manual retriever matching context to prompt", "Implement citation mapping for generated text"],
            miniProject: {
              title: "Local Document QA Bot",
              description: "A chat app that allows users to upload custom textbooks and receive contextual answers based exclusively on those documents.",
              skillsLearned: ["RAG", "Context Injection", "Streamlit UI"]
            }
          },
          {
            weekNumber: 5,
            title: "Agentic Flows & LangGraph Networks",
            topics: ["State Graphs", "State Management", "Routing Actions", "Memory Retention"],
            resources: ["LangGraph Official Notebooks", "Multi-Agent Systems Courses"],
            practiceTasks: ["Implement state transitions based on model validation", "Configure memory threads for continuing chats"],
            miniProject: {
              title: "Multi-Agent Research Planner",
              description: "An agentic flow where a Planner Agent generates a list of study topics and a Reviewer Agent validates and adjusts the topics iteratively.",
              skillsLearned: ["LangGraph", "State Management", "Agent Workflows"]
            }
          },
          {
            weekNumber: 6,
            title: "AI Agents with Tools (Function Calling)",
            topics: ["Function Declarations", "Tool Invocation Routing", "Handling Tool Execution Errors", "API Proxies"],
            resources: ["Gemini SDK Tool Reference", "OpenAPI Specification"],
            practiceTasks: ["Expose weather search functions to a Gemini Agent", "Build a validator checking execution outputs"],
            miniProject: {
              title: "SQL Agentic Interface",
              description: "Develop an AI assistant that takes natural language requests, writes SQL, safe-runs it on a database, and summarizes findings.",
              skillsLearned: ["Function Calling", "Database Agents", "Prompt Security"]
            }
          },
          {
            weekNumber: 7,
            title: "Model Fine-Tuning & Evaluation Metrics",
            topics: ["Parameter-Efficient Fine-Tuning (PEFT)", "LoRA", "Evaluation Metrics (ROUGE, BLEU, LLM-as-a-Judge)"],
            resources: ["Hugging Face PEFT Library", "Weights & Biases Fine-Tuning Courses"],
            practiceTasks: ["Write evaluation prompts using a grading matrix", "Analyze training curves from validation datasets"],
            miniProject: {
              title: "Model Evaluator Suite",
              description: "Create a script that evaluates response fidelity of two distinct model parameters against 50 core test questions.",
              skillsLearned: ["Fine-tuning Concepts", "Model Evaluation", "Analytics"]
            }
          },
          {
            weekNumber: 8,
            title: "Production Deployment & Security Best Practices",
            topics: ["Prompt Injection Prevention", "Rate-Limiting AI Endpoints", "VLLM / Server-Side Hosting", "Caching Prompt Prefixes"],
            resources: ["OWASP Top 10 LLM Security Risks", "Dockerizing AI Containers"],
            practiceTasks: ["Write safety guardrails checking input inputs", "Enable Redis caching for duplicate search semantic strings"],
            miniProject: {
              title: "Secure AI Gateway API",
              description: "Design a containerized Express REST API that handles secure Gemini completions, monitors token quotas, and filters prompt injections.",
              skillsLearned: ["Docker", "Prompt Safety Guardrails", "Production Scaling"]
            }
          }
        ]
      }
    },
    "Interview Agent": {
      agentName: "Interview Agent",
      timestamp: "10:18 PM",
      targetRole: "AI Engineer",
      interviewPrep: {
        questions: [
          {
            id: "q1",
            category: "Technical",
            question: "What is the difference between semantic search (embeddings) and lexical search (TF-IDF/BM25)? In what scenarios should we combine them?",
            modelAnswer: "Semantic search matches query intent by projecting text into a high-dimensional vector space (via embedding models), allowing it to grasp synonyms and context (e.g., matching 'car' with 'automobile'). Lexical search (BM25) relies on exact term frequency. \n\nWe should combine them (Hybrid Search) when precise keyword hits are critical alongside synonym mapping—such as looking up SKU codes or specific technical product numbers within an otherwise conversational search portal. We use Reciprocal Rank Fusion (RRF) to merge and rank the candidate lists from both techniques.",
            difficulty: "Medium"
          },
          {
            id: "q2",
            category: "Coding",
            question: "Write a simple token-level chunking function in Python that takes a list of words, an overlap count, and max tokens, returning a list of overlapping text chunks.",
            modelAnswer: "Here is a standard slide-window approach:\n\n```python\ndef chunk_text_by_words(words, max_tokens, overlap):\n    if max_tokens <= overlap:\n        raise ValueError('max_tokens must exceed overlap')\n    chunks = []\n    step = max_tokens - overlap\n    for i in range(0, len(words), step):\n        chunk = words[i:i + max_tokens]\n        chunks.append(' '.join(chunk))\n        if i + max_tokens >= len(words):\n            break\n    return chunks\n```\nExplain how this prevents context loss during text split processes.",
            difficulty: "Medium"
          },
          {
            id: "q3",
            category: "System Design",
            question: "Design an enterprise-level RAG pipeline that handles 10,000 PDF documents. How do you handle document parsing, updates, and indexing safely?",
            modelAnswer: "1. **Parsing Pipeline**: Use an asynchronous task queue (like Celery) to parse PDFs using robust libraries (like PyMuPDF or layout-aware parsers). \n2. **Database Schema**: Store raw text, metadata, and embeddings. Use PostgreSQL with pgvector or dedicated vector stores like Pinecone.\n3. **Updating / Syncing**: Implement a hash-checksum database. When a document updates, compare the file MD5 hash. If different, purge old chunks using metadata-filtering `doc_id = XYZ` and write new chunks. \n4. **Performance Optimization**: Enable semantic chunk-caching, metadata filtering to avoid scanning unrelated indices, and chunk pre-fetching.",
            difficulty: "Hard"
          },
          {
            id: "q4",
            category: "Behavioral",
            question: "Explain a time you had to deal with an LLM production system hallucinating critical metrics. How did you identify and remediate it?",
            modelAnswer: "Explain this using the STAR method (Situation, Task, Action, Result):\n- **Situation**: During a feature launch of our smart summarizer, users reported the AI was inventing fictional percentage numbers from corporate PDFs.\n- **Task**: Standardize evaluation and implement guardrails.\n- **Action**: I set up an automated 'LLM-as-a-Judge' pipeline (using Gemini 3.5 Flash) checking output facts against source chunks. I updated our prompting to instruct the model to return 'I do not know' if information isn't directly mentioned in context.\n- **Result**: Hallucinations in production dropped from 12% to under 0.5% within 3 days, restoring customer trust.",
            difficulty: "Hard"
          }
        ]
      }
    },
    "Resume Rewrite Agent": {
      agentName: "Resume Rewrite Agent",
      timestamp: "10:19 PM",
      targetRole: "AI Engineer",
      rewrittenResume: {
        summary: {
          original: "Highly motivated Software Engineer with 2+ years of experience building scalable web applications. Strong foundations in JavaScript, React, Node.js, and SQL. Actively transitioning into AI Engineering...",
          rewritten: "AI Systems & Software Engineer with 2+ years of experience designing high-throughput web architectures and intelligence-driven APIs. Proficient in TypeScript/React alongside Python development, LLM integration, and semantic indexers. Proven record in model latency optimization, full-stack database management, and implementing secure API proxies for scalable, cost-efficient Generative AI systems.",
          explanation: "Redefines your engineering title from 'Software Engineer' to 'AI Systems & Software Engineer'. Infuses critical target keywords (AI, APIs, LLM integration, semantic indexing, latency optimization, proxies) immediately into the first sentence to secure high ATS relevance."
        },
        experience: [
          {
            original: "Maintained and optimized high-traffic client dashboard interfaces, resulting in a 25% reduction in frontend load time.",
            rewritten: "Engineered scalable RESTful API proxies and optimized frontend interface state delivery, reducing load latency by 25% and cutting server token transmission bottlenecks.",
            explanation: "Shifts focus from visual frontend layout updates to back-end API proxy scalability, which is far more valued in core AI Engineering pipelines."
          },
          {
            original: "Engineered safe database migrations for complex PostgreSQL clusters.",
            rewritten: "Designed robust PostgreSQL schema migrations and integrated indexing matrices, enabling sub-second lookup retrieval times for highly-structured search contexts.",
            explanation: "Highlights information retrieval and index designs—vital prerequisite engineering foundations for RAG development."
          }
        ],
        projects: [
          {
            original: "Developed a full-stack document summarizer using Node.js and basic API integrations.",
            rewritten: "Designed and implemented an offline-first 'Smart-Summarizer' application featuring custom text chunking pipelines and a secure Node.js proxy routing queries to Gemini 3.5 Flash, reducing cost-per-query through prompt prefix semantic caching.",
            explanation: "Reframes a standard API-wrapper into an advanced engineering system with caching, chunking, and proxy security."
          }
        ],
        skills: {
          original: "Frontend: React, Redux, Tailwind CSS, TypeScript. Backend: Node.js, Express, PostgreSQL. Tools: Git, Docker.",
          rewritten: "- **AI Orchestration & Scripting**: Python, TypeScript, LLM Integration, Prompt Engineering, Semantic Search, Chunking Strategies\n- **Full-Stack & Systems**: Node.js, Express, React, PostgreSQL (pgvector), RESTful Proxies\n- **Infrastructure & Quality**: Docker, Git, CI/CD, Automated Testing (Cypress)",
          explanation: "Indexes your technical stack under category taxonomy fields expected by Technical Hiring Managers for AI roles."
        }
      }
    },
    "Project Recommendation Agent": {
      agentName: "Project Recommendation Agent",
      timestamp: "10:20 PM",
      targetRole: "AI Engineer",
      projects: [
        {
          level: "Beginner",
          title: "AI Prompt Playground and Token Tracker",
          description: "Build a single-screen dashboard where users can test prompts against Gemini, view real-time token usage, and estimate execution cost. Store prompt histories locally.",
          skillsLearned: ["Gemini API", "Local Storage", "Cost Estimation Models"],
          duration: "1 week",
          difficulty: "Easy"
        },
        {
          level: "Intermediate",
          title: "Intelligent Semantic Book Finder",
          description: "Develop a backend application that loads 50 PDF books, generates embeddings, stores them in an in-memory FAISS vector index, and lets users query content using semantic search.",
          skillsLearned: ["Python", "FAISS", "Embeddings", "PDF Chunking"],
          duration: "3 weeks",
          difficulty: "Moderate"
        },
        {
          level: "Advanced",
          title: "Multi-Agent System for Competitive Code Analysis",
          description: "Design a LangGraph workflow that automatically takes a code repository, evaluates it using a Code Auditor Agent, flags errors, passes modifications to a Refactor Agent, and compiles test logs.",
          skillsLearned: ["LangGraph", "State Graphs", "Code Generation", "Agent Supervisor Patterns"],
          duration: "4 weeks",
          difficulty: "Hard"
        }
      ]
    },
    "Career Advice Agent": {
      agentName: "Career Advice Agent",
      timestamp: "10:21 PM",
      targetRole: "AI Engineer",
      careerAdvice: {
        roles: [
          { title: "AI Application Developer", matchPercentage: 88, description: "Highly aligned with your strong frontend/React foundations paired with basic LLM API integrations." },
          { title: "AI Full-Stack Engineer", matchPercentage: 85, description: "Perfect fit once you bridge the vector database and Python proxy server knowledge gap." },
          { title: "Data Platform Developer", matchPercentage: 72, description: "Strong potential due to your PostgreSQL experience, though requires further Spark/Kafka learning." }
        ],
        salaryExpectations: {
          entry: "$110,000",
          mid: "$145,000",
          senior: "$185,000+",
          currency: "USD"
        },
        learningPriorities: [
          "Master Python backend scripting and async execution patterns.",
          "Implement hands-on vector database RAG search pipelines.",
          "Deploy containerized LLM systems inside Docker networks."
        ],
        nextCertifications: [
          "Google Professional Machine Learning Engineer",
          "NVIDIA DLI - Building Transformer-Based Applications",
          "AWS Certified Certified AI Practitioner (Beta)"
        ],
        futureOutlook: "The demand for specialized AI Engineers who can connect foundational LLMs to business data (RAG and Agentic systems) is growing exponentially. While pure prompt engineering is fading, full-stack developers who can architect safe, secure, and cost-efficient agent pipelines using tools like LangGraph are highly prized. Visualizing your AI knowledge through high-quality portfolio projects is your fastest ticket into this field."
      }
    }
  },
  chatHistory: [
    {
      id: "m1",
      role: "assistant",
      agentName: "Supervisor Agent",
      text: "Hello Jane! I am your AI Career Mentor Agent. I have analyzed your uploaded Software Engineer resume against your career goal of becoming an AI Engineer.\n\nI have created a comprehensive mentorship ecosystem for you: Resume Metrics, Skill Gap Analysis, a targeted 8-Week Roadmap, customized Interview Practice, Side-by-side Resume Rewrites, and Portfolio Projects!\n\nUse the sidebar or tabs to explore your options. You can also chat with me directly here to drill down on any advice!",
      timestamp: "10:22 PM"
    }
  ]
};
