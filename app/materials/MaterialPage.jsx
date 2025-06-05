"use client";

import React from "react";
import { getRecommendations } from "./GetRecommendations";

const MaterialsPage = ({ finalPrediction, features }) => {
  const recommendations = getRecommendations(finalPrediction, features);

  if (!recommendations.length) return null;

  return (
    <div className="bg-blue-500 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">📘 Personalized Recommendations</h2>
      <ul className="space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="border-l-4 border-blue-400 pl-3">
            <p className="font-semibold">{rec.title}</p>
            <p className="text-sm">{rec.desc}</p>
            <a
              href={rec.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline text-sm"
            >
              Visit Resource
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaterialsPage;
