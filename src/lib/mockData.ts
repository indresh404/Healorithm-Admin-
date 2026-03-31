// Realistic Mock Data for Health Dashboard
import { Village, Worker, OutbreakAlert } from '../types';

export const MOCK_VILLAGES: Village[] = [
  { name: 'Alur', lat: 15.123, lng: 77.123, patient_count: 1420, high_risk_count: 85, emergency_cases: 12, worker_count: 24, avg_risk_score: 45.8, last_activity: new Date().toISOString() },
  { name: 'Gooty', lat: 15.234, lng: 77.234, patient_count: 985, high_risk_count: 32, emergency_cases: 4, worker_count: 18, avg_risk_score: 32.4, last_activity: new Date().toISOString() },
  { name: 'Adoni', lat: 15.345, lng: 77.345, patient_count: 2150, high_risk_count: 142, emergency_cases: 28, worker_count: 42, avg_risk_score: 68.2, last_activity: new Date().toISOString() },
  { name: 'Dhone', lat: 15.456, lng: 77.456, patient_count: 1650, high_risk_count: 78, emergency_cases: 8, worker_count: 31, avg_risk_score: 52.1, last_activity: new Date().toISOString() },
  { name: 'Pattikonda', lat: 15.567, lng: 77.567, patient_count: 895, high_risk_count: 18, emergency_cases: 2, worker_count: 15, avg_risk_score: 28.5, last_activity: new Date().toISOString() },
  { name: 'Nandyal', lat: 15.485, lng: 78.486, patient_count: 3200, high_risk_count: 195, emergency_cases: 42, worker_count: 58, avg_risk_score: 72.4, last_activity: new Date().toISOString() },
  { name: 'Kurnool', lat: 15.828, lng: 78.033, patient_count: 5800, high_risk_count: 240, emergency_cases: 65, worker_count: 85, avg_risk_score: 64.9, last_activity: new Date().toISOString() },
  { name: 'Yemmiganur', lat: 15.772, lng: 77.478, patient_count: 1250, high_risk_count: 48, emergency_cases: 9, worker_count: 22, avg_risk_score: 38.2, last_activity: new Date().toISOString() },
  // Additional Rural Nodes for Dense Heatmap
  ...Array.from({ length: 60 }, (_, i) => ({
    name: `Rural Node ${i + 1}`,
    lat: 15.1 + Math.random() * 0.8,
    lng: 77.1 + Math.random() * 1.2,
    patient_count: Math.floor(Math.random() * 500) + 100,
    high_risk_count: Math.floor(Math.random() * 50),
    emergency_cases: Math.floor(Math.random() * 5),
    worker_count: Math.floor(Math.random() * 10) + 2,
    avg_risk_score: Math.random() * 100,
    last_activity: new Date().toISOString()
  }))
];

export const MOCK_WORKERS: Worker[] = [
  { id: 'w1', name: 'Anitha K.', village: 'Alur', lat: 15.125, lng: 77.128, last_sync: new Date().toISOString(), status: 'Active', assigned_patients: 42, visits_this_week: 15, overdue_patients: 3 },
  { id: 'w2', name: 'Lakshmi P.', village: 'Adoni', lat: 15.348, lng: 77.352, last_sync: new Date().toISOString(), status: 'Active', assigned_patients: 48, visits_this_week: 18, overdue_patients: 6 },
  { id: 'w3', name: 'Rani M.', village: 'Dhone', lat: 15.458, lng: 77.462, last_sync: new Date().toISOString(), status: 'Idle', assigned_patients: 35, visits_this_week: 12, overdue_patients: 1 },
  { id: 'w4', name: 'Suresh B.', village: 'Kurnool', lat: 15.832, lng: 78.038, last_sync: new Date().toISOString(), status: 'Active', assigned_patients: 52, visits_this_week: 22, overdue_patients: 8 },
  { id: 'w5', name: 'Meera G.', village: 'Nandyal', lat: 15.488, lng: 78.492, last_sync: new Date().toISOString(), status: 'Active', assigned_patients: 45, visits_this_week: 20, overdue_patients: 4 },
];

export const MOCK_OUTBREAKS: OutbreakAlert[] = [
  { 
    id: 'o1', 
    symptom: 'High Fever & Joint Pain', 
    patient_count: 18, 
    village_names: ['Adoni', 'Yemmiganur'], 
    center_lat: 15.420, 
    center_lng: 77.410, 
    radius_km: 12, 
    severity: 'High', 
    suggested_action: 'Deploy emergency medical team for screening and vector control.' 
  },
  { 
    id: 'o2', 
    symptom: 'Respiratory Distress', 
    patient_count: 12, 
    village_names: ['Nandyal'], 
    center_lat: 15.480, 
    center_lng: 78.480, 
    radius_km: 8, 
    severity: 'Moderate', 
    suggested_action: 'Monitor air quality index and distribute face masks.' 
  },
];

export const MOCK_TRENDS = {
  weeks: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
  weeklyNewCases: [120, 145, 138, 162, 210, 195, 245, 280, 260, 310, 340, 325],
  avgRiskScore: [42, 44, 46, 45, 48, 52, 55, 54, 58, 62, 60, 59],
  adherenceRate: [82, 80, 85, 84, 88, 86, 92, 90, 94, 93, 96, 95],
  emergencyEvents: [12, 15, 10, 18, 22, 19, 25, 28, 24, 32, 28, 30],
  forecast: [330, 345, 360, 350] // Next 4 weeks
};

export const MOCK_RESOURCES = [
  { item: 'Paracetamol 500mg', current_stock: 4500, monthly_consumption: 4200, forecast_demand: 4800, status: 'Low Stock' },
  { item: 'Metformin 500mg', current_stock: 8200, monthly_consumption: 3200, forecast_demand: 3400, status: 'Healthy' },
  { item: 'Amoxicillin 250mg', current_stock: 1200, monthly_consumption: 1100, forecast_demand: 2100, status: 'Critical' },
  { item: 'VPD Vaccines', current_stock: 850, monthly_consumption: 400, forecast_demand: 450, status: 'Healthy' },
];
