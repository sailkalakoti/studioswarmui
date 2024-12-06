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
      <div className="w-full lg:w-[480px] p-8 flex flex-col bg-[#1B112A]">
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
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
            className="w-full py-3 px-4 bg-white/90 text-[#1B112A] rounded-lg font-semibold hover:bg-white/80 backdrop-blur-sm transition-colors"
          >
            Sign in
          </button>

          <div className="text-center">
            <a href="/register" className="text-purple-400 hover:text-purple-300">
              CREATE AN ACCOUNT
            </a>
          </div>
        </form>
      </div>

      {/* Right side - Hero/Branding */}
      <div className="hidden lg:block flex-1 bg-gradient-to-br from-[#2D1576] to-[#1B112A] p-12 relative">
        {/* Add StudioSwarm logo in top-right corner */}
        <div className="absolute top-8 right-8 flex items-center gap-2">
          <Logo color="white" className="w-8 h-8" />
          <span className="font-semibold text-[22px] text-white">StudioSwarm</span>
        </div>

        <div className="h-full flex flex-col justify-center max-w-2xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6">
            Bring ideas to life
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
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