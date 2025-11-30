import styles from './page.module.css';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaExternalLinkAlt, FaYoutube, FaPen } from 'react-icons/fa';
import { SiHuggingface } from 'react-icons/si';

const blogPosts: { title: string; date: string; description: string; url: string }[] = [
  // Add your blog posts here
  // Example:
  // {
  //   title: 'Building an AI-Powered Recommendation System',
  //   date: '2024-03-15',
  //   description: 'A deep dive into collaborative filtering and content-based approaches.',
  //   url: '/blog/recommendation-system',
  // },
];

const projects = [
  {
    title: 'Tobor - Amazon Warehouse Robot',
    period: '09/2024 – 01/2025',
    description: 'Developed an autonomous warehouse robot system simulating Amazon\'s logistics operations. Designed pathfinding, obstacle avoidance, and task scheduling algorithms. The robot detects humans and cargo boxes with a custom-trained YOLO model.',
    tags: ['Python', 'ROS2', 'YOLO', 'Robotics'],
    links: [
      { label: 'GitHub', url: 'https://github.com/rusenbb/Amazon-Warehouse-Robot', icon: 'github' },
      { label: 'Video', url: 'https://youtu.be/h-Jxs_y9kNA', icon: 'youtube' },
    ],
  },
  {
    title: 'Biting The Bytes - Turkish Diacritic Restoration',
    period: '03/2024 – 06/2024',
    description: 'Improved Turkish text by automatically adding missing accent marks and special characters using T5, a transformer model by Google. The system restores proper diacritics for enhanced readability.',
    tags: ['NLP', 'T5', 'Transformers', 'Turkish'],
    links: [
      { label: 'GitHub', url: 'https://github.com/rusenbb/Biting-The-Bytes', icon: 'github' },
      { label: 'Demo', url: 'https://huggingface.co/spaces/emircanerol/diacritizeTR', icon: 'huggingface' },
    ],
  },
  {
    title: 'AIZheimer - Machine Unlearning on Stable Diffusion',
    period: '03/2024 – 06/2024',
    description: 'Selectively removed specific concepts from Stable Diffusion 2.1 while keeping other capabilities intact. Useful for content moderation and customizing AI output.',
    tags: ['Stable Diffusion', 'Machine Unlearning', 'Computer Vision'],
    links: [
      { label: 'GitHub', url: 'https://github.com/rusenbb/AIzheimer', icon: 'github' },
    ],
  },
  {
    title: 'To-AI-or-Not-to-AI - GPT Detector',
    period: '03/2023 – 06/2023',
    description: 'Developed an ensemble method to detect AI-generated text using three fine-tuned models. Addresses concerns about academic integrity and misinformation.',
    tags: ['NLP', 'Ensemble Learning', 'Classification'],
    links: [
      { label: 'GitHub', url: 'https://github.com/rusenbb/To-AI-or-Not-to-AI', icon: 'github' },
      { label: 'Demo', url: 'https://huggingface.co/spaces/rusen/gpt_detector', icon: 'huggingface' },
    ],
  },
  {
    title: 'Anime Recommender',
    period: '09/2022 – 02/2023',
    description: 'Created a personalized anime recommendation system combining collaborative filtering and content-based approaches. Achieved RMSE of 0.289, MAE of 0.213 on the test set.',
    tags: ['Recommender Systems', 'Matrix Factorization', 'Python'],
    links: [
      { label: 'GitHub', url: 'https://github.com/rusenbb/Anime-Recommender', icon: 'github' },
    ],
  },
];

const experience = [
  {
    role: 'Junior AI Engineer',
    company: 'CyberQuote',
    period: '03/2025 – 07/2025',
    location: 'Istanbul, Türkiye',
    description: 'Working on AI automations and agentic LLM implementations for Phillip Capital subsidiary. Building intelligent systems for internal operations and customer-facing websites.',
  },
  {
    role: 'NLP Research Intern',
    company: 'ITU NLP Lab',
    period: '07/2024 – 08/2024',
    location: 'Istanbul, Türkiye',
    description: 'Researched LLMs for financial applications including forecasting, sentiment analysis, tool usage, financial reasoning, and RAG implementations.',
  },
  {
    role: 'AIOps Research Intern',
    company: 'Havelsan',
    period: '08/2024 – 09/2024',
    location: 'Istanbul, Türkiye',
    description: 'Conducted research for AIOps project using software log data for predictive maintenance. Generated demos on HDFS logs.',
  },
];

function getLinkIcon(icon: string) {
  switch (icon) {
    case 'github':
      return <FaGithub />;
    case 'youtube':
      return <FaYoutube />;
    case 'huggingface':
      return <SiHuggingface />;
    default:
      return <FaExternalLinkAlt />;
  }
}

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.greeting}>Hi, I&apos;m</p>
          <h1 className={styles.name}>Ruşen Birben</h1>
          <p className={styles.title}>AI & Data Engineer</p>
          <p className={styles.bio}>
            AI & Data Engineering graduate from Istanbul Technical University, passionate about NLP, LLMs, 
            and building intelligent systems. Currently working on agentic AI applications.
          </p>
          <div className={styles.location}>
            <FaMapMarkerAlt />
            <span>İstanbul, Türkiye</span>
          </div>
          <div className={styles.heroLinks}>
            <a href="https://github.com/rusenbb" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/rusenbirben" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
              <FaLinkedin />
            </a>
            <a href="mailto:rusenbirben@gmail.com" className={styles.iconLink}>
              <FaEnvelope />
            </a>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className={styles.section} id="experience">
        <h2 className={styles.sectionTitle}>Experience</h2>
        <div className={styles.timeline}>
          {experience.map((exp, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <div className={styles.expHeader}>
                  <h3 className={styles.expRole}>{exp.role}</h3>
                  <span className={styles.expPeriod}>{exp.period}</span>
                </div>
                <p className={styles.expCompany}>{exp.company} · {exp.location}</p>
                <p className={styles.expDescription}>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className={styles.section} id="projects">
        <h2 className={styles.sectionTitle}>Projects</h2>
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <article key={index} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <span className={styles.projectPeriod}>{project.period}</span>
              </div>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.projectTags}>
                {project.tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <div className={styles.projectLinks}>
                {project.links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                    {getLinkIcon(link.icon)}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className={styles.section} id="blog">
        <h2 className={styles.sectionTitle}>Blog</h2>
        {blogPosts.length > 0 ? (
          <div className={styles.blogGrid}>
            {blogPosts.map((post, index) => (
              <a key={index} href={post.url} className={styles.blogCard}>
                <div className={styles.blogHeader}>
                  <FaPen className={styles.blogIcon} />
                  <span className={styles.blogDate}>{post.date}</span>
                </div>
                <h3 className={styles.blogTitle}>{post.title}</h3>
                <p className={styles.blogDescription}>{post.description}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className={styles.blogEmpty}>
            <FaPen className={styles.blogEmptyIcon} />
            <p>Blog posts coming soon...</p>
          </div>
        )}
      </section>

      {/* Education Section */}
      <section className={styles.section} id="education">
        <h2 className={styles.sectionTitle}>Education</h2>
        <div className={styles.educationCard}>
          <div className={styles.eduMain}>
            <h3 className={styles.eduDegree}>B.Sc. in AI and Data Engineering</h3>
            <p className={styles.eduSchool}>Istanbul Technical University</p>
            <p className={styles.eduPeriod}>09/2022 – 07/2025</p>
          </div>
          <div className={styles.eduGpa}>
            <span className={styles.gpaValue}>3.61</span>
            <span className={styles.gpaLabel}>GPA</span>
          </div>
        </div>
        <p className={styles.eduNote}>
          Transferred from Electronics and Communication Engineering program in 2022.
        </p>
      </section>

      {/* Interests Section */}
      <section className={styles.section} id="interests">
        <h2 className={styles.sectionTitle}>Interests</h2>
        <div className={styles.interestsGrid}>
          <div className={styles.interestCard}>
            <span className={styles.interestEmoji}>☕</span>
            <h3>Coffee</h3>
            <p>Specialty coffee enthusiast with V60 and Aeropress setup</p>
          </div>
          <div className={styles.interestCard}>
            <span className={styles.interestEmoji}>📚</span>
            <h3>Books</h3>
            <p>Philosophy, AI/CS, and finance</p>
          </div>
          <div className={styles.interestCard}>
            <span className={styles.interestEmoji}>🇯🇵</span>
            <h3>Anime & Manga</h3>
            <p>Avid watcher and reader</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="https://github.com/rusenbb" target="_blank" rel="noopener noreferrer">
            <FaGithub /> GitHub
          </a>
          <a href="https://linkedin.com/in/rusenbirben" target="_blank" rel="noopener noreferrer">
            <FaLinkedin /> LinkedIn
          </a>
          <a href="mailto:rusenbirben@gmail.com">
            <FaEnvelope /> Email
          </a>
        </div>
        <p className={styles.copyright}>© 2025 Ruşen Birben</p>
      </footer>
    </main>
  );
}
