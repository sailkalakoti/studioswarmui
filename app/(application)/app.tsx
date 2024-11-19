"use client";

import { useFetchData } from '@/lib/utils';
export default function Authorizer({ children }) {
  const { data, isLoading }: { data: any, isLoading: boolean } = useFetchData("/auth/me");
  if (!data?.username || isLoading) {
    return null;
  }
  return children;
}
