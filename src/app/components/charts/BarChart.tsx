'use client'

import { useEffect, useRef } from 'react';
import Chart, {ChartConfiguration} from 'chart.js/auto';

import { VariantWithMetrics } from '@/app/types';

interface BarChartProps {
  variants: VariantWithMetrics[];
}

export function BarChart({ variants }: BarChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !chartRef.current.getContext('2d') || variants.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (!chartInstance.current) {
      const labels = variants.map(v => v.name);
      const chartConfig: ChartConfiguration = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Conversion Rate (%)',
              data: variants.map(v => v.metrics.conversionRate),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
              yAxisID: 'y',
            },
            {
              label: 'Revenue per Visitor ($)',
              data: variants.map(v => v.metrics.revenuePerVisitor),
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 1,
              yAxisID: 'y1',
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
                text: 'Conversion Rate (%)'
              }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              grid: {
                drawOnChartArea: false,
              },
              title: {
                display: true,
                text: 'Revenue per Visitor ($)'
              }
            }
          },
          animation: {
            duration: 500
          }
        }
      }

      chartInstance.current = new Chart(ctx, chartConfig);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || variants.length === 0) return;

    chartInstance.current.data.datasets[0].data = variants.map(v => v.metrics.conversionRate);
    chartInstance.current.data.datasets[1].data = variants.map(v => v.metrics.revenuePerVisitor);

    chartInstance.current.update('none'); // 'none' disables animation for this update
  }, [variants]);

  return (
    <div className="h-64 md:h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
