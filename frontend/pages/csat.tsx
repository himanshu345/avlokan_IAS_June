import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar/Navbar';
import ContactAndFooter from '../components/ContactAndFooter/ContactAndFooter';

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProfileResponse {
  success: boolean;
  user: User;
  message?: string;
}

export default function CSAT() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data: ProfileResponse = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
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
    <>
      <Head>
        <title>CSAT - AvlokanIAS</title>
        <meta name="description" content="CSAT preparation resources and materials" />
      </Head>
      <Navbar user={user} />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon!</h1>
          <p className="text-xl text-gray-600">We will be launching CSAT course soon</p>
        </div>
      </div>

      <ContactAndFooter />
    </>
  );
} 