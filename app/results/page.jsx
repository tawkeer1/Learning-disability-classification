"use client";

import { useEffect, useState } from "react";
import FeatureImportanceChart from "../FeautureImp/FeatureImportanceChart";
import MaterialsPage from "../materials/MaterialPage";
export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [finalPrediction, setFinalPrediction] = useState([]);
  const [modelPredictions, setModelPredictions] = useState({});
  const [error, setError] = useState(null);
  const [studentInfo, setStudentInfo] = useState({});
  const [features, setFeatures] = useState({});

  useEffect(() => {
    const getPrediction = async () => {
      const info = {
        name: localStorage.getItem("StudentName") || "Unknown",
        enroll: localStorage.getItem("Enroll") || "Unknown",
        studyClass: localStorage.getItem("studyClass") || "Unknown",
      };

      const featureData = {
        "Reading Score": Number(localStorage.getItem("Reading Score")) || 0,
        "Math Score": Number(localStorage.getItem("Math Score")) || 0,
        "Attention Span": Number(localStorage.getItem("Attention Span")) || 0,
        "Memory Retention": Number(localStorage.getItem("Memory Retention")) || 0,
        "Visual Processing": Number(localStorage.getItem("Visual Processing")) || 0,
        "Verbal Reasoning": Number(localStorage.getItem("Verbal Reasoning")) || 0,
        "Spelling Accuracy": Number(localStorage.getItem("Spelling Accuracy")) || 0,
        Age: Number(localStorage.getItem("Age")) || 0,
        "Sleep Quality": localStorage.getItem("Sleep Quality") || "Poor",
        Gender: localStorage.getItem("Gender") || "Male",
        "Family History": localStorage.getItem("Family History") || "No",
      };

      setStudentInfo(info);
      setFeatures(featureData);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentInfo: info, features: featureData }),
        });

        const data = await response.json();

        // Fix: Ensure finalPrediction is always an array
        setFinalPrediction(Array.isArray(data.finalPrediction) ? data.finalPrediction : []);
        setModelPredictions(data.predictions || {});
      } catch (err) {
        setError("Failed to get prediction");
      } finally {
        setLoading(false);
      }
    };

    getPrediction();
  }, []);

  const resetTest = () => {
    localStorage.clear();
    window.location.href = "/tests/maths";
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🧾 Test Summary</h1>

      {loading && <p className="text-gray-500">Analyzing your test results...</p>}

      {!loading && error && (
        <div className="bg-gray-500 text-red-800 p-4 rounded">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Student Info */}
          <div className="bg-gray-500 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">👤 Student Info</h2>
            <p><strong>Name:</strong> {studentInfo.name}</p>
            <p><strong>Enrollment No:</strong> {studentInfo.enroll}</p>
            <p><strong>Class:</strong> {studentInfo.studyClass}</p>
          </div>

          {/* Features */}
          <div className="bg-gray-500 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">📊 Test Scores & Info</h2>
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(features).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {String(value)}
                </li>
              ))}
            </ul>
          </div>

          {/* Final Prediction */}
          <div className="bg-green-500 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">✅ Final Prediction</h2>
            <p>
              <strong>Result:</strong>{" "}
              {finalPrediction.length > 0 ? finalPrediction.join(", ") : "None"}
            </p>
          </div>

          {/* Individual Model Predictions */}
          {Object.entries(modelPredictions).map(([model, result]) => (
            <div key={model} className="bg-gray-500 p-4 rounded shadow">
              <h2 className="text-xl font-semibold">🧠 {model} Model</h2>
              <p>
                <strong>Prediction:</strong>{" "}
                {Array.isArray(result?.prediction) && result.prediction.length > 0
                  ? result.prediction.join(", ")
                  : "None"}
              </p>
              {result?.probabilities && typeof result.probabilities === "object" && (
                <>
                  <h3 className="mt-2 font-semibold">Confidence Scores:</h3>
                  <ul className="list-disc pl-5">
                    {Object.entries(result.probabilities).map(([label, prob]) => (
                      <li key={label}>
                        {label}: {Number(prob).toFixed(2)}%
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}

          {/* Retake Button */}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
            onClick={resetTest}
          >
            🔄 Retake Test
          </button>

          {/* Feature Importance */}
          <div className="mb-2">
          <FeatureImportanceChart />
          </div>

          {/* Personalized Materials */}
          <div className="mt-12">
          <MaterialsPage finalPrediction={finalPrediction} features={features} />
          </div>
        </>
      )}
    </div>
  );
}
