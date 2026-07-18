import { Router } from 'express';
import { param } from 'express-validator';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

// ─── All routes are protected + admin-only ───────────────────────────
router.use(protect);
router.use(authorize('ADMIN'));

// ─── Validation ──────────────────────────────────────────────────────
const idValidation = [
  param('id').isUUID().withMessage('Invalid user ID format'),
];

// ─── Routes ──────────────────────────────────────────────────────────

// List users (with search, role/experience filter, pagination)
router.get('/', getUsers);

// Get single user by ID (includes recent interviews)
router.get('/:id', idValidation, validate, getUserById);

// Update a user (admin can change role, reset password, etc.)
router.put('/:id', idValidation, validate, updateUser);

// Delete a user and all their data
router.delete('/:id', idValidation, validate, deleteUser);

export default router;
