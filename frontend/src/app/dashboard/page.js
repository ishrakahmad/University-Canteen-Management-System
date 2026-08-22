"use client";
import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';

export default function DashboardPage() {
  const { token, userRole } = useContext(AppContext);
  const router = useRouter();

  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'staff';

  useEffect(() => {
    if (userRole && userRole !== 'admin' && userRole !== 'staff') {
      router.push('/');
      return;
    }
    if (!token) {
      router.push('/login');
    }
  }, [token, userRole]);

  if (!isAdmin && !isStaff) return null;

  return (
    <div className="py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
        {isAdmin ? 'Admin Dashboard' : 'Staff Dashboard'}
      </h2>
      <p className="text-gray-600 font-medium">Manage the canteen menu and incoming orders.</p>
    </div>
  );
}
