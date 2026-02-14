import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: Ganti dengan URL API backend Anda yang sebenarnya
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-api.com';
    
    // Panggil API backend Anda
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        rememberMe,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: response.status }
      );
    }

    // Kirim response dengan token/data user
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token: data.token,
      user: data.user,
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
