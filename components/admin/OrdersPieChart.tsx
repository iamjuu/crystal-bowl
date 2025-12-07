"use client";

import { PieChart } from '@mui/x-charts/PieChart';

interface OrdersPieChartProps {
  paid: number;
  pending: number;
  cancelled: number;
}

export default function OrdersPieChart({ paid, pending, cancelled }: OrdersPieChartProps) {
  const data = [
    { id: 0, value: paid, label: 'Paid', color: '#10b981' },
    { id: 1, value: pending, label: 'Pending', color: '#f59e0b' },
    { id: 2, value: cancelled, label: 'Cancelled', color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="flex items-center justify-center h-[200px]">
      <PieChart
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
            labelStyle: {
              fontSize: 12,
              fill: 'white',
            },
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

