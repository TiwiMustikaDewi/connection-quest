// Connection Quest Scoring Engine
// Blends: Speed & Focus + Arcade Mastery + Indicator Harmony + CTA Commitment Quality
// Total Maximum Score: 1000 Points

export function calculateTotalScore({
  indicators = {},
  choices = [],
  reflection = {},
  arcadeScore = 220,
  startTime = null,
  endTime = null,
}) {
  // 1. Speed & Focus Bonus (Max 250 pts)
  const decisionBonus = Math.min(30, choices.length * 3);
  let speedScore = 190 + decisionBonus;
  if (startTime && endTime) {
    const elapsedMinutes = (endTime - startTime) / 60000;
    if (elapsedMinutes <= 5) speedScore = 250;
    else if (elapsedMinutes <= 8) speedScore = 230;
    else if (elapsedMinutes <= 12) speedScore = 200;
    else if (elapsedMinutes <= 20) speedScore = 160;
    else speedScore = 120;
  } else {
    // If no explicit timer, grant default focused pace
    speedScore = 220;
  }

  // 2. Arcade Games Performance (Max 350 pts)
  // Scaled from arcade performance or decision choices
  const safeArcadeScore = Math.min(350, Math.max(120, arcadeScore || 240));

  // 3. Indicator Harmony & Wisdom (Max 250 pts)
  const init = indicators.initiative || 0;
  const emp = indicators.empathy || 0;
  const adapt = indicators.adaptability || 0;
  const auth = indicators.authenticity || 0;
  const totalIndicators = init + emp + adapt + auth;

  // Base indicator points (max 180)
  const baseIndicatorPoints = Math.min(180, Math.round(totalIndicators * 11));

  // Harmony bonus: rewarding balanced development across all 4 traits (+70 pts)
  const values = [init, emp, adapt, auth];
  const mean = totalIndicators / 4 || 1;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / 4;
  const stdDev = Math.sqrt(variance);
  const harmonyBonus = stdDev < 1.8 ? 70 : stdDev < 2.5 ? 45 : 25;

  const connectionScore = Math.min(250, baseIndicatorPoints + harmonyBonus);

  // 4. CTA Action Commitment Quality (Max 150 pts)
  let ctaScore = 0;
  const pledgeText = reflection.nextAction || '';
  const wordCount = pledgeText.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount >= 10) ctaScore += 80;
  else if (wordCount >= 5) ctaScore += 55;
  else if (wordCount >= 2) ctaScore += 35;

  if (reflection.strategyToPractice) ctaScore += 40;
  if (reflection.targetEnvironment) ctaScore += 30;

  const safeCtaScore = Math.min(150, ctaScore);

  const totalScore = Math.min(1000, speedScore + safeArcadeScore + connectionScore + safeCtaScore);

  return {
    totalScore,
    breakdown: {
      speedScore,
      arcadeScore: safeArcadeScore,
      connectionScore,
      ctaScore: safeCtaScore,
    },
  };
}
