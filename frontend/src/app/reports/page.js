"use client";
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';

export default function ReportsPage() {
  const { token, userRole } = useContext(AppContext);
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const summaryRes = await api.get('/reports/sales-summary?range=daily');
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (userRole && userRole !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchReports();
  }, [token, userRole]);

  if (!token || userRole !== 'admin') return null;

  return (
    <div className="py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Sales Reports</h2>
      <p className="text-gray-600 font-medium mb-8">See how the canteen is performing.</p>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading reports...</div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-sm">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Orders (daily)</p>
          <p className="text-4xl font-extrabold text-gray-900">{summary?.totalOrders ?? 0}</p>
        </div>
      )}
    </div>
  );
}
