export function calculateScores(template, answers) {
  const categoryScores = {};
  let qIndex = 0;

  template.categories.forEach((cat) => {
    let score = 0;
    let max = 0;

    cat.questions.forEach((q) => {
      const answerIndex = answers[qIndex];
      if (answerIndex !== null && answerIndex !== undefined) {
        score += q.options[answerIndex].points;
      }
      max += Math.max(...q.options.map((o) => o.points));
      qIndex++;
    });

    categoryScores[cat.name] = {
      score,
      max,
      pct: max > 0 ? Math.round((score / max) * 100) : 0,
    };
  });

  const totalScore = Object.values(categoryScores).reduce(
    (s, c) => s + c.score,
    0
  );
  const totalMax = Object.values(categoryScores).reduce(
    (s, c) => s + c.max,
    0
  );
  const percentage =
    totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  let tier = template.tiers[0];
  for (let i = template.tiers.length - 1; i >= 0; i--) {
    if (percentage >= template.tiers[i].minPct) {
      tier = template.tiers[i];
      break;
    }
  }

  return {
    score: totalScore,
    maxScore: totalMax,
    percentage,
    tier: tier.name,
    tierData: tier,
    categoryScores,
  };
}

export function getTotalQuestions(template) {
  return template.categories.reduce(
    (sum, cat) => sum + cat.questions.length,
    0
  );
}

export function flattenQuestions(template) {
  const questions = [];
  template.categories.forEach((cat) => {
    cat.questions.forEach((q) => {
      questions.push({ ...q, category: cat.name, categoryIcon: cat.icon });
    });
  });
  return questions;
}
