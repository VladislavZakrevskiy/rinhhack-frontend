export enum AppRoutes {
	MAIN = "main",
	NOT_FOUND = "not_found",
	LOGIN = "login",
	TESTPAGE ="testpage",
	ERROR = 'error'
}

export const getRouteMain = () => "/";
export const getRouteLogin = () => "/login";
export const getRouteNotFound = () => "*";
export const getRouteTestPage = () => "/testpage"; 
export const getRouteError = () => "/error"