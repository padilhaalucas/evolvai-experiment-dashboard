'use client'

import { useEffect, useRef, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { format, parseISO } from 'date-fns';

import { Experiment } from '@/app/types';

interface LineChartProps {
  experiment: Experiment;
  metric: 'visitors' | 'conversions' | 'revenue';
}

export function LineChart({ experiment, metric }: LineChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartColors, setChartColors] = useState({
    color1: 'rgb(59, 130, 246)',
    color2: 'rgb(16, 185, 129)',
    yAxisLabel: 'New Visitors'
  });

  useEffect(() => {
    let color1, color2, yAxisLabel;

    switch (metric) {
      case 'visitors':
        color1 = 'rgb(59, 130, 246)';
        color2 = 'rgb(16, 185, 129)';
        yAxisLabel = 'New Visitors';
        break;
      case 'conversions':
        color1 = 'rgb(249, 115, 22)';
        color2 = 'rgb(139, 92, 246)';
        yAxisLabel = 'New Conversions';
        break;
      case 'revenue':
        color1 = 'rgb(220, 38, 38)';
        color2 = 'rgb(234, 88, 12)';
        yAxisLabel = 'New Revenue ($)';
        break;
    }

    setChartColors({ color1, color2, yAxisLabel });

    if (chartInstance.current) {
      if (chartInstance.current.data.datasets[0]) {
        chartInstance.current.data.datasets[0].borderColor = color1;
        chartInstance.current.data.datasets[0].backgroundColor = `${color1}20`;
      }
      if (chartInstance.current.data.datasets[1]) {
        chartInstance.current.data.datasets[1].borderColor = color2;
        chartInstance.current.data.datasets[1].backgroundColor = `${color2}20`;
      }

      if (chartInstance.current.options.scales?.y) {
        // @ts-ignore - TypeScript doesn't know about title property
        chartInstance.current.options.scales.y.title.text = yAxisLabel;
      }

      chartInstance.current.update('none');
    }
  }, [metric]);

  useEffect(() => {
    if (!chartRef.current || !experiment) return;

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !experiment) return;

    const updates = [...experiment.liveUpdates].slice(-10);

    const labels = updates.map(update =>
      format(parseISO(update.timestamp), 'HH:mm:ss')
    );

    const controlData = updates.map(update => update.control[metric]);
    const variantData = updates.map(update => update.variantB[metric]);

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Control',
            data: controlData,
            borderColor: chartColors.color1,
            backgroundColor: `${chartColors.color1}20`,
            fill: true,
            tension: 0.1,
          },
          {
            label: 'Variant B',
            data: variantData,
            borderColor: chartColors.color2,
            backgroundColor: `${chartColors.color2}20`,
            fill: true,
            tension: 0.1,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: chartColors.yAxisLabel
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        },
        animation: {
          duration: 300
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        }
      }
    }

    if (!chartInstance.current) {
      chartInstance.current = new Chart(ctx, chartConfig);
    } else {
      chartInstance.current.data.labels = labels;
      chartInstance.current.data.datasets[0].data = controlData;
      chartInstance.current.data.datasets[1].data = variantData;

      chartInstance.current.update();
    }
  }, [experiment, metric, chartColors]);

  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}