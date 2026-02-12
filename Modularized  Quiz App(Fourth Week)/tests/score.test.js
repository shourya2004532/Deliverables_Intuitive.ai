import { calculateScore } from "../src/score.js";

describe("calculateScore", () => {
  test("adds 1 for correct answer", () => {
    expect(calculateScore(0, 2, 2)).toBe(1);
    expect(calculateScore(5, 1, 1)).toBe(6);
  });

  test("keeps score same for wrong answer", () => {
    expect(calculateScore(3, 0, 2)).toBe(3);
  });
});
