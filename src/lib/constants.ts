// Animation
export const MAX_DELTA = 0.03;
export const ANIMATION_FRAME_INTERVAL = 16;

// Web Vitals Thresholds
export const LCP_THRESHOLDS = { good: 2500, poor: 4000 };
export const FID_THRESHOLDS = { good: 100, poor: 300 };
export const CLS_THRESHOLDS = { good: 0.1, poor: 0.25 };
export const TTFB_THRESHOLD = 800;

// Security
export const MAX_SECURITY_EVENTS = 1000;
export const RATE_LIMIT_WINDOW_MS = 3600000;

// Timeouts
export const TOAST_DURATION = 3000;
export const LOADING_DELAY = 800;
export const SEARCH_TIMEOUT = 2000;
export const MOBILE_BREAKPOINT = 1024;

// IoT
export const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
export const MQTT_RECONNECT_DELAY = 30000;
export const MQTT_TIMEOUT = 3600000;
export const IOT_POLL_INTERVALS = {
  SHORT: 60000,
  MEDIUM: 3600000,
  LONG: 86400000
};

// Performance Monitoring
export const PERFORMANCE_THRESHOLDS = {
  lcp: 0.1,
  fid: 100,
  cls: 2500
};

// Dev Ports
export const DEV_PORT = 5173;
export const PREVIEW_PORT = 4173;
