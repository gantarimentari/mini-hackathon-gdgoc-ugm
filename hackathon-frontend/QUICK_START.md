# 🚀 Quick Start Guide - TemanJalan Login

## Setup Cepat (5 Menit)

### 1. Install Dependencies (Sudah terinstall)

```bash
npm install
```

### 2. Setup Environment Variables

File `.env.local` sudah dibuat. Edit jika perlu:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Test Login Page

Buka browser: `http://localhost:3000/auth/login`

---

## 📋 Checklist Setup

- [x] ✅ Halaman login sudah dibuat
- [x] ✅ API service & auth context sudah ready
- [x] ✅ Auth Provider sudah terintegrasi
- [x] ✅ Protected Route component tersedia
- [ ] ⚠️ Hubungkan dengan backend API Anda
- [ ] ⚠️ Test dengan real credentials
- [ ] ⚠️ Deploy ke production

---

## 🔗 Menghubungkan dengan Backend

### Option 1: Gunakan Mock API (Development)

Edit file `src/app/api/auth/login/route.js`:

```javascript
// Uncomment bagian mock untuk testing tanpa backend
return NextResponse.json(
  {
    success: true,
    message: "Login successful",
    token: "mock-token-" + Date.now(),
    user: {
      id: "1",
      email: email,
      name: "Test User",
    },
  },
  { status: 200 },
);
```

### Option 2: Connect ke Real Backend

1. Update `.env.local` dengan URL backend Anda
2. Pastikan backend API endpoint tersedia di `/auth/login`
3. Format response harus sesuai (lihat dokumentasi)

---

## 📝 Format Response Backend

Backend API harus return format ini:

**Login Success:**

```json
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Login Failed:**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## 🎯 Test Login Flow

### Test dengan Mock Data:

1. Buka `http://localhost:3000/auth/login`
2. Masukkan email apapun (format: email@example.com)
3. Masukkan password apapun
4. Klik Login
5. Check localStorage untuk token
6. Coba akses protected page

### Test dengan Real API:

1. Setup backend API
2. Update `.env.local`
3. Test dengan real credentials
4. Verify token di localStorage
5. Test logout functionality

---

## 🛡️ Membuat Protected Page

Contoh: Dashboard yang hanya bisa diakses setelah login

```jsx
// src/app/dashboard/page.jsx
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1>Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    </ProtectedRoute>
  );
}
```

---

## 🔧 Common Tasks

### Mendapatkan Data User di Component

```jsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated } = useAuth();

  return <div>{user?.name}</div>;
}
```

### Logout User

```jsx
import { useAuth } from "@/contexts/AuthContext";

function Header() {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
}
```

### API Call dengan Authorization

```jsx
import apiService from "@/services/api";

// GET request (token otomatis terkirim)
const data = await apiService.get("/api/protected-endpoint");

// POST request
const result = await apiService.post("/api/data", {
  name: "value",
});
```

### Cek Status Authentication

```jsx
import { useAuth } from "@/contexts/AuthContext";

function NavBar() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <div>Hello, {user.name}</div>;
  }

  return <div>Please login</div>;
}
```

---

## 📁 File Structure

```
src/
├── app/
│   ├── api/auth/login/route.js    # API route handler
│   ├── auth/login.jsx              # Login page
│   └── layout.js                   # Root layout
├── components/
│   ├── Providers.jsx               # Auth provider wrapper
│   └── ProtectedRoute.jsx          # Protected route HOC
├── contexts/
│   └── AuthContext.jsx             # Auth context & hooks
└── services/
    └── api.js                      # API service utilities
```

---

## 🐛 Troubleshooting

### "Cannot find module '@/contexts/AuthContext'"

**Fix:** Pastikan path alias `@` sudah setup di `jsconfig.json` atau `tsconfig.json`

### "localStorage is not defined"

**Fix:** Ini normal di server-side rendering. Code sudah handle ini dengan check `typeof window !== 'undefined'`

### API call gagal

**Fix:**

1. Cek API URL di `.env.local`
2. Cek CORS settings di backend
3. Cek network tab di browser DevTools

---

## 🎨 Customization

### Ubah Warna Theme

Edit style di `login.jsx`:

- Primary color: Cari semua `green-600` → ganti dengan warna lain
- Text color, border, dll bisa disesuaikan

### Tambah Fields

Di `login.jsx`, tambahkan field baru di state & form.

### Social Login Implementation

Update fungsi `handleSocialLogin` di `login.jsx` untuk OAuth flow.

---

## 📚 Next Steps

1. **Buat halaman Register** - Copy pattern dari login
2. **Buat Forgot Password** - Form untuk request reset password
3. **Add Form Validation** - Gunakan react-hook-form + zod
4. **Add Toast Notifications** - Feedback yang lebih baik
5. **Implement Refresh Token** - Auto refresh expired tokens
6. **Add Loading States** - Skeleton screens
7. **Error Boundaries** - Handle errors gracefully

---

## 💡 Tips

- Gunakan React DevTools untuk debug auth state
- Check Network tab untuk debug API calls
- Test di mobile view dengan Chrome DevTools
- Implement proper error logging di production
- Always validate on both frontend & backend
- Use HTTPS in production

---

Need help? Check [LOGIN_DOCUMENTATION.md](./LOGIN_DOCUMENTATION.md) untuk detail lengkap!

Happy Coding! 🎉
