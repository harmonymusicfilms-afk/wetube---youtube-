
import { FraudCheckResult } from '../types';

// Bot Detection Heuristics
export const analyzeUserBehavior = (events: any[]): FraudCheckResult => {
  // Mock analysis: check for superhuman speeds or repetitive patterns
  const clickIntervals = events.map((e, i) => i > 0 ? e.timestamp - events[i-1].timestamp : 0).filter(x => x > 0);
  const avgInterval = clickIntervals.reduce((a, b) => a + b, 0) / (clickIntervals.length || 1);

  if (avgInterval < 50) { // < 50ms between actions is suspicious
    return {
      isValid: false,
      reason: 'Automated traffic detected (Action rate too high)',
      confidenceScore: 0.95
    };
  }

  return { isValid: true, confidenceScore: 0.1 };
};

// View Validation
export const validateView = async (
  videoId: string, 
  userId: string | undefined, 
  watchTimeSeconds: number, 
  ipAddress?: string
): Promise<FraudCheckResult> => {
  
  // 1. Threshold Check
  if (watchTimeSeconds < 30) {
    return {
      isValid: false,
      reason: 'Watch time below threshold (30s)',
      confidenceScore: 1.0
    };
  }

  // 2. IP Clustering (Simulated)
  // In a real backend, we'd check Redis for recent views from this IP
  if (ipAddress === '192.168.1.100') { // Mock blocked IP
     return {
         isValid: false,
         reason: 'Suspicious IP address',
         confidenceScore: 0.8
     };
  }

  // 3. Playback Integrity
  // Simulated check (e.g. ensure video wasn't seeked to end instantly)
  
  return {
    isValid: true,
    confidenceScore: 0.05
  };
};
