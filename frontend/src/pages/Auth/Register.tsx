import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';


export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords don't match");
    }
    setLoading(true);
    
    try {
      await register({ 
        username, 
        email, 
        password 
      });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617] relative overflow-hidden">

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1440404653322-9ff142b20fb9?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-[0.03]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-primary/80 mb-6 shadow-2xl shadow-primary/30 cinema-glow border border-white/10"
          >
            <UserPlus className="text-white w-10 h-10" />
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">
            <span className="text-white">Join</span> <span className="text-primary italic">CineMagic</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">Create an account to start your journey</p>
        </div>

        <Card className="border border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[3rem] overflow-hidden">
          <CardHeader className="p-8 pb-0 text-center">
            <CardTitle className="text-3xl text-white font-black tracking-tight mb-2">Sign Up</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Join thousands of movie lovers today
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <User className="text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                  </div>
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-14 pl-12 bg-white/5 border-white/5 text-white placeholder:text-slate-600 rounded-2xl focus:bg-white/10 focus:ring-primary/20 transition-all duration-300 ring-offset-slate-950"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className="text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-12 bg-white/5 border-white/5 text-white placeholder:text-slate-600 rounded-2xl focus:bg-white/10 focus:ring-primary/20 transition-all duration-300 ring-offset-slate-950"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 pl-12 bg-white/5 border-white/5 text-white placeholder:text-slate-600 rounded-2xl focus:bg-white/10 focus:ring-primary/20 transition-all duration-300 ring-offset-slate-950"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Lock className="text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                  </div>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-14 pl-12 bg-white/5 border-white/5 text-white placeholder:text-slate-600 rounded-2xl focus:bg-white/10 focus:ring-primary/20 transition-all duration-300 ring-offset-slate-950"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300" 
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="p-8 pt-0 border-t border-white/5 bg-white/[0.02]">
            <p className="text-slate-400 text-center w-full font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-black transition-colors underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

