export enum AppRoutes {
	MAIN = "main",
	NOT_FOUND = "not_found",
	LOGIN = "login",
	TESTPAGE ="testpage"
}

export const getRouteMain = () => "/";
export const getRouteLogin = () => "/login";
export const getRouteNotFound = () => "*";
export const getRouteTestPage = () => "/testpage"; 
