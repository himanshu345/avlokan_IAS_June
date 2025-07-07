import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';
import Head from 'next/head';

interface Submission {
  _id: string;
  question: string;
  answer: string;
  subject: string;
  status: 'pending' | 'evaluated';
  score?: number;
  feedback?: string;
  submissionDate: string;
  evaluation?: {
    evaluatedPdf?: {
      path: string;
    };
  };
}

interface SubmissionsResponse {
  success: boolean;
  submissions: Submission[];
  message?: string;
}

export default function Submissions() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState('');
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
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
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const res = await axios.get<SubmissionsResponse>('http://localhost:5000/api/evaluations/my-submissions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setSubmissions(res.data.submissions);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch submissions');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const subjects = ['all', 'geography', 'history', 'polity', 'economics', 'current-affairs'];

  const filteredSubmissions = selectedSubject === 'all'
    ? submissions
    : submissions.filter(submission => submission.subject.toLowerCase() === selectedSubject);

  const handlePDFUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadMessage('');
    setError('');
    setUploading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadMessage('Please select a PDF file to upload.');
      setUploading(false);
      return;
    }
    if (file.type !== 'application/pdf') {
      setUploadMessage('Only PDF files are allowed.');
      setUploading(false);
      return;
    }
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('subject', subject);
    try {
      const res = await axios.post('http://localhost:5000/api/evaluations/submit-answer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      const data: any = res.data;
      if (data.success) {
        setUploadMessage('PDF uploaded successfully!');
        setUploading(false);
        // Refresh submissions list
        setLoading(true);
        try {
          const submissionsRes = await axios.get<SubmissionsResponse>('http://localhost:5000/api/evaluations/my-submissions', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (submissionsRes.data.success) {
            setSubmissions(submissionsRes.data.submissions);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setUploadMessage(data.message || 'Failed to upload PDF.');
        setUploading(false);
        setLoading(false);
        if (data.message === 'You have used your 2 free uploads. Please subscribe to continue submitting answers.') {
          setTimeout(() => {
            router.push('/evaluation-plans');
          }, 2500); // Show message for 2.5 seconds before redirect
        }
      }
    } catch (err: any) {
      setUploadMessage(err.response?.data?.message || 'Failed to upload PDF.');
      setUploading(false);
      setLoading(false);
      if (err.response?.data?.message === 'You have used your 2 free uploads. Please subscribe to continue submitting answers.') {
        setTimeout(() => {
          router.push('/evaluation-plans');
        }, 2500);
      }
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>My Evaluations - AvlokanIAS</title>
      </Head>
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* PDF Upload Form */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
            <div className="text-center text-indigo-700 font-semibold text-lg mb-2">Get two of your answers evaluated for free</div>
            <h2 className="text-lg font-semibold mb-4 text-center">Submit Your Answer as PDF</h2>
            <form onSubmit={handlePDFUpload} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 mt-2"
              >
                {uploading ? 'Uploading...' : 'Upload PDF'}
              </button>
            </form>
            {uploadMessage && (
              <div className={`mt-4 text-center ${uploadMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {uploadMessage}
              </div>
            )}
          </div>

          {/* Subject Filter */}
          <div className="mb-8">
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                    selectedSubject === subject
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {subject.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-6">
            {filteredSubmissions.map((submission) => (
              <div key={submission._id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                      {submission.subject}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      submission.status === 'evaluated'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{submission.question}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{submission.answer}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Submitted on {new Date(submission.submissionDate).toLocaleDateString()}
                    </span>
                    {/* Evaluated PDF link */}
                    {submission.evaluation?.evaluatedPdf?.path && (
                      <a
                        href={`http://localhost:5000${submission.evaluation.evaluatedPdf.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 underline ml-4"
                      >
                        View Evaluated PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No submissions found in this subject.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}