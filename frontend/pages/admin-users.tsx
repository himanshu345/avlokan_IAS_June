import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

interface Profile {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const ROLES = ['user', 'evaluator', 'admin'];

export default function AdminUsers() {
  const router = useRouter();
  const [me, setMe] = useState<Profile | null>(null);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const load = async () => {
      try {
        const profileRes = await axios.get<{ success: boolean; user: Profile }>(
          `${API_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!profileRes.data.success || profileRes.data.user.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        setMe(profileRes.data.user);

        const usersRes = await axios.get<{ success: boolean; users: ManagedUser[] }>(
          `${API_URL}/api/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (usersRes.data.success) {
          setUsers(usersRes.data.users);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load users');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const token = localStorage.getItem('token');
    const previous = users;
    setSavingId(userId);
    setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));

    try {
      const res = await axios.put<{ success: boolean; message?: string }>(
        `${API_URL}/api/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to update role');
      }
    } catch (err: any) {
      setUsers(previous);
      alert(err.response?.data?.message || 'Failed to update role');
    } finally {
      setSavingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q);
  });

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
            onClick={() => router.push('/dashboard')}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={me ? { id: me._id, name: me.name, email: me.email, role: me.role } : null} />
      <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-700">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={savingId === u._id || u._id === me?._id}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 capitalize focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        title={u._id === me?._id ? "You can't change your own role" : undefined}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r} className="capitalize">
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
