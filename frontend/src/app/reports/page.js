"use client";
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';

export default function ReportsPage() {
  const { token, userRole } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (userRole && userRole !== 'admin') {
      router.push('/dashboard');
    }
  }, [token, userRole]);

  if (!token || userRole !== 'admin') return null;

  return (
    <div className="py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Sales Reports</h2>
      <p className="text-gray-600 font-medium mb-8">See how the canteen is performing.</p>

      <div className="text-center py-12 text-gray-500 text-lg">Loading reports...</div>
    </div>
  );
}
