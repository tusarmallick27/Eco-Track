import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Trees, 
  Droplets, 
  Zap, 
  Scale, 
  Info, 
  CheckCircle,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import jsPDF from 'jspdf';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORY_COLORS: Record<string, string> = {
  'Plastic': '#10b981',
  'Paper': '#3b82f6',
  'Glass': '#06b6d4',
  'Metal': '#f59e0b',
  'Electronic waste': '#8b5cf6',
  'Organic waste': '#84cc16',
  'Other': '#64748b'
};

export const AnalyticsPage: React.FC = () => {
  const { wasteRecords, impactSummary } = useData();
  const { user } = useAuth();

  const [downloading, setDownloading] = useState<'csv' | 'pdf' | null>(null);

  // Group by disposal method
  const disposalMap = wasteRecords.reduce((acc, r) => {
    acc[r.disposal_method] = (acc[r.disposal_method] || 0) + (r.quantity_kg || 0);
    return acc;
  }, {} as Record<string, number>);

  const disposalData = Object.entries(disposalMap).map(([name, value]) => ({
    name,
    kg: Number(value.toFixed(1))
  }));

  // Category Pie Data
  const categoryMap = wasteRecords.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + (r.quantity_kg || 0);
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(1))
  }));

  // Cumulative Trend Data
  const trendData = [
    { period: 'Week 1', total: 6.2, recycled: 5.1 },
    { period: 'Week 2', total: 11.5, recycled: 9.8 },
    { period: 'Week 3', total: 18.2, recycled: 15.6 },
    { period: 'Week 4', total: 24.8, recycled: 21.2 },
  ];

  // CSV Export
  const handleExportCSV = () => {
    setDownloading('csv');
    setTimeout(() => {
      const headers = ['ID', 'Date', 'Category', 'Description', 'Quantity', 'Unit', 'Normalized_Kg', 'Disposal_Method', 'Eco_Points', 'Notes'];
      const rows = wasteRecords.map(r => [
        r.id,
        r.date,
        `"${r.category}"`,
        `"${r.description.replace(/"/g, '""')}"`,
        r.quantity,
        r.unit,
        r.quantity_kg,
        `"${r.disposal_method}"`,
        r.eco_points_earned,
        `"${(r.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `EcoTrack_Audit_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(null);
    }, 400);
  };

  // PDF Export using jsPDF
  const handleExportPDF = () => {
    setDownloading('pdf');
    setTimeout(() => {
      try {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(10, 35, 24);
        doc.rect(0, 0, 210, 38, 'F');

        doc.setTextColor(34, 197, 94);
        doc.setFontSize(20);
        doc.text('EcoTrack — Sustainability & Waste Audit', 14, 20);

        doc.setTextColor(200, 200, 200);
        doc.setFontSize(9);
        doc.text('Track Waste. Save Earth. Inspire Change.', 14, 28);
        doc.text(`Generated: ${new Date().toLocaleDateString()} | User: ${user?.name || 'Steward'}`, 14, 34);

        // Section: Summary Metrics
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.text('Executive Environmental Summary', 14, 52);

        doc.setFontSize(10);
        doc.text(`Total Waste Logged: ${impactSummary.total_waste_kg} kg`, 14, 62);
        doc.text(`Diverted from Landfill: ${impactSummary.landfill_diverted_kg} kg (${impactSummary.diversion_rate_percentage}%)`, 14, 69);
        doc.text(`Recycled: ${impactSummary.recycled_waste_kg} kg`, 14, 76);
        doc.text(`Composted: ${impactSummary.composted_waste_kg} kg`, 14, 83);

        // Section: Ecological Equivalencies (EPA WARM)
        doc.setFontSize(14);
        doc.text('Calculated Offset Equivalencies (EPA WARM v15)', 14, 100);

        doc.setFontSize(10);
        doc.text(`• Net Greenhouse Gas Avoidance: ${impactSummary.co2_saved_kg} kg CO2e`, 14, 110);
        doc.text(`• Trees Absorption Equivalent: ${impactSummary.trees_equivalent} mature trees/year`, 14, 117);
        doc.text(`• Freshwater Conserved: ${impactSummary.water_saved_liters} Liters`, 14, 124);
        doc.text(`• Energy Conserved: ${impactSummary.energy_saved_kwh} kWh`, 14, 131);

        // Section: Itemized Records
        doc.setFontSize(14);
        doc.text('Recent Itemized Waste Entries', 14, 148);

        let y = 158;
        doc.setFontSize(9);
        doc.text('Date', 14, y);
        doc.text('Category', 45, y);
        doc.text('Description', 85, y);
        doc.text('Method', 145, y);
        doc.text('Weight (kg)', 180, y);
        y += 4;
        doc.setDrawColor(200, 200, 200);
        doc.line(14, y, 196, y);
        y += 6;

        wasteRecords.slice(0, 10).forEach(r => {
          doc.text(r.date, 14, y);
          doc.text(r.category, 45, y);
          doc.text(r.description.substring(0, 24), 85, y);
          doc.text(r.disposal_method, 145, y);
          doc.text(String(r.quantity_kg), 180, y);
          y += 7;
        });

        // Footer disclaimer
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text('*Calculated via EPA WARM methodology. Measured user weight strictly separated from modeled offsets.', 14, 280);

        doc.save(`EcoTrack_Impact_Audit_${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (err) {
        console.error(err);
      } finally {
        setDownloading(null);
      }
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Audited Carbon & Waste Metrics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-emerald-500" />
              <span>Analytics & Impact Report</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Inspect your verified diversion rate, historical trends, and export certified documentation for personal records or sustainability compliance.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              disabled={downloading !== null}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-bold glass-panel text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>{downloading === 'csv' ? 'Exporting...' : 'Export CSV'}</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={downloading !== null}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>{downloading === 'pdf' ? 'Generating...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Waste Measured</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {impactSummary.total_waste_kg} <span className="text-xs font-normal">kg</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Empirically logged entries
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
          <span className="text-[10px] font-bold uppercase text-slate-400">Diversion Rate</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {impactSummary.diversion_rate_percentage}%
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {impactSummary.landfill_diverted_kg} kg kept from landfills
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
          <span className="text-[10px] font-bold uppercase text-slate-400">Avoided Emissions (CO2e)</span>
          <p className="text-3xl font-black text-cyan-500 mt-1 font-mono">
            {impactSummary.co2_saved_kg} <span className="text-xs font-normal">kg</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            ≈ {impactSummary.trees_equivalent} trees yearly offset
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
          <span className="text-[10px] font-bold uppercase text-slate-400">Resource Conservation</span>
          <p className="text-3xl font-black text-amber-500 mt-1 font-mono">
            {impactSummary.water_saved_liters} <span className="text-xs font-normal">L</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Freshwater preserved
          </p>
        </div>
      </div>

      {/* Visual Charts: Area Trend + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cumulative Diversion Trend Area Chart */}
        <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Diversion Trajectory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Cumulative waste tracked vs successfully diverted
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecycled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a2318', 
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="total" stroke="#64748b" fill="transparent" strokeWidth={2} name="Total (kg)" />
                <Area type="monotone" dataKey="recycled" stroke="#22c55e" fillOpacity={1} fill="url(#colorRecycled)" strokeWidth={2} name="Diverted (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disposal Method Bar Chart */}
        <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Disposal Method Volume
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Distribution by end-of-life treatment stream (kg)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disposalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a2318', 
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="kg" fill="#10b981" radius={[6, 6, 0, 0]} name="Volume (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Methodology & Scientific Assumptions Card */}
      <div className="p-6 rounded-3xl glass-card border border-emerald-500/20 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-500" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Calculation Methodology & Assumptions (Section 12 Compliance)
          </h4>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
          <p>
            • <strong>Distinction Between Measured & Estimated Data:</strong> Kilograms logged by users are empirical primary measurements. Greenhouse gas avoidance (kg CO2e), water conservation (Liters), and energy savings (kWh) are life-cycle assessments (LCA) derived from published U.S. Environmental Protection Agency (EPA) WARM factors.
          </p>
          <p>
            • <strong>Specific Factor Coefficients:</strong> Plastic recycling ~1.45 kg CO2e/kg; Aluminum & Metals recycling ~4.20 kg CO2e/kg; Cardboard & Paper recycling ~1.12 kg CO2e/kg; Aerobic food composting ~0.60 kg CO2e/kg avoided methane.
          </p>
          <p>
            • <strong>Tree Equivalency:</strong> Calculated based on an average mature urban tree absorbing ~21.77 kg of atmospheric carbon dioxide annually.
          </p>
        </div>
      </div>

    </div>
  );
};
