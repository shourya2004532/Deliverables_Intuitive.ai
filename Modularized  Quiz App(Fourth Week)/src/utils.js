export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const formatTimer = (seconds) => `Time: ${clamp(seconds, 0, 999)}`;

export const getProgressPercent = (currentIndex, total) => {
  if (total <= 0) return 0;
  return Math.round((currentIndex / total) * 100);
};

export const getResultSummary = ({ score, attempted, total }) => {
  const safeTotal = Math.max(total ?? 0, 0);
  const safeAttempted = clamp(attempted ?? 0, 0, safeTotal);
  const safeScore = clamp(score ?? 0, 0, safeTotal);
  const unattempted = safeTotal - safeAttempted;
  const pct = safeTotal === 0 ? 0 : Math.round((safeScore / safeTotal) * 100);

  return { safeScore, safeAttempted, unattempted, pct, total: safeTotal };
};

export const validateQuestions = (questions) => {
  if (!Array.isArray(questions)) return { valid: false, reason: "not-array" };
  if (questions.length === 0) return { valid: false, reason: "empty" };

  for (const [index, item] of questions.entries()) {
    if (!item || typeof item.q !== "string" || !Array.isArray(item.o) || item.o.length === 0) {
      return { valid: false, reason: `invalid-${index}` };
    }
    if (typeof item.a !== "number" || item.a < 0 || item.a >= item.o.length) {
      return { valid: false, reason: `bad-answer-${index}` };
    }
  }

  return { valid: true, reason: "ok" };
};
