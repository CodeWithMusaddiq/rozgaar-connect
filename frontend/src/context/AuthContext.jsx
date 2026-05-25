import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth.service.js";

/**
 * AuthContext - Global authentication state
 * Provides user data, login, register, logout, and auth status
 */
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = authService.getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);

        // Verify token is still valid by fetching current user
        try {
          const response = await authService.getMe();
          if (response.success) {
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
        } catch (err) {
          // Token invalid, clear everything
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  }, []);

  /**
   * Register user
   */
  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message, errors: err.errors };
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  /**
   * Update user data in context
   */
  const updateUser = useCallback((userData) => {
    setUser((prev) => {
      const updated = { ...prev, ...userData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    isOwner: user?.role === "owner",
    isSeeker: user?.role === "seeker",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
