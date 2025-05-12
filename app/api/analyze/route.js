import { classifyDisability } from '@/app/backend/classifier';
import { connectDB } from '@/app/lib/db';
import TestResult from '@/app/models/TestResult';

export async function POST(req) {
  try {
    const { studentInfo, features } = await req.json();

    await connectDB();
    const result = await classifyDisability(features);
    const { prediction, probabilities } = result;

    const testRecord = new TestResult({
      studentInfo,
      features,
      prediction,
      probabilities,
    });

    await testRecord.save();

    return Response.json({ prediction, probabilities });
  } catch (err) {
    console.error('Error saving test result:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const results = await TestResult.find().sort({ createdAt: -1 });
    return Response.json({ results });
  } catch (err) {
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
export async function DELETE() {
  try {
    await connectDB();
    await TestResult.deleteMany({});
    return Response.json({ message: "All documents deleted" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to delete documents" }, { status: 500 });
  }
}