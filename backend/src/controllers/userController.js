import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── Helper: Select all fields except password ───────────────────────
const userSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  role: true,
  bio: true,
  skills: true,
  experience: true,
  interviewCount: true,
  createdAt: true,
  updatedAt: true,
};

// ──────────────────────────────────────────────────────────────────────
// GET /api/users
// @desc    List all users (with pagination & search)
// @access  Protected (ADMIN)
// ──────────────────────────────────────────────────────────────────────
export const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    experience,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  // Build filter
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role) where.role = role;
  if (experience) where.experience = experience;

  // Allowed sort fields
  const allowedSort = ['createdAt', 'updatedAt', 'name', 'email', 'interviewCount'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = order === 'asc' ? 'asc' : 'desc';

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { [sortField]: sortOrder },
      skip,
      take: limitNum,
    }),
    prisma.user.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// ──────────────────────────────────────────────────────────────────────
// GET /api/users/:id
// @desc    Get a single user by ID
// @access  Protected (ADMIN)
// ──────────────────────────────────────────────────────────────────────
export const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      ...userSelect,
      interviews: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          type: true,
          topic: true,
          status: true,
          overallScore: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ──────────────────────────────────────────────────────────────────────
// PUT /api/users/:id
// @desc    Update a user (admin can update role, any field)
// @access  Protected (ADMIN)
// ──────────────────────────────────────────────────────────────────────
export const updateUser = asyncHandler(async (req, res) => {
  // Verify user exists
  const existing = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    throw ApiError.notFound('User not found');
  }

  const allowedFields = ['name', 'bio', 'skills', 'experience', 'avatar', 'role'];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  // Handle password reset by admin
  if (req.body.password) {
    const salt = await bcrypt.genSalt(12);
    updates.password = await bcrypt.hash(req.body.password, salt);
  }

  if (Object.keys(updates).length === 0) {
    throw ApiError.badRequest('No valid fields provided for update');
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: updates,
    select: userSelect,
  });

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

// ──────────────────────────────────────────────────────────────────────
// DELETE /api/users/:id
// @desc    Delete a user and all their data
// @access  Protected (ADMIN)
// ──────────────────────────────────────────────────────────────────────
export const deleteUser = asyncHandler(async (req, res) => {
  // Prevent self-deletion
  if (req.params.id === req.user.id) {
    throw ApiError.badRequest('You cannot delete your own account from here');
  }

  const existing = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    throw ApiError.notFound('User not found');
  }

  // Cascade delete — Prisma schema has onDelete: Cascade on interviews
  await prisma.user.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: 'User and all related data deleted successfully',
  });
});
