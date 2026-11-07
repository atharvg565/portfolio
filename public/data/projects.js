window.PROJECTS = [
  {
    slug: 'cybershield', title: 'CyberShield', featured: true,
    status: '[Add: e.g. In progress / Complete]',
    summary: 'Explainable phishing and fraud detector. Paste an SMS, email or link and get a Low, Medium or High risk rating with reasons and safety advice.',
    tags: ['Machine Learning', 'Security'],
    github: 'https://github.com/atharvg565/cybershield', demo: '', shot: '',
    overview: 'Rates suspicious SMS, emails and links as Low, Medium or High risk, with a score, the reasons behind it and safety advice.',
    problem: 'Phishing and digital fraud are hard for ordinary users to judge, and most tools give a verdict without explaining it.',
    contribution: '[Add: what you personally built]',
    approach: 'Combines a threat-intelligence blocklist, a machine-learning model trained on about 235,000 URLs, and rule-based analysis of scam language (urgency, credential requests, fake payment demands, impersonation). Personal data such as phone numbers, emails and card numbers is masked before analysis, and raw messages are not stored.',
    stack: ['[Add: Python / framework / libraries]'],
    challenges: '[Add: key challenges]', results: '[Add: real results only]'
  },
  {
    slug: 'setu', title: 'Setu', featured: false,
    status: 'Smart India Hackathon 2026 (PS 26044)',
    summary: 'Academia-industry portal that turns self-assessed skills into a profile and ranks internships with an explainable score.',
    tags: ['React', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    github: 'https://github.com/atharvg565/setu', demo: '', shot: '',
    overview: 'Students rate their skills, see ranked internship matches, and apply. Companies post internships with weighted skills and see applicants ranked by match score.',
    problem: 'Students do not know which skills industry wants, and companies struggle to find fitting candidates.',
    contribution: '[Add: your role in the team]',
    approach: 'Score = weighted average of the student\'s proficiency across a posting\'s required skills, multiplied by the share of those skills the student has. Every ranking can be explained in plain language.',
    stack: ['React', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    challenges: '[Add: key challenges]', results: '[Add: real results only]'
  },
  {
    slug: 'portfolio', title: 'This Portfolio', featured: false,
    status: 'Live',
    summary: 'A dark fantasy pixel-art game menu that doubles as a developer portfolio.',
    tags: ['JavaScript', 'Node.js', 'Express', 'Canvas'],
    github: 'https://github.com/atharvg565/portfolio', demo: 'https://portfolio-theta-gold-93.vercel.app/', shot: '',
    overview: 'Hash-routed single page with a canvas pixel background, persistent music and keyboard navigation.',
    problem: '[Add: why you built it]', contribution: 'Designed and built it.',
    approach: 'Vanilla JavaScript, canvas-drawn scene, Express server, deployed on Vercel.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express'],
    challenges: '[Add]', results: '[Add]'
  }
];