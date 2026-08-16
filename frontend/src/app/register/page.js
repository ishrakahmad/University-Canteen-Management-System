"use client";
import { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';
import { AppContext } from '../context/AppContext';

export default function RegisterPage() {
  const router = useRouter();
  const { triggerNotification } = useContext(AppContext);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/register', formData);
      triggerNotification("Account created successfully! Please log in.");
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-gray-200 shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Create Account</h2>
        <p className="text-gray-600 text-center mb-8 font-medium">Join UCMS to pre-order from the canteen.</p>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-bold text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="block w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
            className="block w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            required
            onChange={handleChange}
            className="block w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
          />

          <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all cursor-pointer"
            >
              <option value="student">Student</option>
              <option value="staff">Canteen Staff</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">For demo purposes only — in production, staff/admin accounts would be created by the canteen owner.</p>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-lg transition-colors shadow-md"
          >
            Register
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-700 font-extrabold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
