"use client";

import { useEffect, useState } from "react";
import { MATERIALS } from "@/app/lib/constants";

export default function MaterialsPage() {
  const [studentName, setStudentName] = useState("");
  const [predictedClass, setPredictedClass] = useState("");
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const name = localStorage.getItem("StudentName") || "Student";
    const prediction = localStorage.getItem("Prediction") || "None";

    setStudentName(name);
    setPredictedClass(prediction);
    setResources(MATERIALS[prediction] || MATERIALS["None"]);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Hello, {studentName}!</h1>
      <h2 className="text-xl text-gray-700 mb-6">
        Based on your test results, we recommend you to check the following
        materials:
      </h2>

      <ul className="space-y-4">
        {resources.map((item, index) => (
          <li key={index} className="bg-white shadow p-4 rounded-lg border">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <a
              href={item.link}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              View Material
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
