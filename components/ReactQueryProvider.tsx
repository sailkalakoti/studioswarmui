"use client";
import React from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    }
  }
});

export default function ReactQueryProvider({ children }) {
  return (

    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}