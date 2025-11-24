
import React, { useEffect } from 'react';
import { View } from '../types';
import { trackPageView } from '../services/analytics';

interface AnalyticsTrackerProps {
  view: View;
}

const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ view }) => {
  useEffect(() => {
    if (view) {
      trackPageView(view);
    }
  }, [view]);

  return null;
};

export default AnalyticsTracker;
