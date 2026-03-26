const envPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
export const FB_PIXEL_ID = (envPixelId && envPixelId !== 'null' && envPixelId !== 'undefined' && envPixelId !== '') ? envPixelId : '2405626966453965'; // Fallback to a valid structure if empty

export const pageview = () => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }
};

// https://developers.facebook.com/docs/facebook-pixel/reference
export const event = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', name, options);
  }
};
