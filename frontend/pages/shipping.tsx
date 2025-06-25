import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ContactAndFooter from '../components/ContactAndFooter';
import Head from 'next/head';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProfileResponse {
  user: User;
}

export default function Shipping() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get<ProfileResponse>('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(res.data.user);
      } catch (err: unknown) {
        console.error('Error fetching profile:', err);
        const error = err as { response?: { status?: number } };
        if (error.response?.status !== 401) {
          setError('Failed to load user profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Shipping Policy - avlokanias</title>
        <meta name="description" content="Shipping Policy for avlokanias - Your trusted platform for UPSC answer writing practice and expert evaluation." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">avlokanias Shipping Policy</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Shipping Overview</h2>
          <div className="prose prose-lg">
            <p>
              avlokanias provides digital and physical educational materials. This policy outlines delivery timelines, charges, and shipping details.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Delivery Timelines</h2>
          <div className="prose prose-lg">
            <ul className="list-disc pl-6 space-y-2">
              <li>Standard: 5-7 business days</li>
              <li>Expedited: 2-4 business days</li>
              <li>International: 10-15 business days (availability subject to location)</li>
            </ul>
            <p className="mt-4">Delays may occur due to external factors.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Shipping Charges</h2>
          <div className="prose prose-lg">
            <p>
              Calculated at checkout. International shipping, customs, or taxes are customer's responsibility.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Order Processing</h2>
          <div className="prose prose-lg">
            <ul className="list-disc pl-6 space-y-2">
              <li>Processed within 1-2 business days.</li>
              <li>Tracking details shared via email.</li>
              <li>Orders on weekends/holidays are processed next working day.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Address Accuracy</h2>
          <div className="prose prose-lg">
            <p>
              Ensure correct shipping details. avlokanias is not responsible for delays due to incorrect addresses.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Tracking & Support</h2>
          <div className="prose prose-lg">
            <p>Track orders using the provided ID. For inquiries, contact:</p>
            <div className="mt-4 space-y-2">
              <p>📧 Email: info@avlokanias.com</p>
              <p>📞 Phone: 7838724075</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Damaged or Lost Shipments</h2>
          <div className="prose prose-lg">
            <ul className="list-disc pl-6 space-y-2">
              <li>Report damaged orders within 48 hours with photos.</li>
              <li>Lost shipments will be investigated; refunds/replacements based on findings.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Returns & Refunds</h2>
          <div className="prose prose-lg">
            <p>
              Applies only to physical products. Digital products (courses, test series) are non-refundable. See Return Policy for details.
            </p>
          </div>
        </section>

        <div className="mt-8 text-sm text-gray-600">
          <p>avlokanias reserves the right to update this policy anytime. Check regularly for updates.</p>
        </div>
      </main>
      <ContactAndFooter />
    </div>
  );
} 