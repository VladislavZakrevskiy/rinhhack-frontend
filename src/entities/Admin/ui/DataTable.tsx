import { FC } from "react";
import { useAdminStore } from "../model/useAdminStore";
import { UserDataTable } from "./DataTables/UserDataTable";
import { TableDataTable } from "./DataTables/TableDataTable";

interface DataTableProps {}

export const DataTable: FC<DataTableProps> = () => {
	const { currentPage } = useAdminStore();

	switch (currentPage?.type) {
		case "Пользователи":
			return <UserDataTable />;
		case "Таблицы":
			return <TableDataTable />;
		default:
			return null;
	}
};
