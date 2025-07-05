import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar/Navbar';
import ContactAndFooter from '../components/ContactAndFooter/ContactAndFooter';
import { FaTelegram, FaThumbsUp } from 'react-icons/fa';

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

export default function Notes() {
  const router = useRouter();
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

  return (
    <>
      <Head>
        <title>Notes - IAS avlokanias</title>
        <meta name="description" content="Access high-quality study materials and notes for UPSC preparation" />
      </Head>

      <Navbar user={user} />

      {/* Purple Promo Banner */}
      <div className="bg-purple-600 text-white py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-sm md:text-base">
            Detailed Evaluation by Interview Appeared Subject Toppers! Recommended by Hundreds of Rankers!
          </p>
          <button 
            onClick={() => router.push('/evaluation-plans')}
            className="bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-50 transition-colors"
          >
            View Plans
          </button>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon!</h1>
          <p className="text-xl text-gray-600">We will be launching Notes course soon</p>
        </div>
      </div>

      {/* Telegram Floating Button */}
      <a
        href="https://t.me/your_telegram_channel"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <FaTelegram className="text-2xl" />
      </a>

      <ContactAndFooter />
    </>
  );
} 