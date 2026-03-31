import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Calendar, Filter, Loader2, Download, Share2 } from 'lucide-react';
import { MOCK_TRENDS } from '../lib/mockData';
import { motion } from 'motion/react';

declare const Chart: any;

export default function HealthTrends() {
  const chartRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const chartInstances = useRef<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    village: 'All',
    period: 'Quarterly',
    metric: 'All'
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    const createChart = (id: string, label: string, data: number[], color: string, suggestedMax?: number) => {
      if (chartInstances.current[id]) {
        chartInstances.current[id].destroy();
      }

      const ctx = chartRefs.current[id]?.getContext('2d');
      if (!ctx) return;

      // Create Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, `${color}40`);
      gradient.addColorStop(1, `${color}00`);

      chartInstances.current[id] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: MOCK_TRENDS.weeks,
          datasets: [{
            label,
            data,
            borderColor: color,
            backgroundColor: gradient,
            borderWidth: 4,
            fill: true,
            tension: 0.5, // Ultra smooth curves
            pointRadius: 0,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { size: 14, weight: '900' },
              bodyFont: { size: 13, weight: 'bold' },
              padding: 16,
              cornerRadius: 16,
              displayColors: false,
              callbacks: {
                label: (context: any) => ` ${context.parsed.y}${id === 'adherence' ? '%' : ''} units`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax,
              grid: { color: '#f1f5f9', drawTicks: false },
              border: { display: false },
              ticks: { 
                padding: 10,
                font: { size: 10, weight: '800' }, 
                color: '#94a3b8' 
              }
            },
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { 
                padding: 10,
                font: { size: 10, weight: '800' }, 
                color: '#94a3b8' 
              }
            }
          }
        }
      });
    };

    createChart('cases', 'Weekly New Cases', MOCK_TRENDS.weeklyNewCases, '#3b82f6');
    createChart('risk', 'Avg Risk Score', MOCK_TRENDS.avgRiskScore, '#ef4444', 100);
    createChart('adherence', 'Medicine Adherence %', MOCK_TRENDS.adherenceRate, '#10b981', 100);
    createChart('emergency', 'Emergency Events', MOCK_TRENDS.emergencyEvents, '#f59e0b');

    return () => {
      Object.values(chartInstances.current).forEach((chart: any) => chart?.destroy());
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Building Neural Visualization...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Temporal <span className="text-blue-600">Dynamics</span></h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Multi-variate Trend Analysis Engine</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="glass px-4 py-2 rounded-2xl flex items-center gap-4">
            <FilterItem label="Village" value={filters.village} />
            <div className="w-px h-4 bg-slate-200"></div>
            <FilterItem label="Period" value={filters.period} />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
            <Download className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200 hover:scale-105 transition-all">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 stagger-reveal">
        <TrendCard 
          title="Weekly New Case Velovity" 
          id="cases" 
          color="#3b82f6" 
          subtitle="New diagnosis volume across district nodes"
        />
        <TrendCard 
          title="Aggregated Risk Trajectory" 
          id="risk" 
          color="#ef4444" 
          subtitle="District-wide patient risk score mean"
        />
        <TrendCard 
          title="Adherence Compliance (%)" 
          id="adherence" 
          color="#10b981" 
          subtitle="Treatment and prescription follow-through"
        />
        <TrendCard 
          title="Acute Emergency Frequency" 
          id="emergency" 
          color="#f59e0b" 
          subtitle="High-priority medical intervention events"
        />
      </div>
    </div>
  );

  function TrendCard({ title, id, color, subtitle }: { title: string, id: string, color: string, subtitle: string }) {
    return (
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100/50 hover:scale-[1.02] transition-all duration-500 group">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight">{title}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <Maximize2 className="w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="h-72 relative">
          <canvas ref={(el) => (chartRefs.current[id] = el)} />
        </div>
      </div>
    );
  }
}

function FilterItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}:</span>
      <span className="text-[10px] font-black text-slate-900 uppercase">{value}</span>
    </div>
  );
}

function Maximize2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9"></polyline>
      <polyline points="9 21 3 21 3 15"></polyline>
      <line x1="21" y1="3" x2="14" y2="10"></line>
      <line x1="3" y1="21" x2="10" y2="14"></line>
    </svg>
  );
}
