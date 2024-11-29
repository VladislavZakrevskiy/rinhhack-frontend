import { UserRoles } from "../consts/UserRoles";

export interface User {
	name: string;
	email: string;
	role: UserRoles
}