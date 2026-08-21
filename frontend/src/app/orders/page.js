"use client";
import { useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';

const STATUS_STEPS = ['pending', 'preparing', 'ready', 'completed'];

const statusBadge = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'preparing': return 'bg-blue-100 text-blue-800';
    case 'ready': return 'bg-emerald-100 text-emerald-800';
    case 'completed': return 'bg-gray-200 text-gray-800';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function MyOrdersPage() {
  const { token, userId, userRole } = useContext(AppContext);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = useCallback(async () => {
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
  }, [userId]);

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">My Orders</h2>
          <p className="text-gray-600 font-medium">Track the status of your canteen pre-orders.</p>
        </div>
        <Link href="/" className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-colors">
          + New Order
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="text-emerald-700 font-bold hover:underline">Browse the menu →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => {
            const currentStepIndex = STATUS_STEPS.indexOf(order.status);
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">Order #{order.id}</span>
                    <span className="ml-3 text-sm text-gray-500 font-medium">
                      Pickup: {order.pickupTime || 'N/A'}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center mb-5">
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
                <div className="flex justify-between text-xs text-gray-500 font-bold uppercase mb-5 -mt-3">
                  <span>Pending</span><span>Preparing</span><span>Ready</span><span>Completed</span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    {order.items?.map((i) => (
                      <div key={i.id} className="flex justify-between">
                        <span>{i.quantity}x {i.menuItem?.name || 'Item'}</span>
                        <span>৳{(Number(i.unitPrice) * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-emerald-600">৳{Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
