import { FC } from "react";
import { useAdminStore } from "../model/useAdminStore";

interface DataTableProps {}

export const DataTable: FC<DataTableProps> = () => {
	const { currentPage } = useAdminStore();

	return <div>{JSON.stringify(currentPage)}</div>;
};
