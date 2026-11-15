
import { useEffect, useMemo, useState } from "react";

interface Skill {
  id: number;
  profile_id: number;
  name: string;
  category: string;
  proficiency_level: string;
  description: string | null;
}

interface Profile {
  id: number;
  career_goal: string | null;
}

interface PersonalizedRoadmapProps {
  profile: Profile;
  skills: Skill[];
}

interface LearningItem {
  name: string;
  description: string;
  resource: string;
  resourceLabel: string;
}

interface LearningStage {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  items: LearningItem[];
}

interface CareerPath {
  label: string;
  stages: LearningStage[];
}

const careerPaths: Record<string, CareerPath> = {
  frontend: {
    label: "Frontend Developer",
    stages: [
      {
        number: "01",
        title: "Build the foundations",
        subtitle: "THE STARTING POINT",
        description: "Understand the technologies behind modern websites.",
        color: "lime",
        items: [
          {
            name: "HTML",
            description: "Learn semantic structure, forms and accessible markup.",
            resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
            resourceLabel: "MDN HTML Guide",
          },
          {
            name: "CSS",
            description: "Practice layouts, Flexbox, Grid and responsive design.",
            resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
            resourceLabel: "MDN CSS Guide",
          },
          {
            name: "JavaScript",
            description: "Learn variables, functions, arrays, objects and DOM basics.",
            resource: "https://javascript.info/",
            resourceLabel: "JavaScript.info",
          },
        ],
      },
      {
        number: "02",
        title: "Build real interfaces",
        subtitle: "MAKE SOMETHING REAL",
        description: "Move from fundamentals to interactive applications.",
        color: "blue",
        items: [
          {
            name: "React",
            description: "Understand components, props, state, hooks and routing.",
            resource: "https://react.dev/learn",
            resourceLabel: "React Documentation",
          },
          {
            name: "TypeScript",
            description: "Add types to JavaScript and make applications safer.",
            resource: "https://www.typescriptlang.org/docs/",
            resourceLabel: "TypeScript Handbook",
          },
          {
            name: "API Integration",
            description: "Connect your frontend to backend services and APIs.",
            resource: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
            resourceLabel: "Fetch API Guide",
          },
        ],
      },
      {
        number: "03",
        title: "Become industry-ready",
        subtitle: "YOUR NEXT LEVEL",
        description: "Polish your applications and prepare to work professionally.",
        color: "orange",
        items: [
          {
            name: "Git and GitHub",
            description: "Manage versions, branches and collaborative projects.",
            resource: "https://docs.github.com/en/get-started",
            resourceLabel: "GitHub Skills",
          },
          {
            name: "Testing",
            description: "Learn component testing and debugging techniques.",
            resource: "https://testing-library.com/docs/react-testing-library/intro/",
            resourceLabel: "Testing Library",
          },
          {
            name: "Deployment",
            description: "Deploy projects and understand production workflows.",
            resource: "https://vercel.com/docs",
            resourceLabel: "Vercel Documentation",
          },
        ],
      },
    ],
  },

  backend: {
    label: "Backend Developer",
    stages: [
      {
        number: "01",
        title: "Master the foundations",
        subtitle: "THE STARTING POINT",
        description: "Understand programming, data and server-side fundamentals.",
        color: "lime",
        items: [
          {
            name: "Python",
            description: "Learn functions, classes, modules and error handling.",
            resource: "https://docs.python.org/3/tutorial/",
            resourceLabel: "Python Tutorial",
          },
          {
            name: "SQL",
            description: "Practice queries, joins, relationships and database design.",
            resource: "https://sqlbolt.com/",
            resourceLabel: "SQLBolt",
          },
          {
            name: "HTTP and APIs",
            description: "Understand requests, responses, methods and status codes.",
            resource: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
            resourceLabel: "HTTP Guide",
          },
        ],
      },
      {
        number: "02",
        title: "Build backend systems",
        subtitle: "MAKE SOMETHING REAL",
        description: "Create services that store, process and deliver information.",
        color: "blue",
        items: [
          {
            name: "FastAPI",
            description: "Build REST APIs, request validation and documentation.",
            resource: "https://fastapi.tiangolo.com/tutorial/",
            resourceLabel: "FastAPI Tutorial",
          },
          {
            name: "Database Integration",
            description: "Connect applications to relational databases using an ORM.",
            resource: "https://docs.sqlalchemy.org/en/20/tutorial/",
            resourceLabel: "SQLAlchemy Tutorial",
          },
          {
            name: "Authentication",
            description: "Understand password hashing, tokens and access control.",
            resource: "https://fastapi.tiangolo.com/tutorial/security/",
            resourceLabel: "FastAPI Security",
          },
        ],
      },
      {
        number: "03",
        title: "Build production-ready services",
        subtitle: "YOUR NEXT LEVEL",
        description: "Improve reliability, security and deployment.",
        color: "orange",
        items: [
          {
            name: "Testing",
            description: "Write automated tests for APIs and application logic.",
            resource: "https://fastapi.tiangolo.com/tutorial/testing/",
            resourceLabel: "FastAPI Testing",
          },
          {
            name: "Docker",
            description: "Learn containers and reproducible development environments.",
            resource: "https://docs.docker.com/get-started/",
            resourceLabel: "Docker Getting Started",
          },
          {
            name: "Deployment",
            description: "Deploy services and configure production environments.",
            resource: "https://render.com/docs",
            resourceLabel: "Deployment Guide",
          },
        ],
      },
    ],
  },

  fullstack: {
    label: "Full Stack Developer",
    stages: [
      {
        number: "01",
        title: "Learn both sides",
        subtitle: "THE STARTING POINT",
        description: "Build a strong foundation in frontend and programming.",
        color: "lime",
        items: [
          {
            name: "HTML and CSS",
            description: "Create structured, responsive and accessible interfaces.",
            resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
            resourceLabel: "MDN Learning Area",
          },
          {
            name: "JavaScript",
            description: "Understand programming fundamentals and browser behaviour.",
            resource: "https://javascript.info/",
            resourceLabel: "JavaScript.info",
          },
          {
            name: "Python",
            description: "Learn backend programming and application logic.",
            resource: "https://docs.python.org/3/tutorial/",
            resourceLabel: "Python Tutorial",
          },
        ],
      },
      {
        number: "02",
        title: "Connect the system",
        subtitle: "MAKE SOMETHING REAL",
        description: "Bring frontend, backend and database technologies together.",
        color: "blue",
        items: [
          {
            name: "React",
            description: "Build reusable interfaces and interactive applications.",
            resource: "https://react.dev/learn",
            resourceLabel: "React Documentation",
          },
          {
            name: "REST APIs",
            description: "Connect frontend applications with backend services.",
            resource: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
            resourceLabel: "HTTP Guide",
          },
          {
            name: "SQL and Databases",
            description: "Design tables, relationships and database queries.",
            resource: "https://sqlbolt.com/",
            resourceLabel: "SQLBolt",
          },
        ],
      },
      {
        number: "03",
        title: "Ship complete products",
        subtitle: "YOUR NEXT LEVEL",
        description: "Learn to test, secure and deploy complete applications.",
        color: "orange",
        items: [
          {
            name: "Authentication",
            description: "Implement secure login and protected application routes.",
            resource: "https://fastapi.tiangolo.com/tutorial/security/",
            resourceLabel: "Security Tutorial",
          },
          {
            name: "Git and GitHub",
            description: "Track changes and collaborate on software projects.",
            resource: "https://docs.github.com/en/get-started",
            resourceLabel: "GitHub Guide",
          },
          {
            name: "Deployment",
            description: "Deploy frontend and backend applications.",
            resource: "https://vercel.com/docs",
            resourceLabel: "Vercel Documentation",
          },
        ],
      },
    ],
  },

  data: {
    label: "Data Analyst",
    stages: [
      {
        number: "01",
        title: "Understand the data",
        subtitle: "THE STARTING POINT",
        description: "Develop the foundations of working with information.",
        color: "lime",
        items: [
          {
            name: "Excel",
            description: "Practice formulas, sorting, filtering and pivot tables.",
            resource: "https://support.microsoft.com/excel",
            resourceLabel: "Excel Learning",
          },
          {
            name: "SQL",
            description: "Retrieve and combine information from databases.",
            resource: "https://sqlbolt.com/",
            resourceLabel: "SQLBolt",
          },
          {
            name: "Statistics",
            description: "Understand averages, distributions and basic probability.",
            resource: "https://www.khanacademy.org/math/statistics-probability",
            resourceLabel: "Khan Academy",
          },
        ],
      },
      {
        number: "02",
        title: "Analyse and visualise",
        subtitle: "MAKE SOMETHING REAL",
        description: "Turn raw datasets into meaningful insights.",
        color: "blue",
        items: [
          {
            name: "Python",
            description: "Learn data handling and analysis with Python.",
            resource: "https://docs.python.org/3/tutorial/",
            resourceLabel: "Python Tutorial",
          },
          {
            name: "Pandas",
            description: "Clean, transform and analyse structured datasets.",
            resource: "https://pandas.pydata.org/docs/getting_started/",
            resourceLabel: "Pandas Getting Started",
          },
          {
            name: "Data Visualisation",
            description: "Build charts and dashboards to communicate findings.",
            resource: "https://public.tableau.com/en-us/s/resources",
            resourceLabel: "Tableau Resources",
          },
        ],
      },
      {
        number: "03",
        title: "Think like an analyst",
        subtitle: "YOUR NEXT LEVEL",
        description: "Build a portfolio that demonstrates analytical thinking.",
        color: "orange",
        items: [
          {
            name: "Power BI",
            description: "Create interactive reports and business dashboards.",
            resource: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi",
            resourceLabel: "Power BI Learning",
          },
          {
            name: "Exploratory Analysis",
            description: "Find patterns, outliers and useful relationships in data.",
            resource: "https://www.kaggle.com/learn",
            resourceLabel: "Kaggle Learn",
          },
          {
            name: "Portfolio Projects",
            description: "Publish case studies that explain your findings.",
            resource: "https://github.com/",
            resourceLabel: "GitHub",
          },
        ],
      },
    ],
  },

  aiml: {
    label: "AI / ML Engineer",
    stages: [
      {
        number: "01",
        title: "Build the foundations",
        subtitle: "THE STARTING POINT",
        description: "Develop the programming and mathematical foundations of AI.",
        color: "lime",
        items: [
          {
            name: "Python",
            description: "Learn functions, data structures and object-oriented programming.",
            resource: "https://docs.python.org/3/tutorial/",
            resourceLabel: "Python Tutorial",
          },
          {
            name: "Mathematics",
            description: "Study linear algebra, probability and basic calculus.",
            resource: "https://www.khanacademy.org/math",
            resourceLabel: "Khan Academy",
          },
          {
            name: "NumPy and Pandas",
            description: "Work with numerical data and structured datasets.",
            resource: "https://numpy.org/learn/",
            resourceLabel: "NumPy Learning",
          },
        ],
      },
      {
        number: "02",
        title: "Explore machine learning",
        subtitle: "MAKE SOMETHING REAL",
        description: "Train models and understand how they learn from data.",
        color: "blue",
        items: [
          {
            name: "Machine Learning",
            description: "Learn supervised and unsupervised learning concepts.",
            resource: "https://developers.google.com/machine-learning/crash-course",
            resourceLabel: "Google ML Crash Course",
          },
          {
            name: "Scikit-learn",
            description: "Build and evaluate traditional machine learning models.",
            resource: "https://scikit-learn.org/stable/getting_started.html",
            resourceLabel: "Scikit-learn Guide",
          },
          {
            name: "Model Evaluation",
            description: "Understand training, testing, accuracy and overfitting.",
            resource: "https://developers.google.com/machine-learning/crash-course",
            resourceLabel: "ML Evaluation Lessons",
          },
        ],
      },
      {
        number: "03",
        title: "Build intelligent products",
        subtitle: "YOUR NEXT LEVEL",
        description: "Explore deeper models and turn experiments into applications.",
        color: "orange",
        items: [
          {
            name: "Deep Learning",
            description: "Understand neural networks and deep learning fundamentals.",
            resource: "https://www.deeplearning.ai/",
            resourceLabel: "DeepLearning.AI",
          },
          {
            name: "PyTorch",
            description: "Build and train neural networks with a modern framework.",
            resource: "https://pytorch.org/tutorials/",
            resourceLabel: "PyTorch Tutorials",
          },
          {
            name: "AI Projects",
            description: "Create documented projects using real datasets and models.",
            resource: "https://www.kaggle.com/learn",
            resourceLabel: "Kaggle Learn",
          },
        ],
      },
    ],
  },

  python: {
    label: "Python Developer",
    stages: [
      {
        number: "01",
        title: "Become fluent in Python",
        subtitle: "THE STARTING POINT",
        description: "Build confidence with the language and its core concepts.",
        color: "lime",
        items: [
          {
            name: "Python Fundamentals",
            description: "Learn variables, loops, functions and data structures.",
            resource: "https://docs.python.org/3/tutorial/",
            resourceLabel: "Python Tutorial",
          },
          {
            name: "Object-Oriented Programming",
            description: "Understand classes, inheritance and reusable code.",
            resource: "https://docs.python.org/3/tutorial/classes.html",
            resourceLabel: "Python Classes",
          },
          {
            name: "Problem Solving",
            description: "Practice writing clear solutions to programming problems.",
            resource: "https://www.hackerrank.com/domains/python",
            resourceLabel: "HackerRank Python",
          },
        ],
      },
      {
        number: "02",
        title: "Create useful applications",
        subtitle: "MAKE SOMETHING REAL",
        description: "Apply Python to databases, APIs and automation.",
        color: "blue",
        items: [
          {
            name: "SQL and Databases",
            description: "Store, retrieve and organise application data.",
            resource: "https://sqlbolt.com/",
            resourceLabel: "SQLBolt",
          },
          {
            name: "FastAPI",
            description: "Create APIs and backend services using Python.",
            resource: "https://fastapi.tiangolo.com/tutorial/",
            resourceLabel: "FastAPI Tutorial",
          },
          {
            name: "Automation",
            description: "Automate repetitive tasks using Python scripts.",
            resource: "https://automatetheboringstuff.com/",
            resourceLabel: "Automate the Boring Stuff",
          },
        ],
      },
      {
        number: "03",
        title: "Work like a developer",
        subtitle: "YOUR NEXT LEVEL",
        description: "Improve quality and prepare applications for real users.",
        color: "orange",
        items: [
          {
            name: "Testing",
            description: "Write tests and debug application behaviour.",
            resource: "https://docs.pytest.org/en/stable/",
            resourceLabel: "Pytest Documentation",
          },
          {
            name: "Git and GitHub",
            description: "Track your work and collaborate with other developers.",
            resource: "https://docs.github.com/en/get-started",
            resourceLabel: "GitHub Guide",
          },
          {
            name: "Deployment",
            description: "Package and deploy Python applications.",
            resource: "https://render.com/docs",
            resourceLabel: "Deployment Guide",
          },
        ],
      },
    ],
  },

  design: {
    label: "UI/UX Designer",
    stages: [
      {
        number: "01",
        title: "Understand design",
        subtitle: "THE STARTING POINT",
        description: "Learn the principles behind useful and clear interfaces.",
        color: "lime",
        items: [
          {
            name: "Design Principles",
            description: "Study hierarchy, contrast, balance and visual consistency.",
            resource: "https://www.nngroup.com/articles/",
            resourceLabel: "Nielsen Norman Group",
          },
          {
            name: "Colour and Typography",
            description: "Understand colour systems, type scales and readability.",
            resource: "https://m3.material.io/styles",
            resourceLabel: "Material Design",
          },
          {
            name: "User Research",
            description: "Learn to understand user needs and behaviours.",
            resource: "https://www.nngroup.com/articles/which-ux-research-methods/",
            resourceLabel: "UX Research Methods",
          },
        ],
      },
      {
        number: "02",
        title: "Design experiences",
        subtitle: "MAKE SOMETHING REAL",
        description: "Turn ideas into wireframes, prototypes and interfaces.",
        color: "blue",
        items: [
          {
            name: "Figma",
            description: "Create layouts, components and interactive prototypes.",
            resource: "https://help.figma.com/",
            resourceLabel: "Figma Help",
          },
          {
            name: "Wireframing",
            description: "Plan user journeys and structure before visual design.",
            resource: "https://www.figma.com/resource-library/",
            resourceLabel: "Figma Resources",
          },
          {
            name: "Prototyping",
            description: "Test interactions and communicate design decisions.",
            resource: "https://help.figma.com/hc/en-us/categories/360002051613",
            resourceLabel: "Figma Tutorials",
          },
        ],
      },
      {
        number: "03",
        title: "Build your design identity",
        subtitle: "YOUR NEXT LEVEL",
        description: "Create a portfolio and learn to work with development teams.",
        color: "orange",
        items: [
          {
            name: "Design Systems",
            description: "Create reusable components and consistent design rules.",
            resource: "https://m3.material.io/",
            resourceLabel: "Material Design",
          },
          {
            name: "Accessibility",
            description: "Design experiences that work for different users.",
            resource: "https://www.w3.org/WAI/fundamentals/accessibility-intro/",
            resourceLabel: "W3C Accessibility",
          },
          {
            name: "Portfolio",
            description: "Present your process, decisions and finished case studies.",
            resource: "https://www.behance.net/",
            resourceLabel: "Behance",
          },
        ],
      },
    ],
  },

  cybersecurity: {
    label: "Cybersecurity Analyst",
    stages: [
      {
        number: "01",
        title: "Understand systems",
        subtitle: "THE STARTING POINT",
        description: "Learn how computers, networks and operating systems work.",
        color: "lime",
        items: [
          {
            name: "Networking",
            description: "Understand IP, DNS, ports and common network protocols.",
            resource: "https://www.cloudflare.com/learning/",
            resourceLabel: "Cloudflare Learning",
          },
          {
            name: "Linux",
            description: "Practice the command line, permissions and system basics.",
            resource: "https://linuxjourney.com/",
            resourceLabel: "Linux Journey",
          },
          {
            name: "Python",
            description: "Learn scripting for automation and security analysis.",
            resource: "https://docs.python.org/3/tutorial/",
            resourceLabel: "Python Tutorial",
          },
        ],
      },
      {
        number: "02",
        title: "Learn security",
        subtitle: "MAKE SOMETHING REAL",
        description: "Understand threats, vulnerabilities and defensive practices.",
        color: "blue",
        items: [
          {
            name: "Security Fundamentals",
            description: "Learn confidentiality, integrity, availability and risk.",
            resource: "https://www.cisa.gov/resources-tools",
            resourceLabel: "CISA Resources",
          },
          {
            name: "Web Security",
            description: "Study common web vulnerabilities and how to prevent them.",
            resource: "https://owasp.org/www-project-top-ten/",
            resourceLabel: "OWASP Top 10",
          },
          {
            name: "Log Analysis",
            description: "Learn to inspect system events and identify suspicious activity.",
            resource: "https://tryhackme.com/",
            resourceLabel: "TryHackMe",
          },
        ],
      },
      {
        number: "03",
        title: "Practise defensively",
        subtitle: "YOUR NEXT LEVEL",
        description: "Develop practical skills in safe, authorised environments.",
        color: "orange",
        items: [
          {
            name: "Incident Response",
            description: "Understand preparation, detection and response workflows.",
            resource: "https://www.cisa.gov/resources-tools",
            resourceLabel: "CISA Guidance",
          },
          {
            name: "Security Monitoring",
            description: "Explore monitoring, alerts and security event investigation.",
            resource: "https://tryhackme.com/",
            resourceLabel: "TryHackMe Labs",
          },
          {
            name: "Security Portfolio",
            description: "Document defensive labs and authorised security projects.",
            resource: "https://github.com/",
            resourceLabel: "GitHub",
          },
        ],
      },
    ],
  },

  general: {
    label: "Technology Professional",
    stages: [
      {
        number: "01",
        title: "Strengthen your foundations",
        subtitle: "THE STARTING POINT",
        description: "Build the core habits that support a technology career.",
        color: "lime",
        items: [
          {
            name: "Programming Fundamentals",
            description: "Learn variables, logic, functions and problem-solving.",
            resource: "https://www.freecodecamp.org/learn/",
            resourceLabel: "freeCodeCamp",
          },
          {
            name: "Digital Skills",
            description: "Become comfortable with tools, files and online workflows.",
            resource: "https://edu.gcfglobal.org/en/",
            resourceLabel: "GCFGlobal",
          },
          {
            name: "Communication",
            description: "Practise explaining ideas and documenting your work.",
            resource: "https://www.coursera.org/",
            resourceLabel: "Coursera",
          },
        ],
      },
      {
        number: "02",
        title: "Explore and experiment",
        subtitle: "MAKE SOMETHING REAL",
        description: "Choose a direction and build practical experience.",
        color: "blue",
        items: [
          {
            name: "Git and GitHub",
            description: "Save your work and build a public project portfolio.",
            resource: "https://docs.github.com/en/get-started",
            resourceLabel: "GitHub Guide",
          },
          {
            name: "Project Building",
            description: "Create a small project that solves a real problem.",
            resource: "https://www.freecodecamp.org/learn/",
            resourceLabel: "freeCodeCamp",
          },
          {
            name: "Technical Research",
            description: "Learn to read documentation and evaluate tools.",
            resource: "https://developer.mozilla.org/",
            resourceLabel: "MDN Web Docs",
          },
        ],
      },
      {
        number: "03",
        title: "Show what you can do",
        subtitle: "YOUR NEXT LEVEL",
        description: "Turn your learning into evidence of your abilities.",
        color: "orange",
        items: [
          {
            name: "Portfolio",
            description: "Present your projects, contributions and learning journey.",
            resource: "https://github.com/",
            resourceLabel: "GitHub",
          },
          {
            name: "Problem Solving",
            description: "Practise technical challenges and explain your approach.",
            resource: "https://www.hackerrank.com/",
            resourceLabel: "HackerRank",
          },
          {
            name: "Interview Preparation",
            description: "Practise communicating your skills and project decisions.",
            resource: "https://www.geeksforgeeks.org/",
            resourceLabel: "GeeksforGeeks",
          },
        ],
      },
    ],
  },
};

function identifyCareer(goal: string | null): string {
  const value = (goal || "").toLowerCase();

  if (/full.?stack/.test(value)) return "fullstack";
  if (/front.?end|frontend|web developer|react developer/.test(value)) {
    return "frontend";
  }
  if (/back.?end|backend|server.?side/.test(value)) return "backend";
  if (/data analyst|data analytics|business analyst/.test(value)) {
    return "data";
  }
  if (/machine learning|artificial intelligence|\bai\b|\bml\b/.test(value)) {
    return "aiml";
  }
  if (/python developer|python programmer/.test(value)) return "python";
  if (/ui.?ux|ux designer|ui designer|product designer/.test(value)) {
    return "design";
  }
  if (/cyber|security analyst|information security/.test(value)) {
    return "cybersecurity";
  }

  return "general";
}

function normalize(value: string): string {
  return value.toLowerCase().trim().replace(/[.\s_-]+/g, "");
}

function skillMatches(userSkill: string, requiredSkill: string): boolean {
  const user = normalize(userSkill);
  const required = normalize(requiredSkill);

  if (user === required) return true;

  const aliases: Record<string, string[]> = {
    javascript: ["js"],
    typescript: ["ts"],
    react: ["reactjs", "react.js"],
    nodejs: ["node", "node.js"],
    machinelearning: ["ml"],
    html: ["html5"],
    css: ["css3"],
    postgresql: ["postgres"],
    mongodb: ["mongo"],
    powerbi: ["powerbi"],
    figma: ["figma design"],
  };

  const equivalent = (aliases[required] || []).map(normalize);

  return equivalent.includes(user);
}

export default function PersonalizedRoadmap({
  profile,
  skills,
}: PersonalizedRoadmapProps) {
  const suggestedCareer = identifyCareer(profile.career_goal);

  const [selectedCareer, setSelectedCareer] = useState(suggestedCareer);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [expandedStage, setExpandedStage] = useState("01");

  const career = careerPaths[selectedCareer] || careerPaths.general;

  const storageKey = `credora_roadmap_${profile.id}_${selectedCareer}`;

  useEffect(() => {
    setSelectedCareer(suggestedCareer);
  }, [suggestedCareer]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCompleted(saved ? JSON.parse(saved) : {});
    } catch {
      setCompleted({});
    }

    setExpandedStage("01");
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completed));
    } catch {
      // The roadmap remains usable if browser storage is unavailable.
    }
  }, [completed, storageKey]);

  const allItems = useMemo(
    () => career.stages.flatMap((stage) => stage.items),
    [career]
  );

  const isSkillOwned = (name: string) =>
    skills.some((skill) => skillMatches(skill.name, name));

  const isItemComplete = (name: string) =>
    completed[name] ?? isSkillOwned(name);

  const completedCount = allItems.filter((item) =>
    isItemComplete(item.name)
  ).length;

  const progress = allItems.length
    ? Math.round((completedCount / allItems.length) * 100)
    : 0;

  const missingItems = allItems.filter(
    (item) => !isItemComplete(item.name)
  );

  const toggleItem = (name: string) => {
    setCompleted((current) => ({
      ...current,
      [name]: !(current[name] ?? isSkillOwned(name)),
    }));
  };

  const resetProgress = () => {
    if (!window.confirm("Reset your learning progress for this career path?")) {
      return;
    }

    setCompleted({});
  };

  return (
    <section className="inner-page personalized-roadmap">
      <style>{`
        .personalized-roadmap {
          color: #20202b;
        }

        .pr-hero {
          min-height: 300px;
          display: grid;
          grid-template-columns: 1.25fr .75fr;
          background: #3449e8;
          color: #f2eadb;
          overflow: hidden;
          position: relative;
        }

        .pr-hero-copy {
          padding: 42px 45px;
          position: relative;
          z-index: 1;
        }

        .pr-eyebrow {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #d7ed50;
        }

        .pr-hero h1 {
          margin: 24px 0 14px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(38px, 5vw, 61px);
          line-height: .99;
          letter-spacing: -3px;
          color: #f2eadb;
        }

        .pr-hero h1 em {
          color: #d7ed50;
          font-style: normal;
        }

        .pr-hero p {
          max-width: 480px;
          color: rgba(242,234,219,.76);
          font-size: 13px;
          line-height: 1.8;
        }

        .pr-hero-art {
          position: relative;
          min-height: 280px;
          display: grid;
          place-items: center;
          overflow: hidden;
        }

        .pr-orbit {
          position: absolute;
          width: 230px;
          height: 230px;
          border: 1px solid rgba(242,234,219,.4);
          border-radius: 50%;
          transform: rotate(-25deg) scaleY(.55);
        }

        .pr-orbit-two {
          width: 310px;
          height: 310px;
          transform: rotate(45deg) scaleY(.55);
          border-color: rgba(215,237,80,.6);
        }

        .pr-orbit-three {
          width: 170px;
          height: 170px;
          transform: rotate(75deg) scaleY(.55);
        }

        .pr-core {
          width: 105px;
          height: 105px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #d7ed50;
          color: #20202b;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 58px;
          font-weight: 800;
          box-shadow: 0 0 65px rgba(215,237,80,.25);
        }

        .pr-career-select {
          margin-top: 22px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .pr-career-select label {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
          color: rgba(242,234,219,.7);
        }

        .pr-career-select select {
          max-width: 100%;
          padding: 11px 36px 11px 12px;
          border: 1px solid rgba(242,234,219,.35);
          border-radius: 2px;
          background: #2638c5;
          color: #fff;
          font: inherit;
          font-size: 12px;
          outline: none;
        }

        .pr-overview {
          margin: 28px 0;
          display: grid;
          grid-template-columns: 1.2fr repeat(2, 1fr);
          gap: 12px;
        }

        .pr-stat {
          min-height: 120px;
          padding: 20px;
          background: #fffdf8;
          border: 1px solid rgba(32,32,43,.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .pr-stat-label {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.4px;
          color: #77716c;
        }

        .pr-stat strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 35px;
          letter-spacing: -1.5px;
        }

        .pr-progress-stat {
          background: #d7ed50;
        }

        .pr-progress-track {
          height: 6px;
          margin-top: 8px;
          background: rgba(32,32,43,.15);
        }

        .pr-progress-track span {
          height: 100%;
          display: block;
          background: #20202b;
          transition: width .3s ease;
        }

        .pr-section-heading {
          margin: 42px 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 20px;
        }

        .pr-section-heading h2 {
          margin: 8px 0 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(26px, 4vw, 38px);
          letter-spacing: -1.7px;
        }

        .pr-section-heading h2 em {
          color: #f05a35;
          font-style: normal;
        }

        .pr-section-heading p {
          max-width: 310px;
          color: #77716c;
          font-size: 12px;
          line-height: 1.7;
        }

        .pr-stage {
          margin-bottom: 15px;
          border: 1px solid rgba(32,32,43,.12);
          background: #fffdf8;
        }

        .pr-stage-header {
          width: 100%;
          min-height: 105px;
          padding: 20px 24px;
          display: grid;
          grid-template-columns: 55px 1fr auto;
          align-items: center;
          gap: 18px;
          border: 0;
          background: transparent;
          color: #20202b;
          text-align: left;
          cursor: pointer;
        }

        .pr-stage-number {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          background: #d7ed50;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
        }

        .pr-stage-blue .pr-stage-number {
          background: #dce2ff;
        }

        .pr-stage-orange .pr-stage-number {
          background: #f9d7c9;
        }

        .pr-stage-subtitle {
          display: block;
          margin-bottom: 6px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.4px;
          color: #77716c;
        }

        .pr-stage-title {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 21px;
          font-weight: 700;
          letter-spacing: -.6px;
        }

        .pr-stage-description {
          display: block;
          margin-top: 5px;
          color: #77716c;
          font-size: 11px;
          line-height: 1.6;
        }

        .pr-stage-count {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 10px;
          font-weight: 800;
          color: #77716c;
        }

        .pr-stage-count b {
          font-size: 18px;
          color: #20202b;
        }

        .pr-stage-chevron {
          font-size: 20px;
          transition: transform .2s;
        }

        .pr-stage-chevron.open {
          transform: rotate(180deg);
        }

        .pr-stage-items {
          padding: 0 24px 22px 97px;
        }

        .pr-learning-item {
          display: grid;
          grid-template-columns: 25px 1fr auto;
          gap: 13px;
          align-items: start;
          padding: 17px 0;
          border-top: 1px solid rgba(32,32,43,.09);
        }

        .pr-check {
          width: 21px;
          height: 21px;
          margin-top: 2px;
          accent-color: #3449e8;
          cursor: pointer;
        }

        .pr-learning-copy strong {
          display: block;
          font-size: 13px;
        }

        .pr-learning-copy p {
          margin: 5px 0 8px;
          color: #77716c;
          font-size: 11px;
          line-height: 1.65;
        }

        .pr-learning-copy a {
          color: #3449e8;
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .pr-learning-copy a:hover {
          text-decoration: underline;
        }

        .pr-learning-item.done .pr-learning-copy strong {
          color: #77716c;
          text-decoration: line-through;
        }

        .pr-owned-tag {
          display: inline-block;
          margin-left: 8px;
          padding: 4px 6px;
          background: #edf4c7;
          color: #526018;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .5px;
          vertical-align: middle;
        }

        .pr-reset {
          padding: 10px 13px;
          border: 1px solid rgba(32,32,43,.2);
          background: transparent;
          color: #77716c;
          font: inherit;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .pr-reset:hover {
          border-color: #f05a35;
          color: #f05a35;
        }

        .pr-gap-panel {
          margin-top: 28px;
          padding: 27px;
          background: #20202b;
          color: #f2eadb;
        }

        .pr-gap-panel h2 {
          margin: 10px 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 28px;
          letter-spacing: -1px;
        }

        .pr-gap-panel > p {
          color: rgba(242,234,219,.65);
          font-size: 12px;
          line-height: 1.7;
        }

        .pr-gap-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }

        .pr-gap-chip {
          padding: 9px 12px;
          border: 1px solid rgba(242,234,219,.22);
          color: #d7ed50;
          font-size: 10px;
          font-weight: 700;
        }

        .pr-gap-empty {
          color: #d7ed50 !important;
        }

        .pr-footnote {
          margin-top: 18px;
          color: #8a8790;
          font-size: 10px;
          line-height: 1.7;
        }

        @media(max-width: 760px) {
          .pr-hero {
            grid-template-columns: 1fr;
          }

          .pr-hero-copy {
            padding: 30px 24px 10px;
          }

          .pr-hero-art {
            min-height: 190px;
          }

          .pr-overview {
            grid-template-columns: 1fr 1fr;
          }

          .pr-progress-stat {
            grid-column: 1 / -1;
          }

          .pr-section-heading {
            align-items: start;
            flex-direction: column;
          }

          .pr-stage-header {
            grid-template-columns: 42px 1fr auto;
            gap: 11px;
            padding: 16px;
          }

          .pr-stage-number {
            width: 40px;
            height: 40px;
          }

          .pr-stage-title {
            font-size: 17px;
          }

          .pr-stage-items {
            padding: 0 16px 16px;
          }

          .pr-learning-item {
            grid-template-columns: 22px 1fr;
          }

          .pr-learning-item .pr-item-status {
            display: none;
          }
        }

        @media(max-width: 420px) {
          .pr-overview {
            grid-template-columns: 1fr;
          }

          .pr-progress-stat {
            grid-column: auto;
          }

          .pr-stage-count {
            gap: 5px;
          }

          .pr-stage-count span {
            display: none;
          }
        }
      `}</style>

      <div className="pr-hero">
        <div className="pr-hero-copy">
          <span className="pr-eyebrow">04 / YOUR PERSONAL LEARNING JOURNEY</span>
          <h1>
            Your next step.
            <br />
            <em>Your next version.</em>
          </h1>
          <p>
            A learning path shaped around your ambitions and the skills
            you already have. Progress at your own pace.
          </p>

          <div className="pr-career-select">
            <label htmlFor="pr-career">YOUR CAREER DIRECTION</label>
            <select
              id="pr-career"
              value={selectedCareer}
              onChange={(event) => setSelectedCareer(event.target.value)}
            >
              {Object.entries(careerPaths).map(([key, path]) => (
                <option value={key} key={key}>
                  {path.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pr-hero-art" aria-hidden="true">
          <div className="pr-orbit" />
          <div className="pr-orbit pr-orbit-two" />
          <div className="pr-orbit pr-orbit-three" />
          <div className="pr-core">C</div>
        </div>
      </div>

      <div className="pr-overview">
        <article className="pr-stat pr-progress-stat">
          <span className="pr-stat-label">YOUR ROADMAP PROGRESS</span>
          <strong>{progress}%</strong>
          <div className="pr-progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
        </article>

        <article className="pr-stat">
          <span className="pr-stat-label">COMPLETED SKILLS</span>
          <strong>{completedCount.toString().padStart(2, "0")}</strong>
        </article>

        <article className="pr-stat">
          <span className="pr-stat-label">SKILLS TO EXPLORE</span>
          <strong>{missingItems.length.toString().padStart(2, "0")}</strong>
        </article>
      </div>

      <div className="pr-section-heading">
        <div>
          <span className="section-index">YOUR LEARNING BLUEPRINT</span>
          <h2>Three stages.<br /><em>One evolving you.</em></h2>
        </div>
        <p>
          Your existing skills are recognised automatically.
          Mark other skills complete as you learn them.
        </p>
      </div>

      <div className="pr-stages">
        {career.stages.map((stage) => {
          const stageCompleted = stage.items.filter((item) =>
            isItemComplete(item.name)
          ).length;

          const isExpanded = expandedStage === stage.number;

          return (
            <article
              className={`pr-stage pr-stage-${stage.color}`}
              key={`${selectedCareer}-${stage.number}`}
            >
              <button
                type="button"
                className="pr-stage-header"
                onClick={() =>
                  setExpandedStage(isExpanded ? "" : stage.number)
                }
                aria-expanded={isExpanded}
              >
                <span className="pr-stage-number">{stage.number}</span>

                <span>
                  <span className="pr-stage-subtitle">{stage.subtitle}</span>
                  <span className="pr-stage-title">{stage.title}</span>
                  <span className="pr-stage-description">
                    {stage.description}
                  </span>
                </span>

                <span className="pr-stage-count">
                  <b>{stageCompleted}/{stage.items.length}</b>
                  <span>DONE</span>
                  <span className={`pr-stage-chevron ${isExpanded ? "open" : ""}`}>
                    ↓
                  </span>
                </span>
              </button>

              {isExpanded && (
                <div className="pr-stage-items">
                  {stage.items.map((item) => {
                    const checked = isItemComplete(item.name);
                    const owned = isSkillOwned(item.name);

                    return (
                      <div
                        className={`pr-learning-item ${checked ? "done" : ""}`}
                        key={item.name}
                      >
                        <input
                          className="pr-check"
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleItem(item.name)}
                          aria-label={`Mark ${item.name} as ${
                            checked ? "incomplete" : "complete"
                          }`}
                        />

                        <div className="pr-learning-copy">
                          <strong>
                            {item.name}
                            {owned && (
                              <span className="pr-owned-tag">
                                IN YOUR SKILLS
                              </span>
                            )}
                          </strong>
                          <p>{item.description}</p>
                          <a
                            href={item.resource}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.resourceLabel} ↗
                          </a>
                        </div>

                        <span className="pr-item-status">
                          {checked ? "✓ DONE" : "TO LEARN"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <section className="pr-gap-panel">
        <span className="pr-eyebrow">YOUR NEXT OPPORTUNITY</span>
        <h2>Skills to explore next.</h2>
        <p>
          These are roadmap skills that are not yet marked complete or
          recognised in your Credora skill collection.
        </p>

        {missingItems.length === 0 ? (
          <p className="pr-gap-empty">
            ✳ You've completed every skill in this roadmap. Keep building
            projects and exploring deeper topics!
          </p>
        ) : (
          <div className="pr-gap-list">
            {missingItems.slice(0, 6).map((item) => (
              <span className="pr-gap-chip" key={item.name}>
                {item.name}
              </span>
            ))}
            {missingItems.length > 6 && (
              <span className="pr-gap-chip">
                +{missingItems.length - 6} MORE
              </span>
            )}
          </div>
        )}
      </section>

      <div className="pr-section-heading">
        <div>
          <span className="section-index">YOUR PROGRESS, YOUR PACE</span>
          <h2>Keep the journey<br /><em>moving forward.</em></h2>
        </div>
        <button type="button" className="pr-reset" onClick={resetProgress}>
          RESET THIS ROADMAP ↻
        </button>
      </div>

      <p className="pr-footnote">
        Learning resources are external links. Roadmap completion is saved
        locally in this browser and is not submitted to the Credora server.
        Existing skills are recognised by name; this roadmap is a learning
        guide, not a certification or job-readiness assessment.
      </p>
    </section>
  );
}
