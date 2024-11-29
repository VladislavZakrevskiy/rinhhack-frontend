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
import { ExcelFile } from "@/shared/types/ExcelFile";
import { useNavigate } from "react-router-dom";

interface DataTableProps {}

const tableColumns: TableColumnDefinition<ExcelFile>[] = [
	createTableColumn<ExcelFile>({
		columnId: "name",
		compare: (a, b) => {
			return a.name.localeCompare(b.name);
		},
	}),
	createTableColumn<ExcelFile>({
		columnId: "url",
		compare: (a, b) => {
			return a.url.localeCompare(b.url);
		},
	}),
	createTableColumn<ExcelFile>({
		columnId: "lastModified",
		compare: (a, b) => {
			return new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
		},
	}),
	createTableColumn<ExcelFile>({
		columnId: "creator",
		compare: (a, b) => {
			return a?.creator.first_name?.localeCompare(b?.creator.first_name);
		},
	}),
];

export const TableDataTable: FC<DataTableProps> = () => {
	const toasterId = useId("toaster-tablesdatatable");
	const { dispatchToast } = useToastController(toasterId);

	const nav = useNavigate();
	const { t } = useTranslation();
	const { currentPage, setData } = useAdminStore();
	const {
		selection: { allRowsSelected, someRowsSelected, toggleAllRows, toggleRow, isRowSelected },
		getRows,
		sort: { getSortDirection, sort, toggleColumnSort },
	} = useTableFeatures({ columns: tableColumns, items: currentPage?.data ? (currentPage.data as ExcelFile[]) : [] }, [
		useTableSort({
			defaultSortState: { sortColumn: "first_name", sortDirection: "ascending" },
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

	const openModal = (mode: "create" | "update" | "delete", currentUser: Employee) => {
		setCurrentUser(currentUser);
		setMode(mode);
		setIsOpen(true);
	};

	const onSave = async () => {
		switch (mode) {
			case "create":
				break;
			case "delete":
				break;
			case "update":
				break;
		}
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
				<Button appearance="primary">Create</Button>
				<Button appearance="primary">Delete All</Button>
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

						<TableHeaderCell {...headerSortProps("name")}>{t("name")}</TableHeaderCell>
						<TableHeaderCell {...headerSortProps("url")}>{t("url")}</TableHeaderCell>
						<TableHeaderCell>{t("site url")}</TableHeaderCell>
						<TableHeaderCell {...headerSortProps("lastModified")}>{t("lastModified")}</TableHeaderCell>
						<TableHeaderCell {...headerSortProps("creator")}>{t("creator")}</TableHeaderCell>
						<TableHeaderCell>{t("actions")}</TableHeaderCell>
					</TableRow>
				</TableHeader>

				<TableBody className="w-screen">
					{currentPage?.data && currentPage.data.length > 0
						? rows.map(({ item, selected }) => (
								<TableRow key={item.id} className="w-screen">
									<TableSelectionCell checked={selected} checkboxIndicator={{ "aria-label": "Select row" }} />
									<TableCell>
										<TableCellLayout>{item.name}</TableCellLayout>
									</TableCell>
									<TableCell>
										<TableCellLayout>{item.url}</TableCellLayout>
									</TableCell>
									<TableCell>
										<a onClick={() => nav()}>{item.url}</a>
									</TableCell>
									<TableCell>
										<TableCellLayout
											media={
												<Avatar
													aria-label={item.first_name}
													name={item.first_name + " " + item.last_name}
													badge={{ status: "available" }}
												/>
											}
										>
											{item.first_name}
										</TableCellLayout>
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
