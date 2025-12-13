// @ts-nocheck
"use client";

import { PieChart } from '@mui/x-charts/PieChart';

interface UsersPieChartProps {
  total: number;
  verified: number;
}

export default function UsersPieChart({ total, verified }: UsersPieChartProps) {
  const unverified = total - verified;
  
  const data = [
    { id: 0, value: verified, label: 'Verified', color: '#10b981' },
    { id: 1, value: unverified, label: 'Unverified', color: '#f59e0b' },
  ].filter(item => item.value > 0);

  return (
    <div className="flex items-center justify-center h-[200px]">
      <PieChart {...{} as any}
        series={[
          {
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            arcLabel: (item) => `${item.value}`,
            arcLabelMinAngle: 35,
          },
        ]}
        width={300}
        height={200}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 0,
          },
        }}
        sx={{
          '& .MuiChartsLegend-series text': {
            fill: 'white !important',
          },
          '& .MuiPieArc-root': {
            stroke: 'none',
          },
          '& text': {
            fill: 'white !important',
          },
        }}
      />
    </div>
  );
}



