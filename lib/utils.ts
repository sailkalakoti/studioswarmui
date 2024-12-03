import { clsx, type ClassValue } from "clsx";
import { parseISO, differenceInDays } from 'date-fns'; 
import { twMerge } from "tailwind-merge";

import { Cog, User, Users, Zap } from "lucide-react"

import { useState, useEffect, useRef } from 'react';
import axiosInstance from "./apiService";
import { useMutation, useQueryClient, useQuery, UseMutationOptions, UseQueryResult, UseQueryOptions } from 'react-query';
import { ResponseType } from "axios";

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

export function getDifferenceInDays(targetDate) {
  const targetDateISO = parseISO(targetDate);
  const currentDate = new Date();
  return differenceInDays(currentDate, targetDateISO);
}

export function getDifferenceInDaysLabel(targetDate) {
  const difference = getDifferenceInDays(targetDate);
  if (difference < 1) {
    return `Created today`;
  }
  if (difference === 1) {
    return `Created 1 day ago`;
  }
  return `Created ${difference} days ago`;
}

export function getChildrenCount(routineItem, type) {
  if (type === 'routines') {
    return {};
  }

  if (type === 'agents') {
    return {
      icon: Cog,
      label: `${routineItem?.routines?.length} ${addPluralIfNeeded('Routine', routineItem?.routines?.length)}`
    };
  }

  if (type === 'swarms') {
    const agentCount = routineItem?.graph?.nodes?.filter((swarmNode: any) => swarmNode?.type === 'agent')?.length;
    return {
     icon: agentCount < 2 ? User : Users,
     label: `${agentCount || 0} ${addPluralIfNeeded('Agent', agentCount)}`,
    }
  }
  return {};
}

export function addPluralIfNeeded(word: string, count: number) {
  if (count > 1) {
    return `${word}s`;
  }
  return word;
}


// Generic API function
export const apiRequest = async <TData, TVariables>({ url, method = 'GET', data, params, signal, responseType = 'json' }: {
  url: string;
  method?: string;
  data?: TVariables;
  params?: TVariables;
  signal?: AbortSignal;
  responseType?: ResponseType;
}) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data,
      params,
      signal,
      responseType
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
  responseType?: ResponseType,
  config?: UseQueryOptions<TData>,
  queryKey?: string[],
): UseQueryResult<TData> => {
  return useQuery<TData>([url, ...(queryKey || [])], ({ signal }) => {
    return apiRequest<TData, TVariables>({ url, params, signal, responseType })
  }, {
    enabled: !!url && config?.enabled,
    ...config,
  });
};

export const useApiMutation = <TData, TVariables>(url: string, method: string, config?: UseMutationOptions<TData, unknown, TVariables>) => {
  const queryClient = useQueryClient();
  return useMutation<TData, unknown, TVariables>(
    (data?: TVariables) => apiRequest<TData, TVariables>({ url, method, data }),
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


export async function downloadFile(data, filename) {
  try {

      // Get the binary data as a Blob
      const blob = data;

      // Create a link to download the file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

  } catch (error) {
      console.error("Error:", error);
  }
}

export const useElementOnScreen = (options, callback) => {
  const containerRef = useRef();

  const callbackFunction = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      callback?.();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [options]);

  return [containerRef];
};

export const capitalizeFirstChar = (str = '') => {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}