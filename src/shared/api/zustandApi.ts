import { create } from "zustand";
import { User } from "@/entities/User";
import { $api } from "@/shared/api/api";
import { AxiosResponse } from "axios";

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  login: async () => {
    try {
      const res = await $api.post<{ email: string; password: string }, AxiosResponse<User>>(
        import.meta.env.API_URL + "/login",
      );
      if (res.status === 200) {
        set((store) => {
          return store;
        });
      }
    } catch (e) {
        console.error("Login failed:", e);
    }
  },
}));