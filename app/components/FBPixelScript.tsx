'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as fbpixel from '@/lib/fpixel';
import Script from 'next/script';

export default function FBPixelScript() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fbpixel.pageview();
  }, [pathname, searchParams]);

  return (
    <>
      {fbpixel.FB_PIXEL_ID && fbpixel.FB_PIXEL_ID !== 'null' && fbpixel.FB_PIXEL_ID !== 'undefined' && (
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbpixel.FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
      {fbpixel.FB_PIXEL_ID && fbpixel.FB_PIXEL_ID !== 'null' && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${fbpixel.FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      )}
    </>
  );
}
