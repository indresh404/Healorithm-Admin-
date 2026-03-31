import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, QrCode, Activity, Map as MapIcon, AlertTriangle, TrendingUp, Package, UserCheck, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: MapIcon, label: 'Health Map', path: '/map' },
  { icon: AlertTriangle, label: 'Outbreaks', path: '/outbreaks' },
  { icon: TrendingUp, label: 'Trends', path: '/trends' },
  { icon: Package, label: 'Resources', path: '/resources' },
  { icon: UserCheck, label: 'Workers', path: '/workers' },
  { icon: Users, label: 'Patients', path: '/users' },
  { icon: QrCode, label: 'Scan QR', path: '/scan' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-[110] w-72 glass border-r border-white/20 flex flex-col transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200/50 animate-float">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Heal<span className="text-blue-600">orithm</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Super Admin</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden",
              isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200/50" 
                : "text-slate-500 hover:bg-white hover:text-blue-600"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
            )} />
            {item.label}
            {/* Animated dot for active state */}
            {/* <div className={cn("absolute right-4 w-1.5 h-1.5 rounded-full bg-white transition-opacity", isActive ? "opacity-100" : "opacity-0")} /> */}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-2">District Office</p>
            <p className="text-lg font-black leading-tight">Kurnool<br/>North Region</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              SERVER ONLINE
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
