export enum AppRoutes {
	MAIN = "main",
	NOT_FOUND = "not_found",
	LOGIN = "login",
	ERROR = 'error',
	ADMIN = 'admin'
}

export const getRouteMain = () => "/";
export const getRouteLogin = () => "/login";
export const getRouteNotFound = () => "*";
export const getRouteError = () => "/error"
export const getRouteAdmin = () => "/admin"