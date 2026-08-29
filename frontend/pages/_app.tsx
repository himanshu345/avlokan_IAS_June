import React, { useState } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Image from 'next/image';

function MyApp({ Component, pageProps }: AppProps) {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
      <Head>
        <title>AvlokanIAS</title>
        <meta name="description" content="A platform for IAS exam preparation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      {showPopup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative w-[85vw] max-w-[420px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(false)}
              aria-label="Close"
              className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-2xl">
              <Image
                src="/images/uppsc-prelims-2026.jpeg"
                alt="UPPSC Prelims Test Series 2026"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyApp;