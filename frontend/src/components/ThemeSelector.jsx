import styled from "styled-components";
import { THEMES } from "./themes";

const Container = styled.div`
  margin-top: 30px;
`;

const Wrapper = styled.div`
  position: relative;
`;

const Indicator = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 54px;
  border-radius: 16px;
  background: ${({ theme }) => theme.bubble};
  box-shadow: 0 0 30px ${({ theme }) => theme.bubble};
  transition: transform 0.35s ease;
  z-index: 0;
`;

const ThemeButton = styled.button`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 14px;
  margin-bottom: 14px;
  border-radius: 16px;
  border: 2px solid ${({ theme }) => theme.bubble};
  background: transparent;
  cursor: pointer;
  font-family: "Crimson Text", serif;
  font-size: 1.1rem;
  color: ${({ active, theme }) =>
    active ? "#fff" : theme.text};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export default function ThemeSelector({ selectedTheme, setTheme }) {
  const themeKeys = Object.keys(THEMES);
  const activeIndex = themeKeys.indexOf(selectedTheme);

  return (
    <Container>
      <h3>Theme</h3>

      <Wrapper>
        <Indicator
          style={{
            transform: `translateY(${activeIndex * 68}px)`,
          }}
        />

        {themeKeys.map((key) => (
          <ThemeButton
            key={key}
            active={selectedTheme === key}
            onClick={() => setTheme(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </ThemeButton>
        ))}
      </Wrapper>
    </Container>
  );
}