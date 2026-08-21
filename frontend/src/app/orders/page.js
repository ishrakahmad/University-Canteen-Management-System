"use client";
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';

export default function MyOrdersPage() {
  const { token } = useContext(AppContext);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [token]);

  if (!token) return null;

  return (
    <div className="py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">My Orders</h2>
      <p className="text-gray-600 font-medium mb-8">Track the status of your canteen pre-orders.</p>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading your orders...</div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <span className="text-lg font-bold text-gray-900">Order #{order.id}</span>
              <span className="ml-3 text-sm text-gray-500 font-medium">{order.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
