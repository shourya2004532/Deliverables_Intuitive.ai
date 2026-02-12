export const calculateScore = (currentScore, selectedIndex, correctIndex) => {
  if (selectedIndex === correctIndex) return currentScore + 1;
  return currentScore;
};
