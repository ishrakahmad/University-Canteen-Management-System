"use client";
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';

export default function ChangePasswordPage() {
  const { token } = useContext(AppContext);
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="password"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={inputClass}
            placeholder="Enter current password"
          />
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
            placeholder="Enter new password"
          />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            placeholder="Confirm new password"
          />
          <button
            type="submit"
            className="w-full py-4 mt-4 bg-gray-900 hover:bg-black text-white font-bold text-lg rounded-lg transition-colors shadow-md"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
