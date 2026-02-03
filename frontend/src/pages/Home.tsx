import React from "react";
import "../styles/Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">

      {/* Navbar Section */}
      <nav className="navbar">
        <h1 className="logo">✨ SheRise</h1>
        <div className="nav-buttons">
          <a href="/login">
          <button className="login-btn">Login</button>
          </a>
          <a href="/register">
  <button className="signup-btn">Create Account</button>
</a>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Empowering Women, Transforming Lives</h2>
          <p>
            A complete platform for women's health, education, career growth,
            safety and financial independence. Join thousands of women on their journey to success.
          </p>
          <button className="get-started-btn">Get Started Today</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>What We Offer</h2>
        <p>Comprehensive tools and resources designed for your success</p>

        <div className="feature-cards">

          <div className="card">
            <img
              src="https://img.freepik.com/free-vector/women-health-concept-illustration_114360-8571.jpg"
              alt="Health"
            />
            <h3>Women Health Hub</h3>
            <p>Track your health, fitness goals, and mental wellness with personalized insights and expert guidance.</p>
          </div>

          <div className="card">
            <img
              src="https://img.freepik.com/free-vector/online-education-concept_23-2148525861.jpg"
              alt="Education"
            />
            <h3>Educational Resources</h3>
            <p>Access courses, workshops, and materials on rights, skills development, and self-care practices.</p>
          </div>

          <div className="card">
            <img
              src="https://img.freepik.com/free-vector/career-progress-concept-illustration_114360-12574.jpg"
              alt="Career"
            />
            <h3>Career Support</h3>
            <p>Find job opportunities, connect with mentors, and expand your professional network.</p>
          </div>

          <div className="card">
            <img
              src="https://img.freepik.com/free-vector/online-community-concept_52683-37493.jpg"
              alt="Community"
            />
            <h3>Community Support</h3>
            <p>Join a supportive community of women, share experiences, and grow together.</p>
          </div>

        </div>
      </section>

      {/* Inspirational Section */}
      <section className="inspiration">
        <h2>Real Women, Real Stories</h2>
        <p>
          Get inspired by the stories of women who transformed their lives with courage, 
          determination, and the support of our community. Your success story starts here.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 SheRise - Empowering Women Everywhere 💜</p>
      </footer>

    </div>
  );
};

export default Home;