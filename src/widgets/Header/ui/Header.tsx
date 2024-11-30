import React from "react";
import { Button, Toolbar, ToolbarButton } from "@fluentui/react-components";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User";
import { getProfilePage } from "@/shared/consts/router";
import { LanguageSwitcher } from "@/features/LanguageSwitcher";
import { ThemeSwitcher } from "@/features/ThemeSwitcher";
import { ArrowExitFilled } from "@fluentui/react-icons";
import { USER_ACCESS_TOKEN, USER_REFRESH_TOKEN } from "@/shared/consts/localStorage";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
	const { user, logout } = useUserStore();
	const nav = useNavigate();

	return (
		<header className="shadow-md px-4">
			<Toolbar aria-label="Header toolbar" className="flex items-center">
				<ToolbarButton appearance="transparent">
					<Link to="/" className="font-bold text-xl text-blue-600 no-underline">
						TeDoxel
					</Link>
				</ToolbarButton>

				<div className="flex-grow" />

				<div className="flex gap-3">
					{!user ? (
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
							onClick={() => nav(getProfilePage(user.id))}
							className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded"
						>
							Профиль
						</Button>
					)}
					<ThemeSwitcher />
					<LanguageSwitcher />
					<Button
						onClick={() => {
							localStorage.removeItem(USER_ACCESS_TOKEN);
							localStorage.removeItem(USER_REFRESH_TOKEN);
							logout();
						}}
						icon={<ArrowExitFilled />}
					/>
				</div>
			</Toolbar>
		</header>
	);
};
