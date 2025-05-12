'use client';

import { useEffect, useState } from 'react';
import MaterialsPage from '../materials/page';

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState([]);
  const [probabilities, setProbabilities] = useState({});
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
        "Age": Number(localStorage.getItem('Age')) || 0,
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
          setPrediction(Array.isArray(data.prediction) ? data.prediction : []);
          setProbabilities(data.probabilities || {});
        } else {
          setError(data.error || 'Unexpected response format');
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
    window.location.href = '/tests/maths';
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

      {!loading && !error && (
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
            {prediction.length === 0 ? (
              <p className="text-lg font-bold">No learning disability detected</p>
            ) : (
              <ul className="list-disc pl-6">
                {prediction.map((label, idx) => (
                  <li key={idx} className="text-lg font-bold">{label}</li>
                ))}
              </ul>
            )}

            {Object.keys(probabilities).length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Confidence Scores:</h3>
                <ul className="list-disc pl-6">
                  {Object.entries(probabilities).map(([label, percent]) => (
                    <li key={label}>{label}: {percent}%</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={resetTest}
          >
            Retake Test
          </button>

          <div>
            <MaterialsPage />
          </div>
        </>
      )}
    </div>
  );
}
