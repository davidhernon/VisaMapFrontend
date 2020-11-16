import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import HomePage from '@src/containers/Home';
import { useRouter } from 'next/dist/client/router';

const Home: NextPage = () => {
  const { SITE_NAME } = process.env;
  const { GA_TRACKING_ID } = process.env;
  const router = useRouter();
  const { iso } = router.query;
  const countryCode = typeof iso === 'string' ? iso.toUpperCase() : undefined;

  return (
    <>
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <title>{SITE_NAME}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Visa and Travel Information" />
        <link rel="canonical" href="https://visamap.live" />
        <meta name="og:title" content="Visa Map" />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://visamap.live" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@davidmhernon" />
        <meta
          name="twitter:title"
          content="Visa Map | Visa and Travel Information"
        />
        <meta
          name="twitter:description"
          content="Get information on visa requirements and covid restrictions for the globe. If you must travel, check this first."
        />
      </Head>
      <HomePage iso={countryCode} />
    </>
  );
};

export default Home;
