"use client";
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/axios';
import { Suspense } from 'react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/auth/reset-password', { 
        token, 
        newPassword 
      });
      setMessage(response.data.message);

      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-6 bg-red-50 text-red-800 rounded-xl border border-red-200 font-bold">
        Missing reset token. Please use the link sent to your email.
        <div className="mt-4">
          <Link href="/forgot-password" className="text-emerald-600 hover:text-emerald-700 underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {message && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-bold border border-emerald-200 text-center">
          {message}
          <p className="mt-2 text-xs">Redirecting to login...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm font-bold border border-red-200 text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="new-password" className="sr-only">New Password</label>
          <input
            id="new-password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm font-medium bg-gray-50"
            placeholder="New Password"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm font-medium bg-gray-50"
            placeholder="Confirm New Password"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading || message !== ''}
          className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save New Password'}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Create New Password
          </h2>
          <p className="mt-4 text-center text-sm text-gray-600 font-medium">
            Please enter your new password below.
          </p>
        </div>
        
        <Suspense fallback={<div className="text-center py-10 font-bold text-gray-500">Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}