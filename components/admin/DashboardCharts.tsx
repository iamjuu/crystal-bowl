"use client";

import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { BarPlot } from "@mui/x-charts/BarChart";

type ChartData = {
  label?: string;
  date?: string;
  value: number;
  color?: string;
};

type DashboardChartsProps = {
  type: "bar" | "line";
  data: ChartData[];
  title: string;
  color?: string;
  height?: number;
};

export default function DashboardCharts({ type, data, title, color = "#10b981", height = 300 }: DashboardChartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500">
        No data available
      </div>
    );
  }

  // Prepare data for MUI charts
  const labels = data.map((item) => item.date || item.label || "");
  const values = data.map((item) => item.value);

  const margin = { top: 20, right: 24, bottom: 40, left: 40 };

  if (type === "bar") {
    return (
      <Box sx={{ width: "100%", height: height }}>
        <ChartContainer
          width={undefined}
          height={height}
          series={[{ data: values, label: title, type: "bar" }]}
          xAxis={[{ scaleType: "band", data: labels }]}
          margin={margin}
          sx={{
            width: "100%",
            "& .MuiChartsAxis-root": {
              stroke: "#6b7280",
            },
            "& .MuiChartsAxis-tick": {
              stroke: "#6b7280",
            },
            "& .MuiChartsAxis-tickLabel": {
              fill: "#9ca3af",
              fontSize: "12px",
            },
            "& .MuiChartsTooltip-root": {
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              color: "#ffffff",
            },
          }}
        >
          <BarPlot />
        </ChartContainer>
      </Box>
    );
  } else {
    return (
      <Box sx={{ width: "100%", height: height }}>
        <LineChart
          series={[
            {
              data: values,
              label: title,
              color: color,
            },
          ]}
          xAxis={[{ scaleType: "point", data: labels }]}
          yAxis={[{ width: 50 }]}
          margin={margin}
          sx={{
            width: "100%",
            "& .MuiChartsAxis-root": {
              stroke: "#6b7280",
            },
            "& .MuiChartsAxis-tick": {
              stroke: "#6b7280",
            },
            "& .MuiChartsAxis-tickLabel": {
              fill: "#9ca3af",
              fontSize: "12px",
            },
            "& .MuiChartsTooltip-root": {
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              color: "#ffffff",
            },
          }}
        />
      </Box>
    );
  }
}
