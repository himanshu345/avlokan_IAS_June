import React, { useEffect, useState } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Image from 'next/image';

function MyApp({ Component, pageProps }: AppProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>AvlokanIAS</title>
        <meta name="description" content="A platform for IAS exam preparation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showSplash && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white cursor-pointer"
          onClick={() => setShowSplash(false)}
        >
          <div className="relative w-[85vw] max-w-[420px] aspect-square">
            <Image
              src="/images/uppsc-prelims-2026.jpeg"
              alt="UPPSC Prelims Test Series 2026"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
      )}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;