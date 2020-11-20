import React from 'react';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import {
  countryCodeMap,
  getCodeFromSlug,
  getCountryNameFromCode,
} from '@src/utils/country-mapping';
import Home from '@src/containers/Home';

export default function Slug() {
  const router = useRouter();

  const { SITE_NAME } = process.env;
  const { GA_TRACKING_ID } = process.env;
  const { slug } = router.query as { slug: string };
  const iso = getCodeFromSlug(slug);
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
        <link rel="canonical" href={`https://visamap.live/visa/${slug}`} />
        <meta name="og:title" content="Visa Map" />
        <meta name="og:type" content="website" />
        <meta name="og:url" content={`https://visamap.live/visa/${slug}`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@davidmhernon" />
        <meta
          name="twitter:title"
          content={`Visa Map | Visa and Travel Restrictions for ${getCountryNameFromCode(
            iso,
          )}`}
        />
        <meta
          name="twitter:description"
          content="Get information on visa requirements and covid restrictions for the globe. If you must travel, check this first."
        />
      </Head>
      <Home iso={iso} />
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: countryCodeMap.map((country) => ({
      params: { slug: country.slug, fallback: false },
    })),
    fallback: false,
  };
}

export async function getStaticProps(props: any) {
  return {
    props: {
      params: props.params,
      locales: null,
    },
  };
}
