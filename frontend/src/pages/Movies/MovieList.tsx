import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Star, Calendar, Clock, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { movieService } from '@/services';
import type { Movie, Category } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [movieRes, catRes] = await Promise.all([
          movieService.getAllMovies(),
          movieService.getAllCategories()
        ]);
        
        if (movieRes.success) setMovies(movieRes.data);
        if (catRes.success) setCategories(catRes.data);
      } catch (error: any) {
        // toast.error('Failed to load movie data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || movie.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-20">
      <header className="relative min-h-[400px] flex items-center px-8 overflow-hidden rounded-[2rem] bg-slate-900 border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10" />
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059")' }} 
        />
        
        <div className="relative z-20 max-w-3xl">
          <div>
            <Badge className="mb-4 h-7 px-4 bg-red-600 border-none text-white">
              <Star className="mr-1 fill-white" size={14} /> NOW SHOWING
            </Badge>
            <h1 className="text-6xl font-black tracking-tighter text-white mb-6 leading-none uppercase">
              CINE<span className="text-red-600 italic">MAGIC</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-xl mb-10">
              Your gateway to the ultimate cinematic experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="xl" className="rounded-xl bg-red-600 hover:bg-red-700 text-white border-none px-10 font-bold">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-4 z-40 bg-slate-950 border border-white/10 p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <Input
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-slate-900 border-white/10 text-white rounded-xl"
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'ghost'}
            onClick={() => setSelectedCategory('All')}
            className="rounded-xl h-10 px-6 font-bold"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-xl h-10 px-6 font-bold"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredMovies.map((movie) => (
          <div key={movie.id}>
            <Card className="relative h-[450px] border border-white/5 overflow-hidden rounded-2xl bg-slate-900">
              <img
                src={movie.posterUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059'}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-600 border-none text-white">
                  {movie.categoryName || 'Movie'}
                </Badge>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-black text-white leading-tight">
                    {movie.title}
                  </CardTitle>
                </CardHeader>
                
                <CardFooter className="p-0 flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-bold uppercase">Price</span>
                    <span className="text-xl font-black text-white">75.000 đ</span>
                  </div>
                  <Button 
                    className="rounded-xl h-10 px-6 bg-red-600 hover:bg-red-700 text-white border-none font-bold"
                    onClick={() => navigate(`/booking/${movie.id}`)}
                  >
                    Tickets
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </div>
        ))}
      </div>

    </div>
  );
};
