'use server';

import { headers } from 'next/headers';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'LUXE_PIXEL_DEFAULT';
const FB_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

export async function trackServerEvent(eventName: string, userData: any = {}, customData: any = {}) {
  if (!FB_ACCESS_TOKEN) {
    console.warn('Facebook Access Token missing. CAPI event skipped.');
    return { success: false, error: 'Missing token' };
  }

  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const clientIp = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: {
          client_ip_address: clientIp,
          client_user_agent: userAgent,
          ...userData,
        },
        custom_data: customData,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    console.error('CAPI Error:', error);
    return { success: false, error };
  }
}
