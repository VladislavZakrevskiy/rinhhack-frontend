import React, { useState } from "react";
import { Employee } from "@/shared/types/Employee";
import { UserRoles } from "@/entities/User";
import { v4 } from "uuid";
import {
	ChoiceGroup,
	DefaultButton,
	Dialog,
	DialogFooter,
	DialogType,
	PrimaryButton,
	TextField,
} from "@fluentui/react";

interface EmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (employee: Employee) => Promise<void>;
	employee?: Employee; // Для редактирования сотрудника
	mode: "create" | "update" | "delete"; // Режим: создать, обновить или удалить
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, employee, mode }) => {
	const [firstName, setFirstName] = useState(employee?.first_name || "");
	const [lastName, setLastName] = useState(employee?.last_name || "");
	const [email, setEmail] = useState(employee?.email || "");
	const [role, setRole] = useState<UserRoles>(employee?.role || UserRoles.USER);
	const [position, setPosition] = useState(employee?.position || "");
	const [department, setDepartment] = useState(employee?.department || "");

	const handleSave = async () => {
		const newEmployee: Employee = {
			id: employee?.id || v4(), // Новый ID для создания, или старый для обновления
			first_name: firstName,
			last_name: lastName,
			email,
			role,
			position,
			department,
		};
		await onSave(newEmployee);
		onClose(); // Закрываем модалку после сохранения
	};

	const handleDelete = async () => {
		if (employee) {
			await onSave(employee); // Для удаления можно передавать просто ID
		}
		onClose();
	};

	const renderContent = () => {
		switch (mode) {
			case "create":
			case "update":
				return (
					<>
						<TextField
							label="First Name"
							value={firstName}
							onChange={(e, newValue) => setFirstName(newValue || "")}
							required={mode === "create"}
						/>
						<TextField
							label="Last Name"
							value={lastName}
							onChange={(e, newValue) => setLastName(newValue || "")}
							required={mode === "create"}
						/>
						<TextField
							required={mode === "create"}
							label="Email"
							value={email}
							onChange={(e, newValue) => setEmail(newValue || "")}
						/>
						<TextField
							required={mode === "create"}
							label="Position"
							value={position}
							onChange={(e, newValue) => setPosition(newValue || "")}
						/>
						<TextField
							required={mode === "create"}
							label="Department"
							value={department}
							onChange={(e, newValue) => setDepartment(newValue || "")}
						/>
						<ChoiceGroup
							required={mode === "create"}
							label="Role"
							selectedKey={role}
							options={[
								{ key: UserRoles.ADMIN, text: "Admin" },
								{ key: UserRoles.USER, text: "User" },
							]}
							onChange={(e, option) => setRole(option?.key as UserRoles)}
						/>
					</>
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
			onDismiss={onClose}
			dialogContentProps={{
				type: DialogType.largeHeader,
				title: mode === "create" ? "Create Employee" : mode === "update" ? "Update Employee" : "Delete Employee",
				subText: mode === "delete" ? "This action cannot be undone." : undefined,
			}}
		>
			<div className="w-[60%]">
				{renderContent()}
				<DialogFooter>{renderActions()}</DialogFooter>
			</div>
		</Dialog>
	);
};

export default EmployeeModal;
