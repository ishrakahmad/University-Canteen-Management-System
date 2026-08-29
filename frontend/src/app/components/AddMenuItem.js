"use client";
import { useState, useContext } from 'react';
import api from '../lib/axios';
import { AppContext } from '../context/AppContext';

export default function AddMenuItem({ onAddSuccess }) {
  const { triggerNotification } = useContext(AppContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/menu', {
        name,
        description,
        price: parseFloat(price),
        isAvailable: true,
        isAvailableToday: true,
      });
      triggerNotification(`Successfully added ${name} to the menu!`);
      setName('');
      setDescription('');
      setPrice('');
      if (onAddSuccess) onAddSuccess();
    } catch (err) {
      triggerNotification(err.response?.data?.message || 'Failed to add menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Menu Item</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
          />
          <input
            type="number"
            placeholder="Price (৳)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
            className="p-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
          />
        </div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="p-4 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all resize-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold text-lg rounded-lg transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}
