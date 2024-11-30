import React, { useEffect, useState } from "react";
import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton, TextField } from "@fluentui/react";
import { ExcelFile } from "@/shared/types/ExcelFile";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

interface EmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (employee: ExcelFile & { oldName: string }) => Promise<void>;
	table?: ExcelFile;
	mode: "create" | "update" | "delete";
	isOperationLoading: boolean;
	isOpen: boolean;
	onClose: () => void;
	onSave: (employee: ExcelFile) => Promise<void>;
	table?: ExcelFile;
	mode: "create" | "update" | "delete";
}

export const TableModal: React.FC<EmployeeModalProps> = ({
	isOpen,
	onClose,
	onSave,
	table,
	mode,
	isOperationLoading,
}) => {
	const [name, setName] = useState(table?.name || "");
	const [oldName, setOldName] = useState(table?.name || "");

	useEffect(() => {
		if (table) {
			setName(table.name);
			setOldName(table.name);
		}
	}, [table]);

	const handleSave = async () => {
		const newEmployee: ExcelFile & { oldName: string } = {
			id: table?.id || "",
			size: table?.size || 0,
			last_modified: new Date(table?.last_modified || 0).toISOString(),
			name,
			download_link: table?.download_link || "",
			oldName: oldName,
		};
		await onSave(newEmployee);
		onClose();
	};

	const handleDelete = async () => {
		if (table) {
			const newTable: ExcelFile & { oldName: string } = {
				id: table?.id || "",
				size: table?.size || 0,
				last_modified: new Date(table?.last_modified || "").toISOString(),
				name,
				download_link: table?.download_link || "",
				oldName: oldName,
			};
			await onSave(newTable);
		}
		onClose();
	};

	const renderContent = () => {
		switch (mode) {
			case "create":
			case "update":
				return (
					<div className="p-3">
						<TextField
							label="Name"
							value={name}
							onChange={(e, newValue) => setName(newValue || "")}
							required={mode === "create"}
						/>
					</div>
				);
			case "delete":
				return null;
			default:
				return null;
		}
	};

	const renderActions = () => {
		switch (mode) {
			case "create":
			case "update":
				return (
					<div className="flex gap-3">
						<PrimaryButton disabled={isOperationLoading} text="Save" onClick={handleSave} />
						<DefaultButton disabled={isOperationLoading} text="Cancel" onClick={onClose} />
					</div>
				);
			case "delete":
				return (
					<div className="flex gap-3">
						<PrimaryButton disabled={isOperationLoading} text="Delete" onClick={handleDelete} />
						<DefaultButton disabled={isOperationLoading} text="Cancel" onClick={onClose} />
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<FluentProvider theme={webLightTheme}>
			<Dialog
				hidden={!isOpen}
				minWidth={"60%"}
				onDismiss={onClose}
				dialogContentProps={{
					type: DialogType.largeHeader,
					title: mode === "create" ? "Create Table" : mode === "update" ? "Update Table" : "Delete Table",
					subText: mode === "delete" ? "This action cannot be undone." : undefined,
				}}
			>
				{renderContent()}
				<DialogFooter>{renderActions()}</DialogFooter>
			</Dialog>
		</FluentProvider>
	);
};
