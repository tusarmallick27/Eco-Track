import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Layers, 
  Calendar, 
  Scale, 
  CheckCircle, 
  AlertCircle,
  Download
} from 'lucide-react';
import { WasteRecord, WasteCategory, DisposalMethod } from '../../types';
import { useData } from '../../contexts/DataContext';
import { WasteFormModal } from './WasteFormModal';

interface WasteTrackerProps {
  onOpenAddModal: () => void;
}

export const WasteTracker: React.FC<WasteTrackerProps> = () => {
  const { wasteRecords, deleteWasteRecord } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMethod, setSelectedMethod] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WasteRecord | null>(null);

  // Filter records
  const filteredRecords = wasteRecords.filter(rec => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = rec.description.toLowerCase().includes(q);
      const matchCat = rec.category.toLowerCase().includes(q);
      const matchNotes = (rec.notes || '').toLowerCase().includes(q);
      if (!matchDesc && !matchCat && !matchNotes) return false;
    }

    // Category
    if (selectedCategory !== 'All' && rec.category !== selectedCategory) {
      return false;
    }

    // Method
    if (selectedMethod !== 'All' && rec.disposal_method !== selectedMethod) {
      return false;
    }

    // Date
    if (dateFilter === 'This Month') {
      const now = new Date();
      const recDate = new Date(rec.date);
      if (recDate.getMonth() !== now.getMonth() || recDate.getFullYear() !== now.getFullYear()) {
        return false;
      }
    }

    return true;
  });

  const totalFilteredKg = filteredRecords.reduce((acc, r) => acc + (r.quantity_kg || 0), 0);
  const totalFilteredPoints = filteredRecords.reduce((acc, r) => acc + (r.eco_points_earned || 0), 0);

  const handleEdit = (record: WasteRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, desc: string) => {
    if (confirm(`Are you sure you want to delete the record "${desc}"?`)) {
      deleteWasteRecord(id);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Interactive Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Waste Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Log, categorize, and monitor waste streams with full database CRUD control.
          </p>
        </div>

        <button
          onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
          className="px-5 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Waste Record</span>
        </button>
      </div>

      {/* Filter Bar & Metric Summary Banner */}
      <div className="space-y-4">
        
        {/* Metric summary bar for filtered query */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass-card border border-emerald-500/20">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Items Shown</span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {filteredRecords.length}
            </p>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-emerald-500/20">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Weight</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              {totalFilteredKg.toFixed(2)} kg
            </p>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-emerald-500/20">
            <span className="text-[10px] font-bold uppercase text-slate-400">Points Yield</span>
            <p className="text-xl font-black text-lime-500 mt-1 font-mono">
              +{totalFilteredPoints} pts
            </p>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-emerald-500/20">
            <span className="text-[10px] font-bold uppercase text-slate-400">Recycled / Composted</span>
            <p className="text-xl font-black text-cyan-500 mt-1 font-mono">
              {filteredRecords.filter(r => r.disposal_method !== 'Landfill').length} items
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/20 flex flex-wrap items-center gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search description, packaging type, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            <option value="Plastic">Plastic</option>
            <option value="Paper">Paper</option>
            <option value="Glass">Glass</option>
            <option value="Metal">Metal</option>
            <option value="Electronic waste">Electronic waste</option>
            <option value="Organic waste">Organic waste</option>
            <option value="Other">Other</option>
          </select>

          {/* Disposal Method */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Disposal Methods</option>
            <option value="Recycled">Recycled</option>
            <option value="Composted">Composted</option>
            <option value="Landfill">Landfill</option>
            <option value="Donated">Donated</option>
            <option value="Repurposed">Repurposed</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Time</option>
            <option value="This Month">This Month</option>
          </select>

          {(searchQuery || selectedCategory !== 'All' || selectedMethod !== 'All' || dateFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedMethod('All');
                setDateFilter('All');
              }}
              className="text-xs text-rose-500 hover:underline px-2 py-1 font-semibold"
            >
              Reset Filters
            </button>
          )}

        </div>

      </div>

      {/* Waste Records Table / Card List */}
      <div className="rounded-3xl glass-card border border-emerald-500/20 overflow-hidden shadow-xl">
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-emerald-950/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-emerald-950">
                <tr>
                  <th className="px-6 py-4">Item & Category</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Disposal Method</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Eco Points</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/60 text-slate-700 dark:text-slate-300">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-emerald-500/[0.03] transition-colors">
                    
                    {/* Item & Category */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{rec.description}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                            {rec.category}
                          </span>
                          {rec.notes && (
                            <span className="text-[10px] text-slate-400 truncate max-w-xs">
                              · {rec.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4 font-mono font-semibold">
                      {rec.quantity} {rec.unit}
                    </td>

                    {/* Disposal Method */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        rec.disposal_method === 'Recycled'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : rec.disposal_method === 'Composted'
                          ? 'bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/30'
                          : rec.disposal_method === 'Landfill'
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {rec.disposal_method}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                      {rec.date}
                    </td>

                    {/* Points */}
                    <td className="px-6 py-4">
                      {rec.eco_points_earned > 0 ? (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          +{rec.eco_points_earned} pts
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">0 pts</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(rec)}
                          title="Edit Record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id, rec.description)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <Layers className="w-12 h-12 mx-auto text-emerald-500/40 mb-3" />
            <h4 className="text-base font-bold text-slate-800 dark:text-white">
              No matching waste records found
            </h4>
            <p className="text-xs mt-1">
              Try adjusting your filter search or log a new waste item to get started.
            </p>
          </div>
        )}
      </div>

      {/* Modal for Add / Edit */}
      <WasteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editRecord={editingRecord}
      />

    </div>
  );
};
