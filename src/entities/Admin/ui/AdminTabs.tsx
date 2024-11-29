import { Button, Tab, TabList } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useAdminStore } from "../model/useAdminStore";
import { v4 } from "uuid";
import { Delete16Regular } from "@fluentui/react-icons";

export const AdminTabs = () => {
	const { t } = useTranslation();
	const { pages, currentPage, setCurrentPage, addPage, removePage } = useAdminStore();

	const addNewPage = () => {
		const id = v4();
		addPage("Новая вкладка", id);
		setCurrentPage(id);
	};

	return (
		<TabList size="medium" className="p-2" selectedValue={currentPage?.id}>
			{pages.map((pageName) => (
				<Tab
					key={pageName.id}
					icon={
						pageName.type !== "Новая вкладка" ? (
							<Button onClick={() => removePage(pageName.id)} icon={<Delete16Regular />} />
						) : undefined
					}
					onClick={() => setCurrentPage(pageName.id)}
					id={currentPage?.id}
					className="min-w-12"
					value={pageName.type}
				>
					{t(pageName.type)}
				</Tab>
			))}
			<Tab onClick={addNewPage} value={"Новая вкладка"}>
				+
			</Tab>
		</TabList>
	);
};
