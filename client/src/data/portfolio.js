// ---------------------------------------------------------------------------
// All site content lives here. Edit this file to update the portfolio.
// ---------------------------------------------------------------------------

export const profile = {
  name: 'KANCHAN YADAV',
  firstName: 'Kanchan',
  initials: 'KY',
  tagline: 'I build AI-powered products — from RAG pipelines to real-time apps.',
  roles: [
    'Full-Stack Developer',
    'AI / LLM Engineer',
    'RAG & Multi-Agent Systems Builder',
    'Software Engineer',
  ],
  email: 'kanchanyadav0916@gmail.com',
  resume: '/resume.pdf',
  timezone: 'Asia/Kolkata',
};

export const links = {
  github: 'https://github.com/y-kanchan',
  githubRepos: 'https://github.com/y-kanchan?tab=repositories',
  linkedin: 'https://www.linkedin.com/in/kanchan-y-459273291/',
  githubUser: 'y-kanchan',
};

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

// Section headings. Wrap a word in *asterisks* to set it in italic.
export const titles = {
  about: 'A little *about* me',
  experience: 'Where I have *worked*',
  work: 'Selected *work*',
  skills: 'Tools of the *trade*',
  certifications: '*Certified*',
  github: 'Commit *log*',
  contact: "Let's build *something*",
};

export const about = {
  statement:
    "I'm Kanchan — a computer science student who builds full-stack products and AI systems: RAG pipelines, multi-agent workflows and LangGraph orchestration that turn messy information into software people actually use.",
  entries: [
    { key: 'education', value: 'B.Tech CSE @ SRM University-AP (2023 – present)' },
    {
      key: 'class_xii',
      value: 'Trinity International SS & College, Kathmandu, Nepal (2021 – 2023)',
    },
    {
      key: 'focus',
      list: [
        'Full-stack — Next.js & MERN',
        'AI / ML — RAG & LLMs',
        'Software Engineering — System Design',
      ],
    },
    {
      key: 'core_cs',
      list: ['DSA', 'OOP', 'DBMS', 'Operating Systems', 'Computer Networks', 'System Design (basics)'],
    },
  ],
};

export const experience = [
  {
    role: 'Summer Research Intern (On-Site)',
    org: 'SRM University-AP',
    period: 'Apr – Sep 2025',
    points: [
      'Built an AI-driven assessment platform with automated evaluation, strong exam integrity, and real-time performance monitoring.',
      'Optimized API flow and cut unnecessary network calls for stable performance on weak networks.',
      'Implemented JWT-based secure access, tab-switch and screen-share detection, and a modular design for exam logic, auth, monitoring, and analytics.',
    ],
  },
];

export const stats = [
  { value: 200, suffix: '+', label: 'students evaluated', note: 'EduYatra' },
  { value: 70, suffix: '%', label: 'faster evaluation', note: 'EduYatra' },
  { value: 80, suffix: '%', label: 'lower latency', note: 'AIRA · 10s → 2s' },
];

export const projects = [
  {
    id: '01',
    title: 'AIRA',
    subtitle: 'AI Interview Platform',
    featured: true,
    description:
      'AI interviewer with a lip-synced 3D avatar that runs personalized technical interviews from resumes, job descriptions, and GitHub repos. Hybrid queue architecture with parallel LangGraph agents (Send API) for ingestion, evaluation, and question generation, cutting response latency by 80% (10s → 2s).',
    tags: ['React', 'FastAPI', 'LangChain', 'LangGraph', 'MongoDB', 'Qdrant', 'Groq'],
    repo: 'https://github.com/y-kanchan/AIRA',
  },
  {
    id: '02',
    title: 'EduYatra',
    subtitle: 'AI Exam & Learning Platform',
    featured: true,
    description:
      'AI-powered exam system with automated question generation, OCR answer extraction, and LLM-driven evaluation for 200+ students. Full RAG pipeline (Sentence-Transformers + ChromaDB) for contextual grading and an AI learning assistant, making evaluation 70% faster.',
    tags: ['Node.js', 'FastAPI', 'Gemini API', 'RAG', 'ChromaDB', 'Sentence-Transformers', 'Tesseract OCR'],
    repo: 'https://github.com/y-kanchan/EduYatra',
  },
  {
    id: '03',
    title: 'AI Teaching Agent',
    subtitle: 'Offline Multi-Agent Tutor',
    description:
      'Offline multi-agent learning platform with Professor, Advisor, Librarian, and TA agents. Intelligent query routing, Prolog-based prerequisite tracking, persistent chat history, and downloadable AI-generated study notes.',
    tags: ['Python', 'Streamlit', 'Ollama', 'Agno', 'SQLite', 'Redis', 'Prolog'],
    repo: 'https://github.com/y-kanchan/AI-Teaching-Agent',
  },
  {
    id: '04',
    title: 'Kurakani',
    subtitle: 'Real-Time Messaging Platform',
    description: 'Real-time messaging platform built with TypeScript.',
    tags: ['TypeScript', 'Real-time messaging'],
    repo: 'https://github.com/y-kanchan/Kurakani',
  },
  {
    id: '05',
    title: 'Underwater Image Enhancement',
    subtitle: 'Deep Learning',
    description:
      'PyTorch model that enhances underwater images using multi-input fusion, attention mechanisms, and image-quality optimization.',
    tags: ['Python', 'PyTorch', 'Computer Vision'],
    repo: 'https://github.com/y-kanchan/Underwater_Image_Enhancement_using_DeepLearning',
  },
  {
    id: '06',
    title: 'Document Summarizer',
    subtitle: 'NLP',
    description: 'NLP tool that condenses long documents into concise summaries.',
    tags: ['NLP', 'Python', 'HTML'],
    repo: 'https://github.com/y-kanchan/Document-Summarizer',
  },
];

export const repoCount = 24;

export const skills = [
  { group: 'Languages', items: ['C', 'C++', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'Java'] },
  { group: 'Frontend', items: ['HTML', 'CSS', 'Tailwind CSS', 'React', 'Next.js'] },
  {
    group: 'Backend & DB',
    items: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'MongoDB', 'MySQL', 'PostgreSQL', 'Redis'],
  },
  {
    group: 'AI / ML / LLMs',
    items: [
      'Scikit-learn',
      'TensorFlow',
      'PyTorch',
      'LangChain',
      'LangGraph',
      'RAG Pipelines',
      'Transformer Models',
      'Hugging Face',
      'ChromaDB',
      'Qdrant',
    ],
  },
  { group: 'Tools', items: ['Git', 'GitHub', 'Docker', 'Postman', 'Linux', 'Vercel', 'Netlify', 'Figma'] },
];

export const marquee = [
  'PYTHON', 'C++', 'TYPESCRIPT', 'REACT', 'NEXT.JS', 'NODE.JS', 'FASTAPI', 'MONGODB',
  'LANGCHAIN', 'LANGGRAPH', 'RAG', 'TENSORFLOW', 'PYTORCH', 'DOCKER',
];

export const certifications = [
  { issuer: 'Oracle', title: 'Oracle Certified Professional: Java SE 17 Developer', code: 'JAVA_SE_17' },
  {
    issuer: 'Oracle',
    title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    code: 'OCI_AI_2025',
  },
  { issuer: 'MongoDB', title: 'MongoDB Certified Associate Developer', code: 'MDB_ASSOC_DEV' },
];

// Contribution graph colour must be the charcoal hex (no #).
export const githubChart = `https://ghchart.rshah.org/2A2529/${links.githubUser}`;
