import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata = {
  title: 'AdminHub - Product Admin Dashboard',
  description: 'Frontend Product Admin Dashboard with INR pricing, search, filtering, pagination, and CRUD using DummyJSON API and Axios.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body className={`${fontSans.className} min-h-screen bg-[#F8FAFC] text-[#072D44] antialiased selection:bg-[#064469] selection:text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
