import { UserRoles, useUserStore } from "@/entities/User";
import { getRouteLogin, getRouteNotFound } from "@/shared/consts/router";
import { PageLoader } from "@/widgets/PageLoader";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { $api } from "@/shared/api/api";
import { AxiosResponse } from "axios";
import { Employee } from "@/shared/types/Employee";

interface Props {
	children?: ReactNode;
	roles?: UserRoles[];
}

export const RequireAuth: FC<Props> = ({ children, roles }) => {
	const { user, setUser } = useUserStore();
	const [isLoading, setIsLoading] = useState(true);
	const [localUser, setLocalUser] = useState<Employee | null>(null);
	const location = useLocation();
	const userRole = user?.role;
	const nav = useNavigate();

	const hasRequiredRoles = useMemo(() => {
		if (!roles) {
			return true;
		}
		return roles.some((requireRole) => userRole === requireRole);
	}, [roles, userRole]);

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const res = await $api.get<void, AxiosResponse<Employee>>("/me");
				if (res.data) {
					setUser(res.data);
					setLocalUser(res.data);
				} else {
					nav(getRouteLogin());
				}
			} catch (e) {
				nav(getRouteLogin());
				console.log(e);
			} finally {
				setIsLoading(false);
			}
		};

		if (!user) {
			fetchMe();
		} else {
			setIsLoading(false);
		}
	}, [user, setUser, nav]);

	if (isLoading) {
		return <PageLoader />;
	}

	if (!localUser && !user) {
		return <Navigate to={getRouteLogin()} state={{ from: location }} replace />;
	}

	if (!hasRequiredRoles) {
		return <Navigate to={getRouteNotFound()} state={{ from: location }} replace />;
	}

	return <>{children}</>;
};
