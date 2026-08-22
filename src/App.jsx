import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/public/Home';
import Technologies from './pages/public/Technologies';
import Quizzes from './pages/public/Quizzes';
import Leaderboard from './pages/public/Leaderboard';
import About from './pages/public/About';
import QuizPage from './pages/quiz/QuizPage';
import Dashboard from './pages/user/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';

// Styles
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/instructor-dashboard" element={<InstructorDashboard />} />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div style={{ padding: '120px 24px', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '4rem', color: '#e2e8f0' }}>404</h1>
                  <h2 style={{ color: '#475569' }}>Page Not Found</h2>
                  <p style={{ color: '#94a3b8', marginTop: '8px' }}>
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;
