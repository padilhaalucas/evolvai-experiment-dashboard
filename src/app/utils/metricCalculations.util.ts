import { Variant, DerivedMetrics } from '@/app/types';

export function calculateConversionRate(conversions: number, visitors: number): number {
  if (visitors === 0) return 0;
  return (conversions / visitors) * 100;
}

export function calculateRevenuePerVisitor(revenue: number, visitors: number): number {
  if (visitors === 0) return 0;
  return revenue / visitors;
}

export function calculateDerivedMetrics(variant: Variant): DerivedMetrics {
  return {
    conversionRate: calculateConversionRate(variant.conversions, variant.visitors),
    revenuePerVisitor: calculateRevenuePerVisitor(variant.revenue, variant.visitors),
    averageSessionDuration: 120 + Math.random() * 60, // Simulated value
  };
}