"use client";
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import api from '../lib/axios';
import AddMenuItem from '../components/AddMenuItem';

export default function DashboardPage() {
  const { token, userRole, triggerNotification, menuItems, fetchMenu, categories, fetchCategories } = useContext(AppContext);
  const router = useRouter();

  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'staff';

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');

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
    fetchMenu();
    fetchCategories();
  }, [token, userRole]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name: newCategoryName });
      triggerNotification(`Category "${newCategoryName}" created successfully.`);
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      triggerNotification(error.response?.data?.message || "Failed to create category.");
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete the "${name}" category?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      triggerNotification(`Category "${name}" deleted successfully.`);
      fetchCategories();
      fetchMenu();
    } catch (error) {
      triggerNotification(error.response?.data?.message || "Failed to delete category.");
    }
  };

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

      {isAdmin && <AddMenuItem onAddSuccess={() => fetchMenu()} />}

      {isAdmin && (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Category Management</h3>
          <form onSubmit={handleCreateCategory} className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:border-emerald-500"
              required
            />
            <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">
              Add Category
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <div key={cat.id} className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-800 rounded-full text-sm font-bold flex items-center gap-3">
                <span>{cat.name}</span>
                <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="text-gray-400 hover:text-red-600">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

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
