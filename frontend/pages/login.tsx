import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { getFirebaseAuth } from '../lib/firebase';

interface LoginResponse {
  success: boolean;
  token: string;
  message?: string;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');

  // Phone login state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const finishLogin = (token: string) => {
    localStorage.setItem('token', token);
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectPath);
    } else {
      router.push('/');
    }
  };

  const handleSendOtp = async () => {
    setPhoneError('');
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length !== 10) {
      setPhoneError('Enter a valid 10-digit mobile number');
      return;
    }
    const fullPhone = `+91${digits}`;

    setPhoneLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }
      const result = await signInWithPhoneNumber(auth, fullPhone, recaptchaVerifierRef.current);
      confirmationResultRef.current = result;
      setOtpSent(true);
    } catch (err: any) {
      setPhoneError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setPhoneError('');
    if (!otp || otp.length < 6) {
      setPhoneError('Enter the 6-digit code sent to your phone');
      return;
    }
    if (!confirmationResultRef.current) {
      setPhoneError('Please request an OTP first');
      return;
    }

    setPhoneLoading(true);
    try {
      const result = await confirmationResultRef.current.confirm(otp);
      const idToken = await result.user.getIdToken();
      const res = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/phone-auth`, {
        idToken
      });
      if (res.data.success) {
        finishLogin(res.data.token);
      }
    } catch (err: any) {
      setPhoneError(err.response?.data?.message || err.message || 'Invalid or expired OTP');
    } finally {
      setPhoneLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        email,
        password
      });

      if (res.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', res.data.token);
        
        // Check if there's a redirect path stored
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin'); // Clear the stored path
          router.push(redirectPath);
        } else {
          // Default redirect to home page
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const res = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/google-auth`, {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        picture: decoded.picture
      });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        // Check if there's a redirect path stored
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          router.push(redirectPath);
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-background py-12">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text">Welcome Back</h1>
            <p className="text-text-muted mt-2">
              Sign in to access your AvlokanIAS account
            </p>
          </div>

          <div className="flex mb-6 border border-gray-200 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => { setLoginMode('email'); setError(''); setPhoneError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${loginMode === 'email' ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-gray-50'}`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('phone'); setError(''); setPhoneError(''); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${loginMode === 'phone' ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-gray-50'}`}
            >
              Phone
            </button>
          </div>

          {loginMode === 'email' && error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {loginMode === 'phone' && phoneError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {phoneError}
            </div>
          )}

          {loginMode === 'email' ? (
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={onChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={onChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="•••••••••"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary py-2.5"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-text mb-1">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-text-muted">
                    +91
                  </span>
                  <input
                    id="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={otpSent}
                    className="w-full px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-text mb-1">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="6-digit code"
                    required
                  />
                  <p className="text-xs text-text-muted mt-1">Sent to +91{phoneNumber}</p>
                </div>
              )}

              <div>
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={phoneLoading}
                    className="w-full btn btn-primary py-2.5"
                  >
                    {phoneLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={phoneLoading}
                    className="w-full btn btn-primary py-2.5"
                  >
                    {phoneLoading ? 'Verifying...' : 'Verify & Sign In'}
                  </button>
                )}
              </div>

              {otpSent && (
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(''); confirmationResultRef.current = null; }}
                  className="text-sm text-primary hover:underline"
                >
                  Change number
                </button>
              )}

              <div id="recaptcha-container" />
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-text-muted">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Social Login Options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-muted">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Sign In was unsuccessful')}
                  useOneTap
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 