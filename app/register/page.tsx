"use client";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/apiService';
import toast, { Toaster } from "react-hot-toast";

const login = async (payload) => {
  const { data } = await axiosInstance.post('/auth/signup', {
    username: payload.email,
    password: payload.password,
    firstName: payload.firstName,
    lastName: payload.lastName
  })
  return data;
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      toast.success("User created, please login");
      localStorage.setItem('swarm_token', data?.access_token);
      router.push('/login');
    }
  });

  const onSignUp = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      email,
      password,
      firstName,
      lastName
    })
  }

  return (
    <div className="min-h-screen flex">
      <Toaster toastOptions={{ position: "bottom-right" }} />
      {/* Left side - Sign Up Form */}
      <div className="w-full lg:w-[480px] p-8 flex flex-col bg-[#1B112A]">
        <div className="flex items-center mb-12">
          <h1 className="text-2xl font-bold text-white">Create account</h1>
        </div>

        <form onSubmit={onSignUp} className="space-y-6 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                First name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                placeholder="Last name"
                required
              />
            </div>
          </div>

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
                placeholder="Create a password"
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
            <p className="mt-2 text-sm text-white/50">
              Must be at least 8 characters long
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-white/90 text-[#1B112A] rounded-lg font-semibold hover:bg-white/80 backdrop-blur-sm transition-colors"
          >
            Create account
          </button>

          <div className="text-center">
            <a href="/login" className="text-purple-400 hover:text-purple-300">
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>

      {/* Right side - Hero/Branding */}
      <div className="hidden lg:block flex-1 bg-gradient-to-br from-[#2D1576] to-[#1B112A] p-12">
        <div className="h-full flex flex-col justify-center max-w-2xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6">
            Join the community
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              #withStudioSwarm
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Build, automate, and bring your ideas to life with StudioSwarm.
          </p>
        </div>
      </div>
    </div>
  );
}