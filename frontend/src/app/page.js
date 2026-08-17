"use client";

export default function MenuPage() {
  return (
    <div className="py-8">
      <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">
          Welcome to the University Canteen
        </h1>
        <p className="text-emerald-800 font-medium">Pre-order your food, pick a time slot, and skip the queue during your break.</p>
      </div>

      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6">Today&apos;s Menu</h2>

      <div className="text-center py-12 text-gray-500 text-lg">Loading today&apos;s menu...</div>
    </div>
  );
}
