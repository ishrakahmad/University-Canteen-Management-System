"use client";
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';

export default function DashboardPage() {
  const { token, userRole, triggerNotification } = useContext(AppContext);
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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      triggerNotification(`Order #${orderId} is now ${newStatus.toUpperCase()}`);
      fetchOrders();
    } catch (error) {
      triggerNotification(error.response?.data?.message || "Failed to update status");
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-4 text-gray-900 font-bold">Order</th>
                <th className="py-3 px-4 text-gray-900 font-bold">Status</th>
                <th className="py-3 px-4 text-gray-900 font-bold">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-bold text-gray-900">#{order.id}</td>
                  <td className="py-3 px-4 text-gray-600">{order.status}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
