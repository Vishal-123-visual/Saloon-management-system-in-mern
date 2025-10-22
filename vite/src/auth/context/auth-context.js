// src/auth/context/auth-context.js
import { createContext, useContext } from "react";

export const AuthContext = createContext({
  loading: false,
  setLoading: () => {},
  saveAuth: () => {},
  user : null,
  setUser: () => {},
  login: async () => {},
  allUser: async () => {},
  updateUser: async () => {},
  deleteUser: async () => {},
  getAllCustomer: async () => {},
  requestPasswordReset: async () => {},
  resetPassword: async () => {},
  resendVerificationEmail: async () => {},
  getUser: async () => null,
  updateProfile: async () => ({}),
  logout: () => {},
  verify: async () => {},
  isAdmin: false,
});

export function useAuth() {
  return useContext(AuthContext);
}
