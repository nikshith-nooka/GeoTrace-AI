
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { analyzeLocationByCoordinates, geocodeLocation, getCityHealthSnapshot } from '../services/geminiService';
import type { LocationAnalysisResult, Facility, CityHealthSnapshot } from '../types';
import { LocationReport } from '../components/LocationReport';
import { CityHealthReport } from '../components/CityHealthReport';
import { MagnifyingGlassIcon, CloseIcon } from '../components/icons';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { majorCities, City } from '../data/cities';
import { BackButton } from '../components/BackButton';

// Generate flat heatmap dots
const genHeatmapData = () => {
  return [...Array(120).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: 0.4 + Math.random() * 0.4,
    color: ['#10b981', '#fbbf24', '#f97316', '#ef4444'][Math.floor(Math.random() * 4)]
  }));
};

// Persistent Cache Key
const CACHE_KEY = 'geotrace_analysis_cache';

export const GlobePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [locationAnalysis, setLocationAnalysis] = useState<{ result: LocationAnalysisResult, imageUrl: string | null } | null>(null);
  const [citySnapshot, setCitySnapshot] = useState<CityHealthSnapshot | null>(null);
  const [analysisType, setAnalysisType] = useState<'location' | 'city' | null>(null);
  const [heatmapData] = useState(genHeatmapData());
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const globeEl = useRef<any>(null);

  const [globeDimensions, setGlobeDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState<any | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const [panelTitle, setPanelTitle] = useState('Analysis');
  const [facilityPoints, setFacilityPoints] = useState<any[]>([]);
  const language = 'English';

  // Load cache from localStorage
  const getCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }, []);

  const setCache = useCallback((key: string, value: any) => {
    try {
      const cache = getCache();
      cache[key] = value;
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.warn("Cache storage full or unavailable");
    }
  }, [getCache]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setGlobeDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isGlobeReady && globeEl.current) {
      globeEl.current.pointOfView({ altitude: 2.2 }, 800);
    }
  }, [isGlobeReady]);
  
  const openPanel = (title: string) => {
    setPanelTitle(title);
    setIsPanelOpen(true);
    setIsLoading(true);
    setError(null);
    setLocationAnalysis(null);
    setCitySnapshot(null);
    setFacilityPoints([]); 
  };

  const startLocationAnalysis = useCallback(async (lat: number, lng: number, locationName?: string) => {
    if (isLoading) return;
    
    // Snappy transition
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat, lng, altitude: 0.4 }, 1000);
    }

    const cacheKey = `loc_${lat.toFixed(2)}_${lng.toFixed(2)}`;
    setClickedCoords({ lat, lng });
    setAnalysisType('location');
    openPanel(locationName || 'Analyzing...');

    const cache = getCache();
    if (cache[cacheKey]) {
        setLocationAnalysis(cache[cacheKey]);
        setPanelTitle(cache[cacheKey].result.locationName);
        setIsLoading(false);
        return;
    }
    
    try {
      const result = await analyzeLocationByCoordinates(lat, lng, language, locationName);
      setCache(cacheKey, result);
      setLocationAnalysis(result);
      setPanelTitle(result.analysis.locationName);
    } catch (err) {
      setError("Intelligence recalibrating. Kindly attempt another trace.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, getCache, setCache]);

  const startCityAnalysis = useCallback(async (city: City) => {
    if (isLoading) return;
    if (globeEl.current) {
        globeEl.current.pointOfView({ lat: city.lat, lng: city.lng, altitude: 0.35 }, 1200);
    }

    const cacheKey = `city_${city.name}`;
    setClickedCoords({ lat: city.lat, lng: city.lng });
    setAnalysisType('city');
    openPanel(city.name);

    const cache = getCache();
    if (cache[cacheKey]) {
        setCitySnapshot(cache[cacheKey]);
        setIsLoading(false);
        return;
    }

    try {
        const snapshot = await getCityHealthSnapshot(city.name, city.country, language);
        setCache(cacheKey, snapshot);
        setCitySnapshot(snapshot);
    } catch (err) {
        setError("Urban sensors temporarily disconnected.");
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, getCache, setCache]);

  const handleGlobeClick = useCallback(({ lat, lng }: { lat: number, lng: number }) => {
    startLocationAnalysis(lat, lng);
  }, [startLocationAnalysis]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    setSearchError(null);
    try {
        const { lat, lng, foundLocationName } = await geocodeLocation(searchQuery);
        startLocationAnalysis(lat, lng, foundLocationName);
    } catch (err) {
        setSearchError("Location unreachable.");
    } finally {
        setIsSearching(false);
    }
  }, [searchQuery, isSearching, startLocationAnalysis]);
  
  const closePanel = useCallback(() => {
      setIsPanelOpen(false);
      setSearchQuery('');
      setSearchError(null);
      setAnalysisType(null);
      setClickedCoords(null);
      setFacilityPoints([]);
      if (globeEl.current) {
          const currentPos = globeEl.current.pointOfView();
          globeEl.current.pointOfView({ ...currentPos, altitude: 2.2 }, 800);
      }
  }, []);

  const handleFacilitiesFound = useCallback((facilities: Facility[]) => {
      if (clickedCoords && facilities.length > 0 && globeEl.current) {
          const points = facilities.map(f => ({
              lat: f.lat,
              lng: f.lng,
              name: f.name,
              color: f.type === 'Hospital' ? '#e11d48' : '#10b981'
          }));
          setFacilityPoints(points);
      }
  }, [clickedCoords]);

  const combinedPoints = useMemo(() => [...facilityPoints, ...heatmapData], [facilityPoints, heatmapData]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden bg-black z-40">
      {globeDimensions.width > 0 && (
          <Globe
            ref={globeEl}
            width={globeDimensions.width}
            height={globeDimensions.height}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            globeTileEngineUrl={(x: number, y: number, z: number) => 
                `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`
            }
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            onGlobeClick={handleGlobeClick}
            atmosphereColor="#38bdf8"
            atmosphereAltitude={0.15}
            onGlobeReady={() => setIsGlobeReady(true)}
            
            // ENSURE NO STICKS: pointAltitude is 0. 
            pointsData={combinedPoints}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointAltitude={0} 
            pointRadius={(d: any) => d.size || 0.4}
            pointLabel="name"

            labelsData={majorCities}
            labelLat="lat"
            labelLng="lng"
            labelText="name"
            labelSize={(d: any) => d === hoveredLabel ? 1.0 : 0.6}
            labelDotRadius={0.4}
            labelColor={(d: any) => d === hoveredLabel ? '#fbbf24' : '#fff'}
            labelAltitude={0.01}
            onLabelClick={(label: any) => startCityAnalysis(label as City)}
            onLabelHover={(label: any) => {
                setHoveredLabel(label);
                if (containerRef.current) containerRef.current.style.cursor = label ? 'pointer' : 'default';
            }}
          />
      )}

      {/* Optimized Header */}
      <div className={`absolute top-0 left-0 right-0 p-6 flex justify-center transition-all duration-500 z-50 ${isPanelOpen ? 'opacity-0 -translate-y-full' : 'opacity-100'}`}>
        <div className="max-w-[700px] w-full flex items-center gap-4 bg-white/95 backdrop-blur-xl px-5 py-2 rounded-full border border-white shadow-2xl">
          <BackButton onClick={onBack} className="p-2.5 bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100 shadow-none" />
          <div className="h-6 w-px bg-slate-200"></div>
          <form onSubmit={handleSearch} className="flex-grow flex items-center">
             <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location..."
                className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 font-bold text-sm"
                disabled={isSearching}
              />
              <button type="submit" className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all shadow-md active:scale-90">
                {isSearching ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <MagnifyingGlassIcon className="w-4 h-4" />}
              </button>
          </form>
        </div>
      </div>

      {/* Fast Transition Side Panel */}
      <div className={`absolute top-0 right-0 h-full w-full max-w-[460px] bg-white shadow-2xl transition-transform duration-300 ease-out z-[60] ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col relative">
            <button onClick={closePanel} className="absolute top-4 right-4 z-[70] w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-all active:scale-90">
                <CloseIcon className="w-4 h-4" />
            </button>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full p-10 text-center gap-5">
                        <LoadingSpinner />
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Tracing Atmospheric Data...</p>
                    </div>
                )}
                {error && <div className="m-6 p-5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 font-bold text-xs">{error}</div>}
                {locationAnalysis && analysisType === 'location' && clickedCoords && (
                  <LocationReport 
                    result={locationAnalysis.result} 
                    imageUrl={locationAnalysis.imageUrl} 
                    coords={clickedCoords} 
                    onFacilitiesFound={handleFacilitiesFound} 
                  />
                )}
                {citySnapshot && analysisType === 'city' && <CityHealthReport snapshot={citySnapshot} />}
            </div>
        </div>
      </div>

      {/* Compact Hint */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 z-10 ${isPanelOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
          <div className="bg-white/90 backdrop-blur-lg py-2 px-6 rounded-full border border-white shadow-xl flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Select a coordinate to begin environmental audit</p>
          </div>
      </div>
    </div>
  );
};
