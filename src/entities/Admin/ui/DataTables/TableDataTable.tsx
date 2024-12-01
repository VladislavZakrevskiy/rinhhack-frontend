import { FC, useCallback, useEffect, useState } from "react";
import {
	Button,
	createTableColumn,
	Spinner,
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
import { useTranslation } from "react-i18next";
import { useAdminStore } from "../../model/useAdminStore";
import { $api } from "@/shared/api/api";
import { ArrowDownloadFilled, DeleteRegular, EditRegular } from "@fluentui/react-icons";
import { ExcelFile } from "@/shared/types/ExcelFile";
import { TableModal } from "../Modals/Tables/TableModal";
import { useNavigate } from "react-router-dom";
import { getExcelPage } from "@/shared/consts/router";
import { BackupsModal } from "../Modals/BackupsModal";

interface DataTableProps {}

const tableColumns: TableColumnDefinition<ExcelFile>[] = [
	createTableColumn<ExcelFile>({
		columnId: "name",
		compare: (a, b) => {
			return a.name.localeCompare(b.name);
		},
	}),
	createTableColumn<ExcelFile>({
		columnId: "last_modified",
		compare: (a, b) => {
			return new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime();
		},
	}),
	createTableColumn<ExcelFile>({
		columnId: "size",
		compare: (a, b) => {
			return a.size - b.size;
		},
	}),
];

export const TableDataTable: FC<DataTableProps> = () => {
	const toasterId = useId("toaster-tablesdatatable");
	const { dispatchToast } = useToastController(toasterId);

	const nav = useNavigate();
	const { t } = useTranslation();
	const { currentPage, setData } = useAdminStore();
	const [currentTables, setCurrentTables] = useState<ExcelFile[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOperationLoading, setIsOperationLoading] = useState(false);
	const [backups, setBackups] = useState<{ folder_name: string; files: ExcelFile[] }[]>([]);
	const {
		selection: { allRowsSelected, someRowsSelected, toggleAllRows, toggleRow, isRowSelected, selectedRows },
		getRows,
		sort: { getSortDirection, sort, toggleColumnSort },
	} = useTableFeatures({ columns: tableColumns, items: currentTables }, [
		useTableSort({
			defaultSortState: { sortColumn: "firstName", sortDirection: "ascending" },
		}),
		useTableSelection({
			selectionMode: "multiselect",
		}),
	]);

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [currentFile, setCurrentFile] = useState<ExcelFile>();
	const [mode, setMode] = useState<"create" | "update" | "delete">("create");

	const fetchTables = async () => {
		try {
			setIsLoading(true);
			const res = await $api.get("/excel/files");
			if (res.data?.files) {
				setCurrentTables(res.data.files);
				const pageId = currentPage?.id;
				if (pageId) {
					setData(pageId, res.data.files);
				} else {
					console.error("No current page ID available");
				}
			} else {
				console.error("No files found");
			}
			const res2 = await $api.get<{ backup_folders: { folder_name: string; files: ExcelFile[] }[] }>(
				"/excel/backup_files",
			);
			if (res2.data) {
				setBackups(res2.data.backup_folders);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
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

	const openModal = (mode: "create" | "update" | "delete", currentFile: ExcelFile) => {
		setCurrentFile(currentFile);
		setMode(mode);
		setIsOpen(true);
	};

	const onSave = async (saveData: ExcelFile & { oldName: string }) => {
		try {
			setIsOperationLoading(true);
			switch (mode) {
				case "create":
					await $api.post("/excel/create", { filename: saveData.name });
					break;
				case "delete":
					await $api.delete("/excel/delete/" + saveData.name);
					break;
				case "update":
					await $api.post("/excel/rename_file", {
						old_key: saveData.oldName,
						new_key: saveData.name,
					});
					break;
			}
			fetchTables();
		} catch (e) {
			notify();
			console.log(e);
		} finally {
			setIsOperationLoading(false);
		}
	};

	useEffect(() => {
		fetchTables();
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
			for (const row in Array(...selectedRows)) {
				// @ts-ignore
				await $api.delete("/excel/delete/" + rows[row].item.name);
			}
			fetchTables();
			notifySuccess();
		} catch (e) {
			console.log(e);
			notify();
		}
	};
	console.log(rows);
	return (
		<>
			<TableModal
				isOperationLoading={isOperationLoading}
				isOpen={isOpen}
				mode={mode}
				onClose={() => setIsOpen(false)}
				onSave={onSave}
				table={currentFile}
			/>
			<Toaster toasterId={toasterId} />
			<div className="m-2 flex gap-2">
				<Button
					onClick={() =>
						openModal("create", {
							id: "",
							last_modified: "",
							name: "",
							download_link: "",
							size: 0,
						})
					}
					appearance="primary"
				>
					{t("create")}
				</Button>
				<Button onClick={deleteSelected} appearance="primary">
					{t("delete selected")}
				</Button>
				<Button onClick={fetchTables} appearance="primary">
					{t("reload")}
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

						<TableHeaderCell {...headerSortProps("name")}>{t("name")}</TableHeaderCell>
						<TableHeaderCell {...headerSortProps("size")}>{t("size")}</TableHeaderCell>
						<TableHeaderCell {...headerSortProps("last_modified")}>{t("lastModified")}</TableHeaderCell>
						<TableHeaderCell>{t("actions")}</TableHeaderCell>
					</TableRow>
				</TableHeader>

				<TableBody className="w-screen">
					{currentPage?.data && currentPage.data.length > 0
						? rows.map(({ item, selected, onClick, onKeyDown }) => (
								<TableRow key={item.id} className="w-screen">
									<TableSelectionCell
										onClick={onClick}
										onKeyDown={onKeyDown}
										checked={selected}
										checkboxIndicator={{ "aria-label": "Select row" }}
									/>
									<TableCell>
										<TableCellLayout>{item.name}</TableCellLayout>
									</TableCell>
									<TableCell>
										<TableCellLayout>
											{item.size / 1024 > 1024
												? `${(item.size / 1024 / 1024).toFixed(2)}МБ`
												: `${(item.size / 1024).toFixed(2)}КБ`}
										</TableCellLayout>
									</TableCell>
									<TableCell>
										<TableCellLayout>{new Date(item.last_modified).toISOString().split("T")[0]}</TableCellLayout>
									</TableCell>
									<TableCell role="gridcell">
										<TableCellLayout>
											<div className="flex flex-col gap-1 p-2">
												<div className="flex gap-2">
													<Button onClick={() => openModal("update", item)} icon={<EditRegular />} aria-label="Edit" />
													<Button
														onClick={() => openModal("delete", item)}
														icon={<DeleteRegular />}
														aria-label="Delete"
													/>
													<BackupsModal backups={backups} />
												</div>
												<div className="flex gap-2">
													<Button
														as="a"
														href={item.download_link}
														download={item.name}
														icon={<ArrowDownloadFilled />}
														aria-label="Download"
													/>
													<Button onClick={() => nav(getExcelPage(item.name))} aria-label="Go">
														{t("go")}
													</Button>
												</div>
											</div>
										</TableCellLayout>
									</TableCell>
								</TableRow>
							))
						: undefined}
				</TableBody>
			</Table>
			{isLoading && (
				<div className="flex justify-center items-center w-full p-5">
					<Spinner size="large" />
				</div>
			)}
		</>
	);
};
