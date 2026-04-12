import { useState, useEffect, useCallback, useRef } from 'react';

export interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'gateway' | 'controller';
  status: 'online' | 'offline' | 'warning';
  lastSeen: Date;
  data?: Record<string, unknown>;
}

export interface MQTTMessage {
  topic: string;
  payload: string;
  timestamp: Date;
  qos: 0 | 1 | 2;
}

interface UseMQTTOptions {
  brokerUrl?: string;
  topics?: string[];
  onMessage?: (topic: string, message: string) => void;
  clientId?: string;
}

export function useMQTT(options: UseMQTTOptions = {}) {
  const { brokerUrl = 'wss://broker.hivemq.com:8884/mqtt', topics = [], onMessage } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MQTTMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const clientId = `rhine-${Date.now()}`;
    const ws = new WebSocket(`${brokerUrl}?clientId=${clientId}`);

    ws.onopen = () => {
      setIsConnected(true);
      topics.forEach(topic => {
        ws.send(JSON.stringify({ type: 'subscribe', topic }));
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const msg: MQTTMessage = {
          topic: data.topic || 'unknown',
          payload: data.payload || '',
          timestamp: new Date(),
          qos: 0,
        };
        setMessages(prev => [...prev.slice(-99), msg]);
        onMessage?.(msg.topic, msg.payload);
      } catch {}
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);
    wsRef.current = ws;
  }, [brokerUrl, topics, onMessage]);

  const publish = useCallback((topic: string, payload: string, qos: 0 | 1 | 2 = 0) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'publish', topic, payload, qos }));
    }
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    setIsConnected(false);
  }, []);

  useEffect(() => {
    return () => { wsRef.current?.close(); };
  }, []);

  return { isConnected, messages, connect, publish, disconnect };
}

export function useDeviceManagement() {
  const [devices, setDevices] = useState<IoTDevice[]>([
    { id: 'dev-1', name: 'Temperature Sensor A', type: 'sensor', status: 'online', lastSeen: new Date() },
    { id: 'dev-2', name: 'Smart Light Controller', type: 'controller', status: 'online', lastSeen: new Date() },
    { id: 'dev-3', name: 'Motion Detector', type: 'sensor', status: 'warning', lastSeen: new Date(Date.now() - 300000) },
    { id: 'dev-4', name: 'Gateway Hub', type: 'gateway', status: 'offline', lastSeen: new Date(Date.now() - 3600000) },
  ]);

  const updateDevice = useCallback((id: string, updates: Partial<IoTDevice>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates, lastSeen: new Date() } : d));
  }, []);

  const getDeviceById = useCallback((id: string) => {
    return devices.find(d => d.id === id);
  }, [devices]);

  return { devices, updateDevice, getDeviceById };
}

export function formatLastSeen(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}