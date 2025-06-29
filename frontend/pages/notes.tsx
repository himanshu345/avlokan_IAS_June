import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import ContactAndFooter from '../components/ContactAndFooter';
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
        const res = await fetch('http://localhost:5000/api/users/profile', {
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

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Notes Modules</h2>
                <nav className="space-y-2">
                  <a href="#" className="block px-4 py-2 bg-purple-50 text-purple-600 rounded-md font-medium">
                    Mains Diamonds - CA Model Answers
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                    Current Affairs - Question Bank
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                    Prelims CA
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                    UPPSC Notes
                  </a>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mains 2025 Diamonds</h3>
                  <p className="text-gray-600 mb-4">
                    Model Answers from Current Affairs Topics. Must for Revision (Monthly Compilation)
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹1,999</span>
                      <span className="text-gray-500 line-through ml-2">₹4,999</span>
                      <span className="text-sm text-gray-500 ml-1">(including GST)</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <FaThumbsUp className="mr-1" />
                      <span>471 likes</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push('/evaluation-plans')}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    View Details & Subscribe
                  </button>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Mains 2026 Diamonds</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">New</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Model Answers from Current Affairs Topics. Must for Revision (Monthly Compilation)
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹1,999</span>
                      <span className="text-gray-500 line-through ml-2">₹4,999</span>
                      <span className="text-sm text-gray-500 ml-1">(including GST)</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <FaThumbsUp className="mr-1" />
                      <span>69 likes</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push('/evaluation-plans')}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    View Details & Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
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