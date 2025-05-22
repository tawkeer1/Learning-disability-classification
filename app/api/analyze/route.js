import { classifyDisability } from "@/app/backend/classifier";
import { connectDB } from "@/app/lib/db";
import TestResult from "@/app/models/TestResult";

export async function POST(req) {
  try {
    const { studentInfo, features } = await req.json();

    await connectDB();
    console.log(features);

    // Get predictions from Python script
    const { finalPrediction, ...predictions } = await classifyDisability(features);
    console.log(predictions);

    // Save everything in MongoDB
    const testRecord = new TestResult({
      studentInfo,
      features,
      predictions, // Save full predictions
      finalPrediction
    });

    await testRecord.save();

      return Response.json({
      predictions,
      finalPrediction,
      results: testRecord,
    });
  } catch (err) {
    console.error("❌ Error in POST /api/analyze:", err);
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const results = await TestResult.find().sort({ createdAt: -1 });
    return Response.json({ results });
  } catch (err) {
    console.error("❌ Error in GET /api/analyze:", err);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await TestResult.deleteMany({});
    return Response.json({ message: "All test records deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in DELETE /api/analyze:", error);
    return Response.json({ error: "Failed to delete documents" }, { status: 500 });
  }
}
