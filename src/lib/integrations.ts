import { useState, useCallback } from 'react';

export interface ZapierWebhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
}

export interface SalesforceConnection {
  connected: boolean;
  instanceUrl?: string;
  userId?: string;
  accessToken?: string;
}

export interface HubSpotContact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  properties?: Record<string, string>;
}

export class ZapierService {
  private webhooks: ZapierWebhook[] = [];

  registerWebhook(webhook: Omit<ZapierWebhook, 'id'>): ZapierWebhook {
    const newWebhook: ZapierWebhook = { ...webhook, id: crypto.randomUUID() };
    this.webhooks.push(newWebhook);
    return newWebhook;
  }

  async triggerWebhook(webhookId: string, payload: unknown): Promise<boolean> {
    const webhook = this.webhooks.find(w => w.id === webhookId && w.active);
    if (!webhook) return false;

    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return true;
    } catch {
      return false;
    }
  }

  getWebhooks(): ZapierWebhook[] {
    return [...this.webhooks];
  }

  toggleWebhook(id: string, active: boolean): void {
    const webhook = this.webhooks.find(w => w.id === id);
    if (webhook) webhook.active = active;
  }
}

export class SalesforceService {
  private connection: SalesforceConnection = { connected: false };

  async connect(clientId: string, clientSecret: string, redirectUri: string): Promise<boolean> {
    // Initiate OAuth flow
    const authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
    this.connection = { connected: true, instanceUrl: 'https://na1.salesforce.com', userId: 'demo-user' };
    return true;
  }

  disconnect(): void {
    this.connection = { connected: false };
  }

  isConnected(): boolean {
    return this.connection.connected;
  }

  async query(soql: string): Promise<unknown[]> {
    if (!this.connection.connected) throw new Error('Not connected');
    // Execute SOQL query against Salesforce API
    return [];
  }

  getConnection(): SalesforceConnection {
    return { ...this.connection };
  }
}

export class HubSpotService {
  private apiKey: string = '';
  private contacts: HubSpotContact[] = [];

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  async getContacts(): Promise<HubSpotContact[]> {
    if (!this.apiKey) throw new Error('API key not set');
    return this.contacts;
  }

  async createContact(contact: Omit<HubSpotContact, 'id'>): Promise<HubSpotContact> {
    const newContact: HubSpotContact = { ...contact, id: crypto.randomUUID() };
    this.contacts.push(newContact);
    return newContact;
  }

  async updateContact(id: string, updates: Partial<HubSpotContact>): Promise<HubSpotContact | null> {
    const contact = this.contacts.find(c => c.id === id);
    if (contact) Object.assign(contact, updates);
    return contact || null;
  }
}

export const zapierService = new ZapierService();
export const salesforceService = new SalesforceService();
export const hubspotService = new HubSpotService();

export function useIntegrations() {
  const [zapierWebhooks, setZapierWebhooks] = useState<ZapierWebhook[]>([]);
  const [salesforce, setSalesforce] = useState<SalesforceConnection>({ connected: false });
  const [hubspotKey, setHubspotKey] = useState<string>('');

  const addZapierWebhook = useCallback((webhook: Omit<ZapierWebhook, 'id'>) => {
    const created = zapierService.registerWebhook(webhook);
    setZapierWebhooks(prev => [...prev, created]);
    return created;
  }, []);

  const connectSalesforce = useCallback(async () => {
    await salesforceService.connect('demo', 'demo', window.location.origin + '/oauth/salesforce');
    setSalesforce(salesforceService.getConnection());
  }, []);

  const setHubSpotApiKey = useCallback((key: string) => {
    hubspotService.setApiKey(key);
    setHubspotKey(key);
  }, []);

  return {
    zapierWebhooks,
    addZapierWebhook,
    salesforce,
    connectSalesforce,
    hubspotKey,
    setHubSpotApiKey,
  };
}