
import { CopyrightClaim } from '../types';

// Mock Database of Copyright Signatures
const CONTENT_ID_DB = [
  { signature: 'audio_123', owner: 'Sony Music Entertainment', type: 'audio' },
  { signature: 'visual_456', owner: 'Warner Bros. Pictures', type: 'visual' }
];

export const scanContent = async (file: File): Promise<CopyrightClaim[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const claims: CopyrightClaim[] = [];

  // Deterministic mock logic based on file name
  if (file.name.toLowerCase().includes('music') || file.name.toLowerCase().includes('song')) {
    claims.push({
      id: `claim_${Date.now()}`,
      videoId: 'pending_id',
      videoTitle: file.name,
      claimant: 'Universal Music Group',
      type: 'audio',
      timestamp: '0:45 - 1:30',
      status: 'active',
      action: 'monetize' // Claimant takes revenue
    });
  }

  if (file.name.toLowerCase().includes('movie') || file.name.toLowerCase().includes('clip')) {
    claims.push({
      id: `claim_${Date.now()}_2`,
      videoId: 'pending_id',
      videoTitle: file.name,
      claimant: 'Paramount Pictures',
      type: 'visual',
      timestamp: '2:10 - 2:45',
      status: 'active',
      action: 'block' // Video blocked in some territories
    });
  }

  return claims;
};

export const getClaims = async (): Promise<CopyrightClaim[]> => {
  // Return mock claims for the dashboard
  return [
    {
      id: 'c1',
      videoId: 'v1',
      videoTitle: 'My Summer Vlog 2025 (feat. Popular Song)',
      claimant: 'Sony Music Entertainment',
      type: 'audio',
      timestamp: '0:15 - 2:30',
      status: 'active',
      action: 'monetize'
    },
    {
      id: 'c2',
      videoId: 'v5',
      videoTitle: 'React Tutorial - Full Course',
      claimant: 'EduCorp Global',
      type: 'audiovisual',
      timestamp: '14:20 - 15:00',
      status: 'disputed',
      action: 'track'
    }
  ];
};

export const disputeClaim = async (claimId: string, reason: string): Promise<void> => {
  console.log(`Disputing claim ${claimId} for reason: ${reason}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
};
