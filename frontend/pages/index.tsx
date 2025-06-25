import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
// Toppers section temporarily disabled
// import Toppers from '../components/Toppers';
import Features from '../components/Features';
import EvaluationPlans from '../components/EvaluationPlans';
import ProcessSection from '../components/ProcessSection';
import SamplesAndFAQ from '../components/SamplesAndFAQ';
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

export default function Home() {
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
      } catch (err) {
        console.error('Error fetching profile:', err);
        // Don't set error for unauthorized access
        if ((axios as any).isAxiosError(err) && (err as any).response?.status !== 401) {
        // if (axios.isAxiosError(err) && err.response?.status !== 401) {
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>AvlokanIAS - UPSC Answer Writing & Evaluation Platform</title>
        <meta name="description" content="AvlokanIAS - Your trusted platform for UPSC answer writing practice and expert evaluation. Join thousands of aspirants in their journey to success." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main>
        <Hero />
        {/* Toppers section temporarily disabled
        <Toppers />
        */}
        <Features />
        <EvaluationPlans user={user} showTitleSection={false} showNotesSection={false} />
        <ProcessSection />
        <SamplesAndFAQ />
        <ContactAndFooter />
      </main>
    </div>
  );
} 