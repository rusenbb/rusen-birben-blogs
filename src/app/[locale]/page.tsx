import styles from './page.module.css';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaExternalLinkAlt, FaYoutube, FaPen, FaArrowRight } from 'react-icons/fa';
import { SiHuggingface } from 'react-icons/si';
import { Locale, getDictionary } from '@/lib/i18n';
import { getLatestPosts } from '@/lib/blog';

interface Props {
  params: { locale: Locale };
}

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

export default function Home({ params }: Props) {
  const dict = getDictionary(params.locale);
  const latestPosts = getLatestPosts(params.locale, 3);

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.greeting}>{dict.hero.greeting}</p>
          <h1 className={styles.name}>{dict.hero.name}</h1>
          <p className={styles.title}>{dict.hero.title}</p>
          <p className={styles.bio}>{dict.hero.bio}</p>
          <div className={styles.location}>
            <FaMapMarkerAlt />
            <span>{dict.hero.location}</span>
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
        <h2 className={styles.sectionTitle}>{dict.sections.experience}</h2>
        <div className={styles.timeline}>
          {dict.experience.items.map((exp, index) => (
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
        <h2 className={styles.sectionTitle}>{dict.sections.projects}</h2>
        <div className={styles.projectsGrid}>
          {dict.projects.items.map((project, index) => (
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
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{dict.sections.blog}</h2>
          {latestPosts.length > 0 && (
            <Link href={`/${params.locale}/blog`} className={styles.viewAllLink}>
              {dict.sections.viewAll} <FaArrowRight />
            </Link>
          )}
        </div>
        {latestPosts.length > 0 ? (
          <div className={styles.blogGrid}>
            {latestPosts.map((post) => (
              <Link key={post.slug} href={`/${params.locale}/blog/${post.slug}`} className={styles.blogCard}>
                <div className={styles.blogHeader}>
                  <FaPen className={styles.blogIcon} />
                  <span className={styles.blogDate}>{post.date}</span>
                </div>
                <h3 className={styles.blogTitle}>{post.title}</h3>
                <p className={styles.blogDescription}>{post.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.blogEmpty}>
            <FaPen className={styles.blogEmptyIcon} />
            <p>{dict.blog.empty}</p>
          </div>
        )}
      </section>

      {/* Education Section */}
      <section className={styles.section} id="education">
        <h2 className={styles.sectionTitle}>{dict.sections.education}</h2>
        <div className={styles.educationCard}>
          <div className={styles.eduMain}>
            <h3 className={styles.eduDegree}>{dict.education.degree}</h3>
            <p className={styles.eduSchool}>{dict.education.school}</p>
            <p className={styles.eduPeriod}>{dict.education.period}</p>
          </div>
          <div className={styles.eduGpa}>
            <span className={styles.gpaValue}>{dict.education.gpa}</span>
            <span className={styles.gpaLabel}>{dict.education.gpaLabel}</span>
          </div>
        </div>
        <p className={styles.eduNote}>{dict.education.note}</p>
      </section>

      {/* Interests Section */}
      <section className={styles.section} id="interests">
        <h2 className={styles.sectionTitle}>{dict.sections.interests}</h2>
        <div className={styles.interestsGrid}>
          {dict.interests.items.map((interest, index) => (
            <div key={index} className={styles.interestCard}>
              <span className={styles.interestEmoji}>{interest.emoji}</span>
              <h3>{interest.title}</h3>
              <p>{interest.description}</p>
            </div>
          ))}
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
        <p className={styles.copyright}>{dict.footer.copyright}</p>
      </footer>
    </main>
  );
}

