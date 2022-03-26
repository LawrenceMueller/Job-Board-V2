import Layout from '../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const handleRouteChange = (url) => {
    window.gtag('config', '[Tracking ID]', {
      page_path: url,
    });
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <Layout>
        <Head>
          <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
          />
          <meta
            name='description'
            content='Online job board for software developers. Find the next step in your career here. Sort by remote, experience, location, and other great filters.'
          />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
