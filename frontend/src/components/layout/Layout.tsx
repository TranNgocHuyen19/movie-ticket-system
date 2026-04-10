import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Toaster } from '@/components/ui/sonner';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200 antialiased">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-slate-950 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-xl font-black text-white tracking-tighter">Movie<span className="text-primary italic">Ticket</span></span>
              <p className="text-sm text-slate-500 max-w-xs text-center md:text-left">
                The ultimate movie booking experience. Get your tickets in seconds.
              </p>
            </div>
            <div className="flex gap-8 text-sm font-bold text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-xs text-slate-600">
              © 2024 MovieTicket. All rights reserved. Built with ❤️ for cinema lovers.
            </p>
          </div>
        </div>
      </footer>
      <Toaster position="top-center" expand={true} richColors theme="dark" />
    </div>
  );
};
