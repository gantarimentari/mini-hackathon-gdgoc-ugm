'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MdConstruction, MdAccessible, MdWarning, MdCheckCircle, MdCameraAlt, MdClose } from 'react-icons/md';
import { FiMapPin, FiUpload, FiX } from 'react-icons/fi';
import { reportsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center font-rubik text-gray-500">
      Loading Map...
    </div>
  ),
});

export default function UpdateLocationPage() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('obstacle');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // state buat mode transportasi
  const [selectedMode, setSelectedMode] = useState('walk');
  
  // state buat foto
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  
  // state buat lokasi user
  const [userLocation, setUserLocation] = useState(null);

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
    }
  }, []);

  const reportTypes = [
    { key: 'obstacle', label: 'Obstacle / Barrier', icon: MdConstruction, desc: 'Lapor jalur terhalang, tangga, atau konstruksi' },
    { key: 'accessible', label: 'Accessible Place', icon: MdAccessible, desc: 'Share lokasi ramah kursi roda' },
    { key: 'hazard', label: 'Hazard', icon: MdWarning, desc: 'Peringatan kondisi jalan berbahaya' },
    { key: 'improvement', label: 'Improvement', icon: MdCheckCircle, desc: 'Saran perbaikan aksesibilitas' },
  ];

  // mode transportasi yang berlaku
  const transportModes = [
    { key: 'walk', label: 'Jalan Kaki', icon: '🚶' },
    { key: 'wheelchair', label: 'Kursi Roda', icon: '♿' },
    { key: 'bike', label: 'Sepeda', icon: '🚲' },
  ];

  // handle pilih foto
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validasi tipe file
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, dll)');
      return;
    }

    // validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5MB');
      return;
    }

    setSelectedImage(file);
    setError('');

    // bikin preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // hapus foto yang dipilih
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // trigger file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // submit laporan ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // validasi
      if (!description.trim()) {
        throw new Error('Deskripsi wajib diisi');
      }

      if (!userLocation) {
        throw new Error('Lokasi belum tersedia, coba lagi');
      }

      let imageUrl = '';

      // upload foto dulu kalo ada
      if (selectedImage) {
        setUploadingImage(true);
        try {
          const uploadResult = await reportsAPI.uploadImage(selectedImage);
          imageUrl = uploadResult.image_url;
        } catch (uploadErr) {
          console.error('Gagal upload foto:', uploadErr);
          // lanjut aja tanpa foto kalo gagal
        }
        setUploadingImage(false);
      }

      // kirim laporan ke backend
      const reportData = await reportsAPI.submitReport(
        user?.id || 'guest_user',
        userLocation.lat,
        userLocation.lng,
        imageUrl,
        `[${reportType.toUpperCase()}] ${description}`,
        selectedMode
      );

      console.log('Laporan berhasil dikirim:', reportData);

      // sukses
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      
      // reset form
      setDescription('');
      setSelectedImage(null);
      setImagePreview(null);
      setReportType('obstacle');
      setSelectedMode('walk');

    } catch (err) {
      console.error('Gagal submit laporan:', err);
      setError(err.message || 'Terjadi kesalahan saat mengirim laporan');
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="font-rubik font-bold text-2xl text-gray-900 mb-1 mt-0">
          Lapor Lokasi
        </h1>
        <p className="font-rubik text-sm text-gray-500 mb-5 mt-0">
          Bantu orang lain dengan berbagi info aksesibilitas
        </p>

        {/* notifikasi sukses */}
        {submitted && (
          <div className="mb-4 p-4 rounded-xl flex items-center gap-3 bg-primary-light">
            <MdCheckCircle className="w-5 h-5 text-primary" />
            <p className="font-rubik text-sm text-primary font-medium m-0">
              Terima kasih! Laporanmu sudah terkirim dan akan diverifikasi AI.
            </p>
          </div>
        )}

        {/* notifikasi error */}
        {error && (
          <div className="mb-4 p-4 rounded-xl flex items-center gap-3 bg-red-50 border border-red-200">
            <MdClose className="w-5 h-5 text-red-600" />
            <p className="font-rubik text-sm text-red-600 font-medium m-0">
              {error}
            </p>
          </div>
        )}

        {/* preview map */}
        <div className="w-full rounded-xl overflow-hidden mb-5 h-[200px] border-[1.5px] border-gray-200">
          <Map />
        </div>
        <p className="font-rubik text-xs text-gray-500 text-center mb-4 -mt-3">
          <FiMapPin className="inline w-3 h-3 mr-1" />
          {userLocation 
            ? `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}`
            : 'Mendapatkan lokasi...'
          }
        </p>

        <form onSubmit={handleSubmit}>
          {/* pilih tipe laporan */}
          <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
            Tipe Laporan
          </p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => setReportType(type.key)}
                  className={`flex flex-col items-start p-3 rounded-xl text-left cursor-pointer ${
                    reportType === type.key
                      ? 'border-2 border-primary bg-primary-light'
                      : 'border-[1.5px] border-gray-200 bg-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1 text-primary" />
                  <span className="font-rubik text-[13px] font-semibold text-gray-900">{type.label}</span>
                  <span className="font-rubik text-[11px] text-gray-500 leading-[14px]">{type.desc}</span>
                </button>
              );
            })}
          </div>

          {/* upload foto */}
          <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
            Foto Lokasi
          </p>
          <div className="mb-5">
            {/* hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* preview foto atau tombol upload */}
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border-[1.5px] border-gray-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {/* tombol hapus */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center cursor-pointer border-none"
                >
                  <FiX className="w-5 h-5 text-white" />
                </button>
                {/* overlay loading kalo lagi upload */}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUploadClick}
                className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                  <MdCameraAlt className="w-6 h-6 text-primary" />
                </div>
                <span className="font-rubik text-sm text-gray-600">
                  Tap untuk ambil/pilih foto
                </span>
                <span className="font-rubik text-xs text-gray-400">
                  JPG, PNG max 5MB
                </span>
              </button>
            )}
          </div>

          {/* pilih mode transportasi */}
          <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
            Mode Transportasi
          </p>
          <div className="flex gap-2 mb-5">
            {transportModes.map((mode) => (
              <button
                key={mode.key}
                type="button"
                onClick={() => setSelectedMode(mode.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl cursor-pointer font-rubik text-sm font-medium transition-colors ${
                  selectedMode === mode.key
                    ? 'bg-primary text-white border-2 border-primary'
                    : 'bg-white text-gray-700 border-[1.5px] border-gray-200'
                }`}
              >
                <span>{mode.icon}</span>
                <span className="text-xs">{mode.label}</span>
              </button>
            ))}
          </div>

          {/* deskripsi */}
          <p className="font-rubik text-xs font-semibold text-gray-500 mb-2 mt-0 uppercase tracking-[0.5px]">
            Deskripsi *
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ceritakan kondisi aksesibilitas di lokasi ini... (contoh: Trotoar berlubang, ada galian kabel)"
            rows={4}
            required
            className="w-full mb-5 p-3 rounded-xl border-[1.5px] border-gray-200 font-rubik text-sm text-gray-900 bg-surface outline-none resize-y box-border"
          />

          {/* tombol submit */}
          <button
            type="submit"
            disabled={loading || !description.trim()}
            className={`w-full flex items-center justify-center gap-2 border-none text-white px-3.5 py-3.5 rounded-xl font-rubik text-[15px] font-semibold shadow-[0_4px_14px_rgba(86,151,108,0.3)] ${
              loading || !description.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                {uploadingImage ? 'Mengupload foto...' : 'Mengirim laporan...'}
              </>
            ) : (
              <>
                <FiUpload className="w-5 h-5" />
                Kirim Laporan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
