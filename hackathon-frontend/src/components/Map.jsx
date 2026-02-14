// komponen Map
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ---- fix icon leaflet ----
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
// ----------------------------

// komponen helper buat gerakin map kalo koordinat berubah
function FlyToLocation({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    // flyTo kasih animasi bagus, bisa juga pake map.setView() 
    map.flyTo(center, zoom);
  }, [center, zoom, map]);

  return null;
}

const Map = () => {
  // default ke London dulu sampe dapet lokasi user
  const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });
  const [hasLocation, setHasLocation] = useState(false);

  // ambil lokasi user pas component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          setHasLocation(true);
        },
        (err) => {
          console.error("Error getting location:", err);
          // opsional: handle error kalo user ga kasih izin
        }
      );
    }
  }, []);

  return (
    <MapContainer 
      center={[position.lat, position.lng]} 
      zoom={18} 
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* komponen helper yg gerakin kamera */}
      <FlyToLocation center={[position.lat, position.lng]} zoom={18} />

      <Marker position={[position.lat, position.lng]} icon={icon}>
        <Popup>
          {hasLocation ? "You are here!" : "Default Location"}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;