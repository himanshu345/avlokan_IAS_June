import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import PrelimsPanel from '../PrelimsPanel/PrelimsPanel';

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
      <nav className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-lg rounded-b-2xl ${isScrolled ? 'bg-white/80 shadow-2xl' : 'bg-purple-100/80'} `} style={{backdropFilter: 'blur(12px)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link href="/">
                <div className="flex items-center group cursor-pointer">
                  <Image
                    src="/images/logo.jpeg"
                    alt="AvlokanIAS Logo"
                    width={44}
                    height={44}
                    className="rounded-full border-2 border-indigo-500 shadow-md group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="ml-3 text-2xl font-extrabold tracking-tight text-indigo-700 group-hover:text-purple-700 transition-colors duration-200 font-sans drop-shadow-md">AvlokanIAS</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <Link href="/evaluation-plans">
                  <div className="flex flex-col items-center text-gray-700 hover:text-indigo-700 hover:underline underline-offset-8 decoration-2 transition-all duration-200">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs text-green-500">Popular</span>
                    </div>
                    <span>Evaluation Plans</span>
                  </div>
                </Link>
                {/* <div className="relative group">
                  <button
                    onClick={() => {
                      setIsPrelimsOpen(true);
                      router.push('/prelims');
                    }}
                    className="flex flex-col items-center text-gray-700 hover:text-indigo-700 hover:underline underline-offset-8 decoration-2 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      <span className="text-xs text-orange-500">New</span>
                    </div>
                    <span>Prelims</span>
                  </button>
                </div> */}
                {/* <Link href="/csat">
                  <div className="text-gray-700 hover:text-indigo-700 hover:underline underline-offset-8 decoration-2 transition-all duration-200">CSAT</div>
                </Link> */}
                {/* <Link href="/notes">
                  <div className="text-gray-700 hover:text-indigo-700 hover:underline underline-offset-8 decoration-2 transition-all duration-200">Notes</div>
                </Link> */}
                {/* <Link href="/mentored-answer-writing">
                  <div className="text-gray-700 hover:text-indigo-700 hover:underline underline-offset-8 decoration-2 transition-all duration-200">MAW</div>
                </Link> */}
                {/* <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-indigo-700 hover:underline underline-offset-8 decoration-2 transition-all duration-200">
                    <span>Videos</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute hidden group-hover:block w-52 bg-white/90 shadow-xl rounded-xl mt-2 py-2 border border-gray-100">
                    <Link href="/videos/current-affairs">
                      <div className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition">Current Affairs</div>
                    </Link>
                    <Link href="/videos/optional">
                      <div className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition">Optional Subjects</div>
                    </Link>
                    <Link href="/videos/strategy">
                      <div className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition">Strategy Sessions</div>
                    </Link>
                  </div>
                </div> */}
                <Link href="/contact">
                  <div className="text-gray-700 hover:text-indigo-700 hover:underline underline-offset-8 decoration-2 transition-all duration-200">Contact Us</div>
                </Link>
              </div>
            </div>

            {/* Right side - Mobile menu button and Auth */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-indigo-600 hover:text-indigo-800 focus:outline-none p-2 rounded-full bg-white/70 shadow-md border border-indigo-100 transition-all duration-200"
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
                  <div className="flex items-center space-x-4 bg-white/80 px-4 py-2 rounded-xl shadow border border-gray-100">
                    <span className="text-gray-700 font-semibold">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border border-indigo-300 rounded-lg text-indigo-700 font-semibold hover:bg-indigo-50 hover:text-indigo-900 transition-all duration-200 shadow-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 transform transition-all duration-300">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="block lg:hidden bg-white/95 shadow-2xl rounded-b-2xl border-t border-indigo-100 animate-fade-in-down">
            <div className="flex flex-col px-4 pt-4 pb-4 space-y-4">
              <Link href="/evaluation-plans" className="block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">
                Evaluation Plans
              </Link>
              {/* <Link href="/prelims" className="block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">
                Prelims
              </Link> */}
              {/* <Link href="/csat" className="block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">
                CSAT
              </Link> */}
              {/* <Link href="/notes" className="block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">
                Notes
              </Link> */}
              {/* <Link href="/mentored-answer-writing" className="block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">
                MAW
              </Link> */}
              {/* <Link href="/videos" className="block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">
                Videos
              </Link> */}
              <Link href="/contact" className="block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">
                Contact Us
              </Link>
              {!user && (
                <>
                  <Link href="/login" className="block w-full text-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transition-all duration-300">
                    Login
                  </Link>
                  <Link href="/register" className="block w-full text-center px-4 py-3 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200">
                    Register
                  </Link>
                </>
              )}
              {user && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-base font-semibold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
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