import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';

interface EvaluationStats {
  totalSubmissions: number;
  pendingSubmissions: number;
  evaluatedSubmissions: number;
  averageScore: number;
}

interface EvaluationStatsResponse {
  success: boolean;
  stats: EvaluationStats;
  message?: string;
}

interface SubmissionsApiResponse {
  success: boolean;
  submissions: any[];
  message?: string;
}

export default function Evaluations() {
  const router = useRouter();
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [evaluatedSubmissions, setEvaluatedSubmissions] = useState<any[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchEvaluationStats = async () => {
      try {
        const res = await axios.get<EvaluationStatsResponse>(`${API_URL}/api/evaluations/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch evaluation statistics');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationStats();
  }, [router, API_URL]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const fetchEvaluated = async () => {
      try {
        const res = await axios.get<SubmissionsApiResponse>(`${API_URL}/api/evaluations/my-submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setEvaluatedSubmissions(res.data.submissions.filter((s: any) => s.evaluation && s.evaluation.evaluatedPdf && s.evaluation.evaluatedPdf.key));
        }
      } catch (err) {
        // ignore for now
      }
    };
    fetchEvaluated();
  }, [API_URL]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleDownload = async (key: string) => {
    const token = localStorage.getItem('token');
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
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Total Submissions</h3>
              <p className="text-3xl font-bold text-indigo-600">{stats?.totalSubmissions || 0}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Evaluations</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats?.pendingSubmissions || 0}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Evaluated</h3>
              <p className="text-3xl font-bold text-green-600">{stats?.evaluatedSubmissions || 0}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Average Score</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats?.averageScore ? stats.averageScore.toFixed(1) : '0.0'}/25
              </p>
            </div>
          </div>

          {evaluatedSubmissions.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Evaluated Answers</h2>
              <ul className="divide-y divide-gray-200">
                {evaluatedSubmissions.map((sub) => (
                  <li key={sub._id} className="py-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{sub.subject}</div>
                      <div className="text-sm text-gray-500">Submitted on {new Date(sub.submissionDate).toLocaleDateString()}</div>
                      <div className="text-sm text-indigo-700 font-semibold mt-1">
                        Obtained marks: {sub.evaluation?.totalScore ?? 'N/A'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(sub.evaluation.evaluatedPdf.key)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Download Evaluated PDF
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Performance Chart */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Performance chart will be displayed here</p>
            </div>
          </div>

          {/* Subject-wise Performance */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Subject-wise Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Geography</span>
                  <span className="text-sm font-medium text-gray-700">7.5/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">History</span>
                  <span className="text-sm font-medium text-gray-700">8.0/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Polity</span>
                  <span className="text-sm font-medium text-gray-700">7.0/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Economics</span>
                  <span className="text-sm font-medium text-gray-700">8.5/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 