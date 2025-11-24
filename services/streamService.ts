
import { StreamSettings, StreamStats } from '../types';

// Mock Service for Streaming Infrastructure

export const generateStreamKey = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [4, 4, 4, 4];
  return segments
    .map(len => Array(len).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join(''))
    .join('-');
};

export const getStreamServer = (): string => {
  return 'rtmp://a.rtmp.wetube.com/live2';
};

export const getInitialStats = (): StreamStats => ({
  isLive: false,
  viewers: 0,
  duration: 0,
  bitrate: 0,
  health: 'offline'
});

export const simulateStreamHealth = (current: StreamStats): StreamStats => {
  if (!current.isLive) return current;
  
  // Simulate fluctuating stats
  return {
    ...current,
    viewers: current.viewers + Math.floor(Math.random() * 5),
    bitrate: 4500 + Math.floor(Math.random() * 500), // 4500-5000 kbps
    duration: current.duration + 1,
    health: 'good'
  };
};
