import mongoose from 'mongoose';

const TestResultSchema = new mongoose.Schema({
  studentInfo: {
    name: { type: String, required: true },
    enroll: { type: String, required: true },
    studyClass: { type: String, required: true },
  },
  features: {
    'Reading Score': { type: Number, required: true },
    'Math Score': { type: Number, required: true },
    'Attention Span': { type: Number, required: true },
    'Memory Retention': { type: Number, required: true },
    'Visual Processing': { type: Number, required: true },
    'Verbal Reasoning': { type: Number, required: true },
    'Spelling Accuracy': { type: Number, required: true },
    'Age': { type: Number, required: true },
    'Gender': { type: String, enum: ['Male', 'Female'], required: true },
    'Sleep Quality': { type: String, enum: ["Poor", "Average", "Good"], required: true }, // 0 = Poor, 1 = Average, 2 = Good
    'Family History': { type: String, enum: ['Yes', 'No'], required: true },
  },
  predictions: {
    type: mongoose.Schema.Types.Mixed, // Contains model-wise predictions and probabilities
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite during hot reloads in development
export default mongoose.models.TestResult || mongoose.model('TestResult', TestResultSchema);
