import React, { useEffect, useState } from "react";
import { DatePicker, DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton, TextField } from "@fluentui/react";
import { ExcelFile } from "@/shared/types/ExcelFile";

interface EmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (employee: ExcelFile) => Promise<void>;
	table?: ExcelFile;
	mode: "create" | "update" | "delete";
}

export const TableModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, table, mode }) => {
	const [last_modified, setLastModified] = useState(new Date(table?.last_modified || new Date()));
	const [name, setName] = useState(table?.name || "");
	const [url, setUrl] = useState(table?.url || "");
	const [size, setSize] = useState<number>(table?.size || 0);

	useEffect(() => {
		if (table) {
			setSize(table?.size);
			setLastModified(new Date(table.last_modified));
			setUrl(table.url);
			setName(table.name);
		}
	}, []);

	const handleSave = async () => {
		const newEmployee: ExcelFile = {
			id: table?.id || "",
			size: size,
			last_modified: last_modified.toISOString(),
			name,
			url,
		};
		await onSave(newEmployee);
		onClose();
	};

	const handleDelete = async () => {
		if (table) {
			const newTable: ExcelFile = {
				id: table?.id || "",
				size: size,
				last_modified: last_modified.toISOString(),
				name,
				url,
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

						<DatePicker
							label="Last Modified"
							value={last_modified}
							onSelectDate={(date) => setLastModified(date || new Date())}
						/>
						<TextField
							required={mode === "create"}
							label="Creator Id"
							value={creatorId}
							onChange={(e, newValue) => setCreatorId(newValue || "")}
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
						<PrimaryButton text="Save" onClick={handleSave} />
						<DefaultButton text="Cancel" onClick={onClose} />
					</div>
				);
			case "delete":
				return (
					<div className="flex gap-3">
						<PrimaryButton text="Delete" onClick={handleDelete} />
						<DefaultButton text="Cancel" onClick={onClose} />
					</div>
				);
			default:
				return null;
		}
	};

	return (
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
	);
};
