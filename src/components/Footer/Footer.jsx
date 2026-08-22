import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">
                <span className="fli-inner">&lt;/&gt;</span>
              </span>
              <span className="logo-text">
                Code<span className="logo-highlight">Quiz</span> Hub
              </span>
            </Link>
            <p className="footer-description">
              The best platform to test your coding skills and grow as a developer.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="GitHub"><FiGithub /></a>
              <a href="#" className="social-link" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" className="social-link" aria-label="Discord">💬</a>
              <a href="#" className="social-link" aria-label="LinkedIn"><FiLinkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/technologies">Technologies</Link></li>
              <li><Link to="/quizzes">Quizzes</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Technologies */}
          <div className="footer-section">
            <h4>Technologies</h4>
            <ul>
              <li><Link to="/technologies">Java</Link></li>
              <li><Link to="/technologies">Python</Link></li>
              <li><Link to="/technologies">JavaScript</Link></li>
              <li><Link to="/technologies">React</Link></li>
              <li><Link to="/technologies">Spring Boot</Link></li>
              <li><Link to="/technologies">SQL</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/about">FAQ</Link></li>
              <li><Link to="/about">Contact Us</Link></li>
              <li><Link to="/about">Privacy Policy</Link></li>
              <li><Link to="/about">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* 3D Laptop Illustration */}
        <div className="footer-3d-laptop" aria-hidden="true">
          <div className="fl-screen">
            <div className="fl-line fl-l1" />
            <div className="fl-line fl-l2" />
            <div className="fl-line fl-l3" />
            <div className="fl-line fl-l4" />
          </div>
          <div className="fl-base" />
          <div className="fl-glow" />
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 CodeQuiz Hub. All rights reserved.</p>
          <p className="made-with">Made with ❤️ for developers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
