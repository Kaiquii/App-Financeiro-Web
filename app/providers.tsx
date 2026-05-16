"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { apiClient } from "@/lib/api";
import { useThemeStore } from "@/store/useThemeStore";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const interceptorId = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          router.replace("/login");
        }

        return Promise.reject(error);
      },
    );

    return () => {
      apiClient.interceptors.response.eject(interceptorId);
    };
  }, [logout, router]);

  return children;
}
