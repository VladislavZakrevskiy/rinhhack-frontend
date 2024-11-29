import { getRouteMain } from "@/shared/consts/router";
import { Button, Card, Text, Title3 } from "@fluentui/react-components";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ErrorPage = memo(() => {
	const { t } = useTranslation();
	const nav = useNavigate();

	return (
		<div className="flex justify-center items-center h-screen">
			<Card className="w-[40%] flex flex-col">
				<Title3 className="mb-3">{t("error")}</Title3>
				<Text>{t("sorry error")}</Text>
				<Text>{t("please reload error")}</Text>
				<div className="flex gap-3">
					<Button onClick={() => nav(-1)} appearance="primary">
						{t("back")}
					</Button>
					<Button onClick={() => nav(getRouteMain())} appearance="primary">
						{t("to home")}
					</Button>
				</div>
			</Card>
		</div>
	);
});

export default ErrorPage;
