"use client";

import { useEffect, useState } from "react";

export default function StudentsPage() {
  const [records, setRecords] = useState([]);

  const deleteAllEntries = async () => {
    try {
      console.log("Deleting all entries...");
      const res = await fetch("/api/analyze", { method: "DELETE" });
      const data = await res.json();
      if (data.message) {
        console.log(data.message);
        setRecords([]); // clear UI
      } else {
        console.error("Failed to delete entries");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchRecords = async () => {
      const res = await fetch("/api/analyze");
      const data = await res.json();
      if (data.results) setRecords(data.results);
    };
    fetchRecords();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button
        className="border p-2 bg-red-500 text-white rounded mb-4"
        onClick={deleteAllEntries}
      >
        Delete all entries
      </button>

      <h1 className="text-3xl font-bold mb-6">All Student Test Records</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600 text-sm">
          <thead className="bg-gray-500">
            <tr>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Enroll</th>
              <th className="border px-3 py-2">Class</th>
              <th className="border px-3 py-2">Age</th>
              <th className="border px-3 py-2">Reading</th>
              <th className="border px-3 py-2">Math</th>
              <th className="border px-3 py-2">Attention</th>
              <th className="border px-3 py-2">Memory</th>
              <th className="border px-3 py-2">Visual</th>
              <th className="border px-3 py-2">Verbal</th>
              <th className="border px-3 py-2">Model</th>
              <th className="border px-3 py-2">Prediction</th>
              <th className="border px-3 py-2">ADHD (%)</th>
              <th className="border px-3 py-2">Dyslexia (%)</th>
            </tr>
          </thead>
          <tbody>
  {records.map((rec, index) =>
    rec.predictions
      ? Object.entries(rec.predictions).map(([modelName, modelResult], i) => (
          <tr key={`${index}-${modelName}`} className="text-center">
            {i === 0 && (
              <>
                <td className="border px-3 py-2" rowSpan={Object.keys(rec.predictions).length}>
                  {rec.studentInfo.name}
                </td>
                <td className="border px-3 py-2" rowSpan={Object.keys(rec.predictions).length}>
                  {rec.studentInfo.enroll}
                </td>
                <td className="border px-3 py-2" rowSpan={Object.keys(rec.predictions).length}>
                  {rec.studentInfo.studyClass}
                </td>
                <td className="border px-3 py-2" rowSpan={Object.keys(rec.predictions).length}>
                  {rec.features["Age"]}
                </td>
                <td className="border px-3 py-2" rowSpan={Object.keys(rec.predictions).length}>
                  {rec.features["Reading Score"]}
                </td>
                <td className="border px-3 py-2" rowSpan={Object.keys(rec.predictions).length}>
                  {rec.features["Math Score"]}
                </td>
                <td className="border px-3 py-2" rowSpan={Object.keys(rec.predictions).length}>
                  {rec.features["Attention Span"]}
                </td>
                <td className="border px-3 py-2" rowSpan={Object.keys(rec.predictions).length}>
                  {rec.features["Memory Retention"]}
                </td>
                <td className="border px-3 py-2" rowSpan={Object.keys(rec.predictions).length}>
                  {rec.features["Visual Processing"]}
                </td>
                <td className="border px-3 py-2" rowSpan={Object.keys(rec.predictions).length}>
                  {rec.features["Verbal Reasoning"]}
                </td>
              </>
            )}
            <td className="border px-3 py-2 font-medium">{modelName}</td>
            <td className="border px-3 py-2">
              {modelResult.prediction.length > 0
                ? modelResult.prediction.join(", ")
                : "None"}
            </td>
            <td className="border px-3 py-2">
              {modelResult.probabilities?.ADHD ?? "-"}
            </td>
            <td className="border px-3 py-2">
              {modelResult.probabilities?.Dyslexia ?? "-"}
            </td>
          </tr>
        ))
      : null
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}
