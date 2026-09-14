import Script from 'next/script';
import GaPageViews from '@/components/GaPageViews';
import { GA_MEASUREMENT_ID, isGaMeasurementId } from '@/lib/ga';

export default function GoogleAnalytics() {
  if (!isGaMeasurementId(GA_MEASUREMENT_ID)) return null;

  const id = GA_MEASUREMENT_ID;

  return (
    <>
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${id}',{send_page_view:false,anonymize_ip:true});`}
      </Script>
      <GaPageViews />
    </>
  );
}
