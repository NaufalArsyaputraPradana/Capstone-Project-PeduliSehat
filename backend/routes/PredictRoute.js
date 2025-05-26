import express from 'express';
import { predictDisease } from '../controllers/PredictController.js';

const router = express.Router();

// ML prediction endpoint
router.post('/predict', predictDisease);

export default router; 