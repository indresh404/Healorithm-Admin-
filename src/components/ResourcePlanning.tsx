import React, { useEffect, useState } from 'react';
import { Package, Search, Download, AlertCircle, CheckCircle, Clock, Loader2, BarChart3, Pill, Boxes } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MedicineDemand {
  name: string;
  active_patients: number;
  avg_cycle_days: number;
  projected_refills_4w: number;
  stock_status: 'Critical' | 'Low' | 'Stable';
  last_procurement: string;
}

export default function ResourcePlanning() {
  const [demands, setDemands] = useState<MedicineDemand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const FAKE_DEMANDS: MedicineDemand[] = [
    { name: 'Metformin 500mg', active_patients: 1500, avg_cycle_days: 30, projected_refills_4w: 1800, stock_status: 'Stable', last_procurement: '2026-03-01' },
    { name: 'Amlodipine 5mg', active_patients: 1200, avg_cycle_days: 30, projected_refills_4w: 1400, stock_status: 'Low', last_procurement: '2026-02-15' },
    { name: 'Atorvastatin 10mg', active_patients: 850, avg_cycle_days: 30, projected_refills_4w: 1000, stock_status: 'Stable', last_procurement: '2026-03-10' },
    { name: 'Losartan 50mg', active_patients: 600, avg_cycle_days: 30, projected_refills_4w: 750, stock_status: 'Critical', last_procurement: '2026-01-20' },
    { name: 'Gliclazide 80mg', active_patients: 450, avg_cycle_days: 30, projected_refills_4w: 550, stock_status: 'Stable', last_procurement: '2026-03-05' },
    { name: 'Hydrochlorothiazide 12.5mg', active_patients: 300, avg_cycle_days: 30, projected_refills_4w: 400, stock_status: 'Low', last_procurement: '2026-02-28' },
    { name: 'Azithromycin 500mg', active_patients: 200, avg_cycle_days: 5, projected_refills_4w: 600, stock_status: 'Critical', last_procurement: '2026-03-15' },
    { name: 'Paracetamol 500mg', active_patients: 5000, avg_cycle_days: 7, projected_refills_4w: 12000, stock_status: 'Stable', last_procurement: '2026-03-12' },
  ];

  const fetchData = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setDemands(FAKE_DEMANDS);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDemands = demands.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = ['Medicine Name', 'Active Patients', 'Avg Cycle (Days)', 'Projected Refills (4W)', 'Stock Status', 'Last Procurement'];
    const rows = demands.map(d => [d.name, d.active_patients, d.avg_cycle_days, d.projected_refills_4w, d.stock_status, d.last_procurement]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `resource_planning_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inventory Ledger Scanning...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-200">
            <Boxes className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Supply <span className="text-indigo-600">Forecasting</span></h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Algorithmic Resource demand projection</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search Inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 glass border-white rounded-[2rem] text-sm focus:ring-4 focus:ring-indigo-100 transition-all w-full md:w-80 outline-none font-bold"
            />
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
          >
            <Download className="w-5 h-5" />
            EXCEL EXPORT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-reveal">
        <SummaryCard 
          label="Strategic Shortage" 
          value={demands.filter(d => d.stock_status === 'Critical').length} 
          icon={AlertCircle} 
          color="red" 
          subtitle="Immediate procurement required"
        />
        <SummaryCard 
          label="Low Inventory" 
          value={demands.filter(d => d.stock_status === 'Low').length} 
          icon={Clock} 
          color="orange" 
          subtitle="Restock within 72 hours"
        />
        <SummaryCard 
          label="Optimal Stock" 
          value={demands.filter(d => d.stock_status === 'Stable').length} 
          icon={CheckCircle} 
          color="emerald" 
          subtitle="Current levels confirmed"
        />
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-100/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100">
                <th className="px-10 py-6">Medical Asset</th>
                <th className="px-10 py-6 text-center">Active Nodes</th>
                <th className="px-10 py-6 text-center">Cycle Mean</th>
                <th className="px-10 py-6 text-center">Proj. Demand</th>
                <th className="px-10 py-6">Health Index</th>
                <th className="px-10 py-6">Last Batch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDemands.map((demand, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 ${
                          demand.stock_status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'
                        }`}>
                           <Pill className="w-full h-full" />
                        </div>
                        <span className="font-black text-slate-900 text-base">{demand.name}</span>
                     </div>
                  </td>
                  <td className="px-10 py-8 text-center font-bold text-slate-600">{demand.active_patients.toLocaleString()}</td>
                  <td className="px-10 py-8 text-center">
                     <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">{demand.avg_cycle_days} Days</span>
                  </td>
                  <td className="px-10 py-8 text-center">
                     <div className="text-lg font-black text-indigo-600 tracking-tight">{demand.projected_refills_4w.toLocaleString()}</div>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Recommended Qty</p>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
                          <div className={`h-full rounded-full transition-all duration-1000 ${
                            demand.stock_status === 'Critical' ? 'w-[15%] bg-red-500' :
                            demand.stock_status === 'Low' ? 'w-[40%] bg-orange-500' :
                            'w-[90%] bg-emerald-500'
                          }`}></div>
                       </div>
                       <span className={`text-[9px] font-black uppercase tracking-widest ${
                         demand.stock_status === 'Critical' ? 'text-red-600' :
                         demand.stock_status === 'Low' ? 'text-orange-600' :
                         'text-emerald-600'
                       }`}>
                         {demand.stock_status}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-sm text-slate-400 font-bold uppercase tracking-tight">{new Date(demand.last_procurement).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  function SummaryCard({ label, value, icon: Icon, color, subtitle }: { label: string, value: number, icon: any, color: string, subtitle: string }) {
    const colorClasses: any = {
      red: 'from-red-600 to-red-800 shadow-red-200/50',
      orange: 'from-orange-500 to-orange-700 shadow-orange-200/50',
      emerald: 'from-emerald-500 to-emerald-700 shadow-emerald-200/50'
    };
    
    return (
      <div className={`p-10 rounded-[2.5rem] bg-gradient-to-br ${colorClasses[color]} text-white shadow-2xl relative overflow-hidden group hover:scale-105 transition-all duration-500`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
             <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Icon className="w-6 h-6 text-white" />
             </div>
             <span className="text-5xl font-black italic tracking-tighter">{value}</span>
          </div>
          <p className="text-sm font-black uppercase tracking-[0.1em] mb-1">{label}</p>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
    );
  }
}
