'use client'

import { useMemo, useState } from 'react';
import { calculateDerivedMetrics } from '@/app/utils';
import { useExperimentContext } from "@/app/contexts";
import { SectionHeader, MetricCard } from "@/app/components";

export function MetricsPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: experiment } = useExperimentContext();

  const variantsWithMetrics = useMemo(() => {
    if (!experiment || !experiment?.variants) return [];

    return experiment.variants.map(variant => ({
      ...variant,
      metrics: calculateDerivedMetrics(variant),
    }));
  }, [experiment]);

  const control = variantsWithMetrics.find(v => v.name === 'Control');
  const variantB = variantsWithMetrics.find(v => v.name === 'Variant B');

  const diffPercentages = (() => {
    let conversion = 0
    let revenuePerVisitor = 0

    if (control && variantB) {
      conversion = variantB.metrics.conversionRate - control.metrics.conversionRate
      if ([control.metrics.revenuePerVisitor, variantB.metrics.revenuePerVisitor].every(n => n > 0)) {
        revenuePerVisitor = ((variantB.metrics.revenuePerVisitor / control.metrics.revenuePerVisitor) - 1) * 100
      }
    }

    return {
      conversion,
      revenuePerVisitor
    }
  })()

  if (!experiment || !control || !variantB) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Key Metrics</h2>

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
        <div className="text-gray-500 mt-4">Loading metrics data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-hidden">
      <SectionHeader
        title="Key Metrics"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'mt-4 opacity-100 p-1' : 'mt-0 opacity-0'}`}
        style={{
          maxHeight: isExpanded ? '1000px' : '0px',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Visitors"
            value={`${control.visitors + variantB.visitors}`}
            subtext="Across all variants"
          />

          <MetricCard
            title="Conversion Rate"
            value={`${variantB.metrics.conversionRate.toFixed(1)}%`}
            subtext={`Control: ${control.metrics.conversionRate.toFixed(1)}%`}
            change={diffPercentages.conversion}
          />

          <MetricCard
            title="Revenue per Visitor"
            value={`$${variantB.metrics.revenuePerVisitor.toFixed(2)}`}
            subtext={`Control: $${control.metrics.revenuePerVisitor.toFixed(2)}`}
            change={diffPercentages.revenuePerVisitor}
          />

          <MetricCard
            title="Avg. Session Duration"
            value={`${Math.floor(variantB.metrics.averageSessionDuration)}s`}
            subtext={`Control: ${Math.floor(control.metrics.averageSessionDuration)}s`}
          />
        </div>
      </div>
    </div>
  );
}