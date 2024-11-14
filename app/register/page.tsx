"use client";
import Link from 'next/link';
// import { Form } from 'app/form';
// import { signIn } from 'app/auth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/apiService';
import toast, { Toaster } from "react-hot-toast";
import Logo from '@/components/Logo';

const login = async (payload) => {
  let x = new FormData();
  x.append("username", payload.userName);
  x.append("password", payload.password);
  const { data } = await axiosInstance.post('/auth/signup', {
    username: payload.userName,
    password: payload.password,
  })
  return data;
}


export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      toast.success("User created, please login");
      localStorage.setItem('swarm_token', data?.access_token);
      router.push('/login');
    }
  });
  const onSignUp = () => {
    loginMutation.mutate({
      userName,
      password,
    })
  }
  return (
    <div className="flex flex-col gap-8 h-screen w-screen items-center justify-center bg-gray-50">
      <div className='h-8 flex items-center gap-2'>
        <Logo />
        <span className="font-semibold text-[28px] text-[#002856]">StudioSwarm</span>
      </div>
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <Toaster toastOptions={{ position: "bottom-right" }} />
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign Up</h3>
          <p className="text-sm text-gray-500">
            Create an account with your email and password
          </p>
        </div>
        <form
          className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-xs text-gray-600 uppercase"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="user@acme.com"
              autoComplete="email"
              required
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs text-gray-600 uppercase"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <center>
            <Button onClick={onSignUp}>Sign up</Button>
          </center>
          <p className="text-center text-sm text-gray-600">
            {'Already have an account? '}
            <Link href="/login" className="font-semibold text-gray-800">
              Sign in
            </Link>
            {' instead.'}
          </p>
          {/* </Form> */}
        </form>
      </div>
    </div>
  );
}