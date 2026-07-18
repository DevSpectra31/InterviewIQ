import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// ──────────────────────────────────────────────────────────────────────
// POST /api/interviews
// @desc    Create a new interview session
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const createInterview = asyncHandler(async (req, res) => {
  const { type, topic, difficulty } = req.body;

  const interview = await prisma.interview.create({
    data: {
      userId: req.user.id,
      type,
      topic,
      difficulty: difficulty || 'MEDIUM',
    },
  });

  // Increment user's interview count
  await prisma.user.update({
    where: { id: req.user.id },
    data: { interviewCount: { increment: 1 } },
  });

  res.status(201).json({
    success: true,
    message: 'Interview created successfully',
    data: interview,
  });
});

// ──────────────────────────────────────────────────────────────────────
// GET /api/interviews
// @desc    Get all interviews for the current user (with pagination)
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const getInterviews = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    type,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  // Build filter
  const where = { userId: req.user.id };
  if (status) where.status = status;
  if (type) where.type = type;

  // Allowed sort fields
  const allowedSort = ['createdAt', 'updatedAt', 'overallScore', 'topic'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = order === 'asc' ? 'asc' : 'desc';

  const [interviews, total] = await Promise.all([
    prisma.interview.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      skip,
      take: limitNum,
      include: {
        _count: { select: { questions: true } },
      },
    }),
    prisma.interview.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: interviews,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// ──────────────────────────────────────────────────────────────────────
// GET /api/interviews/:id
// @desc    Get a single interview with all its questions
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await prisma.interview.findUnique({
    where: { id: req.params.id },
    include: {
      questions: {
        orderBy: { askedAt: 'asc' },
      },
    },
  });

  if (!interview) {
    throw ApiError.notFound('Interview not found');
  }

  // Ensure user owns this interview
  if (interview.userId !== req.user.id) {
    throw ApiError.forbidden('Not authorized to access this interview');
  }

  res.status(200).json({
    success: true,
    data: interview,
  });
});

// ──────────────────────────────────────────────────────────────────────
// PATCH /api/interviews/:id/start
// @desc    Start an interview (transition PENDING → IN_PROGRESS)
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const startInterview = asyncHandler(async (req, res) => {
  const interview = await prisma.interview.findUnique({
    where: { id: req.params.id },
  });

  if (!interview) {
    throw ApiError.notFound('Interview not found');
  }

  if (interview.userId !== req.user.id) {
    throw ApiError.forbidden('Not authorized to access this interview');
  }

  if (interview.status !== 'PENDING') {
    throw ApiError.badRequest(
      `Cannot start an interview with status '${interview.status}'`
    );
  }

  const updated = await prisma.interview.update({
    where: { id: req.params.id },
    data: {
      status: 'IN_PROGRESS',
      startedAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    message: 'Interview started',
    data: updated,
  });
});

// ──────────────────────────────────────────────────────────────────────
// PATCH /api/interviews/:id/complete
// @desc    Complete an interview (transition IN_PROGRESS → COMPLETED)
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const completeInterview = asyncHandler(async (req, res) => {
  const interview = await prisma.interview.findUnique({
    where: { id: req.params.id },
    include: { questions: true },
  });

  if (!interview) {
    throw ApiError.notFound('Interview not found');
  }

  if (interview.userId !== req.user.id) {
    throw ApiError.forbidden('Not authorized to access this interview');
  }

  if (interview.status !== 'IN_PROGRESS') {
    throw ApiError.badRequest(
      `Cannot complete an interview with status '${interview.status}'`
    );
  }

  // Calculate overall score from answered questions
  const scoredQuestions = interview.questions.filter((q) => q.score !== null);
  const overallScore =
    scoredQuestions.length > 0
      ? Math.round(
          scoredQuestions.reduce((sum, q) => sum + q.score, 0) /
            scoredQuestions.length
        )
      : null;

  // Calculate duration in minutes
  const duration = interview.startedAt
    ? Math.round((Date.now() - new Date(interview.startedAt).getTime()) / 60000)
    : null;

  const updated = await prisma.interview.update({
    where: { id: req.params.id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      overallScore,
      duration,
    },
    include: {
      questions: { orderBy: { askedAt: 'asc' } },
    },
  });

  res.status(200).json({
    success: true,
    message: 'Interview completed',
    data: updated,
  });
});

// ──────────────────────────────────────────────────────────────────────
// DELETE /api/interviews/:id
// @desc    Delete an interview (only PENDING/CANCELLED can be hard-deleted;
//          others are cancelled)
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await prisma.interview.findUnique({
    where: { id: req.params.id },
  });

  if (!interview) {
    throw ApiError.notFound('Interview not found');
  }

  if (interview.userId !== req.user.id) {
    throw ApiError.forbidden('Not authorized to delete this interview');
  }

  // Hard-delete only if interview was never started
  if (interview.status === 'PENDING' || interview.status === 'CANCELLED') {
    await prisma.interview.delete({ where: { id: req.params.id } });

    // Decrement user's interview count
    await prisma.user.update({
      where: { id: req.user.id },
      data: { interviewCount: { decrement: 1 } },
    });

    return res.status(200).json({
      success: true,
      message: 'Interview deleted',
    });
  }

  // Otherwise cancel it (preserve data for analytics)
  const updated = await prisma.interview.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED' },
  });

  res.status(200).json({
    success: true,
    message: 'Interview cancelled',
    data: updated,
  });
});
