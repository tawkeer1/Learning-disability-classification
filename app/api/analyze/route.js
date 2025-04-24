import { classifyDisability } from '@/app/backend/classifier';
import { connectDB } from '@/app/lib/db';
import TestResult from '@/app/models/TestResult';

export async function POST(req) {
  try {
    const { studentInfo, features } = await req.json();

    await connectDB();
    console.log("Before prediction");
    const prediction = await classifyDisability(features);
    console.log("After prediction", prediction);
    const testRecord = new TestResult({
      studentInfo,
      features,
      prediction,
    });

    await testRecord.save();

    return Response.json({ prediction });
  } catch (err) {
    console.error('Error analyzing test:', err);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
