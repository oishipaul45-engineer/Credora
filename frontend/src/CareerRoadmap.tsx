
import { useState } from "react";

interface CareerRoadmapProps {
  profile?: {
    id: number;
    career_goal: string | null;
  };
  skills?: {
    id: number;
    name: string;
    category: string;
    proficiency_level: string;
    description: string | null;
  }[];
}

interface RoadmapItem {
  name: string;
  description: string;
  resource: string;
  resourceLabel: string;
}

interface RoadmapStage {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  items: RoadmapItem[];
}

interface Career {
  label: string;
  description: string;
  duration: string;
  stages: RoadmapStage[];
}

const careers: Record<string, Career> = {
  frontend: {
    label: "Frontend Developer",
    description: "Learn to create responsive, interactive and visually engaging web applications.",
    duration: "4–6 months",
    stages: [
      {
        number: "01",
        title: "Web Development Fundamentals",
        subtitle: "START HERE",
        description: "Understand the technologies behind every modern website.",
        color: "lime",
        items: [
          {
            name: "HTML",
            description: "Learn semantic elements, forms, links and webpage structure.",
            resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
            resourceLabel: "HTML Learning Guide",
          },
          {
            name: "CSS",
            description: "Learn styling, Flexbox, Grid, animations and responsive layouts.",
            resource: "https://developer.mozilla.org/en-US/docs/Web/CSS",
            resourceLabel: "CSS Documentation",
          },
          {
            name: "JavaScript",
            description: "Understand variables, functions, arrays, objects and DOM manipulation.",
            resource: "https://javascript.info/",
            resourceLabel: "JavaScript Tutorial",
          },
        ],
      },
      {
        number: "02",
        title: "Modern Frontend Development",
        subtitle: "BUILD APPLICATIONS",
        description: "Move beyond static websites and create interactive experiences.",
        color: "blue",
        items: [
          {
            name: "React",
            description: "Learn components, props, state, hooks and application structure.",
            resource: "https://react.dev/learn",
            resourceLabel: "React Documentation",
          },
          {
            name: "TypeScript",
            description: "Write safer and more maintainable JavaScript applications.",
            resource: "https://www.typescriptlang.org/docs/",
            resourceLabel: "TypeScript Handbook",
          },
          {
            name: "API Integration",
            description: "Connect frontend applications with backend APIs.",
            resource: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
            resourceLabel: "Fetch API Guide",
          },
        ],
      },
      {
        number: "03",
        title: "Professional Development",
        subtitle: "GET INDUSTRY READY",
        description: "Learn professional workflows and prepare for employment.",
        color: "orange",
        items: [
          {
            name: "Git and GitHub",
            description: "Manage code versions and collaborate with developers.",
            resource: "https://docs.github.com/en/get-started",
            resourceLabel: "GitHub Guide",
          },
          {
            name: "Testing",
            description: "Learn component testing and debugging techniques.",
            resource: "https://testing-library.com/docs/react-testing-library/intro/",
            resourceLabel: "Testing Library",
          },
          {
            name: "Deployment",
            description: "Publish applications and understand production workflows.",
            resource: "https://vercel.com/docs",
            resourceLabel: "Vercel Documentation",
          },
        ],
      },
    ],
  },

  backend: {
    label: "Backend Developer",
    description: "Learn to build APIs, databases and reliable server-side applications.",
    duration: "5–7 months",
    stages: [
      {
        number: "01",
        title: "Programming and Database Fundamentals",
        subtitle: "START HERE",
        description: "Build a strong foundation in programming and data storage.",
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
            description: "Understand queries, joins, relationships and database design.",
            resource: "https://sqlbolt.com/",
            resourceLabel: "SQLBolt",
          },
          {
            name: "HTTP and Networking",
            description: "Understand requests, responses, methods and status codes.",
            resource: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
            resourceLabel: "HTTP Documentation",
          },
        ],
      },
      {
        number: "02",
        title: "Backend Application Development",
        subtitle: "BUILD APPLICATIONS",
        description: "Create APIs and connect applications to databases.",
        color: "blue",
        items: [
          {
            name: "FastAPI",
            description: "Build REST APIs, request validation and automatic documentation.",
            resource: "https://fastapi.tiangolo.com/tutorial/",
            resourceLabel: "FastAPI Tutorial",
          },
          {
            name: "Database Integration",
            description: "Connect applications to databases using SQLAlchemy.",
            resource: "https://docs.sqlalchemy.org/en/20/tutorial/",
            resourceLabel: "SQLAlchemy Tutorial",
          },
          {
            name: "Authentication",
            description: "Implement password hashing, tokens and access control.",
            resource: "https://fastapi.tiangolo.com/tutorial/security/",
            resourceLabel: "Security Tutorial",
          },
        ],
      },
      {
        number: "03",
        title: "Production and Deployment",
        subtitle: "GET INDUSTRY READY",
        description: "Build secure, testable and deployable backend systems.",
        color: "orange",
        items: [
          {
            name: "API Testing",
            description: "Write automated tests for endpoints and application logic.",
            resource: "https://fastapi.tiangolo.com/tutorial/testing/",
            resourceLabel: "Testing Guide",
          },
          {
            name: "Docker",
            description: "Learn containers and reproducible development environments.",
            resource: "https://docs.docker.com/get-started/",
            resourceLabel: "Docker Guide",
          },
          {
            name: "Deployment",
            description: "Deploy backend services and configure production environments.",
            resource: "https://render.com/docs",
            resourceLabel: "Deployment Guide",
          },
        ],
      },
    ],
  },

  fullstack: {
    label: "Full Stack Developer",
    description: "Learn to build complete applications from user interfaces to databases.",
    duration: "6–9 months",
    stages: [
      {
        number: "01",
        title: "Core Development Skills",
        subtitle: "START HERE",
        description: "Understand frontend technologies and backend programming.",
        color: "lime",
        items: [
          {
            name: "HTML and CSS",
            description: "Build structured, responsive and accessible interfaces.",
            resource: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
            resourceLabel: "MDN Learning Area",
          },
          {
            name: "JavaScript",
            description: "Understand programming fundamentals and browser behaviour.",
            resource: "https://javascript.info/",
            resourceLabel: "JavaScript Tutorial",
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
        title: "Full Stack Application Development",
        subtitle: "BUILD APPLICATIONS",
        description: "Bring frontend, backend and database technologies together.",
        color: "blue",
        items: [
          {
            name: "React",
            description: "Create reusable interfaces and interactive applications.",
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
        title: "Professional Full Stack Engineering",
        subtitle: "GET INDUSTRY READY",
        description: "Secure, test and deploy complete software products.",
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
    description: "Learn to transform raw information into meaningful business insights.",
    duration: "4–6 months",
    stages: [
      {
        number: "01",
        title: "Data Fundamentals",
        subtitle: "START HERE",
        description: "Understand how data is collected, stored and interpreted.",
        color: "lime",
        items: [
          {
            name: "Excel",
            description: "Learn formulas, sorting, filtering and pivot tables.",
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
            description: "Understand averages, distributions and probability.",
            resource: "https://www.khanacademy.org/math/statistics-probability",
            resourceLabel: "Statistics Learning",
          },
        ],
      },
      {
        number: "02",
        title: "Data Analysis and Visualization",
        subtitle: "BUILD APPLICATIONS",
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
            resourceLabel: "Pandas Guide",
          },
          {
            name: "Data Visualization",
            description: "Create charts and dashboards to communicate findings.",
            resource: "https://public.tableau.com/en-us/s/resources",
            resourceLabel: "Tableau Resources",
          },
        ],
      },
      {
        number: "03",
        title: "Professional Data Analytics",
        subtitle: "GET INDUSTRY READY",
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
            name: "Exploratory Data Analysis",
            description: "Find patterns, outliers and relationships in datasets.",
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
    description: "Learn to develop intelligent applications using machine learning.",
    duration: "8–12 months",
    stages: [
      {
        number: "01",
        title: "Programming and Mathematics",
        subtitle: "START HERE",
        description: "Build the mathematical and programming foundations of AI.",
        color: "lime",
        items: [
          {
            name: "Python",
            description: "Learn functions, data structures and object-oriented programming.",
            resource: "https://docs.python.org/3/tutorial/",
            resourceLabel: "Python Tutorial",
          },
          {
            name: "Linear Algebra and Statistics",
            description: "Study vectors, matrices, probability and statistics.",
            resource: "https://www.khanacademy.org/math",
            resourceLabel: "Mathematics Learning",
          },
          {
            name: "NumPy and Pandas",
            description: "Work with numerical information and datasets.",
            resource: "https://numpy.org/learn/",
            resourceLabel: "NumPy Learning",
          },
        ],
      },
      {
        number: "02",
        title: "Machine Learning",
        subtitle: "BUILD APPLICATIONS",
        description: "Train models and understand how they learn from data.",
        color: "blue",
        items: [
          {
            name: "Machine Learning",
            description: "Learn supervised and unsupervised learning concepts.",
            resource: "https://developers.google.com/machine-learning/crash-course",
            resourceLabel: "Google ML Course",
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
            resourceLabel: "ML Evaluation",
          },
        ],
      },
      {
        number: "03",
        title: "Advanced AI Development",
        subtitle: "GET INDUSTRY READY",
        description: "Explore deep learning and develop real AI applications.",
        color: "orange",
        items: [
          {
            name: "Deep Learning",
            description: "Understand neural networks and deep learning architectures.",
            resource: "https://www.deeplearning.ai/",
            resourceLabel: "DeepLearning.AI",
          },
          {
            name: "PyTorch",
            description: "Build and train neural networks using PyTorch.",
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
    description: "Build applications, automation tools and backend services with Python.",
    duration: "4–6 months",
    stages: [
      {
        number: "01",
        title: "Python Fundamentals",
        subtitle: "START HERE",
        description: "Develop confidence with Python and its core concepts.",
        color: "lime",
        items: [
          {
            name: "Python Basics",
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
            description: "Practise writing clear solutions to programming problems.",
            resource: "https://www.hackerrank.com/domains/python",
            resourceLabel: "HackerRank Python",
          },
        ],
      },
      {
        number: "02",
        title: "Application Development",
        subtitle: "BUILD APPLICATIONS",
        description: "Apply Python to APIs, databases and automation.",
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
            resourceLabel: "Automation Book",
          },
        ],
      },
      {
        number: "03",
        title: "Professional Python Development",
        subtitle: "GET INDUSTRY READY",
        description: "Improve code quality and prepare applications for real users.",
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
            description: "Track your work and collaborate with developers.",
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
    description: "Learn to design intuitive, accessible and engaging digital experiences.",
    duration: "4–6 months",
    stages: [
      {
        number: "01",
        title: "Design Fundamentals",
        subtitle: "START HERE",
        description: "Understand the principles behind useful and clear interfaces.",
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
        title: "Interface Design",
        subtitle: "BUILD APPLICATIONS",
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
        title: "Professional Design",
        subtitle: "GET INDUSTRY READY",
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
    description: "Learn to protect systems, networks and information from security threats.",
    duration: "6–9 months",
    stages: [
      {
        number: "01",
        title: "Systems and Networking",
        subtitle: "START HERE",
        description: "Understand how computers, networks and operating systems work.",
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
            description: "Practise the command line, permissions and system basics.",
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
        title: "Security Fundamentals",
        subtitle: "BUILD APPLICATIONS",
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
        title: "Professional Security Practice",
        subtitle: "GET INDUSTRY READY",
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
    description: "Develop versatile technical and professional skills for a technology career.",
    duration: "Flexible",
    stages: [
      {
        number: "01",
        title: "Technology Foundations",
        subtitle: "START HERE",
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
        title: "Practical Development",
        subtitle: "BUILD APPLICATIONS",
        description: "Choose a direction and build practical experience.",
        color: "blue",
        items: [
          {
            name: "Git and GitHub",
            description: "Save your work and build a project portfolio.",
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
        title: "Career Preparation",
        subtitle: "GET INDUSTRY READY",
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

export default function CareerRoadmap({
  profile,
  skills = [],
}: CareerRoadmapProps) {
  const initialCareer = (() => {
    const goal = profile?.career_goal?.toLowerCase().trim() ?? "";

    if (goal.includes("frontend") || goal.includes("front-end")) {
      return "frontend";
    }

    if (goal.includes("backend") || goal.includes("back-end")) {
      return "backend";
    }

    if (goal.includes("full stack") || goal.includes("fullstack")) {
      return "fullstack";
    }

    return "frontend";
  })();

  const [selectedCareer, setSelectedCareer] = useState(initialCareer);
  const [expandedStage, setExpandedStage] = useState("01");

  const career = careers[selectedCareer] || careers.general;

  const allItems = career.stages.flatMap((stage) => stage.items);

  const ownedSkills = skills.filter((skill) =>
    allItems.some(
      (item) =>
        item.name.toLowerCase() === skill.name.toLowerCase()
    )
  );

  return (
    <section className="inner-page career-roadmap">
      <style>{`
        .career-roadmap {
          color: #20202b;
        }

        .career-hero {
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          background: #242333;
          color: #f2eadb;
          overflow: hidden;
          min-height: 290px;
        }

        .career-hero-copy {
          padding: 42px;
        }

        .career-eyebrow {
          color: #d7ed50;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .career-hero h1 {
          margin: 25px 0 14px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(38px, 5vw, 58px);
          line-height: 1;
          letter-spacing: -2px;
        }

        .career-hero h1 span {
          color: #d7ed50;
        }

        .career-hero p {
          max-width: 450px;
          color: #c8c6d2;
          font-size: 12px;
          line-height: 1.8;
        }

        .career-hero-art {
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
        }

        .career-circle {
          width: 170px;
          height: 170px;
          border: 1px solid rgba(215,237,80,.6);
          border-radius: 50%;
          display: grid;
          place-items: center;
          box-shadow: 0 0 0 35px rgba(215,237,80,.04),
                      0 0 0 70px rgba(215,237,80,.03);
        }

        .career-circle span {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 64px;
          font-weight: 800;
          color: #d7ed50;
        }

        .career-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin: 24px 0;
        }

        .career-control {
          background: #fffdf8;
          border: 1px solid rgba(32,32,43,.12);
          padding: 17px;
        }

        .career-control label {
          display: block;
          margin-bottom: 10px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
          color: #77716c;
        }

        .career-control select {
          width: 100%;
          padding: 11px;
          background: #f2eadb;
          border: 1px solid #ded8cd;
          color: #20202b;
          font: inherit;
          font-size: 12px;
        }

        .career-overview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
          margin: 24px 0;
        }

        .career-stat {
          padding: 21px;
          min-height: 112px;
          background: #fffdf8;
          border: 1px solid rgba(32,32,43,.12);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .career-stat:first-child {
          background: #d7ed50;
        }

        .career-stat span {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #77716c;
        }

        .career-stat strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 30px;
        }

        .career-heading {
          margin: 40px 0 20px;
        }

        .career-heading h2 {
          margin: 8px 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 32px;
          letter-spacing: -1px;
        }

        .career-heading p {
          color: #77716c;
          font-size: 12px;
          line-height: 1.7;
        }

        .career-stage {
          margin-bottom: 15px;
          background: #fffdf8;
          border: 1px solid rgba(32,32,43,.12);
        }

        .career-stage-button {
          width: 100%;
          display: grid;
          grid-template-columns: 52px 1fr auto;
          align-items: center;
          gap: 17px;
          padding: 20px;
          border: 0;
          background: transparent;
          color: #20202b;
          text-align: left;
          cursor: pointer;
        }

        .career-stage-number {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          background: #d7ed50;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
        }

        .career-stage-blue .career-stage-number {
          background: #dce2ff;
        }

        .career-stage-orange .career-stage-number {
          background: #f9d7c9;
        }

        .career-stage-subtitle {
          display: block;
          color: #898797;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.3px;
          margin-bottom: 6px;
        }

        .career-stage-title {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px;
          font-weight: 700;
        }

        .career-stage-description {
          display: block;
          margin-top: 5px;
          color: #898797;
          font-size: 11px;
          line-height: 1.6;
        }

        .career-chevron {
          font-size: 20px;
        }

        .career-stage-content {
          padding: 0 25px 20px 90px;
        }

        .career-item {
          padding: 16px 0;
          border-top: 1px solid rgba(32,32,43,.1);
        }

        .career-item h4 {
          margin: 0 0 7px;
          font-size: 13px;
        }

        .career-item p {
          margin: 0 0 9px;
          color: #77716c;
          font-size: 11px;
          line-height: 1.7;
        }

        .career-item a {
          color: #3449e8;
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .career-item a:hover {
          text-decoration: underline;
        }

        .career-footer {
          margin-top: 28px;
          padding: 25px;
          background: #242333;
          color: #f2eadb;
        }

        .career-footer h3 {
          margin: 10px 0;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 25px;
        }

        .career-footer p {
          color: #c8c6d2;
          font-size: 12px;
          line-height: 1.7;
        }

        .career-owned {
          color: #657a2d;
          background: #edf4c7;
          padding: 4px 7px;
          font-size: 8px;
          font-weight: 800;
          margin-left: 8px;
          vertical-align: middle;
        }

        @media(max-width: 700px) {
          .career-hero {
            grid-template-columns: 1fr;
          }

          .career-hero-copy {
            padding: 28px 22px;
          }

          .career-hero-art {
            min-height: 180px;
          }

          .career-controls {
            grid-template-columns: 1fr;
          }

          .career-overview {
            grid-template-columns: 1fr;
          }

          .career-stage-button {
            grid-template-columns: 42px 1fr auto;
            gap: 10px;
            padding: 15px;
          }

          .career-stage-number {
            width: 40px;
            height: 40px;
          }

          .career-stage-content {
            padding: 0 16px 16px;
          }
        }
      `}</style>

      <div className="career-hero">
        <div className="career-hero-copy">
          <span className="career-eyebrow">CAREER DEVELOPMENT / LEARNING GUIDE</span>
          <h1>
            Explore your
            <br />
            <span>career path.</span>
          </h1>
          <p>
            Discover the skills, technologies and learning milestones
            that shape different careers in the technology industry.
          </p>
        </div>

        <div className="career-hero-art">
          <div className="career-circle">
            <span>C</span>
          </div>
        </div>
      </div>

      <div className="career-controls">
        <div className="career-control">
          <label htmlFor="career-track">EXPLORE A CAREER</label>
          <select
            id="career-track"
            value={selectedCareer}
            onChange={(event) => setSelectedCareer(event.target.value)}
          >
            {Object.entries(careers).map(([key, career]) => (
              <option value={key} key={key}>
                {career.label}
              </option>
            ))}
          </select>
        </div>

        <div className="career-control">
          <label>ESTIMATED LEARNING TIME</label>
          <div style={{ fontWeight: 800, fontSize: 17 }}>
            {career.duration}
          </div>
        </div>
      </div>

      <div className="career-overview">
        <div className="career-stat">
          <span>LEARNING STAGES</span>
          <strong>{career.stages.length}</strong>
        </div>
        <div className="career-stat">
          <span>LEARNING TOPICS</span>
          <strong>{allItems.length}</strong>
        </div>
        <div className="career-stat">
          <span>YOUR EXISTING MATCHES</span>
          <strong>{ownedSkills.length}</strong>
        </div>
      </div>

      <div className="career-heading">
        <span className="section-index">CAREER LEARNING BLUEPRINT</span>
        <h2>{career.label}</h2>
        <p>{career.description}</p>
      </div>

      {career.stages.map((stage) => {
        const expanded = expandedStage === stage.number;

        return (
          <article
            className={`career-stage career-stage-${stage.color}`}
            key={`${selectedCareer}-${stage.number}`}
          >
            <button
              type="button"
              className="career-stage-button"
              onClick={() =>
                setExpandedStage(expanded ? "" : stage.number)
              }
              aria-expanded={expanded}
            >
              <span className="career-stage-number">{stage.number}</span>
              <span>
                <span className="career-stage-subtitle">
                  {stage.subtitle}
                </span>
                <span className="career-stage-title">
                  {stage.title}
                </span>
                <span className="career-stage-description">
                  {stage.description}
                </span>
              </span>
              <span className="career-chevron">
                {expanded ? "−" : "+"}
              </span>
            </button>

            {expanded && (
              <div className="career-stage-content">
                {stage.items.map((item) => {
                  const owned = skills.some(
                    (skill) =>
                      skill.name.trim().toLowerCase() ===
                      item.name.trim().toLowerCase()
                  );

                  return (
                    <div className="career-item" key={item.name}>
                      <h4>
                        {item.name}
                        {owned && (
                          <span className="career-owned">
                            IN YOUR PROFILE
                          </span>
                        )}
                      </h4>
                      <p>{item.description}</p>
                      <a
                        href={item.resource}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.resourceLabel} ↗
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </article>
        );
      })}

      <div className="career-footer">
        <span className="career-eyebrow">KEEP EXPLORING</span>
        <h3>Your career. Your possibilities.</h3>
        <p>
          Explore different career paths, understand their required
          technologies and use the learning resources to build your
          technical foundation.
        </p>
      </div>
    </section>
  );
}
