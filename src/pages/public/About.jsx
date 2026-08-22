import { FiTarget, FiUsers, FiAward, FiCheckCircle, FiZap, FiShield } from 'react-icons/fi';
import './About.css';

const About = () => {
  const features = [
    { icon: <FiTarget />, title: 'Real-World Questions', description: 'Questions designed to mirror real interview and assessment scenarios.' },
    { icon: <FiZap />, title: 'Timed Assessments', description: 'Simulate real exam conditions with countdown timers and auto-submission.' },
    { icon: <FiCheckCircle />, title: 'Instant Scoring', description: 'Get immediate feedback with detailed explanations for every answer.' },
    { icon: <FiUsers />, title: 'Community Leaderboard', description: 'Compete with developers worldwide and track your ranking.' },
    { icon: <FiAward />, title: 'Achievements', description: 'Earn badges and unlock achievements as you progress.' },
    { icon: <FiShield />, title: 'Secure Platform', description: 'Your data is protected with enterprise-grade security.' },
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About CodeQuiz Hub</h1>
          <p>
            CodeQuiz Hub is a technical programming quiz and assessment platform designed
            to help students, developers, and job seekers practice and improve their coding skills.
          </p>
        </div>
      </div>

      <div className="about-container">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            We believe that consistent practice and self-assessment are the keys to mastering
            programming. CodeQuiz Hub provides a comprehensive platform where developers can
            test their knowledge across 20+ technologies, receive instant feedback, track their
            progress, and prepare confidently for technical interviews.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="about-feature-card">
                <div className="about-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section about-team">
          <h2>Technology Stack</h2>
          <div className="tech-stack-list">
            {[
              'React.js',
              'Java 21',
              'Spring Boot',
              'Spring Security',
              'MySQL',
              'REST APIs',
              'JPA / Hibernate',
              'BCrypt Encryption',
            ].map((tech) => (
              <span key={tech} className="tech-stack-item">{tech}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
