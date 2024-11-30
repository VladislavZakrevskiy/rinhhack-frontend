import { UserRoles } from "@/entities/User";

export interface Employee {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: UserRoles;
	position: string; //это должность
	department: string; //хз можем убрать, это типо отдел, чтобы автоматически подгружать к воркспейсам отдела нового сотрудника (если кайф)
	username?: string
}
