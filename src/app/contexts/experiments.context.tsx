import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode
} from 'react';

import { useEventSource, SSEMeta } from '@/app/hooks';
import { Experiment, LiveUpdate } from "@/app/types";

export const UNIFIED_SCALE = [60000, 30000, 15000, 8000, 5000, 3000, 2000, 1000, 500];
export const DEFAULT_INDEX = 4;
export const API_URL = 'http://localhost:4000/api';

interface ExperimentContextType {
  experimentId: string;
  data: Experiment | null;
  meta: SSEMeta | null;
  isConnected: boolean;
  lastUpdated: Date | null;
  error: Event | null;
  index: number;
  displayText: string;
  connect: () => void;
  disconnect: () => void;
  handleFaster: () => void;
  handleSlower: () => void;
}

interface ContextProps {
  experimentId: string;
  children: ReactNode;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export const ExperimentProvider = ({ experimentId: initialExperimentId, children }: ContextProps) => {
  const [experimentId] = useState(initialExperimentId || 'exp_live_001');
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const updateCountRef = useRef(0);
  const [, setUpdateTrigger] = useState(0);
  const [index, setIndex] = useState(DEFAULT_INDEX);

  useEffect(() => {
    const fetchExperiment = async () => {
      try {
        console.log(`Fetching initial data from ${API_URL}/experiments/${experimentId}/metrics`);
        const response = await fetch(`${API_URL}/experiments/${experimentId}/metrics`);
        const data = await response.json();
        console.log('Initial data loaded:', data);
        setExperiment(data);
      } catch (error) {
        console.error('Error fetching experiment data:', error);
      }
    };

    fetchExperiment();
  }, [experimentId]);

  const [persistentLastUpdated, setPersistentLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const savedTimestamp = localStorage.getItem(`lastUpdated_${experimentId}`);
    if (savedTimestamp) {
      setPersistentLastUpdated(new Date(savedTimestamp));
    }
  }, [experimentId]);

  const {
    data: updateData,
    meta,
    isConnected,
    lastUpdated,
    error,
    connect,
    disconnect
  } = useEventSource<LiveUpdate>(
    `${API_URL}/experiments/${experimentId}/events`
  );

  useEffect(() => {
    if (lastUpdated) {
      setPersistentLastUpdated(lastUpdated);
      localStorage.setItem(`lastUpdated_${experimentId}`, lastUpdated.toISOString());
    }
  }, [lastUpdated, experimentId]);

  useEffect(() => {
    if (!updateData) return;

    setExperiment(prevExp => {
      if (!prevExp) return prevExp;

      const updated = JSON.parse(JSON.stringify(prevExp));

      updated.liveUpdates = [...updated.liveUpdates, updateData];

      updated.variants = updated.variants.map((variant: any) => {
        const controlData = updateData.control;
        const variantBData = updateData.variantB;

        if (variant.name === 'Control' && controlData) {
          return {
            ...variant,
            visitors: variant.visitors + controlData.visitors,
            conversions: variant.conversions + controlData.conversions,
            revenue: variant.revenue + controlData.revenue,
          };
        } else if (variant.name === 'Variant B' && variantBData) {
          return {
            ...variant,
            visitors: variant.visitors + variantBData.visitors,
            conversions: variant.conversions + variantBData.conversions,
            revenue: variant.revenue + variantBData.revenue,
          };
        }
        return variant;
      });

      return updated;
    });

    updateCountRef.current += 1;
    setUpdateTrigger(updateCountRef.current);

  }, [updateData]);

  useEffect(() => {
    if (meta && meta.interval) {
      const newIndex = UNIFIED_SCALE.indexOf(meta.interval);
      if (newIndex !== -1) {
        setIndex(newIndex);
      }
    }
  }, [meta]);

  const currentInterval = UNIFIED_SCALE[index];

  const updateInterval = useCallback(async (interval: number) => {
    try {
      await fetch(`${API_URL}/experiments/${experimentId}/interval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval }),
      });
    } catch (e) {
      console.error('Failed to update interval', e);
    }
  }, [experimentId]);

  const handleFaster = useCallback(() => {
    if (index < UNIFIED_SCALE.length - 1) {
      const next = index + 1;
      setIndex(next);
      updateInterval(UNIFIED_SCALE[next]);
    }
  }, [index, updateInterval]);

  const handleSlower = useCallback(() => {
    if (index > 0) {
      const next = index - 1;
      setIndex(next);
      updateInterval(UNIFIED_SCALE[next]);
    }
  }, [index, updateInterval]);

  const displayText = useMemo(() => {
    const multiplier = UNIFIED_SCALE[DEFAULT_INDEX] / currentInterval;
    if (index === DEFAULT_INDEX) return '1x';
    return index > DEFAULT_INDEX
      ? `${multiplier.toFixed(1)}x`
      : `1/${(1 / multiplier).toFixed(1)}x`;
  }, [index, currentInterval]);

  return (
    <ExperimentContext.Provider value={{
      experimentId,
      data: experiment,
      meta,
      isConnected,
      lastUpdated: persistentLastUpdated,
      error,
      index,
      displayText,
      connect,
      disconnect,
      handleFaster,
      handleSlower
    }}>
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperimentContext = (): ExperimentContextType => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperimentContext must be used within an ExperimentProvider');
  }
  return context;
};