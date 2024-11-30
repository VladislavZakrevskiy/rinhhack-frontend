import { memo, useEffect, type FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@fluentui/react-components";
import { USER_LANGUAGE } from "@/shared/consts/localStorage";

interface Props {
	short?: boolean;
}

export const LanguageSwitcher: FC<Props> = memo(() => {
	const { i18n } = useTranslation();

	useEffect(() => {
		i18n.changeLanguage(localStorage.getItem(USER_LANGUAGE) || "en");
	}, []);

	const toggle = async () => {
		localStorage.setItem(USER_LANGUAGE, i18n.language === "ru" ? "en" : "ru");
		i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
	};

	return <Button onClick={toggle}>{i18n.language === "ru" ? "RU" : "EN"}</Button>;
});
