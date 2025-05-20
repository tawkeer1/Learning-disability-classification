import { spawn } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getFeatureImportances() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../mlmodel/app.py"); // same as classifier.js

    const python = spawn("python", [scriptPath, JSON.stringify({ explain: true })]);

    let data = "";
    let error = "";

    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    python.on("close", (code) => {
      if (code === 0) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.feature_importances) {
            resolve(parsed.feature_importances);
          } else {
            reject(new Error("Unexpected response: " + data));
          }
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(error || "Python process failed"));
      }
    });
  });
}
