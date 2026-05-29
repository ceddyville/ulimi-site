"use client";

import { useState, useEffect, useCallback } from "react";
import { verifyToken } from "@/lib/adminApi";

const TOKEN_KEY = "ulimi_admin_token";

export interface AdminAuth {
  token: string | null;
  username: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export function useAdminAuth(): AdminAuth {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }
    // Verify the stored token is still valid
    verifyToken(stored)
      .then((user) => {
        if (user.is_staff) {
          setToken(stored);
          setUsername(user.username);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback((t: string, u: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setUsername(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  return {
    token,
    username,
    isAdmin: !!token,
    isLoading,
    login,
    logout,
  };
}
