import { memo, useCallback, useEffect } from "react";
import { useSystemStore } from "@/entities/System";
import { WeatherMoon20Filled, WeatherSunny20Filled } from "@fluentui/react-icons";
import { Button } from "@fluentui/react-components";
import { USER_THEME } from "@/shared/consts/localStorage";
import { Theme } from "@/entities/System/model/types/Theme";

export const ThemeSwitcher = memo(() => {
	const { setTheme, theme } = useSystemStore();

	useEffect(() => {
		setTheme((localStorage.getItem(USER_THEME) as Theme) || "light");
	}, []);

	const onToggle = useCallback(() => {
		switch (theme) {
			case "dark":
				localStorage.setItem(USER_THEME, "light");
				setTheme("light");
				break;
			case "light":
				localStorage.setItem(USER_THEME, "dark");
				setTheme("dark");
				break;
		}
	}, [theme, setTheme]);

	return <Button onClick={onToggle}>{theme === "light" ? <WeatherSunny20Filled /> : <WeatherMoon20Filled />}</Button>;
});
