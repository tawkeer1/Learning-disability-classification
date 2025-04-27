"use client";

import { useEffect, useState } from "react";
import { MATERIALS } from "@/app/lib/constants";
import StudyMaterialCard from "../cardcompo/Card";

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
      <StudyMaterialCard/>
    </div>
  );
}
