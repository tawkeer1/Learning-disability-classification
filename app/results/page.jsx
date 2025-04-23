'use client';

import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPrediction = async () => {
      try {
        const features = {
            "Reading Score": Number(localStorage.getItem('Reading Score')) || 0,
            "Math Score": Number(localStorage.getItem('Math Score')) || 0,
            "Attention Span": Number(localStorage.getItem('Attention Span')) || 0,
            "Memory Retention": Number(localStorage.getItem('Memory Retention')) || 0,
            "Visual Processing": Number(localStorage.getItem('Visual Processing')) || 0,
            "Verbal Reasoning": Number(localStorage.getItem('Verbal Reasoning')) || 0,
            "Age": 12, // Static age for now, you can enhance it later
          };
          

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(features),
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

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Your Results</h1>

      {loading && <p className="text-gray-500">Analyzing your test results...</p>}

      {!loading && error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && prediction && (
        <div className="bg-green-100 p-6 rounded shadow text-green-800">
          <p className="text-lg">Based on your responses, your predicted class is:</p>
          {prediction == 0 ? <h2 className="text-2xl font-bold mt-2">No disease detected</h2>:
          <h2 className="text-2xl font-bold mt-2">{prediction}</h2>}
          
        </div>
      )}
    </div>
  );
}
