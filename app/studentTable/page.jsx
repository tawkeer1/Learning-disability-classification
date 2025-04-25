"use client";

import { useEffect, useState } from "react";

export default function StudentsPage() {
  const [records, setRecords] = useState([]);

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
      <h1 className="text-3xl font-bold mb-6">All Student Test Records</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600">
          <thead className="bg-gray-500 text-sm">
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
              <th className="border px-3 py-2">Prediction</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, i) => (
              <tr key={i} className="text-center text-sm">
                <td className="border px-3 py-2">{rec.studentInfo.name}</td>
                <td className="border px-3 py-2">{rec.studentInfo.enroll}</td>
                <td className="border px-3 py-2">
                  {rec.studentInfo.studyClass}
                </td>
                <td className="border px-3 py-2">{rec.features["Age"]}</td>
                <td className="border px-3 py-2">
                  {rec.features["Reading Score"]}
                </td>
                <td className="border px-3 py-2">
                  {rec.features["Math Score"]}
                </td>
                <td className="border px-3 py-2">
                  {rec.features["Attention Span"]}
                </td>
                <td className="border px-3 py-2">
                  {rec.features["Memory Retention"]}
                </td>
                <td className="border px-3 py-2">
                  {rec.features["Visual Processing"]}
                </td>
                <td className="border px-3 py-2">
                  {rec.features["Verbal Reasoning"]}
                </td>
                <td className="border px-3 py-2 font-medium">
                  {rec.prediction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
