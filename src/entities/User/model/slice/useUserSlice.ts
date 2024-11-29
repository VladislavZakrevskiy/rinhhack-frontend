import { create } from "zustand";
import { $api } from "@/shared/api/api";
import { AxiosResponse } from "axios";
import { USER_ACCESS_TOKEN, USER_REFRESH_TOKEN } from "@/shared/consts/localStorage";
import { Employee } from "@/shared/types/Employee";

interface UserStore {
	user: Employee | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	isError: boolean;
	setUser: (user: Employee) => void;
	logout: () => void;
	setIsLoading: (isLoading: boolean) => void;
	setIsError: (isError: boolean) => void;
	login: (form: {
		username: string;
		password: string;
	}) => Promise<{ employee: Employee; access_token: string; refresh_token: string } | null>;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	isAuthenticated: false,
	isError: false,
	isLoading: false,
	setUser: (user) => set({ user, isAuthenticated: true }),
	logout: () => set({ user: null, isAuthenticated: false }),
	setIsLoading: (isLoading) => set(() => ({ isLoading })),
	setIsError: (isError) => set(() => ({ isError })),

	login: async (form) => {
		try {
			const res = await $api.post<
				{ email: string; password: string },
				AxiosResponse<{ employee: Employee; access_token: string; refresh_token: string }>
			>("/auth/login", form);
			if (res.status === 200) {
				localStorage.setItem(USER_ACCESS_TOKEN, res.data.access_token);
				localStorage.setItem(USER_REFRESH_TOKEN, res.data.refresh_token);
				set((store) => ({ ...store, isAuthenticated: true, user: res.data.employee }));
				return res.data;
			}
			return null;
		} catch (e) {
			set(() => ({ isAuthenticated: false, isError: true, user: null }));
			return null;
		}
	},
}));
