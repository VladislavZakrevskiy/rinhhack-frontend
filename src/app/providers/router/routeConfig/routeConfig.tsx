import { NotFoundPage } from "@/pages/NotFoundPage";
import { LazyMainPage } from "@/pages/MainPage";
import { AppRoutes, getRouteLogin, getRouteMain, getRouteNotFound } from "@/shared/consts/router";
import { AppRouteProps } from "@/shared/types/router";
import { LazyLoginPage } from "@/pages/Login";

export const routeConfig: Record<AppRoutes, AppRouteProps> = {
	[AppRoutes.MAIN]: {
		path: getRouteMain(),
		element: <LazyMainPage />,
	},
	[AppRoutes.NOT_FOUND]: {
		path: getRouteNotFound(),
		element: <NotFoundPage />,
	},
	[AppRoutes.LOGIN]: {
		path: getRouteLogin(),
		element: <LazyLoginPage />,
	},
};
