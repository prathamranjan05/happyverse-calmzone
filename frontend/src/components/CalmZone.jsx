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
  padding: 0 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
  border-bottom: 1px solid rgba(0, 243, 255, 0.2);
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 15px;
    height: 50px;
  }

  &:hover {
    background: #242438;
  }

  &::before {
    content: 'Go to Home';
    position: absolute;
    bottom: -30px;
    left: 20px;
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

    @media (max-width: 768px) {
      display: none; /* Hide tooltip on mobile */
    }
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

  @media (max-width: 768px) {
    font-size: 1.2rem;
    letter-spacing: 1px;
  }

  &::after {
    content: '🏠';
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;

    @media (max-width: 768px) {
      opacity: 1; /* Always show home icon on mobile */
      margin-left: 5px;
    }
  }

  ${Header}:hover &::after {
    opacity: 1;
  }
`;

/* ===== MAIN CONTENT ===== */
const MainContent = styled.div`
  flex: 1;
  padding: 40px;

  @media (max-width: 1024px) {
    padding: 30px 20px;
  }

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    gap: 30px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 250px 1fr 250px;
    gap: 25px;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr; /* Stack everything on smaller screens */
    gap: 30px;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.panel};
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 0 30px ${({ theme }) => theme.bubble};

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 120px;

  @media (max-width: 900px) {
    padding-top: 60px;
    order: -1; /* Move center content to top on mobile */
  }

  @media (max-width: 768px) {
    padding-top: 40px;
  }
`;

const StartButton = styled.button`
  margin-top: 120px;
  padding: 18px 56px;
  border-radius: 999px;
  border: none;
  background: ${({ theme }) => theme.bubble};
  font-size: 1.3rem;
  cursor: pointer;
  font-family: "Crimson Text", serif;
  box-shadow: 0 0 25px ${({ theme }) => theme.bubble};
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 900px) {
    margin-top: 60px;
  }

  @media (max-width: 768px) {
    margin-top: 40px;
    padding: 16px 48px;
    font-size: 1.2rem;
    width: 100%;
    max-width: 300px;
  }

  @media (max-width: 480px) {
    margin-top: 30px;
    padding: 14px 40px;
    font-size: 1.1rem;
  }
`;

const ThemeToggleButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.bubble};
  font-family: "Crimson Text", serif;
  box-shadow: 0 0 20px ${({ theme }) => theme.bubble};
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-family: "Crimson Text", serif;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.bubble};
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 14px; /* Larger touch target on mobile */
    font-size: 16px; /* Prevent zoom on iOS */
  }

  option {
    background: ${({ theme }) => theme.panel};
    color: ${({ theme }) => theme.text};
  }
`;

const GuidanceSection = styled.div`
  margin-top: 40px;
  line-height: 1.7;

  @media (max-width: 768px) {
    margin-top: 30px;
    font-size: 0.95rem;
  }

  h4 {
    margin-bottom: 12px;
    font-size: 1.2rem;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }

  p {
    margin-bottom: 14px;
    opacity: 0.9;

    @media (max-width: 768px) {
      margin-bottom: 12px;
    }
  }
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

  @media (max-width: 768px) {
    padding: 2rem 1rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 0.8rem 1rem;
  }
`;

const FooterText = styled.p`
  margin: 10px 0;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const MadeWith = styled.p`
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
  font-size: 1rem;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }

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

  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 12px 15px;
    padding: 15px 0;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    gap: 10px 12px;
    padding: 12px 0;
  }
`;

const TeamMember = styled.span`
  padding: 0 8px;
  transition: all 0.3s ease;
  cursor: default;
  position: relative;
  color: #00f3ff;
  font-weight: 400;
  letter-spacing: 0.5px;

  &:active {
    color: #ffee00;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 5px; /* Larger touch area on mobile */
  }

  &::after {
    content: '•';
    position: absolute;
    right: -18px;
    color: rgba(255, 255, 255, 0.3);
    font-size: 16px;
    top: 50%;
    transform: translateY(-50%);

    @media (max-width: 768px) {
      right: -12px;
    }

    @media (max-width: 480px) {
      right: -10px;
    }
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

  @media (max-width: 768px) {
    font-size: 0.8rem !important;
    margin-top: 15px !important;
  }
`;

const StatsContainer = styled.div`
  p {
    margin: 10px 0;
    font-size: 1rem;

    @media (max-width: 768px) {
      font-size: 0.95rem;
      margin: 8px 0;
    }
  }
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

              <Select
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
              >
                <option value="box">Box Breathing</option>
                <option value="calm">Calm</option>
                <option value="relax">Deep Relax</option>
                <option value="energize">Energize</option>
              </Select>

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

              <StartButton
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
                theme={activeTheme}
              >
                {running ? "Stop" : "Start"}
              </StartButton>
            </Center>

            {/* RIGHT */}
            <Card>
              <h3>Statistics</h3>
              <StatsContainer>
                <p>Streak: {stats.streak}</p>
                <p>Total Sessions: {stats.totalSessions}</p>
              </StatsContainer>

              <ThemeToggleButton
                onClick={() => setDark((d) => !d)}
                theme={activeTheme}
              >
                {dark ? "Light Mode" : "Dark Mode"}
              </ThemeToggleButton>

              <GuidanceSection>
                <h4>Meditation Guidance</h4>

                <p>
                  Either sit comfortably or lie down.
                  Let your hands rest naturally. Allow your jaw and forehead to soften.
                  Simply settle into stillness.
                </p>

                <p>
                  Bring your awareness gently to your breath. Notice the air entering
                  through your nose and leaving your body. Follow each inhale and
                  exhale with quiet attention. If your mind drifts, calmly return to
                  the rhythm without judgment.
                </p>

                <p>
                  With each exhale, allow tension to dissolve. Stay present with the
                  rhythm, and let the session unfold naturally.
                </p>
              </GuidanceSection>
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