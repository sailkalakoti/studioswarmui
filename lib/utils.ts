import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { useState, useEffect } from 'react';
import axiosInstance from "./apiService";
import { useMutation, useQueryClient, useQuery, UseMutationOptions, UseQueryResult, UseQueryOptions } from 'react-query';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}


// Generic API function
export const apiRequest = async <TData, TVariables>({ url, method = 'GET', data, params, signal }: {
  url: string;
  method?: string;
  data?: TVariables;
  params?: TVariables;
  signal?: AbortSignal;
}) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data,
      params,
      signal,
    });
    return response.data;
  } catch (error) {
    if (error.code !== "ERR_CANCELED") {
      console.error('API call error:', error);
      throw error;
    }
  }
};

export const useFetchData = <TData, TVariables>(
  url: string,
  params?: TVariables,
  config?: UseQueryOptions<TData>
): UseQueryResult<TData> => {
  return useQuery<TData>([url], ({ signal }) => apiRequest<TData, TVariables>({ url, params, signal }), {
    enabled: !!url,
  });
};



export const useApiMutation = <TData, TVariables>(url: string, method: string, config?: UseMutationOptions<TData, unknown, TVariables>) => {
  const queryClient = useQueryClient();
  return useMutation<TData, unknown, TVariables>(
    (data: TVariables) => apiRequest<TData, TVariables>({ url, method, data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(url);
      },
      ...config,
    }
  );
};


export default function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}
