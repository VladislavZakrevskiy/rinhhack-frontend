import { UserRoles } from "@/entities/User";

export interface Employee {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	role: UserRoles;
	position: string; //это должность
	department: string; //хз можем убрать, это типо отдел, чтобы автоматически подгружать к воркспейсам отдела нового сотрудника (если кайф)
}
