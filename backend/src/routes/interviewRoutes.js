import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createInterview,
  getInterviews,
  getInterviewById,
  startInterview,
  completeInterview,
  deleteInterview,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

// ─── All routes are protected ────────────────────────────────────────
router.use(protect);

// ─── Validation Chains ───────────────────────────────────────────────

const createValidation = [
  body('type')
    .notEmpty()
    .withMessage('Interview type is required')
    .isIn(['TECHNICAL', 'HR', 'RESUME', 'COMPANY'])
    .withMessage('Type must be one of: TECHNICAL, HR, RESUME, COMPANY'),
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('Topic is required')
    .isLength({ max: 200 })
    .withMessage('Topic cannot exceed 200 characters'),
  body('difficulty')
    .optional()
    .isIn(['EASY', 'MEDIUM', 'HARD'])
    .withMessage('Difficulty must be one of: EASY, MEDIUM, HARD'),
];

const idValidation = [
  param('id').isUUID().withMessage('Invalid interview ID format'),
];

// ─── Routes ──────────────────────────────────────────────────────────

// Create a new interview
router.post('/', createValidation, validate, createInterview);

// List user's interviews (with optional query filters)
router.get('/', getInterviews);

// Get a single interview by ID (includes questions)
router.get('/:id', idValidation, validate, getInterviewById);

// Start an interview
router.patch('/:id/start', idValidation, validate, startInterview);

// Complete an interview
router.patch('/:id/complete', idValidation, validate, completeInterview);

// Delete / cancel an interview
router.delete('/:id', idValidation, validate, deleteInterview);

export default router;
