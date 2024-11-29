import { useUserStore } from "@/entities/User";
import { Header } from "@/widgets/Header/ui/Header";
import { memo } from "react";
import { useTranslation } from "react-i18next";

const MainPage = memo(() => {
	const { isAuthenticated, user } = useUserStore();
	const { t } = useTranslation();

	return (
		<>
			<Header isAuthenticated={isAuthenticated} userId={user?.id} />
		</>
	);
});

export default MainPage;
