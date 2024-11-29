export enum AppRoutes {
	MAIN = "main",
	NOT_FOUND = "not_found",
	LOGIN = "login",
	ERROR = 'error',
	ADMIN = 'admin',
	TESTPAGE ="testpage",
	EXCELPAGE = "excelpage"
}

export const getRouteMain = () => "/";
export const getRouteLogin = () => "/login";
export const getRouteNotFound = () => "*";
export const getRouteAdmin = () => "/admin"
export const getRouteTestPage = () => "/testpage"; 
export const getRouteError = () => "/error"
export const getExcelPage = () => "/excel"
