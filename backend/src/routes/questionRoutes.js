import { Router } from 'express';
import { param, body } from 'express-validator';
import { getNextQuestion, submitAnswer } from '../controllers/questionController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router({ mergeParams: true });

// All routes require authentication
router.use(protect);

// Generate next question
router.post(
  '/next',
  [param('interviewId').isUUID().withMessage('Invalid interview ID format')],
  validate,
  getNextQuestion
);

// Submit answer to a question
router.post(
  '/:questionId/answer',
  [
    param('interviewId').isUUID().withMessage('Invalid interview ID format'),
    param('questionId').isUUID().withMessage('Invalid question ID format'),
    body('answerText')
      .trim()
      .notEmpty()
      .withMessage('Answer text is required')
      .isLength({ max: 5000 })
      .withMessage('Answer cannot exceed 5000 characters'),
  ],
  validate,
  submitAnswer
);

export default router;
