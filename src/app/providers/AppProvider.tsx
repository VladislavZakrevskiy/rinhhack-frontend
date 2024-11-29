import { useSystemStore } from "@/entities/System";
import { FluentProvider, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary/ui/ErrorBoundary";

interface AppProviderProps {
	children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
	const { theme } = useSystemStore();

	return (
		<ErrorBoundary>
			<FluentProvider theme={theme === "dark" ? webDarkTheme : webLightTheme}>
				<BrowserRouter>{children}</BrowserRouter>
			</FluentProvider>
		</ErrorBoundary>
	);
};
