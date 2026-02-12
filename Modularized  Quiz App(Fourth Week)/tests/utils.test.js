import {
  clamp,
  formatTimer,
  getProgressPercent,
  getResultSummary,
  validateQuestions
} from "../src/utils.js";

describe("utils", () => {
  test("clamp keeps values within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-2, 0, 10)).toBe(0);
    expect(clamp(25, 0, 10)).toBe(10);
  });

  test("formatTimer formats with label and clamps", () => {
    expect(formatTimer(30)).toBe("Time: 30");
    expect(formatTimer(-5)).toBe("Time: 0");
    expect(formatTimer(1500)).toBe("Time: 999");
  });

  test("getProgressPercent handles totals", () => {
    expect(getProgressPercent(0, 10)).toBe(0);
    expect(getProgressPercent(5, 10)).toBe(50);
    expect(getProgressPercent(1, 3)).toBe(33);
    expect(getProgressPercent(2, 0)).toBe(0);
  });

  test("getResultSummary computes safe values", () => {
    const summary = getResultSummary({ score: 8, attempted: 9, total: 20 });
    expect(summary.safeScore).toBe(8);
    expect(summary.safeAttempted).toBe(9);
    expect(summary.unattempted).toBe(11);
    expect(summary.pct).toBe(40);
  });

  test("getResultSummary reflects updated score in percent", () => {
    const summary = getResultSummary({ score: 6, attempted: 6, total: 10 });
    expect(summary.safeScore).toBe(6);
    expect(summary.pct).toBe(60);
  });

  test("getResultSummary clamps overflows", () => {
    const summary = getResultSummary({ score: 100, attempted: 50, total: 10 });
    expect(summary.safeScore).toBe(10);
    expect(summary.safeAttempted).toBe(10);
    expect(summary.unattempted).toBe(0);
  });

  test("getResultSummary handles zero totals", () => {
    const summary = getResultSummary({ score: 2, attempted: 2, total: 0 });
    expect(summary.safeScore).toBe(0);
    expect(summary.safeAttempted).toBe(0);
    expect(summary.unattempted).toBe(0);
    expect(summary.pct).toBe(0);
  });

  test("validateQuestions rejects invalid data", () => {
    expect(validateQuestions(null).valid).toBe(false);
    expect(validateQuestions([]).valid).toBe(false);
    expect(
      validateQuestions([{ q: "Q", o: ["A"], a: 2 }]).valid
    ).toBe(false);
    expect(
      validateQuestions([{ q: 1, o: ["A"], a: 0 }]).valid
    ).toBe(false);
    expect(
      validateQuestions([{ q: "Q", o: [], a: 0 }]).valid
    ).toBe(false);
  });

  test("validateQuestions accepts valid data", () => {
    const result = validateQuestions([
      { q: "Q", o: ["A", "B"], a: 1 }
    ]);
    expect(result.valid).toBe(true);
  });
});
