import { create } from "zustand";
import { User } from "../types/User";
import { $api } from "@/shared/api/api";
import { AxiosResponse } from "axios";
import { USER_ACCESS_TOKEN, USER_REFRESH_TOKEN } from "@/shared/consts/localStorage";

interface UserStore {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	isError: boolean;
	setUser: (user: User) => void;
	logout: () => void;
	setIsLoading: (isLoading: boolean) => void;
	setIsError: (isError: boolean) => void
	login: (form: {
		email: string;
		password: string;
	}) => Promise<{ user: User; access_token: string; refresh_token: string } | null>;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	isAuthenticated: false,
	isError: false,
	isLoading: false,
	setUser: (user) => set({ user, isAuthenticated: true }),
	logout: () => set({ user: null, isAuthenticated: false }),
	setIsLoading: (isLoading) => set(() => ({ isLoading })),
	setIsError: (isError) => set(() => ({isError})),

	login: async (form) => {
		try {
			const res = await $api.post<
				{ email: string; password: string },
				AxiosResponse<{ user: User; access_token: string; refresh_token: string }>
			>("/login", form);
			if (res.status === 200) {
				localStorage.setItem(USER_ACCESS_TOKEN, res.data.access_token);
				localStorage.setItem(USER_REFRESH_TOKEN, res.data.refresh_token);
				set((store) => ({ ...store, isAuthenticated: true, user: res.data.user }));
				return res.data;
			}
			return null;
		} catch (e) {
			set(() => ({ isAuthenticated: false, isError: true, user: null }));
			return null;
		}
	},
}));
