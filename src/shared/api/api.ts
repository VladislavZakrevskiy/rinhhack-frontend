import axios from "axios";
import { USER_ACCESS_TOKEN } from "@/shared/consts/localStorage";

export const $api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		authorization: localStorage.getItem(USER_ACCESS_TOKEN) || "",
	},
});

$api.interceptors.request.use((config) => {
	if (config.headers) {
		config.headers.Authorization = localStorage.getItem(USER_ACCESS_TOKEN) || "";
	}
	return config;
});
