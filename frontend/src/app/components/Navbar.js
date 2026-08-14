"use client";
import Link from 'next/link';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  const { token, logout } = useContext(AppContext);

  return (
    <nav className="flex justify-between items-center py-5 px-10 bg-white border-b border-gray-200">
      <Link href="/" className="text-2xl font-bold text-gray-900">🍽️ UCMS Canteen</Link>

      <div className="flex gap-6 items-center">
        <Link href="/" className="text-gray-900 font-medium hover:text-gray-600 transition-colors">
          Menu
        </Link>

        {token ? (
          <button onClick={logout} className="text-red-600 font-medium hover:text-red-800 transition-colors">
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="text-gray-900 font-medium hover:text-gray-600 transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-gray-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
