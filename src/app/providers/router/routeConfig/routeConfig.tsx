import { NotFoundPage } from "@/pages/NotFoundPage";
import { LazyMainPage } from "@/pages/MainPage";
import {
	AppRoutes,
	getRouteAdmin,
	getRouteError,
	getRouteLogin,
	getRouteMain,
	getRouteTestPage,
	getRouteNotFound,
} from "@/shared/consts/router";
import { AppRouteProps } from "@/shared/types/router";
import { LazyLoginPage } from "@/pages/Login";
import { LazyTestPage } from "@/pages/TestPage";
import { LazyErrorPage } from "@/pages/Error";
import { LazyAdminPage } from "@/pages/AdminPanel";
import { UserRoles } from "@/entities/User";

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
	[AppRoutes.TESTPAGE]: {
		path: getRouteTestPage(),
		element: <LazyTestPage />,
	},
	[AppRoutes.ERROR]: {
		path: getRouteError(),
		element: <LazyErrorPage />,
	},
	[AppRoutes.ADMIN]: {
		path: getRouteAdmin(),
		authOnly: true,
		element: <LazyAdminPage />,
		roles: [UserRoles.ADMIN],
	},
};
