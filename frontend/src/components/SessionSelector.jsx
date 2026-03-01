import styled from "styled-components";

const Container = styled.div`
  margin-top: 24px;
`;

const Wrapper = styled.div`
  position: relative;
`;

const Indicator = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 52px;
  border-radius: 999px;
  background: ${({ theme }) => theme.bubble};
  box-shadow: 0 0 25px ${({ theme }) => theme.bubble};
  transition: transform 0.35s ease;
  z-index: 0;
`;

const Button = styled.button`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 14px;
  margin-bottom: 14px;
  border-radius: 999px;
  border: 2px solid ${({ theme }) => theme.bubble};
  cursor: pointer;
  font-family: "Crimson Text", serif;
  font-size: 1.1rem;
  background: transparent;

  color: ${({ active, theme }) =>
    active ? "#fff" : theme.text};

  transition: all 0.3s ease;

  box-shadow: ${({ active }) =>
    active
      ? "inset 0 0 12px rgba(255,255,255,0.35)"
      : "none"};

  &:hover {
    transform: translateY(-2px);
  }
`;

export default function SessionSelector({ value, onChange }) {
  const options = ["1min", "5min", "free"];
  const labels = {
    "1min": "1 min",
    "5min": "5 min",
    free: "Free Breathing",
  };

  const activeIndex = options.indexOf(value);

  return (
    <Container>
      <h3>Session</h3>

      <Wrapper>
        <Indicator
          style={{
            transform: `translateY(${activeIndex * 66}px)`,
          }}
        />

        {options.map((option) => (
          <Button
            key={option}
            active={value === option}
            onClick={() => onChange(option)}
          >
            {labels[option]}
          </Button>
        ))}
      </Wrapper>
    </Container>
  );
}