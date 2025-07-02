"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);
export default function AnalyticsPage() {
const conditionColorMap = {
  "ADHD": "#a78bfa",            // Purple
  "Dyslexia": "#60a5fa",        // Blue
  "ADHD & Dyslexia": "#f472b6", // Pink (clearly different from purple/blue)
  "None": "#fbbf24",            // Yellow
};
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/analyze");
      const { results } = await res.json();
      setResults(results);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p className="p-4 text-white">Loading analytics...</p>;

  const classCount = {};
  const genderCount = {};
  const ageCount = {};
  const featureSums = {};
  const featureCount = {};
  const diseaseByAge = {};
  const comorbidCount = { "ADHD & Dyslexia": 0 };
  const riskFeatures = {
    ADHD: {},
    Dyslexia: {},
  };

  results.forEach(({ finalPrediction, features }) => {
    const label = Array.isArray(finalPrediction)
  ? finalPrediction.join(" & ")
  : finalPrediction;

    classCount[label] = (classCount[label] || 0) + 1;
    const age = features.Age;
    ageCount[age] = (ageCount[age] || 0) + 1;
    diseaseByAge[age] = diseaseByAge[age] || {};
    diseaseByAge[age][label] = (diseaseByAge[age][label] || 0) + 1;

    const gender = features.Gender;
    genderCount[gender] = (genderCount[gender] || 0) + 1;

    for (const key in features) {
      if (typeof features[key] === "number") {
        featureSums[key] = (featureSums[key] || 0) + features[key];
        featureCount[key] = (featureCount[key] || 0) + 1;
      }
    }

    // Track comorbid cases
    if (
      Array.isArray(finalPrediction) &&
      finalPrediction.includes("ADHD") &&
      finalPrediction.includes("Dyslexia")
    ) {
      comorbidCount["ADHD & Dyslexia"] += 1;
    }

    // Track lowest risk features
    if (finalPrediction.includes("ADHD")) {
      for (const key of ["Attention Span", "Memory Retention"]) {
        if (features[key] < 50) {
          riskFeatures.ADHD[key] = (riskFeatures.ADHD[key] || 0) + 1;
        }
      }
    }
    if (finalPrediction.includes("Dyslexia")) {
      for (const key of ["Reading Score", "Spelling Accuracy"]) {
        if (features[key] < 50) {
          riskFeatures.Dyslexia[key] = (riskFeatures.Dyslexia[key] || 0) + 1;
        }
      }
    }
  });

  const featureAverages = {};
  for (const key in featureSums) {
    featureAverages[key] = (featureSums[key] / featureCount[key]).toFixed(2);
  }

  const classDistributionData = {
    labels: Object.keys(classCount),
    datasets: [
      {
        label: "Students per Diagnosis",
        data: Object.values(classCount),
        backgroundColor: Object.keys(classCount).map(
          (label) => conditionColorMap[label] || "#a78bfa"
        ),
      },
    ],
  };

  const featureAvgData = {
    labels: Object.keys(featureAverages),
    datasets: [
      {
        label: "Average Feature Score",
        data: Object.values(featureAverages),
        backgroundColor: "#6366f1",
      },
    ],
  };

  const genderDistData = {
    labels: Object.keys(genderCount),
    datasets: [
      {
        label: "Gender",
        data: Object.values(genderCount),
        backgroundColor: ["#f87171", "#60a5fa"],
      },
    ],
  };

  const sortedClasses = Object.entries(classCount).sort((a, b) => b[1] - a[1]);
  const mostCommonDisease =
    sortedClasses.length > 0 ? sortedClasses[0][0] : "None";

  const ageDiseaseInsights = Object.entries(diseaseByAge).map(
    ([age, diseases]) => {
      const most = Object.entries(diseases).sort((a, b) => b[1] - a[1])[0];
      return `Age ${age}: Mostly ${most[0]}`;
    }
  );

  const ageLabels = Object.keys(diseaseByAge).sort((a, b) => +a - +b);
  const conditionSet = new Set();
  ageLabels.forEach((age) => {
    Object.keys(diseaseByAge[age]).forEach((cond) => conditionSet.add(cond));
  });
  const conditions = Array.from(conditionSet);

  const stackedData = {
    labels: ageLabels,
    datasets: conditions.map((cond) => ({
      label: cond,
      data: ageLabels.map((age) => diseaseByAge[age][cond] || 0),
      backgroundColor:
        cond === "Adhd"
          ? "#34d399"
          : cond === "Dyslexia"
          ? "#60a5fa"
          : cond.includes("None")
          ? "#fbbf24"
          : "#f472b6",
      stack: "age",
    })),
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-600 text-white">
      <h1 className="text-3xl font-bold mb-4">
        📊 Student Analytics Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-300 text-gray-900 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Class Distribution</h2>
          <Pie data={classDistributionData} />
        </div>

        <div className="bg-gray-300 text-gray-900 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Average Feature Scores</h2>
          <Bar data={featureAvgData} />
        </div>

        <div className="bg-gray-300 text-gray-900 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Gender Distribution</h2>
          <Pie data={genderDistData} />
        </div>
        <div className="bg-gray-300 text-gray-900 p-4 rounded shadow col-span-full">
          <h2 className="text-xl font-semibold mb-2">
            Age-wise Disease Distribution
          </h2>
          <Bar
            data={stackedData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
              scales: { x: { stacked: true }, y: { stacked: true } },
            }}
          />
        </div>
      </div>

      <div className="bg-gray-600 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Insights</h2>
        <p>
          🧠 Most Common Detected Condition:{" "}
          <strong>{mostCommonDisease}</strong>
        </p>
        <p>
          🧩 Students with both ADHD & Dyslexia:{" "}
          <strong>{comorbidCount["ADHD & Dyslexia"]}</strong>
        </p>
        <ul className="list-disc pl-6 mt-2">
          {ageDiseaseInsights.map((text, idx) => (
            <li key={idx}>{text}</li>
          ))}
        </ul>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">
            Top Risk Features (Score &lt; 50):
          </h3>
          <p>
            🔹 ADHD:{" "}
            {Object.entries(riskFeatures.ADHD)
              .map(([k, v]) => `${k} (${v})`)
              .join(", ") || "None"}
          </p>
          <p>
            🔹 Dyslexia:{" "}
            {Object.entries(riskFeatures.Dyslexia)
              .map(([k, v]) => `${k} (${v})`)
              .join(", ") || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}
