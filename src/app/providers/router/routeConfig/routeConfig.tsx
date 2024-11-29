import { NotFoundPage } from "@/pages/NotFoundPage";
import { LazyMainPage } from "@/pages/MainPage";
import {
	AppRoutes,
	getRouteAdmin,
	getRouteError,
	getRouteLogin,
	getRouteMain,
	getRouteNotFound,
} from "@/shared/consts/router";
import { AppRouteProps } from "@/shared/types/router";
import { LazyLoginPage } from "@/pages/Login";
import { LazyErrorPage } from "@/pages/Error";
import { LazyAdminPage } from "@/pages/AdminPanel";

export const routeConfig: Record<AppRoutes, AppRouteProps> = {
	[AppRoutes.MAIN]: {
		path: getRouteMain(),
		element: <LazyMainPage />,
		authOnly: true,
	},
	[AppRoutes.NOT_FOUND]: {
		path: getRouteNotFound(),
		element: <NotFoundPage />,
		authOnly: true,
	},
	[AppRoutes.LOGIN]: {
		path: getRouteLogin(),
		element: <LazyLoginPage />,
	},
	[AppRoutes.ERROR]: {
		path: getRouteError(),
		element: <LazyErrorPage />,
	},
	[AppRoutes.ADMIN]: {
		path: getRouteAdmin(),
		element: <LazyAdminPage />,
	},
};
