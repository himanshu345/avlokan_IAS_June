import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import PrelimsPanel from './PrelimsPanel';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPrelimsOpen, setIsPrelimsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-purple-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link href="/">
                <div className="flex items-center">
                  <Image
                    src="/images/logo.jpeg"
                    alt="AvlokanIAS Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="ml-2 text-xl font-bold text-gray-900">AvlokanIAS</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <Link href="/evaluation-plans">
                  <div className="flex flex-col items-center text-gray-700 hover:text-purple-600">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs text-green-500">Popular</span>
                    </div>
                    <span>Evaluation Plans</span>
                  </div>
                </Link>
                <div className="relative group">
                  <button
                    onClick={() => {
                      setIsPrelimsOpen(true);
                      router.push('/prelims');
                    }}
                    className="flex flex-col items-center text-gray-700 hover:text-purple-600"
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      <span className="text-xs text-orange-500">New</span>
                    </div>
                    <span>Prelims</span>
                  </button>
                </div>
                <Link href="/csat">
                  <div className="text-gray-700 hover:text-purple-600">CSAT</div>
                </Link>
                <Link href="/notes">
                  <div className="text-gray-700 hover:text-purple-600">Notes</div>
                </Link>
                <Link href="/mentored-answer-writing">
                  <div className="text-gray-700 hover:text-purple-600">MAW</div>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-purple-600">
                    <span>Videos</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute hidden group-hover:block w-48 bg-white shadow-lg rounded-md mt-2 py-2">
                    <Link href="/videos/current-affairs">
                      <div className="block px-4 py-2 text-gray-700 hover:bg-purple-50">Current Affairs</div>
                    </Link>
                    <Link href="/videos/optional">
                      <div className="block px-4 py-2 text-gray-700 hover:bg-purple-50">Optional Subjects</div>
                    </Link>
                    <Link href="/videos/strategy">
                      <div className="block px-4 py-2 text-gray-700 hover:bg-purple-50">Strategy Sessions</div>
                    </Link>
                  </div>
                </div>
                {/* Toppers section temporarily disabled
                <Link href="/toppers">
                  <div className="text-gray-700 hover:text-purple-600">Toppers Copies</div>
                </Link>
                */}
                <Link href="/contact">
                  <div className="text-gray-700 hover:text-purple-600">Contact Us</div>
                </Link>
                <Link href="/reviews">
                  <div className="text-gray-700 hover:text-purple-600">Reviews</div>
                </Link>
              </div>
            </div>

            {/* Right side - Mobile menu button and Auth */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Auth Buttons */}
              <div className="hidden lg:flex items-center ml-8">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg hover:scale-105 transform transition-all duration-300">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/evaluation-plans" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                Evaluation Plans
              </Link>
              <button
                onClick={() => {
                  setIsPrelimsOpen(true);
                  setIsMenuOpen(false);
                  router.push('/prelims');
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Prelims
              </button>
              <Link href="/csat" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                CSAT
              </Link>
              <Link href="/notes" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                Notes
              </Link>
              <Link href="/mentored-answer-writing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                MAW
              </Link>
              {/* Toppers section temporarily disabled
              <Link href="/toppers" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                Toppers Copies
              </Link>
              */}
              <Link href="/videos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                Videos
              </Link>
              <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                Contact Us
              </Link>
              <Link href="/reviews" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                Reviews
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="space-y-1">
                  <div className="block px-4 py-2 text-base font-medium text-gray-500">
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1 px-2 pt-2 pb-3">
                  <Link href="/login" className="block text-center w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700">
                    Login
                  </Link>
                  <Link href="/register" className="block text-center w-full px-4 py-2 text-gray-700 font-medium rounded-md hover:bg-gray-100">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Prelims Panel */}
      <PrelimsPanel isOpen={isPrelimsOpen} onClose={() => setIsPrelimsOpen(false)} />
    </>
  );
} 