'use client'

import { useState, useRef } from 'react';

import { calculateDerivedMetrics } from '@/app/utils';
import { VariantWithMetrics } from '@/app/types';
import { useExperimentContext } from "@/app/contexts";
import {
  BarChart,
  LineChart,
  SectionHeader,
  SubSectionHeader,
  SelectFilters,
} from '@/app/components';

export function VisualizationChartsPanel() {
  const { data: experiment } = useExperimentContext();

  const [isSectionExpanded, setIsSectionExpanded] = useState(false);
  const [barChartExpanded, setBarChartExpanded] = useState(true);
  const [lineChartExpanded, setLineChartExpanded] = useState(true);
  const [lineChartMetric, setLineChartMetric] = useState<'visitors' | 'conversions' | 'revenue'>('conversions');

  const contentRef = useRef<HTMLDivElement>(null);

  if (!experiment || !experiment.variants) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Visualizations</h2>

          <button
            className="p-1.5 rounded-full hover:bg-gray-100 hover:cursor-pointer transition-colors duration-200 focus:outline-none"
            disabled
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="text-gray-500 mt-4">Loading visualization data...</div>
      </div>
    );
  }

  const variantsWithMetrics: VariantWithMetrics[] = experiment.variants.map(variant => ({
    ...variant,
    metrics: calculateDerivedMetrics(variant),
  }));

  const filters = [
    { title: 'Visitors', onClick: () => setLineChartMetric('visitors'), isSelected: lineChartMetric === 'visitors' },
    { title: 'Conversions', onClick: () => setLineChartMetric('conversions'), isSelected: lineChartMetric === 'conversions' },
    { title: 'Revenue', onClick: () => setLineChartMetric('revenue'), isSelected: lineChartMetric === 'revenue' },
  ]

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6 overflow-hidden">
      <SectionHeader
        title="Visualizations"
        isExpanded={isSectionExpanded}
        onToggle={() => setIsSectionExpanded(!isSectionExpanded)}
      />

      <div
        ref={contentRef}
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isSectionExpanded ? 'mt-4 opacity-100' : 'mt-0 opacity-0'}`}
        style={{
          maxHeight: isSectionExpanded ? '2000px' : '0px',
        }}
      >
        <div className="mb-6">
          <SubSectionHeader
            title="Variant Comparison"
            isExpanded={barChartExpanded}
            onToggle={() => setBarChartExpanded(!barChartExpanded)}
          />

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${barChartExpanded ? 'opacity-100' : 'opacity-0'}`}
            style={{
              maxHeight: barChartExpanded ? '500px' : '0px',
            }}
          >
            <BarChart variants={variantsWithMetrics} />
          </div>
        </div>

        <div>
          <SubSectionHeader
            title="Trend Over Time"
            isExpanded={lineChartExpanded}
            onToggle={() => setLineChartExpanded(!lineChartExpanded)}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <SelectFilters filters={filters} isExpanded={lineChartExpanded} />
            </div>
          </SubSectionHeader>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${lineChartExpanded ? 'opacity-100' : 'opacity-0'}`}
            style={{
              maxHeight: lineChartExpanded ? '500px' : '0px',
            }}
          >
            <LineChart experiment={experiment} metric={lineChartMetric} />
          </div>
        </div>
      </div>
    </div>
  );
}