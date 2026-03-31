import React, { useEffect, useRef, useState } from 'react';
import { Village, Worker, OutbreakAlert } from '../types';
import { Map as MapIcon, AlertCircle, Users, Activity, Layers } from 'lucide-react';
import { MOCK_VILLAGES, MOCK_WORKERS, MOCK_OUTBREAKS } from '../lib/mockData';
import { motion } from 'motion/react';

declare const L: any;

interface HealthMapProps {
  height?: string | number;
  mapHeight?: string | number;
  width?: string | number;
  containerClassName?: string;
  showHeader?: boolean;
  showLegend?: boolean;
  defaultZoom?: number;
  centerLat?: number;
  centerLng?: number;
}

export default function HealthMap({
  height = 600,
  mapHeight = 600,
  width = '100%',
  containerClassName = '',
  showHeader = true,
  showLegend = true,
  defaultZoom = 8,
  centerLat = 15.4,
  centerLng = 77.5
}: HealthMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [villages, setVillages] = useState<Village[]>(MOCK_VILLAGES);
  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS);
  const [outbreaks, setOutbreaks] = useState<OutbreakAlert[]>(MOCK_OUTBREAKS);
  const [layers, setLayers] = useState({
    outbreaks: true,
    workers: true,
    heatmap: true,
    villages: true
  });

  const villageLayer = useRef<any>(null);
  const workerLayer = useRef<any>(null);
  const outbreakLayer = useRef<any>(null);
  const heatLayer = useRef<any>(null);

  const containerHeight = typeof height === 'number' ? `${height}px` : height;
  const mapContainerHeight = typeof mapHeight === 'number' ? `${mapHeight}px` : mapHeight;
  const containerWidth = typeof width === 'number' ? `${width}px` : width;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    const initMap = () => {
      if (typeof L === 'undefined') return;
      if (!mapContainerRef.current || mapInstance.current) return;

      // Initialize map with clean settings - no heavy animations
      mapInstance.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        scrollWheelZoom: true,
        fadeAnimation: false,
        markerZoomAnimation: false,
        zoomAnimation: false
      }).setView([centerLat, centerLng], defaultZoom);

      // Clean, professional tile layer - no fancy effects
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3
      }).addTo(mapInstance.current);

      // Add simple zoom control
      L.control.zoom({ position: 'topright' }).addTo(mapInstance.current);

      // Initialize layer groups
      villageLayer.current = L.layerGroup().addTo(mapInstance.current);
      workerLayer.current = L.layerGroup().addTo(mapInstance.current);
      outbreakLayer.current = L.layerGroup().addTo(mapInstance.current);

      // Initialize heat layer if available
      if (L.heatLayer) {
        heatLayer.current = L.heatLayer([], {
          radius: 35,
          blur: 15,
          max: 0.7,
          minOpacity: 0.2,
          gradient: {
            0.0: 'rgba(59, 130, 246, 0)',
            0.4: 'rgba(244, 17, 17, 0.99)',
            0.6: 'rgba(168, 85, 247, 0.4)',
            0.8: 'rgba(249, 115, 22, 0.5)',
            1.0: 'rgba(239, 68, 68, 0.6)'
          }
        }).addTo(mapInstance.current);
      }

      // Fix map size
      setTimeout(() => mapInstance.current?.invalidateSize(), 100);
    };

    // Wait for Leaflet to be available
    const interval = setInterval(() => {
      if (typeof L !== 'undefined') {
        clearInterval(interval);
        initMap();
      }
    }, 50);

    return () => {
      clearInterval(interval);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loading, centerLat, centerLng, defaultZoom]);

  useEffect(() => {
    if (!mapInstance.current || !villageLayer.current) return;

    // Clear all layers
    villageLayer.current.clearLayers();
    workerLayer.current.clearLayers();
    outbreakLayer.current.clearLayers();

    // Add Village Markers - clean and minimal
    if (layers.villages) {
      villages.forEach(v => {
        const isMainVillage = !v.name.startsWith('Rural Node');
        const hasEmergency = v.emergency_cases > 0;

        if (isMainVillage || hasEmergency) {
          const color = v.avg_risk_score >= 67 ? '#ef4444' : v.avg_risk_score >= 34 ? '#f59e0b' : '#10b981';

          // Simple marker - no glow, no animations
          const villageIcon = L.divIcon({
            className: 'village-marker',
            html: `<div style="
              width: 10px; 
              height: 10px; 
              background-color: ${color}; 
              border-radius: 50%; 
              border: 1.5px solid white;
              box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            "></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });

          const marker = L.marker([v.lat, v.lng], { icon: villageIcon });

          // Simple popup with clean design
          marker.bindPopup(`
            <div style="
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              min-width: 200px;
              max-width: 260px;
            ">
              <div style="
                background: #0f172a;
                padding: 12px;
                border-radius: 8px 8px 0 0;
                color: white;
              ">
                <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">${v.name}</h4>
                <p style="margin: 0; font-size: 10px; opacity: 0.8;">Health Center</p>
              </div>
              <div style="
                background: white;
                padding: 12px;
                border-radius: 0 0 8px 8px;
                border: 1px solid #e2e8f0;
                border-top: none;
              ">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                  <div>
                    <p style="margin: 0; font-size: 10px; color: #64748b;">Patients</p>
                    <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #0f172a;">${v.patient_count.toLocaleString()}</p>
                  </div>
                  <div>
                    <p style="margin: 0; font-size: 10px; color: #64748b;">Workers</p>
                    <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #0f172a;">${v.worker_count}</p>
                  </div>
                </div>
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <p style="margin: 0; font-size: 10px; color: #64748b;">Health Index</p>
                    <p style="margin: 0; font-size: 10px; font-weight: 600;">${v.avg_risk_score.toFixed(0)}%</p>
                  </div>
                  <div style="height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden;">
                    <div style="height: 100%; width: ${v.avg_risk_score}%; background-color: ${color};"></div>
                  </div>
                </div>
              </div>
            </div>
          `, {
            maxWidth: 280,
            minWidth: 200,
            className: 'clean-popup'
          });

          marker.addTo(villageLayer.current);
        }
      });
    }

    // Update heatmap
    if (heatLayer.current) {
      if (layers.heatmap) {
        const heatPoints = villages.map(v => [v.lat, v.lng, v.avg_risk_score / 100]);
        heatLayer.current.setLatLngs(heatPoints);
      } else {
        heatLayer.current.setLatLngs([]);
      }
    }

    // Add Worker Markers - minimal design
    if (layers.workers) {
      workers.forEach(w => {
        const workerIcon = L.divIcon({
          className: 'worker-marker',
          html: `<div style="
            width: 24px;
            height: 24px;
            background: white;
            border-radius: 50%;
            border: 2px solid #3b82f6;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          ">
            <div style="
              width: 6px;
              height: 6px;
              background: #3b82f6;
              border-radius: 50%;
            "></div>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L.marker([w.lat, w.lng], { icon: workerIcon })
          .bindPopup(`
            <div style="padding: 12px; min-width: 200px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="
                  width: 36px;
                  height: 36px;
                  background: #dbeafe;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 700;
                  color: #2563eb;
                ">${w.name.charAt(0)}</div>
                <div>
                  <p style="margin: 0; font-weight: 600; font-size: 14px;">${w.name}</p>
                  <p style="margin: 2px 0 0; font-size: 10px; color: #3b82f6;">Healthcare Worker</p>
                </div>
              </div>
              <div style="font-size: 12px;">
                <p style="margin: 8px 0;"><strong>Assigned Patients:</strong> ${w.assigned_patients}</p>
                <p style="margin: 8px 0;">
                  <strong>Status:</strong> 
                  <span style="
                    display: inline-block;
                    margin-left: 4px;
                    padding: 2px 8px;
                    background: #d1fae5;
                    border-radius: 12px;
                    font-size: 10px;
                    color: #065f46;
                  ">${w.status}</span>
                </p>
                <p style="margin: 8px 0 0; font-size: 10px; color: #94a3b8;">Last sync: ${new Date(w.last_sync).toLocaleTimeString()}</p>
              </div>
            </div>
          `)
          .addTo(workerLayer.current);
      });
    }

    // Add Outbreak Markers - subtle warning
    if (layers.outbreaks) {
      outbreaks.forEach(o => {
        const outbreakIcon = L.divIcon({
          className: 'outbreak-marker',
          html: `<div style="position: relative; width: 32px; height: 32px;">
            <div style="
              position: absolute;
              inset: 0;
              background: #ef4444;
              border-radius: 50%;
              opacity: 0.2;
            "></div>
            <div style="
              position: absolute;
              inset: 8px;
              background: #ef4444;
              border-radius: 50%;
              border: 2px solid white;
            "></div>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        L.marker([o.center_lat, o.center_lng], { icon: outbreakIcon })
          .bindPopup(`
            <div style="max-width: 280px;">
              <div style="
                background: #ef4444;
                padding: 12px;
                border-radius: 8px 8px 0 0;
                color: white;
              ">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span style="font-size: 10px; font-weight: 600;">ACTIVE OUTBREAK</span>
                </div>
                <h4 style="margin: 0; font-size: 16px; font-weight: 700;">${o.symptom}</h4>
              </div>
              <div style="
                background: white;
                padding: 12px;
                border-radius: 0 0 8px 8px;
                border: 1px solid #e2e8f0;
                border-top: none;
              ">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                  <div>
                    <p style="margin: 0; font-size: 10px; color: #64748b;">Affected</p>
                    <p style="margin: 4px 0 0; font-size: 20px; font-weight: 700; color: #ef4444;">${o.patient_count}</p>
                  </div>
                  <div>
                    <p style="margin: 0; font-size: 10px; color: #64748b;">Severity</p>
                    <p style="margin: 4px 0 0; font-size: 12px; font-weight: 600; color: #dc2626;">${o.severity}</p>
                  </div>
                </div>
                <div style="
                  background: #fef2f2;
                  padding: 8px;
                  border-radius: 6px;
                  border-left: 3px solid #ef4444;
                ">
                  <p style="margin: 0; font-size: 11px; color: #991b1b;">
                    <strong>Action:</strong> ${o.suggested_action}
                  </p>
                </div>
              </div>
            </div>
          `)
          .addTo(outbreakLayer.current);
      });
    }

    // Fit bounds to show all villages
    if (villages.length > 0 && layers.villages) {
      const bounds = L.latLngBounds(villages.map(v => [v.lat, v.lng]));
      mapInstance.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [villages, workers, outbreaks, layers]);

  if (loading) {
    return (
      <div
        className={`bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center ${containerClassName}`}
        style={{ height: containerHeight, width: containerWidth }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-md ${containerClassName}`}
      style={{ height: containerHeight, width: containerWidth }}
    >
      {/* Header - Clean and simple */}
      {showHeader && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 px-3 py-1.5 pointer-events-auto">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 rounded-md p-1">
                <MapIcon className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-900">Health Map</h3>
                <p className="text-[9px] text-slate-500">Real-time monitoring</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 px-2 py-1.5 flex items-center gap-2">
              <LayerButton
                active={layers.heatmap}
                onClick={() => setLayers(l => ({ ...l, heatmap: !l.heatmap }))}
                icon={Activity}
                label="Heat"
              />
              <div className="w-px h-3 bg-slate-200"></div>
              <LayerButton
                active={layers.outbreaks}
                onClick={() => setLayers(l => ({ ...l, outbreaks: !l.outbreaks }))}
                icon={AlertCircle}
                label="Risk"
                activeColor="text-red-600"
              />
              <div className="w-px h-3 bg-slate-200"></div>
              <LayerButton
                active={layers.workers}
                onClick={() => setLayers(l => ({ ...l, workers: !l.workers }))}
                icon={Users}
                label="Staff"
                activeColor="text-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{ height: mapContainerHeight, width: '100%' }}
        className="map-container"
      />

      {/* Legend - Simple and minimal */}
      {showLegend && (
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 p-2 z-[1000]">
          <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-slate-100">
            <Layers className="w-3 h-3 text-slate-500" />
            <span className="text-[9px] font-medium text-slate-600">Risk Level</span>
          </div>
          <div className="space-y-1">
            <LegendDot color="#ef4444" label="Critical" />
            <LegendDot color="#f59e0b" label="Moderate" />
            <LegendDot color="#10b981" label="Stable" />
          </div>
        </div>
      )}

      {/* Add minimal global styles */}
      <style jsx>{`
        :global(.clean-popup .leaflet-popup-content-wrapper) {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        :global(.clean-popup .leaflet-popup-tip) {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        :global(.map-container img.leaflet-tile) {
          filter: brightness(0.98) contrast(1.02);
        }
      `}</style>
    </div>
  );
}

// Layer Button Component
function LayerButton({ active, onClick, icon: Icon, label, activeColor = "text-blue-600" }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-[9px] font-medium transition-colors px-1.5 py-0.5 rounded ${active ? activeColor : 'text-slate-400 hover:text-slate-600'
        }`}
    >
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </button>
  );
}

// Legend Dot Component
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-[9px] text-slate-600">{label}</span>
    </div>
  );
}