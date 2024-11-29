export enum AppRoutes {
	MAIN = "main",
	NOT_FOUND = "not_found",
	LOGIN = "login",
}

export const getRouteMain = () => "/";
export const getRouteLogin = () => "/login";
export const getRouteNotFound = () => "*";
