"use client";

import { LineChart } from '@mui/x-charts/LineChart';

interface UsersLineChartProps {
  data: { date: string; count: number }[];
}

export default function UsersLineChart({ data }: UsersLineChartProps) {
  const xLabels = data.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
  
  const yData = data.map(item => item.count);

  return (
    <div className="flex items-center justify-center h-[200px]">
      <LineChart
        xAxis={[{ 
          scaleType: 'point', 
          data: xLabels,
          tickLabelStyle: {
            fontSize: 10,
            fill: 'white',
          },
        }]}
        series={[
          {
            data: yData,
            color: '#10b981',
            curve: 'linear',
          },
        ]}
        width={300}
        height={200}
        margin={{ left: 40, right: 10, top: 20, bottom: 30 }}
        sx={{
          '& .MuiChartsAxis-line': {
            stroke: '#52525b',
          },
          '& .MuiChartsAxis-tick': {
            stroke: '#52525b',
          },
          '& .MuiChartsAxis-tickLabel': {
            fill: 'white !important',
          },
          '& text': {
            fill: 'white !important',
          },
        }}
      />
    </div>
  );
}

