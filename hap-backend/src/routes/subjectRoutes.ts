import { Router } from 'express';
import { getSubjectsByDeptYear, getAllSubjects, createSubject } from '../controllers/subjectController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get subjects by department and year
router.get('/:department/:year', authenticateToken, getSubjectsByDeptYear);

// Get all subjects
router.get('/', authenticateToken, getAllSubjects);

// Create a new subject (admin only)
router.post('/', authenticateToken, createSubject);

export default router;
