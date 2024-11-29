import { create } from "zustand";
import { User } from "@/entities/User";
import { AxiosResponse } from "axios";
import { $api } from "@/shared/api/api";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  
  login: async (email, password) => {
    try {
      const res = await $api.post<{ email: string; password: string }, AxiosResponse<User>>(
        `${import.meta.env.VITE_API_URL}/login`, 
        { email, password }
      );
      if (res.status === 200) {
        set({ user: res.data, isAuthenticated: true });
      }
    } catch (e) {
      console.error("Login failed:", e);
    }
  }
}));
