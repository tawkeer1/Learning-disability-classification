// backend/classifier.js
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// For __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const classifyDisability = (features) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../mlmodel/app.py');
    const py = spawn('python3', [scriptPath, JSON.stringify(features)]);
    
    let output = '';
    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on('data', (data) => {
      console.error('Python Error:', data.toString());
    });

    py.on('close', () => {
      try {
        const result = JSON.parse(output);
        if (result.error) return reject(result.error);
        resolve(result.prediction);
      } catch (err) {
        reject("Invalid response from Python script");
      }
    });
  });
};
