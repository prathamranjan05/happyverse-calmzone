import { useUser, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PortalLoading from "./portalloading"; 
import "./dashboard.css";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Updated with your specific project links
  const cards = [
    { 
      title: "Calm Zone 🌿", 
      desc: "Relax your mind with breathing sessions and themes.", 
      link: "/calm-zone", 
      internal: true 
    },
    { 
      title: "Mini Games 🎮", 
      desc: "Boost positivity through mindful mini challenges.", 
      link: "https://happy-verse-mini-games.netlify.app/", 
      internal: false 
    },
    { 
      title: "Happy Bot 🤖", 
      desc: "Talk to your AI emotional support companion.", 
      link: "https://happy-verse-happy-bot.netlify.app/", 
      internal: false 
    },
    { 
      title: "Calm Journal 📔", 
      desc: "Track moods and reflect on your journey.", 
      link: "https://happy-verse-calm-journal.onrender.com", 
      internal: false 
    },
  ];

  const handleNavigation = (card) => {
    if (!card.link) return;

    if (card.internal) {
      setIsLoading(true);
      // Brief delay to allow the "Traveling through portal" animation to feel real
      setTimeout(() => navigate(card.link), 800);
    } else {
      window.open(card.link, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) return <PortalLoading message="Traveling through portal..." />;

  return (
    <div className="dashboard-wrapper">
      {/* TOP NAVIGATION */}
      <nav className="dashboard-nav">
        <h1 className="nav-logo">HappyVerse ✨</h1>
        <div className="nav-user">
          <span>Hi, {user?.firstName || "Explorer"}</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* CENTER CONTENT: 2x2 Grid */}
      <main className="dashboard-main">
        <div className="content-center">
          <h2 className="dashboard-subtitle">Choose your experience</h2>
          <div className="card-grid">
            {cards.map((card, index) => (
              <div 
                key={index} 
                className="dashboard-card" 
                onClick={() => handleNavigation(card)}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <h2>{card.title}</h2>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* BOTTOM FOOTER with Team Credits */}
      <footer className="dashboard-footer">
        <p>Made with 💜 by</p>
        <div className="team-credits">
          <span>Pratham Ranjan</span> • <span>Chirag Agarwal</span> • <span>Ishani Jindal</span> • <span>Mehar Bhanwra</span> • <span>Aditi Mehta</span>
        </div>
        <p className="copyright">&copy; 2026 HappyVerse. All your calm in one place.</p>
      </footer>
    </div>
  );
}