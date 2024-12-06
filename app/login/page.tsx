"use client";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axiosInstance from '@/lib/apiService';
import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import { Toaster } from "react-hot-toast";
import Logo from '@/components/Logo';

const login = async (payload) => {
  let x = new FormData();
  x.append("username", payload.email);
  x.append("password", payload.password);
  const { data } = await axiosInstance.post('/auth/signin', x)
  return data;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const router = useRouter();

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      localStorage.setItem('swarm_token', data?.access_token);
      router.push('/dashboard');
    },
    onError: () => {
      setError("Invalid email or password");
    },
  });

  const onSignIn = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({
      email,
      password,
    })
  }

  return (
    <div className="min-h-screen flex">
      <Toaster toastOptions={{ position: "bottom-right" }} />
      {/* Left side - Login Form */}
      <div className="w-full lg:w-[480px] p-8 flex flex-col bg-[#001429]">
        <div className="flex items-center mb-12">
          <h1 className="text-2xl font-bold text-white">Sign in</h1>
        </div>

        <form onSubmit={onSignIn} className="space-y-6 flex-1">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#002856]/5 border border-[#0071B2]/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#0071B2] focus:ring-1 focus:ring-[#0071B2]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#002856]/5 border border-[#0071B2]/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#0071B2] focus:ring-1 focus:ring-[#0071B2]"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#0071B2] text-white rounded-lg font-semibold hover:bg-[#0071B2]/90 transition-colors"
          >
            Sign in
          </button>

          <div className="text-center">
            <a href="/register" className="text-[#0071B2] hover:text-[#0071B2]/80 text-sm font-medium">
              New to StudioSwarm? Sign up
            </a>
          </div>
        </form>
      </div>

      {/* Right side - Hero/Branding */}
      <div 
        className="hidden lg:block flex-1 bg-gradient-to-br from-[#001429] via-[#002856] to-[#004299] p-12 relative"
        style={{
          backgroundImage: 'radial-gradient(circle at top right, #004299, #002856 50%, #001429)'
        }}
      >
        {/* Add StudioSwarm logo in top-right corner */}
        <div className="absolute top-8 right-8 flex items-center gap-2">
          <Logo color="white" className="w-8 h-8" />
          <span className="font-semibold text-[22px] text-white">StudioSwarm</span>
        </div>

        <div className="h-full flex flex-col justify-center max-w-2xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6">
            Bring ideas to life
            <span className="block text-[#0071B2]">
              #withStudioSwarm
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            From tasks and workflows to apps and systems, build and automate anything in one powerful visual platform.
          </p>
        </div>
      </div>
    </div>
  );
}