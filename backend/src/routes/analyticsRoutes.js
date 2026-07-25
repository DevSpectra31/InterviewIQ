import { Router } from 'express';
import { getUserAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Protect analytics route
router.use(protect);

router.get('/', getUserAnalytics);

export default router;
