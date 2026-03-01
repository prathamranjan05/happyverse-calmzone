import { useState, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import BreathingBubble from "./BreathingBubble";
import SessionSelector from "./SessionSelector";
import ThemeSelector from "./ThemeSelector";
import { THEMES } from "./themes";
import { updateStreak } from "../utils/streak";
import { loadStats, saveStats } from "../utils/storage";
import sessionCue from "../assets/session-cue.mp3";

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: "Crimson Text", serif;
  display: flex;
  flex-direction: column;
`;

/* ===== HEADER STYLES ===== */
const Header = styled.div`
  height: 60px;
  background: #1a1a2a;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 30px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
  border-bottom: 1px solid rgba(0, 243, 255, 0.2);
  box-sizing: border-box;

  &:hover {
    background: #242438;
  }

  &::before {
    content: 'Go to Home';
    position: absolute;
    bottom: -30px;
    left: 30px;
    background: #1a1a2a;
    color: #00f3ff;
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    white-space: nowrap;
    z-index: 1000;
    border: 1px solid rgba(0, 243, 255, 0.3);
  }

  &:hover::before {
    opacity: 1;
  }
`;

const HeaderSpan = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 2px;
  font-family: 'Orbitron', sans-serif;
  color: #00f3ff;
  text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);

  &::after {
    content: '🏠';
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${Header}:hover &::after {
    opacity: 1;
  }
`;

/* ===== MAIN CONTENT ===== */
const MainContent = styled.div`
  flex: 1;
  padding: 40px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.panel};
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 0 30px ${({ theme }) => theme.bubble};
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 120px;
`;

/* ===== FOOTER STYLES ===== */
const Footer = styled.footer`
  padding: 2.5rem 2rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  background: #1a1a2a;
  border-top: 1px solid rgba(0, 243, 255, 0.15);
  position: relative;
  z-index: 100;
  width: 100%;
  margin-top: auto;
`;

const FooterText = styled.p`
  margin: 10px 0;
  font-size: 1rem;
`;

const MadeWith = styled.p`
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
  font-size: 1rem;
  margin-bottom: 15px;

  span {
    color: #ff6b9d;
    animation: pulse 2s infinite;
    display: inline-block;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }
`;

const TeamCredits = styled.div`
  margin: 20px auto;
  font-size: 1.1rem;
  font-weight: 400;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px 25px;
  color: #00f3ff;
  border-top: 1px solid rgba(0, 243, 255, 0.2);
  border-bottom: 1px solid rgba(0, 243, 255, 0.2);
  padding: 20px 0;
  max-width: 800px;
`;

const TeamMember = styled.span`
  padding: 0 8px;
  transition: all 0.3s ease;
  cursor: default;
  position: relative;
  color: #00f3ff;
  font-weight: 400;
  letter-spacing: 0.5px;

  &:hover {
    color: #ffee00;
    transform: translateY(-2px);
    text-shadow: 0 0 10px #00f3ff;
  }

  &::after {
    content: '•';
    position: absolute;
    right: -18px;
    color: rgba(255, 255, 255, 0.3);
    font-size: 16px;
    top: 50%;
    transform: translateY(-50%);
  }

  &:last-child::after {
    display: none;
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem !important;
  opacity: 0.6;
  margin-top: 20px !important;
  letter-spacing: 0.5px;
`;

export default function CalmZone() {
  const [selectedTheme, setSelectedTheme] = useState("meadow");
  const [dark, setDark] = useState(false);

  const activeTheme = THEMES[selectedTheme][dark ? "dark" : "light"];

  const [running, setRunning] = useState(false);
  const [technique, setTechnique] = useState("box");
  const [session, setSession] = useState("free");
  const [stats, setStats] = useState(loadStats);

  /* 🎧 Audio unlocked via user interaction */
  const audioRef = useRef(null);

  function initAudio() {
    if (!audioRef.current) {
      const audio = new Audio(sessionCue);
      audio.volume = 0.6;
      audioRef.current = audio;
    }
  }

  function playCue() {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  function handleSessionComplete() {
    playCue();

    setStats((prev) => {
      const updated = updateStreak(prev);
      saveStats(updated);
      return updated;
    });

    setRunning(false);
  }

  function goToHome() {
    window.location.href = "https://happy-verse-calm-journal.onrender.com";
    console.log("Navigating to home page");
  }

  return (
    <ThemeProvider theme={activeTheme}>
      <Container>
        {/* Main Header - Clickable HAPPYVERSE Home Button */}
        <Header onClick={goToHome}>
          <HeaderSpan>HAPPYVERSE</HeaderSpan>
        </Header>

        <MainContent>
          <Layout>

            {/* LEFT */}
            <Card>
              <h2>Breathing Technique</h2>

              <select
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  marginBottom: "16px",
                  fontFamily: "Crimson Text, serif",
                }}
              >
                <option value="box">Box Breathing</option>
                <option value="calm">Calm</option>
                <option value="relax">Deep Relax</option>
                <option value="energize">Energize</option>
              </select>

              <SessionSelector value={session} onChange={setSession} />

              <ThemeSelector
                selectedTheme={selectedTheme}
                setTheme={setSelectedTheme}
              />
            </Card>

            {/* CENTER */}
            <Center>
              <BreathingBubble
                technique={technique}
                session={session}
                running={running}
                theme={activeTheme}
                onFinish={handleSessionComplete}
              />

              <button
                onClick={() => {
                  initAudio(); // unlock on first interaction

                  if (!running) {
                    playCue();
                    setRunning(true);
                  } else {
                    playCue();
                    setRunning(false);
                  }
                }}
                style={{
                  marginTop: "120px",
                  padding: "18px 56px",
                  borderRadius: "999px",
                  border: "none",
                  background: activeTheme.bubble,
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  fontFamily: "Crimson Text, serif",
                  boxShadow: `0 0 25px ${activeTheme.bubble}`,
                }}
              >
                {running ? "Stop" : "Start"}
              </button>
            </Center>

            {/* RIGHT */}
            <Card>
              <h3>Statistics</h3>
              <p>Streak: {stats.streak}</p>
              <p>Total Sessions: {stats.totalSessions}</p>

              <button
                onClick={() => setDark((d) => !d)}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  background: activeTheme.bubble,
                  fontFamily: "Crimson Text, serif",
                  boxShadow: `0 0 20px ${activeTheme.bubble}`,
                }}
              >
                {dark ? "Light Mode" : "Dark Mode"}
              </button>

              <div style={{ marginTop: "40px", lineHeight: "1.7" }}>
                <h4 style={{ marginBottom: "12px" }}>Meditation Guidance</h4>

                <p style={{ marginBottom: "14px", opacity: 0.9 }}>
                  Either sit comfortably or lie down.
                  Let your hands rest naturally. Allow your jaw and forehead to soften.
                  Simply settle into stillness.
                </p>

                <p style={{ marginBottom: "14px", opacity: 0.9 }}>
                  Bring your awareness gently to your breath. Notice the air entering
                  through your nose and leaving your body. Follow each inhale and
                  exhale with quiet attention. If your mind drifts, calmly return to
                  the rhythm without judgment.
                </p>

                <p style={{ opacity: 0.9 }}>
                  With each exhale, allow tension to dissolve. Stay present with the
                  rhythm, and let the session unfold naturally.
                </p>
              </div>
            </Card>

          </Layout>
        </MainContent>

        {/* Footer with Team Credits */}
        <Footer>
          <MadeWith>Made with <span>💜</span> by</MadeWith>
          <TeamCredits>
            <TeamMember>Pratham Ranjan</TeamMember>
            <TeamMember>Chirag Agarwal</TeamMember>
            <TeamMember>Ishani Jindal</TeamMember>
            <TeamMember>Mehar Bhanwra</TeamMember>
            <TeamMember>Aditi Mehta</TeamMember>
          </TeamCredits>
          <Copyright>&copy; 2026 HappyVerse. All rights reserved.</Copyright>
        </Footer>
      </Container>
    </ThemeProvider>
  );
}