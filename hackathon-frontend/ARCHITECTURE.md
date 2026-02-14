# 🏗️ Architecture Flow - TemanJalan Login System

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Login Page (login.jsx)                    │
│  • Email & Password Form                                     │
│  • Show/Hide Password Toggle                                 │
│  • Remember Me Checkbox                                      │
│  • Social Login Buttons                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Auth Context (useAuth Hook)                  │
│  • login(email, password)                                    │
│  • logout()                                                  │
│  • user state                                                │
│  • isAuthenticated                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Service (api.js)                       │
│  • authAPI.login()                                           │
│  • Set Authorization Headers                                 │
│  • Handle HTTP Requests                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌─────────────────┐   ┌──────────────────┐
          │   Next.js API    │   │  Backend API     │
          │   Route Handler  │   │  (Your Server)   │
          │  /api/auth/login │   │  /auth/login     │
          └─────────────────┘   └──────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Response:       │
                    │  {               │
                    │    token: "...", │
                    │    user: {...}   │
                    │  }               │
                    └──────────────────┘
                              │
                              ▼
                ┌─────────────────────────┐
                │   Store in localStorage  │
                │   token: "JWT_TOKEN"     │
                └─────────────────────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │  Redirect to Home/    │
                  │  Protected Dashboard  │
                  └───────────────────────┘
```

---

## 🔄 Login Flow Step by Step

### 1. User Input
```
User opens /auth/login
  ↓
Enters email & password
  ↓
Clicks "Login" button
```

### 2. Form Submit
```jsx
handleSubmit() triggered
  ↓
Validation (email format, required fields)
  ↓
Call: useAuth().login(email, password)
```

### 3. Authentication Process
```jsx
AuthContext.login()
  ↓
Call: authAPI.login() from api.js
  ↓
POST request to backend
  ↓
Backend validates credentials
  ↓
Returns: { token, user }
```

### 4. Store & Redirect
```jsx
Store token in localStorage
  ↓
Update user state in AuthContext
  ↓
router.push('/') - Redirect to home
  ↓
User is now logged in ✅
```

---

## 🛡️ Protected Route Flow

```
User tries to access /dashboard
  ↓
ProtectedRoute component wraps page
  ↓
Check: useAuth().isAuthenticated
  ↓
┌─────────────┬─────────────┐
│             │             │
▼             ▼             ▼
TRUE       FALSE       LOADING
│             │             │
Render      Redirect    Show
Page        to Login    Spinner
```

---

## 📦 Component Hierarchy

```
RootLayout (layout.js)
└── Providers (Providers.jsx)
    └── AuthProvider (AuthContext.jsx)
        ├── LoginPage (login.jsx)
        │   └── Form
        │       ├── Email Input
        │       ├── Password Input
        │       ├── Remember Me
        │       └── Submit Button
        │
        └── Dashboard (dashboard/page.jsx)
            └── ProtectedRoute
                └── Dashboard Content
```

---

## 🔐 Token Flow

```
┌─────────────────────────────────────────┐
│         1. Login Successful              │
│    Backend returns JWT token             │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│   2. Store in localStorage               │
│   localStorage.setItem('token', token)   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│   3. Subsequent API Requests             │
│   Headers: {                             │
│     Authorization: "Bearer <token>"      │
│   }                                      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│   4. Backend Verifies Token              │
│   - Check signature                      │
│   - Check expiration                     │
│   - Return user data                     │
└─────────────────────────────────────────┘
```

---

## 🌐 API Request Flow

```
Component
  │
  ├─→ import apiService
  │
  ├─→ apiService.post('/endpoint', data)
  │     │
  │     ├─→ Get token from localStorage
  │     │
  │     ├─→ Add Authorization header
  │     │
  │     ├─→ fetch(url, {
  │     │      method: 'POST',
  │     │      headers: { Authorization: 'Bearer token' },
  │     │      body: JSON.stringify(data)
  │     │    })
  │     │
  │     └─→ Return response
  │
  └─→ Handle response in component
```

---

## 🎯 State Management Flow

```
AuthContext Provider
  │
  ├── State:
  │   ├── user: null | { id, email, name }
  │   ├── loading: boolean
  │   └── isAuthenticated: boolean
  │
  ├── Methods:
  │   ├── login(email, password)
  │   ├── logout()
  │   ├── register(userData)
  │   └── checkAuth()
  │
  └── Available to all child components via useAuth()

Any Component
  │
  ├─→ const { user, login, logout } = useAuth()
  │
  └─→ Access user data & auth methods
```

---

## 🚦 Error Handling Flow

```
API Call
  │
  ├─→ Try Request
  │     │
  │     ├─→ Success (200)
  │     │     └─→ Return data
  │     │
  │     ├─→ Auth Error (401)
  │     │     └─→ Clear token & redirect to login
  │     │
  │     ├─→ Server Error (500)
  │     │     └─→ Show error message
  │     │
  │     └─→ Network Error
  │           └─→ Show connection error
  │
  └─→ Catch & Display Error to User
```

---

## 📱 Responsive Design

```
Mobile View (< 768px)
  ├── Single column layout
  ├── Full width form
  ├── Stacked buttons
  └── Touch-friendly inputs

Tablet View (768px - 1024px)
  ├── Centered content
  ├── Max-width container
  └── Same layout features

Desktop View (> 1024px)
  ├── Centered form (max 448px)
  ├── Hover effects
  └── Better spacing
```

---

## 🔄 Lifecycle Hooks

```
App Initialization
  │
  ├─→ RootLayout renders
  │
  ├─→ AuthProvider mounts
  │     │
  │     └─→ useEffect runs
  │           │
  │           └─→ checkAuth()
  │                 │
  │                 ├─→ Check localStorage for token
  │                 │
  │                 ├─→ If token exists:
  │                 │     └─→ Verify with backend
  │                 │
  │                 └─→ Update user state
  │
  └─→ App ready with auth state
```

---

## 🎨 UI Component Breakdown

```
LoginPage
│
├── Header
│   ├── Logo (TemanJalan)
│   └── Menu Icon
│
├── Main Content
│   ├── Title Section
│   │   ├── "Login"
│   │   ├── "Welcome to!"
│   │   └── Description text
│   │
│   ├── Form
│   │   ├── Email Input
│   │   ├── Password Input (with toggle)
│   │   ├── Remember Me Checkbox
│   │   ├── Forgot Password Link
│   │   └── Login Button
│   │
│   ├── Create Account Link
│   │
│   ├── Divider ("or")
│   │
│   └── Social Login Buttons
│       ├── Facebook
│       ├── Twitter
│       └── Google
│
└── Footer (optional)
```

---

## 💾 Data Flow Summary

```
Login Form → AuthContext → API Service → Backend
                ↓              ↓            ↓
           Update State   Add Token    Validate
                ↓              ↓            ↓
          Set user data  Headers Auth  Return user
                ↓              
           Save to localStorage
                ↓
           Redirect to home
```

---

Happy Building! 🚀
