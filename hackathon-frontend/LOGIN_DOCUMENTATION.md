# 🔐 Halaman Login - TemanJalan

Halaman login yang telah dibuat dengan fitur lengkap untuk autentikasi user.

## ✨ Fitur

- ✅ Form login dengan validasi email & password
- ✅ Toggle show/hide password
- ✅ Remember Me checkbox
- ✅ Forgot Password link
- ✅ Social Login (Facebook, Twitter, Google)
- ✅ Error handling & loading states
- ✅ Responsive design untuk mobile
- ✅ Integrasi dengan API backend
- ✅ Auth Context untuk state management
- ✅ Token-based authentication

## 📁 Struktur File

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── login/
│   │           └── route.js          # API route untuk login
│   └── auth/
│       └── login.jsx                 # Halaman login
├── contexts/
│   └── AuthContext.jsx               # Context untuk autentikasi
└── services/
    └── api.js                        # Service untuk API calls
```

## 🚀 Cara Menggunakan

### 1. Konfigurasi Environment Variables

Edit file `.env.local` dan ganti dengan URL API backend Anda:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Setup Auth Provider

Wrap aplikasi Anda dengan `AuthProvider` di `layout.js` atau `layout.tsx`:

```jsx
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### 3. Format API Response

Backend API Anda harus mengembalikan response dalam format berikut:

**Success Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 4. Endpoint API yang Dibutuhkan

Backend Anda harus memiliki endpoint berikut:

- `POST /auth/login` - Login user
- `POST /auth/register` - Register user baru
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user data
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Verify email

## 💻 Contoh Penggunaan

### Menggunakan Auth Context di Component Lain

```jsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login first</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Menggunakan API Service Langsung

```jsx
import apiService, { authAPI } from "@/services/api";

// Login
const loginUser = async () => {
  try {
    const response = await authAPI.login("email@example.com", "password123");
    console.log("Logged in:", response);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Custom API call
const fetchData = async () => {
  try {
    const data = await apiService.get("/api/some-endpoint");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

### Protected Route Example

Buat middleware atau component untuk protected routes:

```jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
```

## 🎨 Customisasi

### Mengubah Warna

Edit Tailwind classes di `login.jsx`:

- Login button: `bg-green-600 hover:bg-green-700` → Ganti dengan warna lain
- Focus ring: `focus:ring-green-500` → Ganti dengan warna lain

### Menambah Field Login

Tambahkan field baru di `formData` state:

```jsx
const [formData, setFormData] = useState({
  email: "",
  password: "",
  rememberMe: false,
  phoneNumber: "", // Field baru
});
```

### Implementasi Social Login

Update fungsi `handleSocialLogin`:

```jsx
const handleSocialLogin = async (provider) => {
  try {
    // Redirect ke OAuth provider
    window.location.href = `${API_URL}/auth/${provider}`;
  } catch (error) {
    console.error(`${provider} login failed:`, error);
  }
};
```

## 🔒 Security Best Practices

1. **Jangan simpan password di state lebih lama dari yang diperlukan**
2. **Gunakan HTTPS untuk production**
3. **Implementasi rate limiting di backend**
4. **Gunakan HTTP-only cookies untuk token (lebih aman dari localStorage)**
5. **Implementasi CSRF protection**
6. **Validasi input di frontend & backend**
7. **Gunakan strong password requirements**

## 📱 Testing

### Test Login Flow

1. Buka `http://localhost:3000/auth/login`
2. Masukkan credentials yang valid
3. Klik Login
4. Cek apakah redirect ke homepage
5. Cek localStorage untuk token
6. Test dengan credentials invalid
7. Test remember me functionality

### Mock API untuk Development

Jika backend belum ready, edit `src/app/api/auth/login/route.js`:

```javascript
// Mock response untuk testing
return NextResponse.json(
  {
    success: true,
    message: "Login successful",
    token: "mock-token-123",
    user: {
      id: "1",
      email: email,
      name: "Test User",
    },
  },
  { status: 200 },
);
```

## 🐛 Troubleshooting

### Error: "useAuth must be used within AuthProvider"

**Solusi:** Pastikan component di-wrap dengan `<AuthProvider>`

### Error: "Failed to fetch"

**Solusi:**

- Cek apakah API URL di `.env.local` benar
- Pastikan backend server running
- Cek CORS settings di backend

### Token tidak tersimpan

**Solusi:**

- Cek localStorage di browser DevTools
- Pastikan backend mengembalikan token
- Cek format response dari backend

## 📚 Next Steps

1. ✅ Buat halaman Register
2. ✅ Buat halaman Forgot Password
3. ✅ Implementasi Email Verification
4. ✅ Buat Protected Routes
5. ✅ Implementasi Refresh Token
6. ✅ Add Form Validation (React Hook Form + Zod)
7. ✅ Add Loading Skeleton
8. ✅ Implementasi 2FA (Two-Factor Authentication)

## 💡 Tips

- Gunakan `react-hook-form` untuk form validation yang lebih baik
- Implementasi `zod` untuk schema validation
- Tambahkan loading skeleton untuk better UX
- Implementasi toast notifications untuk feedback
- Gunakan SWR atau React Query untuk data fetching & caching

---

Happy Coding! 🚀
