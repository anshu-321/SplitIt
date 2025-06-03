import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1493",
  "#FF4500",
  "#FFD700",
  "#00CED1",
  "#7FFF00",
  "#FF69B4",
  "#8A2BE2",
  "#20B2AA",
  "#FF6347",
  "#4682B4",
  "#D2691E",
];

export default function CategoryPieChart({ data }) {
  return (
    // <div className="pt-32">
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md ">
      <h2 className="text-xl font-bold text-center mb-4">
        Expenses by Category
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="totalAmount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
    // </div>
  );
}
