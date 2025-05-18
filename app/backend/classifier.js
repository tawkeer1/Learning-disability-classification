import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Main function to call Python script
export const classifyDisability = (features) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../mlmodel/app.py'); // Adjust path if needed

    const py = spawn('python', [scriptPath, JSON.stringify(features)]); // or 'python3' if required

    let output = '';
    let errorOutput = '';

    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    py.on('close', (code) => {
      if (code !== 0) {
        console.error("Python exited with code:", code);
        console.error("Python error:", errorOutput);
        reject(new Error("Python script failed"));
      } else {
        try {
          const result = JSON.parse(output);
          if (result.error) return reject(result.error);
          resolve(result); // result contains all models
        } catch (err) {
          reject("Invalid response from Python script");
        }
      }
    });
  });
};
