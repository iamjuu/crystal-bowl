"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { ChartDataProviderPro } from '@mui/x-charts-pro/ChartDataProviderPro';
import { ChartsSurface } from '@mui/x-charts-pro/ChartsSurface';
import { LinePlot } from '@mui/x-charts-pro/LineChart';
import { ChartsXAxis } from '@mui/x-charts-pro/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts-pro/ChartsYAxis';
import { useDrawingArea, useXScale } from '@mui/x-charts-pro/hooks';
import { ChartsTooltip } from '@mui/x-charts-pro/ChartsTooltip';
import { ChartsGrid } from '@mui/x-charts-pro/ChartsGrid';
import { ChartZoomSlider } from '@mui/x-charts-pro/ChartZoomSlider';
import { ChartsClipPath } from '@mui/x-charts-pro/ChartsClipPath';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts-pro/ChartsLegend';

interface OrdersLineChartProps {
  data: { date: string; paid: number; pending: number; cancelled: number }[];
}

type HighlightPeriod = {
  start: Date;
  end: Date;
  label: string;
};

function HighlightBands({ periods }: { periods: HighlightPeriod[] }) {
  const { top, left, width, height } = useDrawingArea();
  const xScale = useXScale();
  const theme = useTheme();
  const labelFill = alpha('#ffffff', 0.9);

  return (
    <g>
      {periods.map((p, index) => {
        const xStart = xScale(p.start.getTime());
        const xEnd = xScale(p.end.getTime());

        if (xStart === undefined || xEnd === undefined) {
          return null;
        }

        let textX: number;
        if (xStart >= left && xStart <= left + width) {
          textX = xStart;
        } else if (xEnd >= left && xEnd <= left + width) {
          textX = left;
        } else {
          return null;
        }

        return (
          <React.Fragment key={index}>
            <rect
              x={textX}
              y={top}
              width={Math.min(xEnd, left + width) - textX}
              height={height}
              fill="grey"
              opacity={0.2}
            />
            <text
              x={textX}
              y={top - 5}
              textAnchor="start"
              dominantBaseline="auto"
              fill={labelFill}
              fontSize="0.8rem"
              fontWeight={500}
              pointerEvents="none"
            >
              {p.label}
            </text>
          </React.Fragment>
        );
      })}
    </g>
  );
}

export default function OrdersLineChart({ data }: OrdersLineChartProps) {
  const clipPathId = React.useId();

  // Transform data to include Date objects
  const chartData = data.map(item => ({
    date: new Date(item.date),
    paid: item.paid,
    pending: item.pending,
    cancelled: item.cancelled,
  }));

  // Define highlight periods (optional - you can customize this)
  const highlightPeriods: HighlightPeriod[] = [];

  return (
    <Box sx={{ width: '100%', height: '300px' }}>
      <ChartDataProviderPro
        height={300}
        experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
        dataset={chartData}
        series={[
          {
            type: 'line',
            id: 'paid',
            dataKey: 'paid',
            label: 'Paid',
            color: '#10b981',
            showMark: false,
            valueFormatter: (value) => (value == null ? '' : `${value}`),
          },
          {
            type: 'line',
            id: 'pending',
            dataKey: 'pending',
            label: 'Pending',
            color: '#f59e0b',
            showMark: false,
            valueFormatter: (value) => (value == null ? '' : `${value}`),
          },
          {
            type: 'line',
            id: 'cancelled',
            dataKey: 'cancelled',
            label: 'Cancelled',
            color: '#ef4444',
            showMark: false,
            valueFormatter: (value) => (value == null ? '' : `${value}`),
          },
        ]}
        xAxis={[
          {
            scaleType: 'time',
            dataKey: 'date',
            tickNumber: 4,
            valueFormatter: (date, context) => {
              if (context.location !== 'tick') {
                return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                });
              }
              return date.getMonth() === 0
                ? date.toLocaleDateString('en-US', {
                    year: 'numeric',
                  })
                : date.toLocaleDateString('en-US', {
                    month: 'short',
                  });
            },
            zoom: {
              slider: { enabled: true },
            },
          },
        ]}
        yAxis={[
          {
            scaleType: 'linear',
            valueFormatter: (value) => `${value}`,
          },
        ]}
        sx={{
          '& .MuiChartsLegend-series text': {
            fill: 'white !important',
          },
          '& .MuiChartsAxis-tickLabel': {
            fill: 'white !important',
          },
          '& .MuiChartsAxis-label': {
            fill: 'white !important',
          },
          '& text': {
            fill: 'white !important',
          },
          '& .MuiChartsAxis-line': {
            stroke: '#52525b',
          },
          '& .MuiChartsAxis-tick': {
            stroke: '#52525b',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <ChartsLegend />
        </Box>
        <ChartsSurface>
          <ChartsClipPath id={clipPathId} />
          <HighlightBands periods={highlightPeriods} />
          <ChartsGrid horizontal />
          <g clipPath={`url(#${clipPathId})`}>
            <LinePlot />
          </g>
          <ChartsXAxis />
          <ChartsYAxis label="Orders Count" />
          <ChartsAxisHighlight x="line" />
          <ChartZoomSlider />
        </ChartsSurface>
        <ChartsTooltip />
      </ChartDataProviderPro>
    </Box>
  );
}

