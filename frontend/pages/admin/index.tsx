import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Submission {
  _id: string;
  user: User;
  subject: string;
  status: string;
  fileAttachments: { filename: string; path: string; }[];
  evaluation?: { feedback: string; };
  evaluatedFile?: { filename: string; path: string; };
  submissionDate: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'users' | 'submissions'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    // Fetch profile to check admin
    axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const data = res.data as { user: User };
        setUser(data.user);
        if (data.user.role !== 'admin') {
          router.push('/');
        } else {
          fetchData(token);
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      const [usersRes, submissionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/evaluations', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers((usersRes.data as { users: User[] }).users || (usersRes.data as User[]));
      setSubmissions((submissionsRes.data as { submissions: Submission[] }).submissions || (submissionsRes.data as Submission[]));
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (filePath: string) => {
    window.open(`http://localhost:5000/${filePath}`, '_blank');
  };

  const handleEvaluatedUpload = async (submissionId: string, file: File) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const formData = new FormData();
    formData.append('evaluatedPdf', file);
    await axios.post(`http://localhost:5000/api/evaluations/evaluate/${submissionId}`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    // Refresh submissions
    fetchData(token);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-6 flex gap-4">
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Users</button>
        <button onClick={() => setTab('submissions')} className={`px-4 py-2 rounded ${tab === 'submissions' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Submissions</button>
      </div>
      {tab === 'users' && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'submissions' && (
        <div className="bg-white rounded shadow p-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">Submissions</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">User</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Status</th>
                <th className="p-2">Submitted PDF</th>
                <th className="p-2">Evaluated PDF</th>
                <th className="p-2">Upload Evaluated</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub._id} className="border-b">
                  <td className="p-2">{sub.user?.name || 'N/A'}</td>
                  <td className="p-2">{sub.subject}</td>
                  <td className="p-2">{sub.status}</td>
                  <td className="p-2">
                    {sub.fileAttachments && sub.fileAttachments.length > 0 && (
                      <button className="text-blue-600 underline" onClick={() => handleDownload(sub.fileAttachments[0].path)}>Download</button>
                    )}
                  </td>
                  <td className="p-2">
                    {sub.evaluatedFile?.path ? (
                      <button className="text-green-600 underline" onClick={() => handleDownload(sub.evaluatedFile!.path)}>Download</button>
                    ) : 'Not uploaded'}
                  </td>
                  <td className="p-2">
                    <input type="file" accept="application/pdf" onChange={e => {
                      if (e.target.files && e.target.files[0]) handleEvaluatedUpload(sub._id, e.target.files[0]);
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 