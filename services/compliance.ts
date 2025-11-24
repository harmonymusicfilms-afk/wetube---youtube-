
import { ComplianceLog, User } from '../types';
import { MOCK_VIDEOS } from '../constants';

// Mock Compliance Data Service

export const generateUserDataExport = (user: User): Blob => {
  // Aggregate user data
  const exportData = {
    profile: user,
    content: {
      videos: MOCK_VIDEOS.filter(v => v.channelName === user.name), // Mock filter
      comments: [], // Mock comments
      playlists: []
    },
    activity: {
      loginHistory: [],
      searchHistory: []
    },
    gdpr: {
      exportedAt: new Date().toISOString(),
      requestType: 'ACCESS_REQUEST'
    }
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
};

export const downloadUserData = (user: User) => {
  const blob = generateUserDataExport(user);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `wetube_data_export_${user.id}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Mock Compliance Audit Logs
export const getComplianceLogs = (): ComplianceLog[] => {
  return [
    {
      id: 'log_123',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      action: 'USER_DATA_EXPORT',
      actorId: 'user_456',
      targetResource: 'user_profile',
      details: 'User requested GDPR data export.',
      severity: 'low',
      status: 'resolved'
    },
    {
      id: 'log_124',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      action: 'LOGIN_FAILURE_SPIKE',
      actorId: 'unknown',
      targetResource: 'auth_system',
      details: 'Multiple failed login attempts detected from IP 192.168.x.x',
      severity: 'high',
      status: 'flagged'
    },
    {
      id: 'log_125',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      action: 'CONTENT_TAKEDOWN',
      actorId: 'admin_01',
      targetResource: 'video_882',
      details: 'Video removed due to copyright violation (DMCA).',
      severity: 'medium',
      status: 'resolved'
    }
  ];
};
