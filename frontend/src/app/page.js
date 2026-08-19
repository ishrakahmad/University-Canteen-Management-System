"use client";
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from './context/AppContext';

export default function MenuPage() {
  const { menuItems, loading, fetchMenu, categories, fetchCategories, token, addToCart, triggerNotification, cart, removeFromCart } = useContext(AppContext);
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const handleQuantityChange = (id, delta) => {
    setQuantities(prev => {
      const currentQty = prev[id] || 1;
      const newQty = currentQty + delta;
      return { ...prev, [id]: Math.max(1, newQty) };
    });
  };

  const handleAddToCart = (item) => {
    if (!token) {
      triggerNotification("Please log in to add items to your cart.");
      router.push('/login');
      return;
    }
    const finalQuantity = quantities[item.id] || 1;
    addToCart(item, finalQuantity);
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategoryId === 'all' || item.category?.id === selectedCategoryId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8">
      <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">
          Welcome to the University Canteen
        </h1>
        <p className="text-emerald-800 font-medium">Pre-order your food, pick a time slot, and skip the queue during your break.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Today&apos;s Menu</h2>
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="🔍 Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all shadow-sm"
          />
        </div>
      </div>

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
          {filteredItems.map((item) => {
            const qty = quantities[item.id] || 1;
            return (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <span className="text-emerald-600 font-bold text-lg">৳{Number(item.price).toFixed(2)}</span>
              </div>
              {item.description && <p className="text-gray-600 text-sm mb-4">{item.description}</p>}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-gray-200">
                <span className="text-sm font-bold text-gray-700 ml-2">Qty:</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleQuantityChange(item.id, -1)} className="w-8 h-8 rounded bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors">-</button>
                  <span className="font-bold w-4 text-center text-gray-900">{qty}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)} className="w-8 h-8 rounded bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors">+</button>
                </div>
              </div>
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full mt-3 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-colors"
              >
                Add to Cart
              </button>
            </div>
          );})}
        </div>
      )}

      {(cart || []).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 md:p-6 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex gap-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <span className="font-bold text-gray-900">{item.quantity}x</span>
                  <span className="text-gray-700">{item.name}</span>
                  <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500 hover:text-red-700 font-bold">✕</button>
                </div>
              ))}
            </div>
            <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl transition-colors shadow-lg">
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
