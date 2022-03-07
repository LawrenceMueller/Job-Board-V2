import Layout from '../components/Layout';
import Head from 'next/head';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta
          name='description'
          content='Online job board for software developers. Find the next step in your career here. Sort by remote, experience, location, and other great filters.'
        />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
