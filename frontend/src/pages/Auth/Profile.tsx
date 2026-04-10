import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Shield,
  Calendar,
  Settings,
  Ticket,
  ChevronRight,
  LogOut,
  Clock,
  MapPin,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { userService, bookingService } from "@/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import type { Booking } from "@/types"

export const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await bookingService.getAllBookings()
        if (response.success) {
          // Filter bookings for current user
          const userBookings = response.data.filter(
            (b) => b.userId === user?.user.id
          )
          setBookings(userBookings)
        }
      } catch (error) {
        console.error("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfileData()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    navigate("/login")
  }

  if (!user) return null

  return (
    <div className="min-h-screen theater-bg pb-20 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 pt-10 relative z-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            MY <span className="text-primary italic">PROFILE</span>
          </h1>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="rounded-2xl border border-white/5 bg-white/5 px-6 font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut className="mr-2" size={18} /> Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: User Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="cinema-card border-none overflow-hidden">
              <div className="relative h-32 bg-gradient-to-br from-primary via-primary/80 to-slate-900" />
              <CardContent className="relative px-8 pb-8 -mt-12">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-3xl bg-slate-800 border-4 border-slate-950 flex items-center justify-center text-4xl font-black text-white shadow-2xl mb-4 overflow-hidden">
                     {user.user.username.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">
                    {user.user.username}
                  </h2>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-none font-black px-4 py-1 mb-6">
                    VIP MEMBER
                  </Badge>

                  <div className="w-full space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Email Address</p>
                        <p className="text-sm font-bold text-white">{user.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Shield size={18} className="text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Account Status</p>
                        <p className="text-sm font-bold text-white">Active</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Settings size={18} className="text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Member Since</p>
                        <p className="text-sm font-bold text-white">April 2024</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-8 rounded-2xl h-12 font-black shadow-xl shadow-primary/20">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-[2.5rem] bg-white/[0.03] border border-white/5 p-8 backdrop-blur-md">
               <h3 className="text-sm font-black tracking-widest uppercase text-slate-500 mb-6">Your Stats</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
                     <p className="text-2xl font-black text-white">{bookings.length}</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bookings</p>
                  </div>
                  <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
                     <p className="text-2xl font-black text-white">0</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reviews</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Booking History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                  <Ticket size={24} className="text-primary" /> RECENT <span className="text-slate-500 uppercase italic">Bookings</span>
               </h3>
               <Button variant="link" className="text-primary font-bold">View All</Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                 <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="cinema-card border-none hover:border-white/10 transition-all overflow-hidden group">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                           <div className="w-full md:w-32 bg-slate-800 flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 to-transparent">
                              <Ticket size={40} className="text-primary group-hover:scale-110 transition-transform" />
                           </div>
                           <div className="flex-grow p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div>
                                 <h4 className="text-xl font-black text-white mb-2">{booking.movieTitle}</h4>
                                 <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> 12 Apr, 2024</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> 20:30 PM</span>
                                    <span className="flex items-center gap-1 border-l border-white/10 pl-4 text-slate-300">
                                       Seats: <span className="text-primary">{booking.seats.join(", ")}</span>
                                    </span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</p>
                                    <p className="text-lg font-black text-white tracking-tighter">75.000 đ</p>
                                 </div>
                                 <Badge className="bg-green-500/20 text-green-500 border-none px-4 py-1.5 rounded-xl font-black text-[10px] tracking-widest uppercase">
                                    {booking.status}
                                 </Badge>
                                 <Button variant="ghost" size="icon" className="rounded-xl text-slate-600 hover:text-white hover:bg-white/5">
                                    <ChevronRight size={20} />
                                 </Button>
                              </div>
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.02]">
                 <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Ticket size={32} className="text-slate-700" />
                 </div>
                 <h4 className="text-lg font-bold text-slate-400 mb-2">No Bookings Yet</h4>
                 <p className="text-sm text-slate-600 max-w-xs mx-auto mb-8">
                    You haven't booked any movies yet. Explore the latest blockbusters and start your cinematic journey!
                 </p>
                 <Button onClick={() => navigate("/")} variant="outline" className="rounded-2xl border-white/10 text-white hover:bg-white/10">
                    Browse Movies
                 </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
