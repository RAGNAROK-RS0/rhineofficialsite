import { Helmet } from 'react-helmet-async';

export default function SecurityHeaders() {
  return (
    <Helmet>
      <meta httpEquiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://prod.spline.design https://cdn.prod.website-files.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: blob: https:;
        connect-src 'self' https://*.supabase.co https://api.fontshare.com https://cdn.prod.website-files.com;
        frame-src 'self' https://prod.spline.design;
        worker-src 'self' blob:;
      " />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer-policy" content="strict-origin-when-cross-origin" />
      <meta name="permissions-policy" content="camera=(), microphone=(), geolocation=()" />
    </Helmet>
  );
}