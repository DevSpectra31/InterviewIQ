import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

// ─── Cookie options ──────────────────────────────────────────────────
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: '/',
});

// ─── Helper: Build user response with token ──────────────────────────
const buildUserResponse = (user, token) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  bio: user.bio,
  skills: user.skills,
  experience: user.experience,
  interviewCount: user.interviewCount,
  createdAt: user.createdAt,
  token,
});

// ─── Helper: Select all fields except password ───────────────────────
const userSelectWithoutPassword = {
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
// POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ──────────────────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    },
    select: userSelectWithoutPassword,
  });

  // Generate JWT
  const token = generateToken(user.id);

  // Set token as httpOnly cookie
  res.cookie('token', token, getCookieOptions());

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: buildUserResponse(user, token),
  });
});

// ──────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// @desc    Authenticate user & return token
// @access  Public
// ──────────────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user — include password for comparison
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Generate JWT
  const token = generateToken(user.id);

  // Set token as httpOnly cookie
  res.cookie('token', token, getCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: buildUserResponse(user, token),
  });
});

// ──────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// @desc    Get current authenticated user's profile
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: userSelectWithoutPassword,
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
// PUT /api/auth/me
// @desc    Update current user's profile
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  // Fields allowed to be updated (not password — use changePassword for that)
  const allowedFields = ['name', 'bio', 'skills', 'experience', 'avatar'];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw ApiError.badRequest('No valid fields provided for update');
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updates,
    select: userSelectWithoutPassword,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

// ──────────────────────────────────────────────────────────────────────
// PUT /api/auth/change-password
// @desc    Change current user's password
// @access  Protected
// ──────────────────────────────────────────────────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password field
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  // Generate new token
  const token = generateToken(user.id);

  // Set new token as httpOnly cookie
  res.cookie('token', token, getCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    data: { token },
  });
});
