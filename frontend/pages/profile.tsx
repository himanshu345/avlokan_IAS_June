import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Head from 'next/head';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setForm({ name: data.user.name, email: data.user.email, bio: data.user.bio || '' });
          setProfilePic(data.user.profilePicture || null);
          if (data.user.subscriptionPlan) setSubscription(data.user.subscriptionPlan);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {}
    };
    fetchProfile();
    fetchOrders();
  }, []);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({ name: user.name, email: user.email, bio: user.bio || '' });
  };
  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEditMode(false);
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', file);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/users/profile-picture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setProfilePic(data.profilePicture);
        setUser((u: any) => ({ ...u, profilePicture: data.profilePicture }));
      }
    } catch (err) {} finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Profile - AvlokanIAS</title>
      </Head>
      <Navbar user={user} />
      <main className="max-w-3xl mx-auto pt-28 pb-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <div className="relative mb-6">
            <img
              src={
                profilePic && profilePic.startsWith('http')
                  ? profilePic
                  : '/images/default-profile.png'
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow"
            />
            <button
              className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13h6m2 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
              </svg>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </div>
          <div className="w-full text-center">
            {editMode ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full mb-2"
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full mb-2"
                  placeholder="Email"
                  disabled
                />
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full mb-2"
                  placeholder="Bio"
                  rows={3}
                />
                <div className="flex justify-center gap-4 mt-2">
                  <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Save</button>
                  <button onClick={handleCancel} className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-gray-600 mb-2">{user.email}</p>
                {user.bio && <p className="text-gray-500 mb-2">{user.bio}</p>}
                <button onClick={handleEdit} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 mt-2">Edit Profile</button>
              </>
            )}
          </div>
        </div>
        {/* Subscription Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h3 className="text-xl font-semibold mb-4">Subscription</h3>
          {subscription ? (
            <div>
              <p className="mb-2"><span className="font-semibold">Plan:</span> {subscription.title || subscription.name || 'N/A'}</p>
              <p className="mb-2"><span className="font-semibold">Expiry:</span> {user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : 'N/A'}</p>
            </div>
          ) : (
            <p className="text-gray-500">No active subscription.</p>
          )}
        </div>
        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h3 className="text-xl font-semibold mb-4">Orders</h3>
          {orders.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {orders.map((order: any) => (
                <li key={order._id} className="py-2 flex justify-between items-center">
                  <span>Order #{order._id.slice(-6)}</span>
                  <span className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="text-indigo-700 font-semibold">₹{order.amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No orders found.</p>
          )}
        </div>
      </main>
    </div>
  );
} 