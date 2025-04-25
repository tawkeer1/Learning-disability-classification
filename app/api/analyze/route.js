import { NextResponse } from 'next/server';
import { classifyDisability } from '@/app/backend/classifier';
import { connectDB } from '@/app/lib/db';
import TestResult from '@/app/models/TestResult';

export async function POST(req) {
  try {
    const { studentInfo, features } = await req.json();

    await connectDB();
    const prediction = await classifyDisability(features);

    const testRecord = new TestResult({
      studentInfo,
      features,
      prediction,
    });

    await testRecord.save();

    return NextResponse.json({ prediction });
  } catch (err) {
    console.error('Error analyzing test:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const results = await TestResult.find().sort({ createdAt: -1 });
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
