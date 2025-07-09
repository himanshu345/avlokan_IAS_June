import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface ProfileResponse {
  success: boolean;
  user: User;
  message?: string;
}

interface Submission {
  _id: string;
  user: { _id: string; name: string; email: string };
  subject: string;
  status: string;
  fileAttachments: { filename: string; path: string; originalname?: string; key?: string; url?: string }[];
  evaluation?: {
    _id: string;
    evaluatedPdf?: { path: string; url?: string };
  };
}

interface SubmissionsApiResponse {
  success: boolean;
  submissions: Submission[];
}

interface EvaluationCreateResponse {
  evaluation: { _id: string };
  [key: string]: any;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchSubmissions = async (userObj = user) => {
    if (userObj && userObj.role === 'admin') {
      const token = localStorage.getItem('token');
      const res = await axios.get<SubmissionsApiResponse>(`${API_URL}/api/evaluations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSubmissions(res.data.submissions);
      }
    }
  };

  const handleDownload = async (key: string) => {
    const token = localStorage.getItem('token');
    // Use local backend for download API
    const res = await fetch(`${API_URL}/api/evaluations/download?key=${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.url) {
      window.open(data.url, '_blank');
    } else {
      alert('Download failed');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get<ProfileResponse>(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setUser(res.data.user);
          if (res.data.user.role === 'admin') {
            setIsAdmin(true);
            fetchSubmissions(res.data.user);
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
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
      <Navbar user={user ? { id: (user as any)._id, name: user.name, email: user.email, role: user.role } : null} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        {isAdmin && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">All User Submissions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Subject</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Submitted PDF</th>
                    <th className="px-4 py-2">Evaluated PDF</th>
                    <th className="px-4 py-2">Upload Evaluated PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub._id}>
                      <td className="border px-4 py-2">{sub.user?.name}</td>
                      <td className="border px-4 py-2">{sub.user?.email}</td>
                      <td className="border px-4 py-2">{sub.subject}</td>
                      <td className="border px-4 py-2">{sub.status}</td>
                      <td className="border px-4 py-2">
                        {sub.fileAttachments && sub.fileAttachments.length > 0 && sub.fileAttachments[0].key ? (
                          <a href="#" onClick={() => handleDownload(sub.fileAttachments[0].key!)} className="text-indigo-600 underline">
                            Download
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td className="border px-4 py-2">
                        {sub.evaluation?.evaluatedPdf?.url ? (
                          <a href={sub.evaluation.evaluatedPdf.url} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">View</a>
                        ) : 'Not Uploaded'}
                      </td>
                      <td className="border px-4 py-2">
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const file = (e.target as any).elements.evaluatedPdf.files[0];
                            if (!file) return alert('Select a PDF');
                            const formData = new FormData();
                            formData.append('evaluatedPdf', file);
                            const token = localStorage.getItem('token');
                            let evaluationId = sub.evaluation?._id;
                            if (!evaluationId) {
                              try {
                                const evalRes = await axios.post<EvaluationCreateResponse>(
                                  `${API_URL}/api/evaluations/evaluate/${sub._id}`,
                                  {
                                    scores: {
                                      understanding: 5,
                                      structure: 5,
                                      relevance: 5,
                                      language: 5,
                                      examples: 5
                                    },
                                    totalScore: 25,
                                    feedback: {
                                      general: 'Evaluated PDF uploaded.',
                                      strengths: [],
                                      areasForImprovement: [],
                                      specificComments: []
                                    },
                                    status: 'completed'
                                  },
                                  { headers: { Authorization: `Bearer ${token}` } }
                                );
                                if (evalRes.data && evalRes.data.evaluation && evalRes.data.evaluation._id) {
                                  evaluationId = evalRes.data.evaluation._id;
                                } else {
                                  alert('Failed to create evaluation');
                                  return;
                                }
                              } catch (err) {
                                alert('Failed to create evaluation');
                                return;
                              }
                            }
                            // Only upload evaluated PDF if we have an evaluationId
                            if (evaluationId) {
                              await axios.post(
                                `${API_URL}/api/evaluations/evaluate/${evaluationId}/evaluated-pdf`,
                                formData,
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              alert('Evaluated PDF uploaded!');
                              fetchSubmissions();
                            } else {
                              alert('No evaluation ID found.');
                            }
                          }}
                        >
                          <input
                            type="file"
                            name="evaluatedPdf"
                            accept="application/pdf"
                            className="mb-2"
                          />
                          <button
                            type="submit"
                            className="bg-indigo-600 text-white px-3 py-1 rounded"
                          >
                            Upload
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h2>
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">{user?.name}</p>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Submissions</h3>
              <p className="text-gray-600 mb-4">View your answer submissions</p>
              <button
                onClick={() => router.push('/submissions')}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                View Submissions
              </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluations</h3>
              <p className="text-gray-600 mb-4">Check your evaluation results</p>
              <button
                onClick={() => router.push('/evaluations')}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                View Evaluations
              </button>
              </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 