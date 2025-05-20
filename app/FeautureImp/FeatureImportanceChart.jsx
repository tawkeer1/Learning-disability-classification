'use client';

import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042',
  '#8dd1e1', '#d0ed57', '#a4de6c', '#d88884'
];

const FeatureImportanceChart = () => {
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    fetch("/api/explain")
      .then((res) => res.json())
      .then((data) => {
        if (data.importances) {
          const chartData = Object.entries(data.importances).map(([name, value]) => ({
            name,
            value: Number((value * 100).toFixed(2)), // Convert to percentage
          }));
          setPieChartData(chartData);
        }
      });
  }, []);

  return (
    <div className="w-full h-96">
      <h2 className="text-xl font-semibold mb-4 text-center">Feature Importances</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureImportanceChart;
