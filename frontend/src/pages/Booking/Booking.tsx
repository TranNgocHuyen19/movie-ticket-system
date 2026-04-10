import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Armchair, Ticket, CreditCard, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const COLS = 12;

export const Booking = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  // Mock data for the selected movie
  const movie = {
    title: 'Dune: Part Two',
    price: 95000,
    time: '20:30',
    date: 'Today, 10 Apr',
    cinema: 'Cinema Hall 01'
  };

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        return toast.error("You can only book up to 8 seats at once");
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const isBooked = (seatId: string) => {
    // Randomly simulate some booked seats
    const hash = seatId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 7 === 0;
  };

  const totalPrice = selectedSeats.length * movie.price;

  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      return toast.error("Please select at least one seat");
    }
    toast.success("Redirecting to payment...");
    // Simulate checkout flow
    setTimeout(() => {
      toast.success("Booking successful!");
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-8 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl group"
        >
          <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Movies
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
          {/* Seat Selection */}
          <div className="lg:col-span-2 space-y-12">
            <div className="text-center space-y-4">
              <div className="w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-[0_0_20px_oklch(var(--primary))] opacity-50 mb-12" />
              <p className="text-slate-500 uppercase tracking-[0.3em] font-black text-xs">SCREEN THIS WAY</p>
            </div>

            <div className="flex flex-col gap-6 items-center overflow-x-auto pb-8 no-scrollbar">
              {ROWS.map((row) => (
                <div key={row} className="flex gap-4 items-center">
                  <span className="w-6 text-slate-600 font-bold text-center">{row}</span>
                  <div className="flex gap-2">
                    {Array.from({ length: COLS }).map((_, i) => {
                      const col = i + 1;
                      const seatId = `${row}${col}`;
                      const booked = isBooked(seatId);
                      const selected = selectedSeats.includes(seatId);
                      
                      return (
                        <motion.button
                          key={seatId}
                          whileHover={!booked ? { scale: 1.1 } : {}}
                          whileTap={!booked ? { scale: 0.9 } : {}}
                          onClick={() => !booked && toggleSeat(seatId)}
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 relative group",
                            booked ? "bg-slate-800 cursor-not-allowed opacity-50" : 
                            selected ? "bg-primary text-white shadow-[0_0_15px_oklch(var(--primary)/0.5)]" : 
                            "bg-slate-900 border border-slate-700 hover:border-primary/50"
                          )}
                        >
                          <Armchair size={14} className={cn(selected ? "fill-white" : "text-slate-500")} />
                          {selected && (
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-[10px] font-black px-2 py-0.5 rounded shadow-lg">
                              {seatId}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  <span className="w-6 text-slate-600 font-bold text-center">{row}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-8 py-8 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-900 border border-slate-700" />
                <span className="text-xs text-slate-400 font-medium">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary shadow-[0_0_10px_oklch(var(--primary)/0.4)]" />
                <span className="text-xs text-slate-400 font-medium">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-800 opacity-50" />
                <span className="text-xs text-slate-400 font-medium">Booked</span>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="border-none bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden glass-panel">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent p-8">
                <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Order Summary</p>
                <CardTitle className="text-3xl text-white font-black">{movie.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
                      <Calendar size={12} /> Date
                    </span>
                    <span className="text-sm font-bold">{movie.date}</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
                      <Clock size={12} /> Time
                    </span>
                    <span className="text-sm font-bold">{movie.time}</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-2xl space-y-2">
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
                       <Armchair size={12} /> Selected Seats
                     </span>
                     <Badge variant="secondary" className="bg-primary/20 text-primary border-none">
                       {selectedSeats.length} Seats
                     </Badge>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {selectedSeats.length > 0 ? (
                       selectedSeats.map(seat => (
                         <Badge key={seat} className="bg-white/5 border-white/10 text-white font-bold h-7 px-3">
                           {seat}
                         </Badge>
                       ))
                     ) : (
                       <span className="text-xs text-slate-600 italic">No seats selected</span>
                     )}
                   </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 tracking-wide">Seat Price ({selectedSeats.length}x)</span>
                    <span className="text-white font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(movie.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 tracking-wide">Service Fee</span>
                    <span className="text-white font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedSeats.length > 0 ? 5000 : 0)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-white font-black text-xl uppercase italic">Total</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice + (selectedSeats.length > 0 ? 5000 : 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button 
                  size="xl" 
                  className="w-full rounded-2xl font-black group shadow-2xl shadow-primary/20"
                  disabled={selectedSeats.length === 0}
                  onClick={handleCheckout}
                >
                  Confirm Booking <Ticket className="ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
              </CardFooter>
            </Card>

            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex gap-4">
              <Info className="text-blue-500 shrink-0" />
              <p className="text-xs text-blue-300 leading-relaxed">
                Tickets are non-refundable after purchase. Please double check your selection before confirming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
