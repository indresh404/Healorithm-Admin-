import React, { useEffect, useState } from 'react';
import { User, HealthAnalytics } from '../types';
import { 
  Users, QrCode, ChevronRight, Loader2, AlertTriangle, 
  Activity, Clock, UserCheck, ShieldAlert, ShieldCheck, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Zap 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_VILLAGES, MOCK_TRENDS } from '../lib/mockData';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalUsers: 12450, 
    totalRecords: 45600,
    highRisk: 412,
    medRisk: 890,
    pendingFollowUps: 156,
    emergencies: 24,
    activeWorkers: 185
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Aggregating District Data...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Executive <span className="text-blue-600">Overview</span></h2>
          <p className="text-slate-500 font-medium mt-1">Real-time health intelligence for Kurnool North District.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Sync Active</span>
          </div>
          <Link
            to="/scan"
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-sm hover:scale-105 transition-all shadow-2xl shadow-slate-200 active:scale-95"
          >
            <QrCode className="w-5 h-5" />
            SCAN PATIENT QR
          </Link>
        </div>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 stagger-reveal">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.totalUsers.toLocaleString()}
          trend="+12%"
          trendType="up"
          color="blue"
        />
        <StatCard
          icon={ShieldAlert}
          label="High Risk"
          value={stats.highRisk}
          trend="+5.2%"
          trendType="down"
          color="red"
        />
        <StatCard
          icon={AlertTriangle}
          label="Medium Risk"
          value={stats.medRisk}
          trend="-2.1%"
          trendType="up"
          color="yellow"
        />
        <StatCard
          icon={Clock}
          label="Pending Visits"
          value={stats.pendingFollowUps}
          trend="+8"
          trendType="up"
          color="indigo"
        />
        <StatCard
          icon={Activity}
          label="Weekly Emergency"
          value={stats.emergencies}
          trend="Critical"
          trendType="down"
          color="orange"
        />
        <StatCard
          icon={UserCheck}
          label="Active Workers"
          value={stats.activeWorkers}
          trend="98% Online"
          trendType="up"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          {/* District Highlights */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 -z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">District Hotspots</h3>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Village-level risk assessment</p>
                </div>
                <Link to="/map" className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  Open Map
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {MOCK_VILLAGES.slice(0, 2).map((v, i) => (
                  <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-slate-900">
                        {v.name.charAt(0)}
                      </div>
                      <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest ${
                        v.avg_risk_score > 60 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {v.avg_risk_score > 60 ? 'Critical' : 'Stable'}
                      </span>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-1">{v.name} Village</h4>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Last sync 4m ago</p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Avg Risk Score</span>
                        <span className="text-lg font-black text-slate-900">{v.avg_risk_score}%</span>
                      </div>
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${v.avg_risk_score}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className={`h-full ${v.avg_risk_score > 60 ? 'bg-red-500' : 'bg-blue-500'}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Analytics Bar */}
          <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[2.5rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                    <Zap className="w-10 h-10 text-white fill-current" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">AI Prediction Engine</h3>
                    <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">Analyzing 45.6k data points...</p>
                  </div>
                </div>
                <div className="h-12 w-px bg-white/10 hidden md:block"></div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Outbreak Confidence</p>
                  <p className="text-4xl font-black text-white tracking-tight">89.4%</p>
                </div>
                <Link to="/trends" className="px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-sm hover:scale-105 transition-all">
                  VIEW FULL ANALYSIS
                </Link>
             </div>
          </section>
        </div>

        {/* Sidebar/Recent Section */}
        <div className="space-y-10">
          <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-600" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Priority List</h3>
               </div>
               <Link to="/users" className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">Full Directory</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {MOCK_VILLAGES.slice(0, 5).map((v, i) => (
                <div key={i} className="p-8 hover:bg-slate-50/50 transition-all group flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:border-blue-600 group-hover:text-blue-600 transition-colors">
                      {v.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 tracking-tight">{v.name} Node</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.patient_count} Total Patients</p>
                    </div>
                  </div>
                  <div className={`text-right ${v.avg_risk_score > 60 ? 'text-red-600' : 'text-emerald-600'}`}>
                    <p className="text-lg font-black tracking-tight">{v.avg_risk_score.toFixed(1)}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest">Risk</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-[3rem] p-10 shadow-2xl relative group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 to-transparent rounded-[3rem]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-black text-slate-900 tracking-tight">System Integrity</h3>
              </div>
              <div className="space-y-6">
                 <StatusItem label="Satellite Sync" status="Operational" value="100%" />
                 <StatusItem label="Inference Lag" status="Low" value="14ms" />
                 <StatusItem label="Worker Uplink" status="Stable" value="98.2%" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, trend, trendType, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-600 text-white shadow-blue-200',
    red: 'bg-white text-slate-900 border-slate-100',
    yellow: 'bg-white text-slate-900 border-slate-100',
    indigo: 'bg-white text-slate-900 border-slate-100',
    orange: 'bg-white text-slate-900 border-slate-100',
    emerald: 'bg-white text-slate-900 border-slate-100'
  };

  const isWhite = colorMap[color].includes('bg-white');

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 hover:scale-105 active:scale-95 group relative overflow-hidden ${colorMap[color]} ${isWhite ? 'shadow-2xl shadow-slate-100' : 'shadow-2xl'}`}>
      {!isWhite && <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className={`p-3 rounded-2xl ${isWhite ? 'bg-slate-50 text-slate-900' : 'bg-white/20 text-white'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${trendType === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
            {trendType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
        </div>
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${isWhite ? 'text-slate-400' : 'text-white/60'}`}>{label}</p>
        <h4 className="text-4xl font-black tracking-tight">{value}</h4>
      </div>
    </div>
  );
}

function StatusItem({ label, status, value }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{label}</p>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{status}</p>
      </div>
      <span className="text-lg font-black text-slate-900">{value}</span>
    </div>
  );
}
