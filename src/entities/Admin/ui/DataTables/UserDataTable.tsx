import { FC, useCallback, useEffect, useState } from "react";
import {
	Avatar,
	Button,
	createTableColumn,
	Table,
	TableBody,
	TableCell,
	TableCellLayout,
	TableColumnDefinition,
	TableHeader,
	TableHeaderCell,
	TableRow,
	TableSelectionCell,
	Toast,
	ToastBody,
	Toaster,
	ToastTitle,
	useId,
	useTableFeatures,
	useTableSelection,
	useTableSort,
	useToastController,
} from "@fluentui/react-components";
import { Employee } from "@/shared/types/Employee";
import { useTranslation } from "react-i18next";
import { useAdminStore } from "../../model/useAdminStore";
import { $api } from "@/shared/api/api";
import { AxiosResponse } from "axios";
import { DeleteRegular, EditRegular } from "@fluentui/react-icons";
import EmployeeModal from "../Modals/User/UserModal";
import { UserRoles } from "@/entities/User";

interface DataTableProps {}

const tableColumns: TableColumnDefinition<Employee>[] = [
	createTableColumn<Employee>({
		columnId: "firstName",
		compare: (a, b) => {
			return a.firstName.localeCompare(b.firstName);
		},
	}),
	createTableColumn<Employee>({
		columnId: "lastName",
		compare: (a, b) => {
			return a.lastName.localeCompare(b.lastName);
		},
	}),
	createTableColumn<Employee>({
		columnId: "email",
		compare: (a, b) => {
			return a?.email?.localeCompare(b?.email);
		},
	}),
	createTableColumn<Employee>({
		columnId: "role",
		compare: (a, b) => {
			return a?.role?.localeCompare(b?.role);
		},
	}),
	createTableColumn<Employee>({
		columnId: "position",
		compare: (a, b) => {
			return a?.position?.localeCompare(b.position);
		},
	}),
	createTableColumn<Employee>({
		columnId: "department",
		compare: (a, b) => {
			return a?.department?.localeCompare(b.department);
		},
	}),
];

export const UserDataTable: FC<DataTableProps> = () => {
	const toasterId = useId("toaster-userdatatable");
	const { dispatchToast } = useToastController(toasterId);

	const { t } = useTranslation();
	const { currentPage, setData } = useAdminStore();
	const {
		selection: { allRowsSelected, someRowsSelected, toggleAllRows, toggleRow, isRowSelected, selectedRows },
		getRows,
		sort: { getSortDirection, sort, toggleColumnSort },
	} = useTableFeatures({ columns: tableColumns, items: currentPage?.data ? (currentPage.data as Employee[]) : [] }, [
		useTableSort({
			defaultSortState: { sortColumn: "firstName", sortDirection: "ascending" },
		}),
		useTableSelection({
			selectionMode: "multiselect",
		}),
	]);

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<Employee>();
	const [mode, setMode] = useState<"create" | "update" | "delete">("create");

	const fetchUsers = async () => {
		try {
			const res = await $api.get<void, AxiosResponse<Employee[]>>("/users/users");
			if (res.data) {
				setData(currentPage!.id, res.data);
			} else {
				notify();
			}
		} catch (e) {
			console.log(e);
			notify();
		}
	};

	const notify = () =>
		dispatchToast(
			<Toast>
				<ToastTitle>{t("error")}</ToastTitle>
				<ToastBody>{t("error fetch users")}</ToastBody>
			</Toast>,
			{ intent: "error" },
		);

	const notifySuccess = () =>
		dispatchToast(
			<Toast>
				<ToastTitle>{t("success")}</ToastTitle>
				<ToastBody>{t("operation was did successful")}</ToastBody>
			</Toast>,
			{ intent: "success" },
		);

	const openModal = (mode: "create" | "update" | "delete", currentUser: Employee) => {
		setCurrentUser(currentUser);
		setMode(mode);
		setIsOpen(true);
	};

	const onSave = async (saveData: Partial<Employee>) => {
		switch (mode) {
			case "create":
				await $api.post("/users/create", saveData);
				break;
			case "delete":
				await $api.delete("/users/delete/" + saveData.id);
				break;
			case "update":
				await $api.patch("/users/update/" + saveData.id, saveData);
				break;
		}
		fetchUsers();
	};

	useEffect(() => {
		fetchUsers();
	}, [currentPage?.id]);

	const headerSortProps = (columnId: string) => ({
		onClick: (e: React.MouseEvent) => {
			toggleColumnSort(e, columnId);
		},
		sortDirection: getSortDirection(columnId),
	});

	const rows = sort(
		getRows((row) => {
			const selected = isRowSelected(row.rowId);
			return {
				...row,
				onClick: (e: React.MouseEvent) => toggleRow(e, row.rowId),
				onKeyDown: (e: React.KeyboardEvent) => {
					if (e.key === " ") {
						e.preventDefault();
						toggleRow(e, row.rowId);
					}
				},
				selected,
				appearance: selected ? ("brand" as const) : ("brand" as const),
			};
		}),
	);

	const toggleAllKeydown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === " ") {
				toggleAllRows(e);
				e.preventDefault();
			}
		},
		[toggleAllRows],
	);

	const deleteSelected = async () => {
		try {
			for (const row of selectedRows) {
				console.log(rows, row);
			}
			notifySuccess();
		} catch (e) {
			notify();
		}
	};

	return (
		<>
			<EmployeeModal
				isOpen={isOpen}
				mode={mode}
				onClose={() => setIsOpen(false)}
				onSave={onSave}
				employee={currentUser}
			/>
			<Toaster toasterId={toasterId} />
			<div className="m-2 flex gap-2">
				<Button
					onClick={() =>
						openModal("create", {
							department: "",
							email: "",
							firstName: "",
							id: "",
							lastName: "",
							position: "",
							role: UserRoles.USER,
						})
					}
					appearance="primary"
				>
					Create
				</Button>
				<Button onClick={deleteSelected} appearance="primary">
					Delete All
				</Button>
			</div>
			<Table sortable>
				<TableHeader>
					<TableRow>
						<TableSelectionCell
							checked={allRowsSelected ? true : someRowsSelected ? "mixed" : false}
							onClick={toggleAllRows}
							onKeyDown={toggleAllKeydown}
							checkboxIndicator={{ "aria-label": "Select all rows " }}
						/>

						<TableHeaderCell {...headerSortProps("firstName")}>{t("firstName")}</TableHeaderCell>
						<TableHeaderCell {...headerSortProps("lastName")}>{t("lastName")}</TableHeaderCell>
						<TableHeaderCell {...headerSortProps("email")}>{t("email")}</TableHeaderCell>
						<TableHeaderCell {...headerSortProps("role")}>{t("role")}</TableHeaderCell>
						<TableHeaderCell {...headerSortProps("position")}>{t("position")}</TableHeaderCell>
						<TableHeaderCell {...headerSortProps("department")}>{t("department")}</TableHeaderCell>
						<TableHeaderCell>{t("actions")}</TableHeaderCell>
					</TableRow>
				</TableHeader>

				<TableBody className="w-screen">
					{currentPage?.data && currentPage.data.length > 0
						? rows.map(({ item, selected }) => (
								<TableRow key={item.id} className="w-screen">
									<TableSelectionCell checked={selected} checkboxIndicator={{ "aria-label": "Select row" }} />
									<TableCell>
										<TableCellLayout
											media={
												<Avatar
													aria-label={item.firstName}
													name={item.firstName + " " + item.lastName}
													badge={{ status: "available" }}
												/>
											}
										>
											{item.firstName}
										</TableCellLayout>
									</TableCell>
									<TableCell>
										<TableCellLayout>{item.lastName}</TableCellLayout>
									</TableCell>
									<TableCell>
										<TableCellLayout>{item.email}</TableCellLayout>
									</TableCell>
									<TableCell>
										<TableCellLayout>{item.role}</TableCellLayout>
									</TableCell>
									<TableCell>
										<TableCellLayout>{item.position}</TableCellLayout>
									</TableCell>
									<TableCell>
										<TableCellLayout>{item.department}</TableCellLayout>
									</TableCell>
									<TableCell role="gridcell">
										<TableCellLayout>
											<Button
												onClick={() => openModal("update", item)}
												icon={<EditRegular />}
												style={{ marginRight: 5 }}
												aria-label="Edit"
											/>
											<Button onClick={() => openModal("delete", item)} icon={<DeleteRegular />} aria-label="Delete" />
										</TableCellLayout>
									</TableCell>
								</TableRow>
							))
						: undefined}
				</TableBody>
			</Table>
		</>
	);
};
