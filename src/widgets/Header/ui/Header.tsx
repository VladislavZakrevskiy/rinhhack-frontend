import React from "react";
import { Button, Toolbar, ToolbarButton } from "@fluentui/react-components";
import { Link } from "react-router-dom";

interface HeaderProps {
	isAuthenticated: boolean;
	userId?: string;
}

export const Header: React.FC<HeaderProps> = ({ isAuthenticated, userId }) => {
	return (
		<header className="shadow-md px-4">
			<Toolbar aria-label="Header toolbar" className="flex items-center">
				<ToolbarButton appearance="transparent">
					<Link to="/" className="font-bold text-xl text-blue-600 no-underline">
						TeDoxel
					</Link>
				</ToolbarButton>

				<div className="flex-grow" />

				{!isAuthenticated ? (
					<Button
						appearance="primary"
						as="a"
						href="/login"
						className="px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
					>
						Войти
					</Button>
				) : (
					<Button
						appearance="primary"
						as="a"
						href={`/profile/${userId}`}
						className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded"
					>
						Профиль
					</Button>
				)}
			</Toolbar>
		</header>
	);
};
