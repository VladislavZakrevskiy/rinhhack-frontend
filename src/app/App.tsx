import { Suspense } from "react";
import { AppRouter } from "./providers/router";
import { PageLoader } from "@/widgets/PageLoader";
import "./index.css";

const App = () => {
	// const { data: user, isLoading } = useGetMeQuery(undefined);

	// useEffect(() => {
	// 	if (user) setAuthData(user);
	// }, [user]);

	// if (isLoading) {
	// 	return <PageLoader />;
	// }

	return (
		<div>
			<Suspense fallback={<PageLoader />}>
				{/* <Navbar /> */}
				<div className="content-page">
					{/* <Sidebar /> */}
					<AppRouter />
				</div>
			</Suspense>
		</div>
	);
};

export default App;
