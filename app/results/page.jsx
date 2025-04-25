'use client';

import { useEffect, useState } from 'react';
import MaterialsPage from '../materials/page';

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const [studentInfo, setStudentInfo] = useState({});
  const [features, setFeatures] = useState({});

  useEffect(() => {
    const getPrediction = async () => {
      const info = {
        name: localStorage.getItem('StudentName') || 'Unknown',
        enroll: localStorage.getItem('Enroll') || 'Unknown',
        studyClass: localStorage.getItem('studyClass') || 'Unknown',
      };

      const featureData = {
        "Reading Score": Number(localStorage.getItem('Reading Score')) || 0,
        "Math Score": Number(localStorage.getItem('Math Score')) || 0,
        "Attention Span": Number(localStorage.getItem('Attention Span')) || 0,
        "Memory Retention": Number(localStorage.getItem('Memory Retention')) || 0,
        "Visual Processing": Number(localStorage.getItem('Visual Processing')) || 0,
        "Verbal Reasoning": Number(localStorage.getItem('Verbal Reasoning')) || 0,
        "Age": localStorage.getItem('Age') || 0,
      };

      setStudentInfo(info);
      setFeatures(featureData);

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentInfo: info, features: featureData }),
        });

        const data = await response.json();

        if (data.prediction) {
          setPrediction(data.prediction);
        } else {
          setError(data.error || 'Something went wrong');
        }
      } catch (err) {
        setError('Failed to get prediction');
      } finally {
        setLoading(false);
      }
    };

    getPrediction();
  }, []);

  const resetTest = () => {
    localStorage.clear();
    window.location.href = '/tests/maths'; // redirect to home or start page
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Test Summary</h1>

      {loading && <p className="text-gray-500">Analyzing your test results...</p>}

      {!loading && error && (
        <div className="bg-gray-800 text-red-700 p-4 rounded">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && prediction && (
        <>
          <div className="bg-gray-500 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">👤 Student Info</h2>
            <p><strong>Name:</strong> {studentInfo.name}</p>
            <p><strong>Enroll:</strong> {studentInfo.enroll}</p>
            <p><strong>Class:</strong> {studentInfo.studyClass}</p>
          </div>

          <div className="bg-gray-500 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">📊 Test Scores</h2>
            {Object.entries(features).map(([key, val]) => (
              <p key={key}><strong>{key}:</strong> {val}</p>
            ))}
          </div>

          <div className="bg-gray-500 p-4 rounded shadow text-gray-200">
            <h2 className="text-xl font-semibold">🎯 Prediction</h2>
            <p className="text-lg font-bold">
              {prediction === 0 ? "No learning disability detected" : prediction}
            </p>
          </div>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={resetTest}
          >
            Retake Test
          </button>
          <div>
            Based on your test results, we recommend you to check the following materials: 
            <MaterialsPage/>
          </div>
        </>
      )}
    </div>
  );
}
