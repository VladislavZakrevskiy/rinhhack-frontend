import { useSystemStore } from "@/entities/System";
import { FluentProvider, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

interface AppProviderProps {
	children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
	const { theme } = useSystemStore();

	return (
		<FluentProvider theme={theme === "dark" ? webDarkTheme : webLightTheme}>
			<BrowserRouter>{children}</BrowserRouter>
		</FluentProvider>
	);
};
