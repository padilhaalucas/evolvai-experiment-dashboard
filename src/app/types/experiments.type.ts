export interface Variant {
  name: string;
  visitors: number;
  conversions: number;
  revenue: number;
}

export interface LiveUpdate {
  timestamp: string;
  control: {
    visitors: number;
    conversions: number;
    revenue: number;
  };
  variantB: {
    visitors: number;
    conversions: number;
    revenue: number;
  };
}

export interface Experiment {
  experimentId: string;
  variants: Variant[];
  liveUpdates: LiveUpdate[];
}

export interface ExperimentLog {
  timestamp: string;
  experimentId: string;
  message: string;
  eventType: string;
}

export interface DerivedMetrics {
  conversionRate: number;
  revenuePerVisitor: number;
  averageSessionDuration: number; // In seconds
}

export interface VariantWithMetrics extends Variant {
  metrics: DerivedMetrics;
}