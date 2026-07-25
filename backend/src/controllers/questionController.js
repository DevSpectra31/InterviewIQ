import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import aiService from '../services/aiService.js';

// ──────────────────────────────────────────────────────────────────────
// POST /api/interviews/:interviewId/questions/next
// @desc    Generate next question for an active interview
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const getNextQuestion = asyncHandler(async (req, res) => {
  const { interviewId } = req.params;

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: {
      questions: {
        orderBy: { askedAt: 'asc' },
      },
    },
  });

  if (!interview) {
    throw ApiError.notFound('Interview session not found');
  }

  if (interview.userId !== req.user.id) {
    throw ApiError.forbidden('Not authorized to access this interview session');
  }

  // Auto-start interview if it was PENDING
  if (interview.status === 'PENDING') {
    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });
  } else if (interview.status !== 'IN_PROGRESS') {
    throw ApiError.badRequest(`Cannot add questions to an interview with status '${interview.status}'`);
  }

  // Generate question text using AI service
  const questionText = await aiService.generateQuestion({
    type: interview.type,
    topic: interview.topic,
    difficulty: interview.difficulty,
    previousQuestions: interview.questions,
  });

  // Create question in database
  const question = await prisma.question.create({
    data: {
      interviewId,
      questionText,
      isFollowUp: interview.questions.length > 0,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Question generated successfully',
    data: question,
  });
});

// ──────────────────────────────────────────────────────────────────────
// POST /api/interviews/:interviewId/questions/:questionId/answer
// @desc    Submit answer to a question and get AI evaluation
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const submitAnswer = asyncHandler(async (req, res) => {
  const { interviewId, questionId } = req.params;
  const { answerText } = req.body;

  if (!answerText || !answerText.trim()) {
    throw ApiError.badRequest('Answer text is required');
  }

  // Find question and interview
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { interview: true },
  });

  if (!question || question.interviewId !== interviewId) {
    throw ApiError.notFound('Question not found in this interview session');
  }

  if (question.interview.userId !== req.user.id) {
    throw ApiError.forbidden('Not authorized to answer this question');
  }

  // Evaluate answer using AI Service
  const evaluation = await aiService.evaluateAnswer({
    questionText: question.questionText,
    answerText: answerText.trim(),
    topic: question.interview.topic,
    difficulty: question.interview.difficulty,
  });

  // Save evaluation result
  const updatedQuestion = await prisma.question.update({
    where: { id: questionId },
    data: {
      answerText: answerText.trim(),
      score: evaluation.score,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      missingConcepts: evaluation.missingConcepts,
      idealAnswer: evaluation.idealAnswer,
      suggestions: evaluation.suggestions,
      answeredAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    message: 'Answer submitted and evaluated successfully',
    data: updatedQuestion,
  });
});
