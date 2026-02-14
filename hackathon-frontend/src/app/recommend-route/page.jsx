'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_LOCATIONS, CATEGORIES, RECENT_SEARCHES, ACCESSIBILITY_FEATURES } from '@/data/mockLocations';
import { FiArrowLeft, FiX, FiClock, FiNavigation, FiMapPin, FiAlertTriangle, FiShield } from 'react-icons/fi';
import { MdLocationOn, MdCheck, MdWarning } from 'react-icons/md';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { routesAPI } from '@/services/api';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center font-rubik text-gray-500">
      Loading Map...
    </div>
  ),
});

// status bottom sheet nih
const SHEET_COLLAPSED = 'collapsed';   // cuma search bar doang
const SHEET_SEARCH = 'search';         // search sama hasilnya
const SHEET_DETAIL = 'detail';         // detail lokasi
const SHEET_ROUTE = 'route';           // info rutenya

export default function RecommendRoute() {
  const [sheetState, setSheetState] = useState(SHEET_COLLAPSED);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchInputRef = useRef(null);

  // state buat lokasi user sebagai origin
  const [userLocation, setUserLocation] = useState(null);
  // state buat mode transportasi
  const [selectedMode, setSelectedMode] = useState('walk');
  // state buat data rute dari backend
  const [routeData, setRouteData] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null); // rute yang dipilih user
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');

  // ambil lokasi user waktu component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Gagal dapet lokasi:", err);
          // fallback ke lokasi default (UGM)
          setUserLocation({ lat: -7.7705, lng: 110.3778 });
        }
      );
    } else {
      // fallback kalo browser gak support geolocation
      setUserLocation({ lat: -7.7705, lng: 110.3778 });
    }
  }, []);

  // filter lokasi-lokasi berdasarkan search & kategori
  const filteredLocations = useMemo(() => {
    let results = MOCK_LOCATIONS;
    if (selectedCategory) {
      results = results.filter(loc => loc.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        loc => loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q)
      );
    }
    return results;
  }, [searchQuery, selectedCategory]);

  const handleSearchFocus = () => {
    setSheetState(SHEET_SEARCH);
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setSearchQuery(loc.name);
    setSheetState(SHEET_DETAIL);
    // reset route data kalo pilih lokasi baru
    setRouteData(null);
    setRouteError('');
  };

  // panggil API buat dapetin rute
  const handleGetRoute = async () => {
    if (!userLocation || !selectedLocation) return;

    setRouteLoading(true);
    setRouteError('');
    setSheetState(SHEET_ROUTE);

    try {
      const origin = { lat: userLocation.lat, lng: userLocation.lng };
      const destination = { lat: selectedLocation.lat, lng: selectedLocation.lng };

      const response = await routesAPI.getRoutes(origin, destination, selectedMode);
      setRouteData(response);
      // auto-select recommended route
      if (response.recommended_route_id) {
        setSelectedRouteId(response.recommended_route_id);
      } else if (response.data && response.data.length > 0) {
        setSelectedRouteId(response.data[0].id);
      }
      console.log('Rute dari backend:', response);
    } catch (err) {
      console.error('Gagal dapet rute:', err);
      setRouteError(err.message || 'Gagal mendapatkan rute');
    } finally {
      setRouteLoading(false);
    }
  };

  const handleBack = () => {
    if (sheetState === SHEET_ROUTE) {
      setSheetState(SHEET_DETAIL);
      setRouteData(null);
      setSelectedRouteId(null);
      setRouteError('');
    } else if (sheetState === SHEET_DETAIL) {
      setSheetState(SHEET_SEARCH);
      setSelectedLocation(null);
      setRouteData(null);
    } else {
      setSheetState(SHEET_COLLAPSED);
      setSearchQuery('');
      setSelectedCategory(null);
    }
  };

  // mode transportasi options
  const transportModes = [
    { key: 'walk', label: 'Jalan Kaki', icon: '🚶' },
    { key: 'wheelchair', label: 'Kursi Roda', icon: '♿' },
    { key: 'bike', label: 'Sepeda', icon: '🚲' },
  ];

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedLocation(null);
    setSelectedCategory(null);
    searchInputRef.current?.focus();
  };

  // komponen rating bintang
  const StarRating = ({ rating }) => {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.3;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xs ${i < full ? 'text-yellow-500' : (i === full && hasHalf ? 'text-yellow-500' : 'text-gray-200')}`}>
            {i < full ? '★' : (i === full && hasHalf ? '★' : '☆')}
          </span>
        ))}
        <span className="font-rubik text-xs text-gray-500 ml-1">{rating}</span>
      </div>
    );
  };

  // hitung tinggi bottom sheet-nya
  const getSheetMaxHeight = () => {
    switch (sheetState) {
      case SHEET_COLLAPSED: return '160px';
      case SHEET_SEARCH: return '70vh';
      case SHEET_DETAIL: return '55vh';
      case SHEET_ROUTE: return '75vh'; // lebih tinggi buat nampilin multiple routes
      default: return '160px';
    }
  };

  // helper buat dapetin warna safety score
  const getSafetyColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' };
    if (score >= 50) return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' };
    return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
  };

  // ambil rute yang sedang dipilih
  const selectedRoute = useMemo(() => {
    if (!routeData?.data || !selectedRouteId) return null;
    return routeData.data.find(r => r.id === selectedRouteId);
  }, [routeData, selectedRouteId]);

  return (
    <div className="relative w-full bg-white" style={{ height: 'calc(100vh - 52px)' }}>
      {/* kontainer map fullscreen */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Map />
      </div>

      {/* bottom sheet yg bisa naik turun */}
      <div
        className="absolute bottom-0 left-0 w-full z-30 flex flex-col items-center overflow-hidden bg-white rounded-t-[22px] shadow-[0px_-4px_24px_rgba(0,0,0,0.12)] pt-3"
        style={{
          maxHeight: getSheetMaxHeight(),
          transition: 'max-height 0.3s ease',
        }}
      >
        {/* handle buat drag */}
        <div className="w-[58px] h-1.5 bg-gray-200 rounded-xl shrink-0 mb-3" />

        {/* isi yg bisa di scroll */}
        <div className="w-full flex-1 overflow-y-auto px-4 pb-5">

          {/* kotak search */}
          <div className="flex flex-row items-center px-3 w-full h-[54px] bg-gray-100 rounded-lg box-border shrink-0">
            {/* tombol back kalo lagi expanded */}
            {sheetState !== SHEET_COLLAPSED && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center mr-2 w-8 h-8 bg-transparent border-none cursor-pointer p-0 shrink-0"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}

            {/* icon lokasi bulat */}
            {sheetState === SHEET_COLLAPSED && (
              <div className="relative flex items-center justify-center mr-3 w-[38px] h-[38px] shrink-0">
                <div className="absolute w-[38px] h-[38px] rounded-full bg-gray-300" />
                <HiOutlineLocationMarker className="relative z-10 w-[18px] h-[18px] text-gray-800" />
              </div>
            )}

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Where to?"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedLocation(null); }}
              onFocus={handleSearchFocus}
              className={`flex-1 font-rubik text-base leading-4 text-gray-700 bg-transparent border-none outline-none p-0 ${
                searchQuery ? 'font-normal' : 'font-bold'
              }`}
            />

            {searchQuery && (
              <button onClick={handleClearSearch} className="bg-transparent border-none cursor-pointer p-1">
                <FiX className="w-[18px] h-[18px] text-gray-500" />
              </button>
            )}
          </div>

          {/* =========================== COLLAPSED =========================== */}
          {sheetState === SHEET_COLLAPSED && (
            <div className="mt-4">
              {/* tombol-tombol kategori */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedCategory(key); setSheetState(SHEET_SEARCH); }}
                    className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer px-3.5 py-2 rounded-[20px] border-[1.5px] border-gray-200 bg-white font-rubik text-[13px] text-gray-700 shrink-0"
                  >
                    <span>{cat.icon}</span> {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* =========================== SEARCH =========================== */}
          {sheetState === SHEET_SEARCH && (
            <div className="mt-3">
              {/* filter kategori */}
              <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-2xl border-none font-rubik text-xs font-medium shrink-0 ${
                    !selectedCategory ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All
                </button>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                    className={`whitespace-nowrap cursor-pointer px-3 py-1.5 rounded-2xl border-none font-rubik text-xs font-medium shrink-0 ${
                      selectedCategory === key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>

              {/* history pencarian (kalo ga ada query) */}
              {!searchQuery && !selectedCategory && (
                <div className="mb-4">
                  <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
                    Recent
                  </p>
                  {RECENT_SEARCHES.map((item) => {
                    const loc = MOCK_LOCATIONS.find(l => l.id === item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => loc && handleSelectLocation(loc)}
                        className="w-full flex items-center gap-3 text-left cursor-pointer py-2.5 px-1 bg-transparent border-none border-b border-gray-100"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 shrink-0">
                          <FiClock className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-rubik text-sm font-medium text-gray-900 m-0 overflow-hidden text-ellipsis whitespace-nowrap">{item.name}</p>
                          <p className="font-rubik text-xs text-gray-500 mt-0.5 mb-0">{item.address}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* hasil pencarian */}
              <div>
                {(searchQuery || selectedCategory) && (
                  <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
                    {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
                  </p>
                )}
                {!searchQuery && !selectedCategory && (
                  <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
                    Nearby Accessible Places
                  </p>
                )}
                {filteredLocations.map((loc) => {
                  const cat = CATEGORIES[loc.category];
                  return (
                    <button
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full flex items-center gap-3 text-left cursor-pointer py-2.5 px-1 bg-transparent border-none border-b border-gray-100"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface shrink-0 text-lg">
                        {cat?.icon || '📍'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-rubik text-sm font-medium text-gray-900 m-0 overflow-hidden text-ellipsis whitespace-nowrap flex-1">{loc.name}</p>
                          {loc.accessible && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-primary-light text-primary font-rubik font-medium shrink-0">
                              ♿ Accessible
                            </span>
                          )}
                        </div>
                        <p className="font-rubik text-xs text-gray-500 mt-0.5 mb-0 overflow-hidden text-ellipsis whitespace-nowrap">{loc.address}</p>
                      </div>
                    </button>
                  );
                })}
                {filteredLocations.length === 0 && (
                  <div className="text-center py-8">
                    <p className="font-rubik text-sm text-gray-500">No locations found</p>
                    <p className="font-rubik text-xs text-gray-300 mt-1">Try a different search term or category</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================== DETAIL =========================== */}
          {sheetState === SHEET_DETAIL && selectedLocation && (
            <div className="mt-4">
              {/* header lokasi */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-surface shrink-0 text-2xl">
                  {CATEGORIES[selectedLocation.category]?.icon || '📍'}
                </div>
                <div className="flex-1">
                  <h3 className="font-rubik font-semibold text-lg text-gray-900 mb-1 mt-0">
                    {selectedLocation.name}
                  </h3>
                  <p className="font-rubik text-[13px] text-gray-500 mb-1.5 mt-0">
                    {selectedLocation.address}
                  </p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={selectedLocation.rating} />
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-rubik font-medium ${
                        selectedLocation.accessible
                          ? 'bg-primary-light text-primary'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {selectedLocation.accessible ? '♿ Accessible' : '⚠️ Limited Access'}
                    </span>
                  </div>
                </div>
              </div>

              {/* fitur aksesibilitas */}
              <div className="mb-4">
                <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
                  Accessibility Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.features.map((feat) => {
                    const featureInfo = ACCESSIBILITY_FEATURES.find(f => f.key === feat);
                    return (
                      <span
                        key={feat}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface font-rubik text-xs text-gray-700 font-medium"
                      >
                        {featureInfo?.icon || '✓'} {feat}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* pilih mode transportasi */}
              <div className="mb-4">
                <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
                  Mode Transportasi
                </p>
                <div className="flex gap-2">
                  {transportModes.map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => setSelectedMode(mode.key)}
                      className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl cursor-pointer font-rubik text-sm font-medium transition-colors ${
                        selectedMode === mode.key
                          ? 'bg-primary text-white border-2 border-primary'
                          : 'bg-white text-gray-700 border-[1.5px] border-gray-200'
                      }`}
                    >
                      <span>{mode.icon}</span>
                      <span className="text-[10px] sm:text-xs">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* tombol dapetin rute */}
              <button
                onClick={handleGetRoute}
                disabled={!userLocation}
                className={`w-full flex items-center justify-center gap-2 border-none text-white px-3.5 py-3.5 rounded-xl font-rubik text-[15px] font-semibold shadow-[0_4px_14px_rgba(86,151,108,0.3)] ${
                  !userLocation ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary cursor-pointer'
                }`}
              >
                <FiNavigation className="w-[18px] h-[18px]" />
                Get Accessible Route
              </button>
            </div>
          )}

          {/* =========================== ROUTE =========================== */}
          {sheetState === SHEET_ROUTE && selectedLocation && (
            <div className="mt-4">
              {/* loading state */}
              {routeLoading && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
                  <p className="font-rubik text-sm text-gray-500">Mencari rute terbaik...</p>
                </div>
              )}

              {/* error state */}
              {routeError && !routeLoading && (
                <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="font-rubik text-sm text-red-600 m-0">{routeError}</p>
                  <button
                    onClick={handleGetRoute}
                    className="mt-2 font-rubik text-sm text-primary font-medium bg-transparent border-none cursor-pointer p-0"
                  >
                    Coba lagi
                  </button>
                </div>
              )}

              {/* tampilkan route data dari backend */}
              {routeData && !routeLoading && (
                <>
                  {/* header dengan pesan */}
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-primary-light">
                    <FiMapPin className="w-6 h-6 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="font-rubik font-semibold text-sm text-gray-900 m-0">
                        {selectedLocation.name}
                      </p>
                      <p className="font-rubik text-xs text-primary mt-0.5 mb-0 font-medium">
                        {routeData.message || `${routeData.data?.length || 0} rute ditemukan`}
                      </p>
                    </div>
                  </div>

                  {/* pilihan rute */}
                  <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
                    Pilih Rute ({routeData.data?.length || 0} opsi)
                  </p>
                  <div className="flex flex-col gap-2 mb-4">
                    {routeData.data?.map((route) => {
                      const isRecommended = route.id === routeData.recommended_route_id;
                      const isSelected = route.id === selectedRouteId;
                      const safetyColors = getSafetyColor(route.safety_score);
                      
                      return (
                        <button
                          key={route.id}
                          onClick={() => setSelectedRouteId(route.id)}
                          className={`w-full p-3 rounded-xl text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-2 border-primary bg-primary-light'
                              : 'border-[1.5px] border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              {isRecommended && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-white font-rubik font-semibold shrink-0">
                                  ⭐ RECOMMENDED
                                </span>
                              )}
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-rubik font-medium shrink-0 ${safetyColors.bg} ${safetyColors.text}`}>
                                <FiShield className="inline w-3 h-3 mr-0.5" />
                                {route.safety_score}%
                              </span>
                            </div>
                            <span className="font-rubik text-sm font-bold text-gray-900">
                              {route.duration_mins} menit
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500 font-rubik">
                            <span>💰 {route.price === 0 ? 'Gratis' : `Rp ${route.price.toLocaleString()}`}</span>
                            {route.detected_obstacles?.length > 0 && (
                              <span className="text-yellow-600">
                                ⚠️ {route.detected_obstacles.length} hambatan
                              </span>
                            )}
                          </div>

                          {/* warnings */}
                          {route.warnings?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {route.warnings.slice(0, 2).map((warn, idx) => (
                                <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-rubik">
                                  {warn}
                                </span>
                              ))}
                              {route.warnings.length > 2 && (
                                <span className="text-[10px] text-gray-400 font-rubik">
                                  +{route.warnings.length - 2} lainnya
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* detail rute yang dipilih */}
                  {selectedRoute && (
                    <>
                      {/* info ringkasan */}
                      <div className="flex gap-3 mb-4">
                        <div className="flex-1 text-center p-3 rounded-xl bg-surface">
                          <p className="font-rubik text-lg font-bold text-gray-900 m-0">
                            {selectedRoute.duration_mins}
                          </p>
                          <p className="font-rubik text-[11px] text-gray-500 mt-0.5 mb-0">menit</p>
                        </div>
                        <div className={`flex-1 text-center p-3 rounded-xl ${getSafetyColor(selectedRoute.safety_score).bg}`}>
                          <p className={`font-rubik text-lg font-bold m-0 ${getSafetyColor(selectedRoute.safety_score).text}`}>
                            {selectedRoute.safety_score}%
                          </p>
                          <p className={`font-rubik text-[11px] mt-0.5 mb-0 font-medium ${getSafetyColor(selectedRoute.safety_score).text}`}>
                            Safety
                          </p>
                        </div>
                        <div className="flex-1 text-center p-3 rounded-xl bg-surface">
                          <p className="font-rubik text-lg font-bold text-gray-900 m-0">
                            {selectedRoute.price === 0 ? '🆓' : `Rp${selectedRoute.price}`}
                          </p>
                          <p className="font-rubik text-[11px] text-gray-500 mt-0.5 mb-0">Biaya</p>
                        </div>
                      </div>

                      {/* detected obstacles */}
                      {selectedRoute.detected_obstacles?.length > 0 && (
                        <div className="mb-4">
                          <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
                            ⚠️ Hambatan Terdeteksi ({selectedRoute.detected_obstacles.length})
                          </p>
                          <div className="flex flex-col gap-2">
                            {selectedRoute.detected_obstacles.map((obs) => (
                              <div 
                                key={obs.id} 
                                className={`p-2.5 rounded-lg border ${
                                  obs.severity === 'high' 
                                    ? 'bg-red-50 border-red-200' 
                                    : obs.severity === 'medium'
                                    ? 'bg-yellow-50 border-yellow-200'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-rubik font-semibold ${
                                    obs.severity === 'high' ? 'text-red-600' : 
                                    obs.severity === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                                  }`}>
                                    {obs.type === 'pothole' ? '🕳️' : 
                                     obs.type === 'stairs' ? '🪜' : 
                                     obs.type === 'construction' ? '🚧' : '⚠️'}
                                    {obs.type}
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-rubik font-medium ${
                                    obs.severity === 'high' ? 'bg-red-100 text-red-700' : 
                                    obs.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {obs.severity}
                                  </span>
                                </div>
                                <p className="font-rubik text-xs text-gray-600 mt-1 mb-0">
                                  {obs.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* warnings list */}
                      {selectedRoute.warnings?.length > 0 && (
                        <div className="mb-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                          <p className="font-rubik text-xs font-semibold text-yellow-700 mb-2 mt-0">
                            <MdWarning className="inline w-4 h-4 mr-1" />
                            Peringatan
                          </p>
                          <ul className="m-0 pl-4">
                            {selectedRoute.warnings.map((warn, idx) => (
                              <li key={idx} className="font-rubik text-xs text-yellow-700 mb-1">
                                {warn}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* tombol mulai navigasi */}
                      <button
                        className="w-full flex items-center justify-center gap-2 cursor-pointer border-none text-white px-3.5 py-3.5 rounded-xl bg-primary font-rubik text-[15px] font-semibold shadow-[0_4px_14px_rgba(86,151,108,0.3)]"
                      >
                        <FiNavigation className="w-[18px] h-[18px]" />
                        Start Navigation
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
