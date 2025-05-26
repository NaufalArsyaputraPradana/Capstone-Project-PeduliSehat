import express from 'express';
import { getEvaluationResults } from '../controllers/EvaluationController.js';

const router = express.Router();

// Endpoint for ML evaluation results
router.get('/evaluation-results', getEvaluationResults);

export default router; 