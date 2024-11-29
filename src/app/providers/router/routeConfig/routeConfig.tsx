import { NotFoundPage } from "@/pages/NotFoundPage";
import { LazyMainPage } from "@/pages/MainPage";
import {
	AppRoutes, getExcelPage,
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
import { LazyExcelPage } from "@/pages/ExcelPage";
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
	[AppRoutes.TESTPAGE]: {
		path: getRouteTestPage(),
		element: <LazyTestPage />,
	},
	[AppRoutes.ERROR]: {
		path: getRouteError(),
		element: <LazyErrorPage />,
	},
	[AppRoutes.EXCELPAGE]: {
		path: getExcelPage(),
		element: <LazyExcelPage />,
	},
	[AppRoutes.ADMIN]: {
		path: getRouteAdmin(),
		element: <LazyAdminPage />,
	},
};
