import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Payment Successful - AvlokanIAS</title>
        <meta name="description" content="Thank you for your payment. Your subscription has been activated successfully." />
      </Head>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your purchase. You will be redirected to the homepage in 5 seconds.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
} 