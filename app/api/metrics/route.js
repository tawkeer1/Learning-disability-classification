import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

export async function GET(req) {
  try {
    const filePath = path.join(process.cwd(), "app", "mlmodel", "saved_models", "model_metrics_comparison.csv");

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: "CSV file not found" }), { status: 404 });
    }

    const results = []; 

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (data) => {
          results.push({
            Model: data.Model,
            Precision: parseFloat(data.Precision),
            Recall: parseFloat(data.Recall),
            "F1 Score": parseFloat(data["F1 Score"]),
            Accuracy: parseFloat(data.Accuracy),
          });
        })
        .on("end", () => {
          resolve(new Response(JSON.stringify(results), { status: 200 }));
        })
        .on("error", (err) => {
          reject(
            new Response(JSON.stringify({ error: "Failed to read metrics file" }), {
              status: 500,
            })
          );
        });
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
