import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Ticket, Heart, Bell, Menu as MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <Ticket className="text-white fill-white" size={20} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">Movie<span className="text-primary italic">Ticket</span></span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Movies</Link>
            <Link to="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Cinemas</Link>
            <Link to="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Deals</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
                <Bell size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
                <Heart size={20} />
              </Button>
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
              <Link to="/profile" className="flex items-center gap-3 group/user cursor-pointer">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-bold text-white group-hover/user:text-primary transition-colors">{user?.username}</span>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">VIP Member</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 font-black text-sm group-hover/user:border-primary/50 transition-all shadow-lg group-hover/user:shadow-primary/20">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-colors ml-1"
              >
                <LogOut size={20} />
              </Button>

            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">Sign Up</Button>
              </Link>
            </div>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden rounded-xl text-slate-400">
            <MenuIcon size={24} />
          </Button>
        </div>
      </div>
    </nav>
  );
};
