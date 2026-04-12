import { useState, useEffect, useCallback } from 'react';

interface FunnelStep {
  name: string;
  count: number;
  conversionRate?: number;
}

interface FunnelData {
  steps: FunnelStep[];
  dateRange: { start: Date; end: Date };
}

interface HeatmapData {
  element: string;
  clicks: number;
  avgTime: number;
}

function calculateConversionRates(steps: FunnelStep[]): FunnelStep[] {
  if (steps.length === 0) return [];
  
  const firstStepCount = steps[0].count;
  return steps.map((step, index) => ({
    ...step,
    conversionRate: index === 0 ? 100 : (step.count / firstStepCount) * 100,
  }));
}

export function useFunnelAnalytics(funnelId: string) {
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const trackFunnelStep = useCallback((stepName: string) => {
    const key = `funnel_${funnelId}_${stepName}`;
    const current = Number(localStorage.getItem(key) || 0);
    localStorage.setItem(key, String(current + 1));
    
    window.dispatchEvent(new CustomEvent('funnel_step', {
      detail: { funnelId, step: stepName }
    }));
  }, [funnelId]);

  const fetchFunnelData = useCallback(async () => {
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 300));

    const storedSteps: FunnelStep[] = [];
    const stepNames = ['visit', 'browse', 'pricing', 'contact', 'signup'];
    
    stepNames.forEach((step) => {
      const key = `funnel_${funnelId}_${step}`;
      storedSteps.push({
        name: step,
        count: Number(localStorage.getItem(key) || Math.floor(Math.random() * 100)),
      });
    });

    setFunnelData({
      steps: calculateConversionRates(storedSteps),
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    });
    
    setIsLoading(false);
  }, [funnelId]);

  useEffect(() => {
    fetchFunnelData();
  }, [fetchFunnelData]);

  return { funnelData, isLoading, trackFunnelStep, refetch: fetchFunnelData };
}

export function useHeatmapAnalytics() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const trackClick = useCallback((element: string) => {
    const key = `heatmap_${element}`;
    const current = Number(localStorage.getItem(key) || 0);
    localStorage.setItem(key, String(current + 1));
  }, []);

  const fetchHeatmapData = useCallback(async () => {
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 200));

    const elements = [
      'header_cta',
      'hero_button',
      'pricing_card',
      'contact_form',
      'footer_link',
      'sidebar_menu',
    ];

    const data: HeatmapData[] = elements.map((el) => ({
      element: el,
      clicks: Number(localStorage.getItem(`heatmap_${el}`) || Math.floor(Math.random() * 50)),
      avgTime: Math.floor(Math.random() * 30) + 5,
    }));

    setHeatmapData(data.sort((a, b) => b.clicks - a.clicks));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchHeatmapData();
  }, [fetchHeatmapData]);

  return { heatmapData, isLoading, trackClick, refetch: fetchHeatmapData };
}

interface AnalyticsDashboardProps {
  funnelId?: string;
}

export default function AnalyticsDashboard({ funnelId = 'default' }: AnalyticsDashboardProps) {
  const { funnelData, isLoading: funnelLoading } = useFunnelAnalytics(funnelId);
  const { heatmapData, isLoading: heatmapLoading } = useHeatmapAnalytics();

  if (funnelLoading || heatmapLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-[#0082D8] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
        <div className="space-y-3">
          {funnelData?.steps.map((step, index) => (
            <div key={step.name} className="relative">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white capitalize">{step.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-white/60">{step.count} users</span>
                  <span 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: step.conversionRate && step.conversionRate > 50 ? '#10b98120' : '#f59e0b20',
                      color: step.conversionRate && step.conversionRate > 50 ? '#10b981' : '#f59e0b'
                    }}
                  >
                    {step.conversionRate?.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0082D8] rounded transition-all"
                style={{ 
                  width: `${(step.count / (funnelData?.steps[0]?.count || 1)) * 100}%`,
                  opacity: 0.3,
                  zIndex: -1,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Click Heatmap</h3>
        <div className="grid grid-cols-2 gap-3">
          {heatmapData.slice(0, 6).map((item) => (
            <div 
              key={item.element}
              className="p-3 bg-white/5 rounded-lg flex items-center justify-between"
            >
              <span className="text-white/60 text-sm">{item.element.replace(/_/g, ' ')}</span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: `rgba(0, 130, 216, ${Math.min(item.clicks / 50, 1)})`
                  }}
                />
                <span className="text-white font-medium">{item.clicks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}