import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Toaster } from "@/components/ui/sonner"

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-200 antialiased">
      <Navbar />
      <main className="container mx-auto flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-white/5 bg-slate-950 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <span className="text-xl font-black tracking-tighter text-white">
                Movie<span className="text-primary italic">Ticket</span>
              </span>
              <p className="max-w-xs text-center text-sm text-slate-500 md:text-left">
                The ultimate movie booking experience. Get your tickets in
                seconds.
              </p>
            </div>
            <div className="flex gap-8 text-sm font-bold text-slate-400">
              <a href="#" className="transition-colors hover:text-white">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Terms
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Contact
              </a>
            </div>
            <p className="text-xs text-slate-600">
              © 2024 MovieTicket. All rights reserved. Built with ❤️ for cinema
              lovers.
            </p>
          </div>
        </div>
      </footer>
      <Toaster position="top-center" expand={true} richColors theme="dark" />
    </div>
  )
}
