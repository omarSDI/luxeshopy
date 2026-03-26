'use client';

import { useEffect } from 'react';
import { logVisit } from '@/app/actions/analytics';

export default function VisitorTracker() {
  useEffect(() => {
    // 1. Session check to avoid redundant logging
    const sessionKey = 'luxe_session_logged';
    const isSessionLogged = sessionStorage.getItem(sessionKey);
    if (isSessionLogged) return;

    // 2. Capture basic info
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    const path = window.location.pathname;

    // UTMs
    const utm_source = urlParams.get('utm_source');
    const utm_medium = urlParams.get('utm_medium');
    const utm_campaign = urlParams.get('utm_campaign');

    // 3. Determine Source
    let source = 'Direct';
    if (utm_source) {
      source = utm_source;
    } else if (referrer) {
      const refLower = referrer.toLowerCase();
      if (refLower.includes('facebook') || refLower.includes('fb.')) source = 'Facebook';
      else if (refLower.includes('instagram')) source = 'Instagram';
      else if (refLower.includes('tiktok')) source = 'TikTok';
      else if (refLower.includes('google')) source = 'Search';
      else if (refLower.includes('bing') || refLower.includes('yahoo')) source = 'Search';
      else source = 'Other';
    }

    // 4. Determine Device Type
    let deviceType = 'Desktop';
    const ua = navigator.userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      deviceType = 'Tablet';
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      deviceType = 'Mobile';
    }

    // 5. Log it
    logVisit({
      referrer,
      source,
      path,
      device_type: deviceType,
      utm_source: utm_source || undefined,
      utm_medium: utm_medium || undefined,
      utm_campaign: utm_campaign || undefined,
    });

    // Mark as logged for this session
    sessionStorage.setItem(sessionKey, 'true');
  }, []);

  return null;
}
