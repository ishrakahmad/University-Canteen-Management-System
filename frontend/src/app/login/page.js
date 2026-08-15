"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const inputClass = "block w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all";

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-gray-200 shadow-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-center mb-8 font-medium">Sign in to your account.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit"
            className="w-full py-4 mt-2 bg-gray-900 hover:bg-black text-white font-bold text-lg rounded-lg transition-colors shadow-md"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 font-medium">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-emerald-700 font-extrabold hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
