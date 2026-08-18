"use client";
import { useContext, useEffect, useState } from 'react';
import { AppContext } from './context/AppContext';

export default function MenuPage() {
  const { menuItems, loading, fetchMenu, categories, fetchCategories } = useContext(AppContext);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const filteredItems = menuItems.filter(item =>
    selectedCategoryId === 'all' || item.category?.id === selectedCategoryId
  );

  return (
    <div className="py-8">
      <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">
          Welcome to the University Canteen
        </h1>
        <p className="text-emerald-800 font-medium">Pre-order your food, pick a time slot, and skip the queue during your break.</p>
      </div>

      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">Today&apos;s Menu</h2>

      {!loading && (
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
              selectedCategoryId === 'all' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
            }`}
          >
            All Items
          </button>
          {categories?.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                selectedCategoryId === cat.id ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">Loading today&apos;s menu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <span className="text-emerald-600 font-bold text-lg">৳{Number(item.price).toFixed(2)}</span>
              </div>
              {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
