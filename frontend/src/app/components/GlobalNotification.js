"use client";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function GlobalNotification() {
  const { notification } = useContext(AppContext);

  if (!notification) return null;

  return (
    <div className="bg-emerald-500 text-white text-center py-3 font-bold sticky top-0 z-50 shadow-md">
      {notification}
    </div>
  );
}
