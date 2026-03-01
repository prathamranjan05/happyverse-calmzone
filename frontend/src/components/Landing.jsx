import { useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import "./landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <div className="content-overlay">
        <div className="glass-card">
          <h1 className="glitch-text" data-text="HappyVerse ✨">HappyVerse ✨</h1>

          <p className="floating-text">
            Your safe digital space for calmness, growth, positivity and
            self-reflection.
          </p>

          <SignedOut>
            <div className="auth-buttons">
              <SignInButton mode="modal">
                <button className="primary-btn portal-btn">
                  <span>Enter the Portal →</span>
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="secondary-btn">Sign Up</button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="auth-buttons">
              <button
                className="primary-btn portal-btn"
                onClick={() => navigate("/dashboard")}
              >
                <span>Return to Your Realm →</span>
              </button>

              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <div className="features">
            <div className="feature-item">🧠 AI Chat Support</div>
            <div className="feature-item">🎮 Mindful Mini Games</div>
            <div className="feature-item">🌿 Calm Breathing Space</div>
            <div className="feature-item">📔 Mood & Journal Tracker</div>
          </div>
        </div>
      </div>
    </div>
  );
}