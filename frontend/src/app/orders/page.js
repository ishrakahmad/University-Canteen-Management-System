"use client";
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';

export default function MyOrdersPage() {
  const { token } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token]);

  if (!token) return null;

  return (
    <div className="py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">My Orders</h2>
      <p className="text-gray-600 font-medium mb-8">Track the status of your canteen pre-orders.</p>
      <div className="text-center py-12 text-gray-500 text-lg">Loading your orders...</div>
    </div>
  );
}
