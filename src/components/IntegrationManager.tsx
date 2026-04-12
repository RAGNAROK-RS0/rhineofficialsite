import React from 'react';
import { useIntegrations, ZapierWebhook, SalesforceConnection } from '../lib/integrations';

interface IntegrationCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  connected: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  children?: React.ReactNode;
}

function IntegrationCard({ title, description, icon, connected, onConnect, onDisconnect, children }: IntegrationCardProps) {
  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#0082D8]/20 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-white font-bold">{title}</h3>
            <p className="text-white/40 text-sm">{description}</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      {children}
      <button
        onClick={connected ? onDisconnect : onConnect}
        className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          connected 
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
            : 'bg-[#0082D8] text-white hover:bg-[#0082D8]/80'
        }`}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}

export default function IntegrationManager() {
  const { zapierWebhooks, addZapierWebhook, salesforce, connectSalesforce, hubspotKey, setHubSpotApiKey } = useIntegrations();

  const addWebhook = () => {
    addZapierWebhook({
      name: 'New Webhook',
      url: 'https://hooks.zapier.com/hook/demo',
      events: ['contact.created'],
      active: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <IntegrationCard
          title="Zapier"
          description="Automate workflows with 5000+ apps"
          connected={zapierWebhooks.length > 0}
          onConnect={addWebhook}
          onDisconnect={() => {}}
        >
          <div className="text-sm text-white/60">
            {zapierWebhooks.length} webhook{zapierWebhooks.length !== 1 ? 's' : ''} registered
          </div>
        </IntegrationCard>

        <IntegrationCard
          title="Salesforce"
          description="CRM integration and data sync"
          connected={salesforce.connected}
          onConnect={connectSalesforce}
          onDisconnect={() => {}}
        >
          <div className="text-sm text-white/60">
            {salesforce.connected ? `Connected to ${salesforce.instanceUrl}` : 'Not connected'}
          </div>
        </IntegrationCard>

        <IntegrationCard
          title="HubSpot"
          description="Marketing automation and CRM"
          connected={!!hubspotKey}
          onConnect={() => setHubSpotApiKey(import.meta.env.VITE_HUBSPOT_API_KEY || '')}
          onDisconnect={() => setHubSpotApiKey('')}
        >
          <div className="text-sm text-white/60">
            {hubspotKey ? 'API key configured' : 'No API key'}
          </div>
        </IntegrationCard>
      </div>
    </div>
  );
}