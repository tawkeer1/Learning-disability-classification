"use client";

import React from "react";
import { getRecommendations } from "./GetRecommendations";

const MaterialsPage = ({ finalPrediction, features }) => {
  const recommendations = getRecommendations(finalPrediction, features);

  if (!recommendations.length) return null;

  return (
    <div className="bg-gray-400 p-6 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📘 Personalized Recommendations</h2>
      <p className="text-dark-900">Based on your performance we recommend you to visit following</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="bg-blue-50 border border-blue-200 rounded-xl shadow hover:shadow-lg transition-shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-1">{rec.title}</h3>
              <p className="text-sm text-gray-700 mb-3">{rec.desc}</p>
            </div>
            <a
              href={rec.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Visit Resource →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialsPage;
