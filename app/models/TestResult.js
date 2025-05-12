import mongoose from 'mongoose';

const TestResultSchema = new mongoose.Schema({
  studentInfo: {
    name: String,
    enroll: String,
    studyClass: String,
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
  prediction: [String],
  probabilities: {
    type: Map,
    of: Number, // Each value is a percentage (e.g., 72.5)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite issue in development / hot reload
export default mongoose.models.TestResult || mongoose.model('TestResult', TestResultSchema);
