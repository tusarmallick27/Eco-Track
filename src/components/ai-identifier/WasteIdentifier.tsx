import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Clock, 
  Trash2, 
  Info, 
  ArrowRight, 
  Camera, 
  Check, 
  Database,
  ExternalLink,
  Plus
} from 'lucide-react';
import { WasteAnalysis, WasteCategory } from '../../types';
import { analyzeWasteWithGemini, analyzeWasteWithOfflineEngine, getStoredGeminiKey } from '../../lib/gemini';
import { useData } from '../../contexts/DataContext';

interface WasteIdentifierProps {
  onPreFillWasteRecord: (category: WasteCategory, description: string) => void;
  openSupabaseModal: () => void;
}

const PRESET_SAMPLES = [
  {
    id: 'pet_bottle',
    name: 'Plastic Water Bottle',
    category: 'Plastic',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'soda_can',
    name: 'Aluminum Soda Can',
    category: 'Metal',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'cardboard_box',
    name: 'Shipping Cardboard Box',
    category: 'Paper',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'e_waste_phone',
    name: 'Old Smartphone & Battery',
    category: 'Electronic waste',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'organic_peel',
    name: 'Fruit Peels & Scraps',
    category: 'Organic waste',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'styrofoam_cup',
    name: 'Styrofoam Takeout Cup',
    category: 'Plastic',
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80&w=400',
  }
];

export const WasteIdentifier: React.FC<WasteIdentifierProps> = ({
  onPreFillWasteRecord,
  openSupabaseModal
}) => {
  const { saveWasteAnalysis, analyses } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(PRESET_SAMPLES[0].image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('pet_bottle');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<WasteAnalysis | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const geminiKey = getStoredGeminiKey();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, or WEBP).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size exceeds the 5MB maximum limit.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setSelectedPreset('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof PRESET_SAMPLES[0]) => {
    setSelectedFile(null);
    setSelectedPreset(preset.id);
    setImagePreview(preset.image);
    setError(null);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      setError('Please upload an image or choose one of the sample items below.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      if (selectedFile && geminiKey) {
        // Real multimodal analysis with Gemini Vision API
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64 = reader.result as string;
            const result = await analyzeWasteWithGemini(base64, selectedFile.type, geminiKey);
            setAnalysisResult(result);
            saveWasteAnalysis(result);
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Analysis failed';
            setError(message);
          } finally {
            setLoading(false);
          }
        };
        reader.readAsDataURL(selectedFile);
        return;
      }

      // If preset or if no Gemini Key provided, use offline knowledge engine
      const result = await analyzeWasteWithOfflineEngine(selectedPreset || 'pet_bottle');
      setAnalysisResult(result);
      saveWasteAnalysis(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please check network or API connection.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTracker = () => {
    if (!analysisResult) return;
    onPreFillWasteRecord(
      analysisResult.category,
      `${analysisResult.material_identified} (AI Verified)`
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Computer Vision</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Smart Waste Identifier
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
          Snap or upload packaging, containers, or mystery items. Our AI identifies the material polymer, recyclability index, and exact local sorting guidelines.
        </p>

        {/* Engine Transparency Notice */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-500/20 text-[11px] text-slate-600 dark:text-slate-300">
          <span className={`w-2 h-2 rounded-full ${geminiKey ? 'bg-emerald-500 animate-pulse' : 'bg-lime-500'}`} />
          <span>
            {geminiKey ? 'Live Google Gemini 1.5 Flash Connected' : 'Running EcoTrack Built-in Vision Engine'}
          </span>
          <button
            onClick={openSupabaseModal}
            className="text-emerald-600 dark:text-emerald-400 font-semibold underline ml-1"
          >
            Configure API Key
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Uploader & Presets (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Waste Item Photo</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </h3>

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {/* Preview Box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-emerald-950/40 border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer group transition-all"
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Waste Item Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                    <Upload className="w-4 h-4" />
                    <span>Change Image</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-emerald-500 group-hover:-translate-y-1 transition-transform" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click to upload photo</p>
                  <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WEBP (Max 5MB)</p>
                </div>
              )}

              {/* Scanning Laser Line when loading */}
              {loading && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent animate-pulse" />
              )}
            </div>

            {/* Analyze Action Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !imagePreview}
              className="w-full mt-4 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Material Composition...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Item with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets for Demo Testing */}
          <div className="p-6 rounded-3xl glass-card border border-emerald-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              One-Click Testing Presets
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_SAMPLES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedPreset === preset.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-emerald-950/60 hover:border-emerald-500/40 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <img
                    src={preset.image}
                    alt={preset.name}
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-[11px] font-bold truncate">{preset.name}</p>
                    <p className="text-[9px] text-slate-400">{preset.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Analysis Result Card (7 Cols) */}
        <div className="lg:col-span-7">
          
          {error && (
            <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-600 dark:text-rose-400 mb-6">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Analysis Error</p>
                <p className="mt-0.5">{error}</p>
                <button
                  onClick={handleAnalyze}
                  className="mt-2 text-[11px] font-bold underline hover:text-rose-500 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Retry Analysis
                </button>
              </div>
            </div>
          )}

          {analysisResult ? (
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/30 shadow-2xl space-y-6 animate-fadeIn">
              
              {/* Header Result */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-emerald-950/60">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {analysisResult.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">
                      {analysisResult.confidence_score}% Confidence
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {analysisResult.material_identified}
                  </h3>
                </div>

                <div className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 ${
                  analysisResult.recyclability === 'High' 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : analysisResult.recyclability === 'Special Handling'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{analysisResult.recyclability} Recyclability</span>
                </div>
              </div>

              {/* Decomposition & Bin Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>Landfill Lifespan</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {analysisResult.decomposition_estimate}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <Trash2 className="w-4 h-4 text-emerald-500" />
                    <span>Recommended Disposal Stream</span>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {analysisResult.bin_recommendation}
                  </p>
                </div>
              </div>

              {/* Step by step instructions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>Proper Segregation Guidelines</span>
                </h4>
                <div className="space-y-2">
                  {analysisResult.disposal_instructions.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/30 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carbon Footprint Note */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{analysisResult.carbon_footprint_impact}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100 dark:border-emerald-950/60">
                <button
                  onClick={handleSaveToTracker}
                  className="w-full sm:flex-1 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log this Item in Waste Tracker (+20 pts)</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-3xl glass-card border border-emerald-500/20 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Ready for Visual Analysis
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 leading-relaxed">
                Select one of the sample presets or upload a photo from your device, then click <strong>"Analyze Item with AI"</strong> to extract recyclability metrics.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
