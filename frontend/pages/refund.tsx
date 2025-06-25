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

export default function Refund() {
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
        <title>Refund Policy - AvlokanIAS</title>
        <meta name="description" content="Refund Policy for AvlokanIAS - Your trusted platform for UPSC answer writing practice and expert evaluation." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Full Refund</h2>
          <div className="prose prose-lg">
            <p>
              Our policy lasts 2 days. If 2 days have gone by since your purchase, unfortunately, we can't offer you a full refund.
            </p>
            <p>
              To be eligible for a full refund, your Subscription should not have been utilized. (i.e., you should not have submitted single question for the evaluation)
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Partial Refund</h2>
          <div className="prose prose-lg">
            <p>
              To be eligible for a partial refund of 50%, you should not have submitted more than 10 gs questions and 2 essays. You are not eligible for the partial refund after 10 days of the commencement of the plan.
            </p>
            <p>
              To complete your refund process, we require a receipt or proof of purchase.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Late or missing refunds (if applicable)</h2>
          <div className="prose prose-lg">
            <p>
              If you haven't received a refund yet, first check your bank account again.
            </p>
            <p>
              Then contact your credit card company, it may take some time before your refund is officially posted.
            </p>
            <p>
              Next, contact your bank. There is often some processing time before a refund is posted.
            </p>
            <p>
              If you have done all of this and you still have not received your refund yet, please contact us at info@avlokanias.com
            </p>
          </div>
        </section>
      </main>
      <ContactAndFooter />
    </div>
  );
} 