import styled from "styled-components";

const Box = styled.div`
  padding: 20px;
  border-radius: 20px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default function StatsDisplay({ data, dark, toggleDark }) {
  return (
    <Box>
      <div>Streak: {data.streak}</div>
      <div>Total Sessions: {data.total_sessions}</div>
      <label>
        <input type="checkbox" checked={dark} onChange={toggleDark} /> Dark Mode
      </label>
    </Box>
  );
}
