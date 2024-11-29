import { Tab, TabList } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useAdminStore } from "../model/useAdminStore";

export const AdminTabs = () => {
	const { t } = useTranslation();
	const { pages, currentPageId, setCurrentPage } = useAdminStore();

	return (
		<TabList className="p-12" selectedValue={currentPageId} onChange={(value) => setCurrentPage(value.type)}>
			{pages.map((pageName) => (
				<Tab value={pageName.type}>{t(pageName.type)}</Tab>
			))}
			<Tab value={"Новая вкладка"}>+</Tab>
		</TabList>
	);
};
