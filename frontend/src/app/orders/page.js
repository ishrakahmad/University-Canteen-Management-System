"use client";
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';

const STATUS_STEPS = ['pending', 'preparing', 'ready', 'completed'];

export default function MyOrdersPage() {
  const { token, userId, userRole } = useContext(AppContext);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      const mine = response.data.filter(
        (order) => String(order.customer?.id) === String(userId)
      );
      mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(mine);
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
    if (userRole && userRole !== 'student') {
      router.push('/dashboard');
      return;
    }
    if (userId) fetchMyOrders();
  }, [token, userId, userRole]);

  if (!token) return null;

  return (
    <div className="py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">My Orders</h2>
      <p className="text-gray-600 font-medium mb-8">Track the status of your canteen pre-orders.</p>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading your orders...</div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => {
            const currentStepIndex = STATUS_STEPS.indexOf(order.status);
            return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <span className="text-lg font-bold text-gray-900">Order #{order.id}</span>
              <span className="ml-3 text-sm text-gray-500 font-medium">{order.status}</span>

              <div className="flex items-center mt-4">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                      ${i <= currentStepIndex ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {i + 1}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 rounded ${i < currentStepIndex ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}
