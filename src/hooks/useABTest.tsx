import { useState, useEffect, useCallback, createContext, useContext } from 'react';

interface Experiment {
  id: string;
  name: string;
  variants: Record<string, number>;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface ABTestContextType {
  experiments: Experiment[];
  activeExperiment: string | null;
  variant: string | null;
  trackConversion: (experimentId: string, goal: string) => void;
  getVariant: (experimentId: string) => string | null;
  registerExperiment: (experiment: Experiment) => void;
}

const ABTestContext = createContext<ABTestContextType | null>(null);

export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }
  return context;
}

interface ABTestProviderProps {
  children: React.ReactNode;
}

export function ABTestProvider({ children }: ABTestProviderProps) {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ab_experiments');
    if (stored) {
      try {
        setExperiments(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse stored experiments');
      }
    }

    const active = localStorage.getItem('ab_active_experiment');
    const storedVariant = localStorage.getItem('ab_variant');
    if (active && storedVariant) {
      setActiveExperiment(active);
      setVariant(storedVariant);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ab_experiments', JSON.stringify(experiments));
  }, [experiments]);

  const registerExperiment = useCallback((experiment: Experiment) => {
    setExperiments((prev) => {
      const exists = prev.find((e) => e.id === experiment.id);
      if (exists) return prev;
      return [...prev, experiment];
    });
  }, []);

  const getVariant = useCallback((experimentId: string): string | null => {
    const exp = experiments.find((e) => e.id === experimentId);
    if (!exp || !exp.active) return null;
    
    const storedVariant = localStorage.getItem(`ab_variant_${experimentId}`);
    if (storedVariant) return storedVariant;

    const keys = Object.keys(exp.variants);
    const weights = Object.values(exp.variants);
    const random = Math.random() * weights.reduce((a, b) => a + b, 0);
    
    let cumulative = 0;
    for (let i = 0; i < keys.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        localStorage.setItem(`ab_variant_${experimentId}`, keys[i]);
        return keys[i];
      }
    }
    
    const defaultVariant = keys[0];
    localStorage.setItem(`ab_variant_${experimentId}`, defaultVariant);
    return defaultVariant;
  }, [experiments]);

  const trackConversion = useCallback((experimentId: string, goal: string) => {
    
    const currentVariant = getVariant(experimentId);
    const conversionKey = `ab_conversion_${experimentId}_${currentVariant}_${goal}`;
    const existing = localStorage.getItem(conversionKey);
    
    localStorage.setItem(conversionKey, String(Number(existing || 0) + 1));

    const event = new CustomEvent('ab_conversion', {
      detail: { experimentId, variant: currentVariant, goal }
    });
    window.dispatchEvent(event);
  }, [getVariant]);

  return (
    <ABTestContext.Provider
      value={{
        experiments,
        activeExperiment,
        variant,
        trackConversion,
        getVariant,
        registerExperiment,
      }}
    >
      {children}
    </ABTestContext.Provider>
  );
}

export function useABExperiment(experimentId: string, experiment: Experiment) {
  const { registerExperiment, getVariant, trackConversion } = useABTest();
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    registerExperiment(experiment);
  }, [experiment, registerExperiment]);

  useEffect(() => {
    const assignedVariant = getVariant(experimentId);
    setVariant(assignedVariant);
  }, [experimentId, getVariant]);

  const track = useCallback((goal: string) => {
    trackConversion(experimentId, goal);
  }, [experimentId, trackConversion]);

  return { variant, track };
}