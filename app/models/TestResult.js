import mongoose from 'mongoose';

const TestResultSchema = new mongoose.Schema({
  studentInfo: {
    name: { type: String, required: true },
    enroll: { type: String, required: true },
    studyClass: { type: String, required: true },
  },
  features: {
    'Reading Score': Number,
    'Math Score': Number,
    'Attention Span': Number,
    'Memory Retention': Number,
    'Visual Processing': Number,
    'Verbal Reasoning': Number,
    'Age': Number,
  },
  prediction: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.TestResult || mongoose.model('TestResult', TestResultSchema);
