"use client";
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';

export default function ReportsPage() {
  const { token, userRole } = useContext(AppContext);
  const router = useRouter();
  const [range, setRange] = useState('daily');
  const [summary, setSummary] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async (selectedRange) => {
    setLoading(true);
    try {
      const [summaryRes, bestRes] = await Promise.all([
        api.get(`/reports/sales-summary?range=${selectedRange}`),
        api.get('/reports/best-sellers?limit=5'),
      ]);
      setSummary(summaryRes.data);
      setBestSellers(bestRes.data);
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
    fetchReports(range);
  }, [token, userRole, range]);

  if (!token || userRole !== 'admin') return null;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Sales Reports</h2>
          <p className="text-gray-600 font-medium">See how the canteen is performing.</p>
        </div>
        <div className="flex gap-2">
          {['daily', 'weekly'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm capitalize ${range === r ? 'bg-emerald-700 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading reports...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-sm">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Orders ({range})</p>
            <p className="text-4xl font-extrabold text-gray-900">{summary?.totalOrders ?? 0}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Best-Selling Items</h3>
            <ul className="flex flex-col gap-2">
              {bestSellers.map((item) => (
                <li key={item.menuItemId} className="flex justify-between text-gray-700 font-medium">
                  <span>{item.name}</span>
                  <span>{item.totalSold} sold</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
