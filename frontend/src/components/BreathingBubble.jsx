import { motion as Motion } from "framer-motion";
import { useEffect, useReducer, useRef } from "react";

/* ------------------ DATA ------------------ */

const TECHNIQUES = {
  box: [
    { label: "Inhale", seconds: 4, scale: 1.25 },
    { label: "Hold", seconds: 4, scale: 1.25 },
    { label: "Exhale", seconds: 4, scale: 1.0 },
    { label: "Hold", seconds: 4, scale: 1.0 },
  ],
  calm: [
    { label: "Inhale", seconds: 4, scale: 1.25 },
    { label: "Exhale", seconds: 6, scale: 1.0 },
  ],
  relax: [
    { label: "Inhale", seconds: 5, scale: 1.3 },
    { label: "Hold", seconds: 2, scale: 1.3 },
    { label: "Exhale", seconds: 7, scale: 1.0 },
  ],
  energize: [
    { label: "Inhale", seconds: 6, scale: 1.35 },
    { label: "Exhale", seconds: 2, scale: 1.0 },
  ],
};

/* ------------------ REDUCER ------------------ */

function reducer(state, action) {
  switch (action.type) {
    case "RESET":
      return {
        phaseIndex: 0,
        secondsLeft: action.seconds,
      };

    case "TICK": {
      if (state.secondsLeft > 1) {
        return {
          ...state,
          secondsLeft: state.secondsLeft - 1,
        };
      }

      const nextIndex = (state.phaseIndex + 1) % action.phases.length;

      return {
        phaseIndex: nextIndex,
        secondsLeft: action.phases[nextIndex].seconds,
      };
    }

    default:
      return state;
  }
}

/* ------------------ COMPONENT ------------------ */

export default function BreathingBubble({
  technique,
  session,
  running,
  theme,
  onFinish,
}) {
  const phases = TECHNIQUES[technique];

  const [state, dispatch] = useReducer(reducer, {
    phaseIndex: 0,
    secondsLeft: phases[0].seconds,
  });

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const phase = phases[state.phaseIndex];

  useEffect(() => {
    if (!running) {
      clearInterval(timerRef.current);
      return;
    }

    dispatch({ type: "RESET", seconds: phases[0].seconds });
    startTimeRef.current = Date.now();

    const targetDuration =
      session === "1min"
        ? 60
        : session === "5min"
        ? 300
        : null;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      if (targetDuration && elapsed >= targetDuration) {
        clearInterval(timerRef.current);
        onFinish();
        return;
      }

      dispatch({
        type: "TICK",
        phases,
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [running, session, technique, onFinish, phases]); // ✅ state.phaseIndex removed

  return (
    <Motion.div
      animate={{ scale: running ? phase.scale : 1 }}
      transition={{ duration: phase.seconds, ease: "easeInOut" }}
      style={{
        width: 420,
        height: 420,
        borderRadius: "50%",
        background: theme.bubble,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: theme.text,
        fontFamily: "'Crimson Text', serif",
        boxShadow: `0 0 60px ${theme.bubble}`,
      }}
    >
      <div style={{ fontSize: "2.4rem", fontWeight: 600 }}>
        {running ? phase.label : "Ready"}
      </div>

      {running && (
        <div
          style={{
            fontSize: "1.8rem",
            marginTop: 14,
            padding: "6px 18px",
            borderRadius: "999px",
            border: `2px solid ${theme.text}`,
            background: "rgba(255,255,255,0.15)",
          }}
        >
          {state.secondsLeft}
        </div>
      )}
    </Motion.div>
  );
}