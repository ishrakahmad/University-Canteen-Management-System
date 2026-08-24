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
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Sales Reports</h2>
          <p className="text-gray-600 font-medium">See how the canteen is performing.</p>
        </div>
        <div className="flex gap-2">
          {['daily', 'weekly'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm capitalize ${
                range === r ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading reports...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                Total Orders ({range})
              </p>
              <p className="text-4xl font-extrabold text-gray-900">{summary?.totalOrders ?? 0}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                Total Revenue ({range})
              </p>
              <p className="text-4xl font-extrabold text-emerald-600">৳{Number(summary?.totalRevenue ?? 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Best-Selling Items</h3>
            {bestSellers.length === 0 ? (
              <div className="text-gray-500 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center font-medium">
                No sales data yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {bestSellers.map((item, index) => {
                  const maxSold = bestSellers[0]?.totalSold || 1;
                  const widthPct = Math.max(8, (item.totalSold / maxSold) * 100);
                  return (
                    <div key={item.menuItemId} className="flex items-center gap-4">
                      <span className="w-6 text-gray-400 font-bold">#{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-gray-900">{item.name}</span>
                          <span className="text-gray-600 font-medium">{item.totalSold} sold</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className="bg-emerald-600 h-3 rounded-full transition-all"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
