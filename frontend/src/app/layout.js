import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import './globals.css';

export const metadata = {
  title: 'UCMS - University Canteen',
  description: 'University Canteen Management System - order food, skip the queue',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <AppProvider>
          <Navbar />
          <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
