import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Star, Calendar, Clock, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const MOCK_MOVIES = [
  {
    id: '1',
    title: 'Dune: Part Two',
    category: 'Sci-Fi',
    rating: 4.9,
    duration: '2h 46m',
    releaseDate: '2024-03-01',
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925',
    price: 95000,
  },
  {
    id: '2',
    title: 'The Dark Knight',
    category: 'Action',
    rating: 4.8,
    duration: '2h 32m',
    releaseDate: '2008-07-18',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070',
    price: 85000,
  },
  {
    id: '3',
    title: 'Interstellar',
    category: 'Sci-Fi',
    rating: 4.9,
    duration: '2h 49m',
    releaseDate: '2014-11-07',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072',
    price: 90000,
  },
  {
    id: '4',
    title: 'Spirited Away',
    category: 'Animation',
    rating: 4.7,
    duration: '2h 5m',
    releaseDate: '2001-07-20',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070',
    price: 75000,
  },
  {
    id: '5',
    title: 'Oppenheimer',
    category: 'History',
    rating: 4.8,
    duration: '3h 0m',
    releaseDate: '2023-07-21',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    imageUrl: 'https://images.unsplash.com/photo-1492041932197-af6235427b0c?q=80&w=2070',
    price: 110000,
  },
  {
    id: '6',
    title: 'Parasite',
    category: 'Thriller',
    rating: 4.6,
    duration: '2h 12m',
    releaseDate: '2019-05-30',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    imageUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=2070',
    price: 80000,
  }
];

const CATEGORIES = ['All', 'Action', 'Sci-Fi', 'Animation', 'History', 'Thriller'];

export const MovieList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const filteredMovies = MOCK_MOVIES.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || movie.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-20">
      <header className="relative min-h-[500px] flex items-center px-8 overflow-hidden rounded-[2.5rem] bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059")' }} 
        />
        
        <div className="relative z-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-4 h-7 px-4 bg-primary/20 text-primary border-primary/20 backdrop-blur-md">
              <Star className="mr-1 fill-primary" size={14} /> NOW SHOWING
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-none">
              CINE<span className="text-primary italic">MAGIC</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-xl mb-10">
              Experience cinema like never before. From epic sci-fi blockbusters to heart-touching animations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="xl" className="rounded-2xl group shadow-2xl shadow-primary/40">
                Book Now <Ticket className="ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button size="xl" variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white backdrop-blur-md hover:bg-white/10">
                <Play className="mr-2 fill-white" size={18} /> Watch Trailer
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="sticky top-4 z-40 bg-slate-900/50 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
          <Input
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-slate-800/50 border-none text-white rounded-2xl group-focus-within:ring-2 ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-xl h-12 px-6 font-semibold whitespace-nowrap transition-all",
                selectedCategory !== cat && "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="group relative h-[500px] border-none overflow-hidden rounded-[2.5rem] bg-slate-900">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <Badge className="bg-white/10 backdrop-blur-md border-none text-white">
                    {movie.category}
                  </Badge>
                  <Badge className="bg-amber-500/20 backdrop-blur-md border-none text-amber-500">
                    <Star className="mr-1 fill-amber-500" size={12} /> {movie.rating}
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-3xl font-black text-white mb-2 leading-tight">
                      {movie.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-slate-300 text-sm">
                      <span className="flex items-center"><Clock size={14} className="mr-1 text-primary" /> {movie.duration}</span>
                      <span className="flex items-center"><Calendar size={14} className="mr-1 text-primary" /> {new Date(movie.releaseDate).getFullYear()}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0 mb-6">
                    <p className="text-slate-400 line-clamp-2 text-sm leading-relaxed group-hover:line-clamp-none transition-all duration-500">
                      {movie.description}
                    </p>
                  </CardContent>

                  <CardFooter className="p-0 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase font-black tracking-widest">Price from</span>
                      <span className="text-2xl font-black text-white">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(movie.price)}</span>
                    </div>
                    <Button 
                      className="rounded-2xl h-12 px-6 group"
                      onClick={() => navigate(`/booking/${movie.id}`)}
                    >
                      Tickets <Ticket className="ml-2 group-hover:rotate-12 transition-transform" />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
