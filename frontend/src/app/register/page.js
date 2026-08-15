"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-gray-200 shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Create Account</h2>
        <p className="text-gray-600 text-center mb-8 font-medium">Join UCMS to pre-order from the canteen.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            className="block w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="block w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="block w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
          />
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
