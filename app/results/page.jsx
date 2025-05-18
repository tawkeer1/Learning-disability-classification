"use client";

import { useEffect, useState } from "react";
import MaterialsPage from "../materials/page";

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState({});
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
        "Memory Retention":
          Number(localStorage.getItem("Memory Retention")) || 0,
        "Visual Processing":
          Number(localStorage.getItem("Visual Processing")) || 0,
        "Verbal Reasoning":
          Number(localStorage.getItem("Verbal Reasoning")) || 0,
        "Spelling Accuracy":
          Number(localStorage.getItem("Spelling Accuracy")) || 0,
        "Age": Number(localStorage.getItem("Age")) || 0,
        "Sleep Quality": localStorage.getItem("Sleep Quality") || "Poor",
        "Gender": localStorage.getItem('Gender') || 'Male', // Capitalized 'Male'
"Family History": localStorage.getItem('Family History') || 'No', // Capitalized 'No'

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
        setResultData(data);
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
    window.location.href = "/tests/maths"; // or home or registration
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🧾 Test Summary</h1>

      {loading && (
        <p className="text-gray-500">Analyzing your test results...</p>
      )}

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
            <p>
              <strong>Name:</strong> {studentInfo.name}
            </p>
            <p>
              <strong>Enrollment No:</strong> {studentInfo.enroll}
            </p>
            <p>
              <strong>Class:</strong> {studentInfo.studyClass}
            </p>
          </div>

          {/* Features */}
          <div className="bg-gray-500 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">📊 Test Scores & Info</h2>
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(features).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>

          {/* Predictions from models */}
          {Object.entries(resultData).map(([model, result]) => (
            <div key={model} className="bg-gray-500 p-4 rounded shadow">
              <h2 className="text-xl font-semibold">🧠 {model} Model</h2>
              <p>
                <strong>Prediction:</strong>{" "}
                {result.prediction.length > 0
                  ? result.prediction.join(", ")
                  : "None"}
              </p>
              <h3 className="mt-2 font-semibold">Confidence Scores:</h3>
              <ul className="list-disc pl-5">
                {Object.entries(result.probabilities || {}).map(
                  ([label, prob]) => (
                    <li key={label}>
                      {label}: {prob.toFixed(2)}%
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}

          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
            onClick={resetTest}
          >
            🔄 Retake Test
          </button>

          {/* Personalized Materials */}
          <div>
            <MaterialsPage />
          </div>
        </>
      )}
    </div>
  );
}
