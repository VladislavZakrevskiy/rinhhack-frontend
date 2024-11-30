export enum AppRoutes {
	MAIN = "main",
	NOT_FOUND = "not_found",
	LOGIN = "login",
	ERROR = "error",
	ADMIN = "admin",
	TESTPAGE = "testpage",
	EXCELPAGE = "excelpage",
	TESTEXCELPAGE = "testexcelpage",
	WORKSPACEPAGE = "workspace",
	PROFILE = "profile",
	VIDEOCHAT = 'videochat'
}

export const getRouteMain = () => "/";
export const getRouteLogin = () => "/login";
export const getRouteNotFound = () => "*";
export const getRouteAdmin = () => "/admin";
export const getRouteTestPage = () => "/testpage";
export const getRouteError = () => "/error";
export const getExcelPage = (id: string) => "/excel/" + id;
export const getTestExcelPage = () => "/testexcel";
export const getWorkspacePage = (id: string) => "/workspace/" + id;
export const getProfilePage = (id: string) => "/profile/" + id;
export const getVideoChatPage = () => "/video"