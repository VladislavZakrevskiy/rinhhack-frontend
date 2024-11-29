import { Header } from "@/widgets/Header/ui/Header";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

const MainPage = memo(() => {
	const { t } = useTranslation("main");

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userId, setUserId] = useState<string | undefined>(undefined);
	return (
		<>
			<Header isAuthenticated={isAuthenticated} userId={userId} />
		</>
	)
});

export default MainPage;
