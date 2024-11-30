import React, { useEffect, useState } from "react";
import { Employee } from "@/shared/types/Employee";
import { UserRoles } from "@/entities/User";
import { ChoiceGroup, Dialog, DialogFooter, DialogType, TextField } from "@fluentui/react";
import { Button, Spinner } from "@fluentui/react-components";

interface EmployeeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (employee: Omit<Employee, "id">) => Promise<void>;
	employee?: Employee;
	isOperationLoading: boolean;
	mode: "create" | "update" | "delete";
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
	isOpen,
	onClose,
	onSave,
	employee,
	mode,
	isOperationLoading,
}) => {
	const [firstName, setFirstName] = useState(employee?.firstName || "");
	const [lastName, setLastName] = useState(employee?.lastName || "");
	const [email, setEmail] = useState(employee?.email || "");
	const [role, setRole] = useState<UserRoles>(employee?.role || UserRoles.USER);
	const [position, setPosition] = useState(employee?.position || "");
	const [department, setDepartment] = useState(employee?.department || "");
	const [username, setUsername] = useState("");
	const [password, setPaswword] = useState("");

	useEffect(() => {
		if (employee) {
			setFirstName(employee?.firstName);
			setLastName(employee.lastName);
			setEmail(employee.email);
			setRole(employee.role);
			setPosition(employee.position);
			setDepartment(employee.department);
			setUsername(employee.username!);
		}
	}, [employee]);

	const handleSave = async () => {
		const newEmployee: Employee & { password: string } = {
			// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
			id: employee?.id!,
			firstName: firstName,
			lastName: lastName,
			email,
			role,
			position,
			department,
			password,
			username,
		};
		await onSave(newEmployee);
		onClose();
	};

	const handleDelete = async () => {
		if (employee) {
			await onSave(employee);
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
							label="Username"
							value={username}
							onChange={(e, newValue) => setUsername(newValue || "")}
							required={mode === "create"}
						/>
						<TextField
							label="Password"
							type="password"
							value={password}
							onChange={(e, newValue) => setPaswword(newValue || "")}
							required={mode === "create"}
						/>
						<TextField
							required={mode === "create"}
							label="Email"
							type="email"
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
						<Button icon={isOperationLoading ? <Spinner size="tiny" /> : undefined} onClick={handleSave}>
							Save
						</Button>
						<Button icon={isOperationLoading ? <Spinner size="tiny" /> : undefined} onClick={onClose}>
							Cancel
						</Button>
					</div>
				);
			case "delete":
				return (
					<div className="flex gap-3">
						<Button icon={isOperationLoading ? <Spinner size="tiny" /> : undefined} onClick={handleDelete}>
							Delete
						</Button>
						<Button icon={isOperationLoading ? <Spinner size="tiny" /> : undefined} onClick={onClose}>
							Cancel
						</Button>
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
			minWidth={"60%"}
			dialogContentProps={{
				type: DialogType.largeHeader,
				title: mode === "create" ? "Create Employee" : mode === "update" ? "Update Employee" : "Delete Employee",
				subText: mode === "delete" ? "This action cannot be undone." : undefined,
			}}
		>
			{renderContent()}
			<DialogFooter>{renderActions()}</DialogFooter>
		</Dialog>
	);
};

export default EmployeeModal;
