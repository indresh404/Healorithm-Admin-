import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, User, Menu, X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 blur-[120px] rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 glass px-6 lg:px-12 flex items-center justify-between sticky top-0 z-[90] border-b border-white/20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 text-slate-500 hover:bg-white rounded-2xl lg:hidden transition-all shadow-sm"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-48 md:w-[420px] hidden sm:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Deep Search Intel..."
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all shadow-sm outline-none font-bold"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-20 pointer-events-none">
                <Command className="w-3 h-3" />
                <span className="text-[10px] font-black">K</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-3 text-slate-500 hover:bg-white rounded-2xl transition-all relative shadow-sm hover:scale-110 active:scale-95">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
              </button>
            </div>
            
            <div className="h-10 w-px bg-slate-200/50"></div>
            
            <div className="flex items-center gap-4 bg-slate-900 text-white pl-6 pr-2 py-2 rounded-[2rem] shadow-xl shadow-slate-200">
               <div className="text-right hidden md:block">
                  <p className="text-xs font-black tracking-tight leading-none">Dist. Health Officer</p>
                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1">Status: Level 4 Active</p>
               </div>
               <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-full border-2 border-white/20 flex items-center justify-center p-1.5">
                    <User className="w-full h-full text-white" />
                  </div>
               </div>
            </div>
          </div>
        </header>
        
        <main className="p-6 lg:p-12 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
