"use client";
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';

export default function ChangePasswordPage() {
  const { token } = useContext(AppContext);
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (oldPassword === newPassword) {
      setError('New password must be different from your current password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword
      });

      setMessage(response.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Make sure your current password is correct.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "block w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all";

  if (!token) return null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl border border-gray-200 shadow-lg">

        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Change Password
        </h2>
        <p className="text-gray-600 text-center mb-8 font-medium">
          Secure your account with a new password.
        </p>

        {message && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-bold border border-emerald-200 text-center mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm font-bold border border-red-200 text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Current Password</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={inputClass}
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-gray-900 hover:bg-black text-white font-bold text-lg rounded-lg transition-colors shadow-md disabled:bg-gray-400"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
