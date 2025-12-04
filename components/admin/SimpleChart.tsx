"use client";

import { PieChart } from "@mui/x-charts/PieChart";

type SimplePieChartProps = {
  data: { name: string; value: number; color: string }[];
  title: string;
  size?: number;
};

export function SimplePieChart({ data, title, size = 200 }: SimplePieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500">
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500">
        No data available
      </div>
    );
  }

  // Prepare data for MUI PieChart
  const pieData = data.map((item, index) => ({
    id: index,
    value: item.value,
    label: item.name,
  }));

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium text-zinc-400 mb-4">{title}</h3>}
      <div className="flex flex-col items-center">
        <PieChart
          series={[
            {
              data: pieData,
              innerRadius: 0,
              outerRadius: size / 2 - 10,
            },
          ]}
          width={size}
          height={size}
          sx={{
            "& .MuiChartsTooltip-root": {
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              color: "#ffffff",
            },
          }}
        />
        <div className="mt-4 space-y-2 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-zinc-400">{item.name}</span>
              </div>
              <span className="text-white font-medium">
                {item.value} ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
