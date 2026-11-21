import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  ExternalLink, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle, 
  Layers, 
  Filter, 
  Plus, 
  AlertCircle 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RecyclingCenter, WasteCategory } from '../../types';
import { useData } from '../../contexts/DataContext';

// Custom Emerald Map Marker Pin
const createEcoIcon = (isDemo = false) => {
  return L.divIcon({
    className: 'custom-eco-marker',
    html: `
      <div style="
        width: 34px; 
        height: 34px; 
        background: ${isDemo ? 'linear-gradient(135deg, #22c55e, #15803d)' : 'linear-gradient(135deg, #10b981, #047857)'}; 
        border: 2px solid white; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg); 
          color: white; 
          font-size: 14px; 
          font-weight: bold;
        ">
          ♻️
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  });
};

// Component to dynamically re-center map when center is selected
const ChangeMapView: React.FC<{ coords: [number, number]; zoom?: number }> = ({ coords, zoom = 13 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, zoom, { duration: 1.2 });
  }, [coords, zoom, map]);
  return null;
};

export const RecyclingMap: React.FC = () => {
  const { recyclingCenters } = useData();

  const [searchCity, setSearchCity] = useState<string>('Seattle');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(recyclingCenters[0] || null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([47.6062, -122.3321]);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);

  // Filter centers
  const filteredCenters = recyclingCenters.filter(c => {
    // City or name search
    if (searchCity.trim()) {
      const q = searchCity.toLowerCase();
      const matchCity = c.city.toLowerCase().includes(q);
      const matchName = c.name.toLowerCase().includes(q);
      const matchAddress = c.address.toLowerCase().includes(q);
      if (!matchCity && !matchName && !matchAddress) return false;
    }

    // Material
    if (selectedMaterial !== 'All') {
      if (!c.accepted_materials.includes(selectedMaterial as WasteCategory)) {
        return false;
      }
    }

    return true;
  });

  const handleSelectCenter = (center: RecyclingCenter) => {
    setSelectedCenter(center);
    setMapCenter([center.latitude, center.longitude]);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCenter([latitude, longitude]);
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        setGeoError(`Location access denied or unavailable (${err.message}). Showing regional centers.`);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Interactive OpenStreetMap
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-amber-500 font-medium">
                Labeled Demo Facilities
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recycling Center Locator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Locate authorized multi-stream depots, certified e-waste facilities, and composting hubs. Get live turn-by-turn directions.
            </p>
          </div>

          <button
            onClick={handleUseMyLocation}
            disabled={geoLoading}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold glass-panel text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 transition-all shrink-0"
          >
            <Navigation className={`w-4 h-4 text-emerald-500 ${geoLoading ? 'animate-spin' : ''}`} />
            <span>{geoLoading ? 'Detecting Location...' : 'Use My Location'}</span>
          </button>
        </div>

        {geoError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{geoError}</span>
          </div>
        )}
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Search & Centers List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search Controls */}
          <div className="p-4 rounded-2xl glass-card border border-emerald-500/20 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search city (e.g. Seattle, San Francisco, New York)..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Accepted Materials</option>
                <option value="Plastic">Plastic</option>
                <option value="Paper">Paper</option>
                <option value="Glass">Glass</option>
                <option value="Metal">Metal</option>
                <option value="Electronic waste">Electronic waste</option>
                <option value="Organic waste">Organic waste</option>
              </select>
            </div>
          </div>

          {/* List of Centers */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredCenters.map(center => {
              const isSelected = selectedCenter?.id === center.id;
              return (
                <div
                  key={center.id}
                  onClick={() => handleSelectCenter(center)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'glass-card border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : 'glass-panel border-emerald-500/10 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {center.name}
                    </h4>
                    {center.is_demo && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 shrink-0">
                        Demo
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{center.address}, {center.city}</span>
                  </p>

                  {/* Accepted Materials tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {center.accepted_materials.map((mat, i) => (
                      <span key={i} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-emerald-950/60 text-slate-600 dark:text-slate-300">
                        {mat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-emerald-950/60 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{center.hours}</span>
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              );
            })}

            {filteredCenters.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 glass-card rounded-2xl">
                No recycling facilities matched your search. Try changing the city query or materials filter.
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Leaflet OpenStreetMap Container (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="h-[580px] rounded-3xl glass-card border border-emerald-500/20 overflow-hidden shadow-2xl relative">
            
            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <ChangeMapView coords={mapCenter} />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {recyclingCenters.map(center => (
                <Marker
                  key={center.id}
                  position={[center.latitude, center.longitude]}
                  icon={createEcoIcon(center.is_demo)}
                  eventHandlers={{
                    click: () => setSelectedCenter(center),
                  }}
                >
                  <Popup>
                    <div className="p-1 max-w-[220px]">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                        {center.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2">
                        {center.address}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                        Hours: {center.hours}
                      </p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <span>Open Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Bottom floating details pill */}
            {selectedCenter && (
              <div className="absolute bottom-4 left-4 right-4 z-[400] p-3 rounded-2xl glass-panel border border-emerald-500/40 shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {selectedCenter.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {selectedCenter.address} · {selectedCenter.hours}
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.latitude},${selectedCenter.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 flex items-center gap-1 shadow-md transition-colors"
                >
                  <span>Navigate</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
