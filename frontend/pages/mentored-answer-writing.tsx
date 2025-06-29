import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import ContactAndFooter from '../components/ContactAndFooter';
import { FaTelegram, FaThumbsUp, FaChevronRight, FaPencilAlt } from 'react-icons/fa';
import Link from 'next/link';
import type { IconType } from 'react-icons';
const ChevronRight = FaChevronRight as IconType;

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

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-between w-full bg-white p-4 rounded-lg shadow-sm mb-4"
            >
              <span className="font-medium">Mentored Answer Writing</span>
              <ChevronRight className={`transform transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Left Sidebar */}
            <div className={`lg:w-1/4 ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mentored Answer Writing</h2>
                <nav className="space-y-2">
                  <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between">
                    Mentored Answer Writing
                    <ChevronRight className="text-gray-400" />
                  </a>
                  <a href="#" className="block px-4 py-2 bg-purple-600 text-white rounded-md font-medium flex items-center justify-between">
                    CAWG
                    <ChevronRight className="text-white" />
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between">
                    My Sessions
                    <ChevronRight className="text-gray-400" />
                  </a>
                </nav>
              </div>
            </div>

            {/* Main Content - Added margin-top to account for fixed navbar */}
            <div className="lg:w-3/4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaPencilAlt className="text-purple-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">CAWG - 19th May</h3>
                    <p className="text-gray-600 mb-2">avlokanias Answer Writing Group (CAWG)</p>
                    <a href="#" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      View Course
                    </a>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹1,499</span>
                      <span className="text-gray-500 line-through ml-2">₹3,999</span>
                      <span className="text-sm text-gray-500 ml-1">(including GST)</span>
                    </div>
                    <div className="flex items-center text-purple-600">
                      <FaThumbsUp className="mr-1" />
                      <span>93 likes</span>
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