'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaFacebookF, FaTwitter, FaGoogle } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      router.push('/');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="justify-center  min-h-screen flex flex-col items-center bg-[#F6F7FB] px-4">
      {/* Card */}
      <div className=" flex flex-col items-center p-12 gap-6 w-full max-w-[392px]  bg-surface rounded-[10px] box-border">
        {/* Login title */}
        <span className="font-inter font-bold text-xl leading-6 tracking-[0.15px] text-[#1A2D21]">
          Login
        </span>

        {/* Form content */}
        <div className="flex flex-col items-start gap-5 w-full">
          {/* Welcome + subtitle */}
          <div className="flex flex-col gap-1 w-full">
            <h2 className="font-inter font-semibold text-2xl leading-[38px] text-[#262B43E5]/90 m-0">
              Welcome to!
            </h2>
            <p className="font-inter font-normal text-[15px] leading-[22px] text-[#262B43E5]/70 m-0">
              Please sign-in to your account and start the adventure
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="w-full px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg font-inter text-sm text-danger box-border">
              {error}
            </div>
          )}

          {/* Email input */}
          <div className="w-full">
            <div className="box-border flex flex-col items-start w-full h-12 border border-[var(--border-figma)] rounded-lg overflow-hidden">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 py-3 border-none outline-none bg-transparent font-inter font-normal text-[15px] leading-6 text-[var(--text-primary-figma)] box-border"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="w-full">
            <div className="box-border flex flex-row items-center w-full h-12 border border-[var(--border-figma)] rounded-lg overflow-hidden pr-3">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="flex-1 h-12 px-4 py-3 border-none outline-none bg-transparent font-inter font-normal text-[15px] leading-6 text-[var(--text-primary-figma)] box-border"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="w-5 h-5 bg-transparent border-none cursor-pointer p-0 flex items-center justify-center text-[var(--text-primary-figma)]"
                aria-label="Toggle password"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="w-5 h-5" />
                ) : (
                  <AiOutlineEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          {/* <div className="flex flex-row items-center w-full gap-2">
            <label className="flex flex-row items-center flex-1 cursor-pointer gap-0">
              <span className="flex items-center justify-center p-1.5 rounded-full">
                <span
                  className={`flex items-center justify-center w-[18px] h-[18px] rounded-[6px] cursor-pointer ${
                    formData.rememberMe
                      ? 'bg-primary shadow-[0px_2px_6px_rgba(38,43,67,0.14)]'
                      : 'bg-white border-2 border-[var(--border-figma)]'
                  }`}
                >
                  {formData.rememberMe && (
                    <FiCheck className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </span>
              </span>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="hidden"
              />
              <span className="font-inter font-normal text-[15px] leading-[22px] text-[var(--text-primary-figma)]">
                Remember Me
              </span>
            </label>

            <Link
              href="/auth/forgot-password"
              className="font-inter font-normal text-[15px] leading-[22px] text-right text-accent-purple no-underline"
            >
              Forgot Password?
            </Link>
          </div> */}

          {/* Login button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className={`flex flex-row justify-center items-center px-[22px] py-2 w-full h-[38px] bg-primary shadow-[0px_2px_6px_rgba(38,43,67,0.14)] rounded-lg border-none box-border ${
              loading ? 'cursor-default opacity-70' : 'cursor-pointer opacity-100'
            }`}
          >
            <span className="font-inter font-medium text-[15px] leading-[22px] capitalize text-white">
              {loading ? 'Logging in...' : 'Login'}
            </span>
          </button>

          {/* Create account link */}
          <p className="w-full font-inter font-normal text-[15px] leading-[22px] text-center text-[var(--text-secondary-figma)] m-0">
            New on our platform?{' '}
            <Link
              href="/auth/register"
              className="text-accent-purple no-underline font-medium"
            >
              Create an account
            </Link>
          </p>

          {/* Divider */}
          {/* <div className="flex flex-row items-center gap-2 w-full">
            <div className="flex-1 h-0 border-t border-[#1A2D21]" />
            <span className="font-inter font-normal text-[15px] leading-[22px] text-center text-[var(--text-primary-figma)]">
              or
            </span>
            <div className="flex-1 h-0 border-t border-[#1A2D21]" />
          </div> */}

          {/* Social icons */}
          {/* <div className="flex flex-row justify-center items-center gap-6 w-full">
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="bg-transparent border-none cursor-pointer p-0 flex text-primary"
              aria-label="Login with Facebook"
            >
              <FaFacebookF className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('twitter')}
              className="bg-transparent border-none cursor-pointer p-0 flex text-primary"
              aria-label="Login with Twitter"
            >
              <FaTwitter className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="bg-transparent border-none cursor-pointer p-0 flex text-primary"
              aria-label="Login with Google"
            >
              <FaGoogle className="w-[18px] h-[18px]" />
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
