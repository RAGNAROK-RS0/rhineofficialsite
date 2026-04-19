import React, { useState } from 'react';
import { IoTDevice, useDeviceManagement, formatLastSeen } from '../lib/iot';

interface DeviceCardProps {
  device: IoTDevice;
  onSelect?: (device: IoTDevice) => void;
}

function DeviceCard({ device, onSelect }: DeviceCardProps) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500',
  };

  const typeIcons = {
    sensor: '📡',
    actuator: '🎮',
    gateway: '🌐',
    controller: '⚙️',
  };

  return (
    <div 
      onClick={() => onSelect?.(device)}
      className="bg-black/60 border border-white/10 rounded-lg p-4 hover:border-[#0082D8]/50 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeIcons[device.type]}</span>
          <div>
            <h4 className="text-white font-medium">{device.name}</h4>
            <span className="text-white/40 text-xs uppercase">{device.type}</span>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColors[device.status]}`} />
      </div>
      <div className="flex justify-between items-center text-xs text-white/40">
        <span>{device.status}</span>
        <span>{formatLastSeen(device.lastSeen)}</span>
      </div>
    </div>
  );
}

export default function DeviceManager() {
  const { devices } = useDeviceManagement();
  const [selected, setSelected] = useState<IoTDevice | null>(null);

  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white font-bold">IoT Devices</h3>
        <div className="flex gap-4 text-xs">
          <span className="text-green-500">{onlineCount} online</span>
          <span className="text-red-500">{offlineCount} offline</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {devices.map(device => (
          <DeviceCard 
            key={device.id} 
            device={device} 
            onSelect={setSelected}
          />
        ))}
      </div>
      {selected && (
        <div className="p-4 border-t border-white/10">
          <div className="text-white/60 text-sm">Selected: {selected.name}</div>
        </div>
      )}
    </div>
  );
}