export function updateStreak(prevStats, today = new Date()) {
  const todayStr = today.toISOString().split("T")[0];

  const {
    streak = 0,
    totalSessions = 0,
    lastSessionDate = null,
  } = prevStats;

  if (!lastSessionDate) {
    return {
      streak: 1,
      totalSessions: totalSessions + 1,
      lastSessionDate: todayStr,
    };
  }

  const last = new Date(lastSessionDate);
  const diffDays = Math.floor(
    (new Date(todayStr) - last) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return {
      streak,
      totalSessions: totalSessions + 1,
      lastSessionDate: todayStr,
    };
  }

  if (diffDays === 1) {
    return {
      streak: streak + 1,
      totalSessions: totalSessions + 1,
      lastSessionDate: todayStr,
    };
  }

  return {
    streak: 1,
    totalSessions: totalSessions + 1,
    lastSessionDate: todayStr,
  };
}
