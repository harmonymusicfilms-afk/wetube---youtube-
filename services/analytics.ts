
import { LogEntry } from '../types';

export const trackEvent = (eventName: string, data?: any) => {
  const entry: LogEntry = {
    level: 'info',
    message: eventName,
    timestamp: new Date().toISOString(),
    data
  };
  // In a real application, this would send data to ClickHouse or Google Analytics
  console.log('[Analytics]', entry);
};

export const trackPageView = (view: string) => {
  trackEvent('PAGE_VIEW', { view });
};
