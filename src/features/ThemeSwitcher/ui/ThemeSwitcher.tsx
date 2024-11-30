import { memo, useCallback } from "react";
import { useSystemStore } from "@/entities/System";
import { WeatherMoon20Filled, WeatherSunny20Filled } from "@fluentui/react-icons";
import { Button } from "@fluentui/react-components";

export const ThemeSwitcher = memo(() => {
	const { setTheme, theme } = useSystemStore();

	const onToggle = useCallback(() => {
		switch (theme) {
			case "dark":
				setTheme("light");
				break;
			case "light":
				setTheme("light");
				break;
		}
	}, [theme, setTheme]);

	return <Button onClick={onToggle}>{theme === "light" ? <WeatherSunny20Filled /> : <WeatherMoon20Filled />}</Button>;
});
