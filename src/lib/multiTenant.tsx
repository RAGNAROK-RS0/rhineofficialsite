import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor: string;
  features: string[];
  plan: 'free' | 'standard' | 'enterprise';
}

export interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
  isMultiTenant: boolean;
}

const defaultTenant: Tenant = {
  id: 'rhine-default',
  name: 'Rhine Solution',
  slug: 'rhine',
  primaryColor: '#0082D8',
  features: ['analytics', 'team', 'api', '3d'],
  plan: 'enterprise',
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenantState] = useState<Tenant | null>(() => {
    const saved = localStorage.getItem('current_tenant');
    return saved ? JSON.parse(saved) : defaultTenant;
  });

  const setTenant = useCallback((newTenant: Tenant | null) => {
    const finalTenant = newTenant || defaultTenant;
    setTenantState(finalTenant);
    localStorage.setItem('current_tenant', JSON.stringify(finalTenant));
  }, []);

  return (
    <TenantContext.Provider value={{ tenant: tenant || defaultTenant, setTenant, isMultiTenant: true }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

export function getTenantConfig(tenantId: string): TenantConfig {
  const configs: Record<string, TenantConfig> = {
    'rhine-default': {
      apiEndpoint: '/api',
      features: { analytics: true, team: true, api: true, '3d': true, ai: true },
      limits: { users: Infinity, storage: Infinity, apiCalls: Infinity },
    },
    'client-a': {
      apiEndpoint: 'https://api.client-a.com',
      features: { analytics: true, team: true, api: false, '3d': false, ai: false },
      limits: { users: 10, storage: 1_000_000_000 as number, apiCalls: 10_000 },
    },
    'client-b': {
      apiEndpoint: 'https://api.client-b.com',
      features: { analytics: true, team: true, api: true, '3d': true, ai: false },
      limits: { users: 50, storage: 5_000_000_000 as number, apiCalls: 50_000 },
    },
  };
  return configs[tenantId] || configs['rhine-default'];
}

export interface TenantConfig {
  apiEndpoint: string;
  features: Record<string, boolean>;
  limits: { users: number; storage: number; apiCalls: number };
}

export function useTenantFeatures() {
  const { tenant } = useTenant();
  const config = getTenantConfig(tenant.id);
  return config.features;
}

export function useTenantLimits() {
  const { tenant } = useTenant();
  const config = getTenantConfig(tenant.id);
  return config.limits;
}