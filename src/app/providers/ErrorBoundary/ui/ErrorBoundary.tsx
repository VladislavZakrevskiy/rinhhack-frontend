import { getRouteMain } from "@/shared/consts/router";
import { Button, Card, Text, Title3 } from "@fluentui/react-components";
import React, { Component, ReactNode } from "react";
import { withTranslation } from "react-i18next";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
	constructor(props: { children: ReactNode }) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		console.error(error);
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error("Ошибка компонента:", error);
		console.error("Информация о ошибке:", info);
	}

	render() {
		const { t } = this.props;
		if (this.state.hasError) {
			return (
				<div className="flex justify-center items-center h-screen">
					<Card className="w-[40%] flex flex-col">
						<Title3 className="mb-3">{t("error")}</Title3>
						<Text>{t("sorry error")}</Text>
						<Text>{t("please reload error")}</Text>
						<div className="flex gap-3">
							<Button onClick={() => location.replace(getRouteMain())} appearance="primary">
								{t("to home")}
							</Button>
							<Button onClick={() => location.reload()} appearance="primary">
								{t("reload")}
							</Button>
						</div>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}

export default withTranslation()(ErrorBoundary);
