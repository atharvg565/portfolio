window.PROJECTS = [
  {
    slug: 'cybershield', title: 'CyberShield', featured: true,
    status: 'Live',
    summary: 'Explainable phishing and fraud detector. Paste an SMS, email or link and get a Low, Medium or High risk rating with reasons and safety advice.',
    tags: ['Python', 'FastAPI', 'XGBoost', 'Streamlit', 'Security'],
    github: 'https://github.com/atharvg565/Cybershield', demo: 'https://cybershield-beige-mu.vercel.app', shot: '',
    overview: 'Rates suspicious SMS, emails and links as Low, Medium or High risk, with a score, the reasons behind it and safety advice. Includes login, plus a Streamlit dashboard with check, history and metrics tabs.',
    problem: 'Phishing and digital fraud are hard for ordinary users to judge, and most tools give a verdict without explaining it.',
    contribution: 'Built it myself, with Claude AI as a coding assistant.',
    approach: 'A hybrid, layered pipeline: (1) a privacy layer masks personal data first; (2) a threat-intelligence blocklist gives an instant High on a hit; (3) an XGBoost model scores each URL from 16 structural features; (4) URL rules (look-alike domains, risky endings, no HTTPS) and text rules (urgency, credential requests, payment demands) add signals; (5) the score is combined as 0.4 x ML + 0.3 x URL rules + 0.2 x text rules and mapped to Low, Medium or High; (6) an explanation layer lists the indicators that fired and gives advice. The URL detector is a trained model; message analysis is currently rule-based, with a trained text model planned. No raw messages are stored.',
    stack: ['Python', 'FastAPI', 'Uvicorn', 'Pydantic', 'XGBoost', 'scikit-learn', 'pandas', 'joblib', 'tldextract', 'rapidfuzz', 'Streamlit', 'HTML/CSS/JS'],
    challenges: 'Building the frontend was the hardest part for me.',
    results: 'URL model, tested on 47,074 held-out URLs (PhiUSIIL dataset): 99.61% accuracy, 99.89% precision, 99.19% recall, F1 0.9954. Message-level results are being re-evaluated after fixing a threshold bug, and will be added once they match.'
  },
  {
    slug: 'setu', title: 'Setu', featured: false,
    status: 'Smart India Hackathon 2026 (PS 26044): cleared 2 rounds',
    summary: 'Academia-industry portal that turns self-assessed skills into a profile and ranks internships with an explainable score.',
    tags: ['React', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    github: 'https://github.com/atharvg565/Setu', demo: '', shot: '',
    overview: 'Students rate their skills, see ranked internship matches, and apply. Companies post internships with weighted skills and see applicants ranked by match score.',
    problem: 'Students do not know which skills industry wants, and companies struggle to find fitting candidates.',
    contribution: 'Backend developer in a team of 6. I built the whole backend.',
    approach: 'Score = weighted average of the student\'s proficiency across a posting\'s required skills, multiplied by the share of those skills the student has. Every ranking can be explained in plain language.',
    stack: ['React', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    challenges: 'It was our first time working with Node.js, and connecting the frontend and backend correctly took us a while.',
    results: 'Cleared 2 rounds of Smart India Hackathon 2026.'
  },
  {
    slug: 'portfolio', title: 'This Portfolio', featured: false,
    status: 'Live',
    summary: 'A pixel-art sunset game menu that doubles as a developer portfolio.',
    tags: ['JavaScript', 'Node.js', 'Express', 'Canvas'],
    github: 'https://github.com/atharvg565/portfolio', demo: 'https://portfolio-theta-gold-93.vercel.app/', shot: '',
    overview: 'Hash-routed single page with a canvas pixel background, persistent music and keyboard navigation.',
    problem: 'I wanted a portfolio that feels different from a standard template.',
    contribution: 'Designed and built it myself, with AI assistance.',
    approach: 'Vanilla JavaScript, a canvas-drawn scene, an Express server, deployed on Vercel.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express'],
    challenges: 'Finding inspiration and settling on a design was the frustrating part.',
    results: 'Live and deployed on Vercel.'
  }
];