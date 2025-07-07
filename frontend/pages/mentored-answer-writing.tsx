import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar/Navbar';
import ContactAndFooter from '../components/ContactAndFooter/ContactAndFooter';
import { FaTelegram, FaThumbsUp, FaPencilAlt } from 'react-icons/fa';
import Link from 'next/link';

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

export default function MentoredAnswerWriting() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
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
        <title>Mentored Answer Writing - avlokanias</title>
        <meta name="description" content="Join our Mentored Answer Writing program for personalized guidance and feedback" />
      </Head>

      <Navbar user={user} />

      {/* Promo Banner - Updated positioning and z-index */}
      <div className="bg-purple-600 text-white py-3 px-4 text-center relative z-0 mt-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className="text-sm md:text-base">
              Join our Mentored Answer Writing program for personalized guidance and feedback
            </p>
          </div>
          <Link href="/evaluation-plans" className="ml-4">
            <button className="bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-50 transition-colors">
              View Plans
            </button>
          </Link>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon!</h1>
          <p className="text-xl text-gray-600">We will be launching MAW course soon</p>
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