import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Scale, Layers, Trash2, ArrowRight } from 'lucide-react';
import { WasteRecord, WasteCategory, DisposalMethod, MeasurementUnit } from '../../types';
import { useData } from '../../contexts/DataContext';

interface WasteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editRecord?: WasteRecord | null;
  initialCategory?: WasteCategory;
  initialDescription?: string;
}

const CATEGORIES: WasteCategory[] = [
  'Plastic',
  'Paper',
  'Glass',
  'Metal',
  'Electronic waste',
  'Organic waste',
  'Other'
];

const DISPOSAL_METHODS: DisposalMethod[] = [
  'Recycled',
  'Composted',
  'Landfill',
  'Donated',
  'Repurposed'
];

const UNITS: MeasurementUnit[] = ['kg', 'g', 'lbs', 'items'];

export const WasteFormModal: React.FC<WasteFormModalProps> = ({
  isOpen,
  onClose,
  editRecord,
  initialCategory,
  initialDescription,
}) => {
  const { addWasteRecord, updateWasteRecord } = useData();

  const [category, setCategory] = useState<WasteCategory>('Plastic');
  const [quantity, setQuantity] = useState<string>('1.5');
  const [unit, setUnit] = useState<MeasurementUnit>('kg');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [disposalMethod, setDisposalMethod] = useState<DisposalMethod>('Recycled');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editRecord) {
      setCategory(editRecord.category);
      setQuantity(String(editRecord.quantity));
      setUnit(editRecord.unit);
      setDate(editRecord.date);
      setDescription(editRecord.description);
      setDisposalMethod(editRecord.disposal_method);
      setNotes(editRecord.notes || '');
    } else {
      setCategory(initialCategory || 'Plastic');
      setDescription(initialDescription || '');
      setQuantity('1.5');
      setUnit('kg');
      setDate(new Date().toISOString().split('T')[0]);
      setDisposalMethod('Recycled');
      setNotes('');
    }
    setError(null);
  }, [editRecord, initialCategory, initialDescription, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(quantity);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a positive numeric quantity.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a brief item description.');
      return;
    }

    if (editRecord) {
      updateWasteRecord(editRecord.id, {
        category,
        quantity: num,
        unit,
        date,
        description: description.trim(),
        disposal_method: disposalMethod,
        notes: notes.trim(),
      });
    } else {
      addWasteRecord({
        category,
        quantity: num,
        unit,
        date,
        description: description.trim(),
        disposal_method: disposalMethod,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/20 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {editRecord ? 'Edit Waste Record' : 'Log New Waste Item'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Keep track of packaging and materials diverted from landfill.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Waste Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as WasteCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800 dark:text-slate-200"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Item Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cleaned milk jugs, cardboard box, aluminum drink cans"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                step="0.05"
                min="0.01"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Measurement Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as MeasurementUnit)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800 dark:text-slate-200"
              >
                {UNITS.map(u => (
                  <option key={u} value={u} className="bg-slate-900 text-white">{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Disposal Method & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Disposal Method
              </label>
              <select
                value={disposalMethod}
                onChange={(e) => setDisposalMethod(e.target.value as DisposalMethod)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800 dark:text-slate-200"
              >
                {DISPOSAL_METHODS.map(method => (
                  <option key={method} value={method} className="bg-slate-900 text-white">
                    {method} {method === 'Landfill' ? '(0 pts)' : '(+pts)'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Date Recorded
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Sorting Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Rinsed with water; dropped off at green bin"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>{editRecord ? 'Save Changes' : 'Record Waste & Earn Points'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
