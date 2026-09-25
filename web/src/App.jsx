import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./LoginPage";
import Dashboard from "./Dashboard";
import { testBackend } from "./api";

function Home() {
  const checkBackend = async () => {
    const data = await testBackend();
    console.log(data);
  };

  return (
  <div className="app">
    <button onClick={checkBackend}>Test Backend</button>

    <nav className="navbar">
        <div className="logo">StudyMate</div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#ai">AI Assistant</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-buttons">
        <a href="/login">
  <button className="login-btn">Login</button>
</a>

          <a href="/signup">
            <button className="signup-btn">Get Started</button>
          </a>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <span className="badge">YOUR SMART STUDY COMPANION</span>

          <h1>
            Study smarter.
            <br />
            <span>Achieve more.</span>
          </h1>

          <p>
            Organize your subjects, manage tasks, track your progress,
            and use AI to make studying easier.
          </p>

          <div className="hero-buttons">
            <a href="/signup">
              <button className="primary-btn">Start Learning →</button>
            </a>

            <a href="#features">
              <button className="secondary-btn">Explore Features</button>
            </a>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <span>Today's Progress</span>
            <span>•••</span>
          </div>

          <div className="progress-number">72%</div>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

          <p>You're making good progress today.</p>

          <div className="mini-stats">
            <div>
              <strong>7/10</strong>
              <span>Tasks</span>
            </div>

            <div>
              <strong>2.5h</strong>
              <span>Study Time</span>
            </div>

            <div>
              <strong>4</strong>
              <span>Subjects</span>
            </div>
          </div>
        </div>
      </main>

      <section className="features" id="features">
        <div className="section-heading">
          <span>EVERYTHING YOU NEED</span>
          <h2>One place for your entire study life.</h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Subjects</h3>
            <p>Keep your subjects and study material organized.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Tasks</h3>
            <p>Manage assignments and daily study goals.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Understand difficult topics with AI-powered help.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Progress</h3>
            <p>Track your study habits and progress over time.</p>
          </div>
        </div>
      </section>

      <section className="ai-section" id="ai">
        <div>
          <span className="badge">AI POWERED</span>

          <h2>
            Your personal
            <br />
            <span>AI study assistant.</span>
          </h2>

          <p>
            Get explanations, summaries, practice questions and
            personalized study help whenever you need it.
          </p>

          <a href="/signup">
            <button className="primary-btn">Try AI Assistant →</button>
          </a>
        </div>

        <div className="ai-preview">
          <div className="message user-message">
            Explain recursion in simple Hinglish.
          </div>

          <div className="message ai-message">
            Recursion ka simple matlab hai ek function ka khud ko
            call karna, jab tak ek condition satisfy na ho...
          </div>
        </div>
      </section>

      <footer id="about">
        <div>
          <strong>StudyMate</strong>
          <p>Study smarter. Achieve more.</p>
        </div>

        <p>© 2026 StudyMate</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;