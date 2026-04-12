import React from 'react';
import { useTenant, Tenant } from '../lib/multiTenant';

interface TenantSelectorProps {
  onTenantChange?: (tenant: Tenant) => void;
}

const tenants: Tenant[] = [
  { id: 'rhine-default', name: 'Rhine Solution', slug: 'rhine', primaryColor: '#0082D8', features: ['analytics', 'team', 'api', '3d'], plan: 'enterprise' },
  { id: 'client-a', name: 'Acme Corp', slug: 'acme', primaryColor: '#FF6B35', features: ['analytics', 'team'], plan: 'standard' },
  { id: 'client-b', name: 'TechStart', slug: 'techstart', primaryColor: '#4ECDC4', features: ['analytics', 'team', 'api', '3d'], plan: 'standard' },
  { id: 'enterprise-x', name: 'Enterprise X', slug: 'enterprise-x', primaryColor: '#9B59B6', features: ['analytics', 'team', 'api', '3d', 'ai'], plan: 'enterprise' },
];

export default function TenantSelector({ onTenantChange }: TenantSelectorProps) {
  const { tenant, setTenant } = useTenant();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = tenants.find(t => t.id === e.target.value);
    if (selected) {
      setTenant(selected);
      onTenantChange?.(selected);
    }
  };

  return (
    <div className="relative">
      <select
        value={tenant?.id || ''}
        onChange={handleChange}
        className="appearance-none bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg px-4 py-2 pr-10 text-white text-sm cursor-pointer hover:border-white/40 transition-colors focus:outline-none focus:border-[#0082D8]"
      >
        {tenants.map(t => (
          <option key={t.id} value={t.id} className="bg-black text-white">
            {t.name} ({t.plan})
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}