"use client";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/apiService';
import toast, { Toaster } from "react-hot-toast";
import Logo from '@/components/Logo';

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
      <div className="w-full lg:w-[480px] p-8 flex flex-col bg-[#001429]">
        <div className="flex items-center mb-12">
          <h1 className="text-2xl font-bold text-white">Create an Account</h1>
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
                className="w-full px-4 py-3 bg-[#002856]/10 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#0071B2] focus:ring-1 focus:ring-[#0071B2]"
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
                className="w-full px-4 py-3 bg-[#002856]/10 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#0071B2] focus:ring-1 focus:ring-[#0071B2]"
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
                className="w-full px-4 py-3 bg-[#002856]/10 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#0071B2] focus:ring-1 focus:ring-[#0071B2]"
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
            className="w-full py-3 px-4 bg-[#0071B2] text-white rounded-lg font-semibold hover:bg-[#0071B2]/90 transition-colors"
          >
            Create account
          </button>

          <div className="text-center">
            <a href="/login" className="text-[#0071B2] hover:text-[#0071B2]/80 text-sm font-medium">
              Already have an account? Sign in
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
            Join the community
            <span className="block text-[#0071B2]">
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