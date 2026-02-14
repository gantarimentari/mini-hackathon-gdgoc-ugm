// helper buat handle semua request HTTP

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // ambil auth token dari localStorage
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // set headers sama authorization
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // method request generic
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: this.getHeaders(options.headers),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // request GET
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  // request POST
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // request PUT
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // request DELETE  
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  // request PATCH
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// export instance tunggal
const apiService = new ApiService();
export default apiService;

// export juga method auth khusus biar gampang dipake
export const authAPI = {
  login: (email, password, rememberMe = false) =>
    apiService.post('/auth/login', { email, password, rememberMe }),
  
  register: (userData) =>
    apiService.post('/auth/register', userData),
  
  logout: () =>
    apiService.post('/auth/logout'),
  
  forgotPassword: (email) =>
    apiService.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, password) =>
    apiService.post('/auth/reset-password', { token, password }),
  
  verifyEmail: (token) =>
    apiService.post('/auth/verify-email', { token }),
  
  getCurrentUser: () =>
    apiService.get('/auth/me'),
};

// =============================================
// API buat fitur routing - nyari rute ramah
// =============================================
export const routesAPI = {
  // minta rekomendasi rute dari BE
  getRoutes: (origin, destination, mode = 'walk') =>
    apiService.post('/api/routes', {
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destination.lat, lng: destination.lng },
      mode, // walk, wheelchair, dll
    }),
};

// =============================================
// API buat fitur komunitas - lapor trotoar rusak
// =============================================
export const reportsAPI = {
  // kirim laporan ke BE
  submitReport: (userId, lat, lng, imageUrl, description, mode = 'walk') =>
    apiService.post('/api/reports', {
      user_id: userId,
      requested_mode: mode,
      lat,
      lng,
      image_url: imageUrl,
      description,
    }),

  // upload foto dulu ke storage (firebase/cloudinary/dll)
  // ini bisa dipake sebelum submitReport
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = apiService.getToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // jangan set Content-Type, biar browser yg handle multipart boundary
    
    const response = await fetch(`${apiService.baseURL}/api/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Gagal upload gambar');
    }
    
    return response.json(); // harusnya return { image_url: "..." }
  },
};

// =============================================
// API buat fitur map - lihat POI ramah/bahaya
// =============================================
export const poisAPI = {
  // ambil titik-titik lokasi di sekitar koordinat
  getPOIs: (lat, lng, radius = 2) =>
    apiService.get(`/api/pois?lat=${lat}&lng=${lng}&radius=${radius}`),
};

