import { memo, type FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@fluentui/react-components";

interface Props {
	short?: boolean;
}

export const LanguageSwitcher: FC<Props> = memo(() => {
	const { i18n } = useTranslation();

	const toggle = async () => {
		i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
	};

	return <Button onClick={toggle}>{i18n.language === "ru" ? "RU" : "EN"}</Button>;
});
