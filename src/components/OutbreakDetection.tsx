import React, { useEffect, useState } from 'react';
import { OutbreakAlert } from '../types';
import { AlertTriangle, MapPin, Users, ChevronRight, Loader2, Zap, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_OUTBREAKS } from '../lib/mockData';

export default function OutbreakDetection() {
  const [alerts, setAlerts] = useState<OutbreakAlert[]>(MOCK_OUTBREAKS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning Bio-Sensor Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-red-200 animate-float">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Outbreak <span className="text-red-600">Intelligence</span></h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Real-time geographic clustering alerts</p>
          </div>
        </div>
        <div className="glass px-6 py-3 rounded-[2rem] flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
            {alerts.length} CRITICAL CLUSTERS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 stagger-reveal">
        {alerts.map((alert, idx) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden group transition-all duration-500 hover:scale-[1.03] ${
              alert.severity === 'High' 
                ? 'bg-white border-red-100 shadow-red-100/50' 
                : 'bg-white border-orange-100 shadow-orange-100/50'
            }`}
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 opacity-5 transition-transform duration-700 group-hover:scale-150 ${
               alert.severity === 'High' ? 'bg-red-600' : 'bg-orange-600'
            }`}></div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  alert.severity === 'High' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                }`}>
                  {alert.severity} SEVERITY
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  alert.severity === 'High' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  <Zap className="w-6 h-6 fill-current" />
                </div>
              </div>

              <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2 italic uppercase">{alert.symptom}</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                   <MapPin className="w-3 h-3" />
                   {alert.village_names.join(' + ')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-50">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Affected</p>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Users className={`w-4 h-4 ${alert.severity === 'High' ? 'text-red-500' : 'text-orange-500'}`} />
                    <span className="text-2xl font-black text-slate-900">{alert.patient_count}</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Radius</p>
                  <p className="text-2xl font-black text-slate-900">{alert.radius_km}<span className="text-sm">km</span></p>
                </div>
              </div>

              <div className={`p-6 rounded-[2rem] border-2 shadow-inner ${
                alert.severity === 'High' ? 'bg-red-50/50 border-red-100 text-red-900' : 'bg-orange-50/50 border-orange-100 text-orange-900'
              }`}>
                <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2 opacity-60">Strategic Suggestion</p>
                <p className="text-sm font-bold leading-relaxed tracking-tight">{alert.suggested_action}</p>
              </div>

              <button className={`w-full py-5 rounded-[2rem] font-black text-sm transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                alert.severity === 'High' 
                  ? 'bg-slate-900 text-white hover:bg-red-600 shadow-slate-200' 
                  : 'bg-white text-slate-900 border border-slate-100 hover:bg-orange-50 shadow-slate-100'
              }`}>
                ACTIVATE RESPONSE UNIT
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
