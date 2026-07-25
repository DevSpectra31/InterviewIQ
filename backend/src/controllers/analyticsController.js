import prisma from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';

// ──────────────────────────────────────────────────────────────────────
// GET /api/analytics
// @desc    Get detailed user performance analytics & statistics
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const getUserAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Fetch all user interviews with questions
  const interviews = await prisma.interview.findMany({
    where: { userId },
    include: {
      questions: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  const completed = interviews.filter((i) => i.status === 'COMPLETED' && i.overallScore !== null);
  
  // Total stats
  const totalInterviews = interviews.length;
  const completedCount = completed.length;
  
  const averageScore =
    completedCount > 0
      ? Math.round(completed.reduce((acc, i) => acc + (i.overallScore || 0), 0) / completedCount)
      : 0;

  // Total questions answered
  const allQuestions = interviews.flatMap((i) => i.questions);
  const answeredQuestions = allQuestions.filter((q) => q.score !== null);
  const totalQuestionsAnswered = answeredQuestions.length;

  // Score trend over time
  const scoreTrend = completed.map((i) => ({
    id: i.id,
    date: i.completedAt ? new Date(i.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
    score: i.overallScore || 0,
    topic: i.topic,
    type: i.type,
  }));

  // Breakdown by Interview Type
  const typeMap = { TECHNICAL: [], HR: [], RESUME: [], COMPANY: [] };
  completed.forEach((i) => {
    if (typeMap[i.type]) {
      typeMap[i.type].push(i.overallScore || 0);
    }
  });

  const typeBreakdown = Object.keys(typeMap).map((typeKey) => {
    const scores = typeMap[typeKey];
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return {
      type: typeKey,
      count: scores.length,
      averageScore: avg,
    };
  });

  // Breakdown by Difficulty
  const diffMap = { EASY: 0, MEDIUM: 0, HARD: 0 };
  interviews.forEach((i) => {
    if (diffMap[i.difficulty] !== undefined) {
      diffMap[i.difficulty]++;
    }
  });

  const difficultyBreakdown = Object.keys(diffMap).map((diffKey) => ({
    difficulty: diffKey,
    count: diffMap[diffKey],
  }));

  // Aggregate strengths & weaknesses
  const strengthsMap = {};
  const weaknessesMap = {};

  answeredQuestions.forEach((q) => {
    q.strengths.forEach((s) => {
      strengthsMap[s] = (strengthsMap[s] || 0) + 1;
    });
    q.weaknesses.forEach((w) => {
      weaknessesMap[w] = (weaknessesMap[w] || 0) + 1;
    });
  });

  const topStrengths = Object.entries(strengthsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill);

  const topWeaknesses = Object.entries(weaknessesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([area]) => area);

  res.status(200).json({
    success: true,
    data: {
      totalInterviews,
      completedInterviews: completedCount,
      averageScore,
      totalQuestionsAnswered,
      scoreTrend,
      typeBreakdown,
      difficultyBreakdown,
      topStrengths,
      topWeaknesses,
    },
  });
});
