import { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Tweeter</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
