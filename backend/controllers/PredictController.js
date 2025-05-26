import { PythonShell } from 'python-shell';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller for ML prediction
export const predictDisease = (req, res) => {
  const inputData = req.body;
  const scriptPath = path.join(__dirname, '../ml/predict.py');
  PythonShell.run(scriptPath, { args: [JSON.stringify(inputData)] }, (err, results) => {
    if (err) {
      console.error('Prediction error:', err);
      return res.status(500).json({ error: 'Prediction failed' });
    }
    try {
      const output = JSON.parse(results[0]);
      return res.json(output);
    } catch (parseErr) {
      console.error('Parsing prediction result failed:', parseErr);
      return res.status(500).json({ error: 'Invalid prediction result' });
    }
  });
}; 