import EvaluationPlans from '../components/EvaluationPlans';
import Navbar from '../components/Navbar';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function EvaluationPlansPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Evaluation Plans - AvlokanIAS</title>
        <meta name="description" content="Choose from our comprehensive evaluation plans for UPSC preparation. Get expert feedback and improve your answer writing skills." />
      </Head>
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EvaluationPlans user={user} showTitleSection={true} showNotesSection={true} />
      </main>
    </div>
  );
} 