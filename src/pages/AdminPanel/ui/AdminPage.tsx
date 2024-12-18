import { AdminTabs, DataTable, PageType, useAdminStore } from "@/entities/Admin";
import { Header } from "@/widgets/Header/ui/Header";
import { Button, Card } from "@fluentui/react-components";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";

const MainScreen = () => {
	const { t } = useTranslation();
	const { currentPage, addPage, setCurrentPage, removePage } = useAdminStore();

	const handleTypeSelect = (type: PageType) => {
		const newPageId = v4();
		addPage(type, newPageId);
		removePage(currentPage!.id);
		setCurrentPage(newPageId);
	};

	useEffect(() => {
		const id = v4();
		addPage("Новая вкладка", id);
		setCurrentPage(id);
	}, []);

	return (
		<div>
			<Header />
			<AdminTabs />
			{currentPage?.type === "Новая вкладка" ? (
				<div className="flex justify-center items-center w-full">
					<Card className="w-1/3" title="Выберите нужную сущность">
						<div className="flex flex-col justify-center gap-4">
							<Button appearance="primary" className="w-full" onClick={() => handleTypeSelect("Пользователи")}>
								{t("users")}
							</Button>
							<Button appearance="primary" className="w-full" onClick={() => handleTypeSelect("Таблицы")}>
								{t("tables")}
							</Button>
						</div>
					</Card>
				</div>
			) : (
				<div className="p-3">
					<DataTable />
				</div>
			)}
		</div>
	);
};

export default MainScreen;
