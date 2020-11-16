/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import '@src/css/tailwind.css';
import { useRouter } from 'next/dist/client/router';

import * as gtag from '../lib/gtag';

const MyApp = ({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) => {
  const router = useRouter();
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
};

export default MyApp;
