import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ChevronLeft,
  Armchair,
  Ticket,
  Calendar,
  Clock,
  CreditCard,
  Wallet,
  Smartphone,
  Info,
} from "lucide-react"
import { bookingService, movieService, paymentService } from "@/services"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Movie } from "@/types"

const ROWS = ["A", "B", "C", "D", "E", "F", "G"]
const COLS = 12
const SEAT_PRICE = 75000

type PaymentMethod = "Credit Card" | "MoMo" | "ZaloPay"

export const Booking = () => {
  const { movieId } = useParams<{ movieId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [movie, setMovie] = useState<Movie | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [bookedSeats, setBookedSeats] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Credit Card")

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) return
      try {
        const response = await movieService.getMovieById(Number(movieId))
        if (response.success) setMovie(response.data)
      } catch (error) {
        toast.error("Failed to load movie data")
      }
    }
    fetchData()
  }, [movieId])

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    )
  }

  const isBooked = (seatId: string) => bookedSeats.includes(seatId)

  const handleCheckout = async () => {
    if (!user || !movie || selectedSeats.length === 0) return

    setLoading(true)
    const toastId = toast.loading("Processing your request...")

    try {
      // 1. Create Booking
      const bookingRes = await bookingService.createBooking({
        movieId: movie.id,
        userId: user.user.id,
        seats: selectedSeats,
      })

      if (bookingRes.success) {
        toast.loading("Booking confirmed! Processing payment...", {
          id: toastId,
        })

        // 2. Process Payment
        const paymentRes = await paymentService.processPayment({
          bookingId: bookingRes.data.id,
          amount: selectedSeats.length * SEAT_PRICE,
          paymentMethod: paymentMethod,
        })

        if (paymentRes.success) {
          toast.success("Payment successful! Enjoy your movie.", {
            id: toastId,
          })
          navigate("/profile")
        } else {
          toast.error(`Payment failed: ${paymentRes.message}`, { id: toastId })
        }
      } else {
        toast.error("Failed to create booking", { id: toastId })
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during checkout", {
        id: toastId,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!movie) return null

  const totalPrice = selectedSeats.length * SEAT_PRICE

  return (
    <div className="relative min-h-screen bg-slate-950 pb-20 text-white">
      <div className="relative z-10 container mx-auto px-4 pt-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-white/10 bg-white/5 px-5 font-bold text-slate-400"
          >
            <ChevronLeft className="mr-2" /> Back
          </Button>

          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 sm:flex">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Active Session
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            {/* Simple Screen Area */}
            <div className="mx-auto max-w-xl px-10 text-center">
              <div className="h-1 w-full rounded-full bg-slate-800 shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
              <p className="mt-4 text-[10px] font-black tracking-widest text-slate-600 uppercase">
                SCREEN
              </p>
            </div>

            {/* Seat Map */}
            <div className="flex flex-col items-center gap-4 overflow-x-auto pb-8">
              <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-8">
                {ROWS.map((row) => (
                  <div key={row} className="flex items-center gap-6">
                    <span className="w-6 text-center text-xs font-black text-slate-600">
                      {row}
                    </span>
                    <div className="flex gap-2">
                      {Array.from({ length: COLS }).map((_, i) => {
                        const col = i + 1
                        const seatId = `${row}${col}`
                        const booked = isBooked(seatId)
                        const selected = selectedSeats.includes(seatId)

                        return (
                          <button
                            key={seatId}
                            disabled={booked}
                            onClick={() => toggleSeat(seatId)}
                            className={cn(
                              "relative flex h-10 w-10 items-center justify-center rounded-lg border text-[10px] font-bold transition-all",
                              booked
                                ? "cursor-not-allowed border-white/5 bg-slate-800 text-slate-600 opacity-40"
                                : selected
                                  ? "z-10 border-red-500 bg-red-600 text-white shadow-lg"
                                  : "border-white/10 bg-slate-900 text-slate-400 hover:border-red-500"
                            )}
                          >
                            {seatId}
                          </button>
                        )
                      })}
                    </div>
                    <span className="w-6 text-center text-xs font-black text-slate-600">
                      {row}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mx-auto flex max-w-2xl justify-center gap-10 rounded-2xl border border-white/5 bg-slate-900/30 p-6">
              {[
                {
                  label: "Available",
                  color: "bg-slate-900 border border-white/10",
                },
                { label: "Selected", color: "bg-red-600" },
                { label: "Booked", color: "bg-slate-800 opacity-20" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={cn("h-5 w-5 rounded", item.color)} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border-white/10 bg-slate-900 shadow-2xl">
              <div className="relative h-40 bg-slate-800">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="h-full w-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-black text-white">
                    {movie.title}
                  </h2>
                </div>
              </div>

              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Date
                    </p>
                    <p className="flex items-center gap-2 text-sm font-bold">
                      <Calendar size={14} className="text-red-500" /> 12 Apr,
                      2024
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                      Time
                    </p>
                    <p className="flex items-center justify-end gap-2 text-sm font-bold">
                      <Clock size={14} className="text-red-500" /> 20:30 PM
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Payment Method
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "Credit Card", icon: CreditCard },
                      { id: "MoMo", icon: Smartphone },
                      { id: "ZaloPay", icon: Wallet },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() =>
                          setPaymentMethod(method.id as PaymentMethod)
                        }
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                          paymentMethod === method.id
                            ? "border-red-600 bg-red-600/10 text-red-500"
                            : "border-white/5 bg-slate-950 text-slate-500 hover:border-white/10"
                        )}
                      >
                        <method.icon size={20} />
                        <span className="text-[8px] font-black tracking-widest uppercase">
                          {method.id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-400">
                      Selected Seats ({selectedSeats.length})
                    </span>
                    <span className="text-sm font-black text-white">
                      {selectedSeats.join(", ") || "None"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white">
                      Total Amount
                    </span>
                    <span className="text-2xl font-black text-red-500">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(totalPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-8 pt-0">
                <Button
                  onClick={handleCheckout}
                  disabled={selectedSeats.length === 0 || loading}
                  className="h-14 w-full rounded-xl bg-red-600 text-lg font-black text-white shadow-xl shadow-red-600/20 transition-all hover:bg-red-700"
                >
                  {loading ? "Processing..." : "Complete Booking"}
                </Button>
              </CardFooter>
            </Card>

            <div className="flex gap-4 rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
                <Info size={18} className="text-blue-400" />
              </div>
              <p className="text-[10px] leading-relaxed font-bold tracking-widest text-blue-300/60 uppercase">
                Confirmed tickets are permanent. verify details carefully before
                payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
