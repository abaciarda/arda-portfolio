import Script from "next/script";

export default function Analytics() {
  return (
    <>
      <Script id="analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PC1M1B3MJM');
        `}
      </Script>
      <Script
        id="analytics-script"
        src="https://www.googletagmanager.com/gtag/js?id=G-PC1M1B3MJM"
        strategy="lazyOnload"
      />
    </>
  );
}
