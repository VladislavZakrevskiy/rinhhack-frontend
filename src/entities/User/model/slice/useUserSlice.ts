import { create } from "zustand";
import { User } from "../types/User";

interface UserStore {
	user: User | null;
	isAuthenticated: boolean;
	setUser: (user: User) => void;
	logout: () => void;
}

const useUserStore = create<UserStore>((set) => ({
	user: null,
	isAuthenticated: false,
	setUser: (user) => set({ user, isAuthenticated: true }),
	logout: () => set({ user: null, isAuthenticated: false }),
}));

export default useUserStore;
