"use client";
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';

export default function DashboardPage() {
  const { token, userRole } = useContext(AppContext);
  const router = useRouter();

  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'staff';

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (userRole && userRole !== 'admin' && userRole !== 'staff') {
      router.push('/');
      return;
    }
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [token, userRole]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isAdmin && !isStaff) return null;

  return (
    <div className="py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
        {isAdmin ? 'Admin Dashboard' : 'Staff Dashboard'}
      </h2>
      <p className="text-gray-600 font-medium mb-8">Manage the canteen menu and incoming orders.</p>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Incoming Orders</h3>
        {loadingOrders ? (
          <div className="text-gray-500 font-medium">Loading orders...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map(order => (
              <div key={order.id} className="border-b border-gray-100 pb-3">
                <span className="font-bold text-gray-900">#{order.id}</span>
                <span className="ml-3 text-gray-600">{order.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
