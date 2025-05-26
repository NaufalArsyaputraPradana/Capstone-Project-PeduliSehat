import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller for serving ML evaluation results
export const getEvaluationResults = async (req, res) => {
  try {
    const filePath = path.resolve(__dirname, '../../machine-learning/result/evaluation_results.json');
    const data = await fs.promises.readFile(filePath, 'utf-8');
    const json = JSON.parse(data);
    res.json(json);
  } catch (err) {
    console.error('Error reading evaluation results:', err);
    res.status(500).json({ error: 'Failed to load evaluation results' });
  }
}; 