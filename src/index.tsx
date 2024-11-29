import { createRoot } from "react-dom/client";
import "@/shared/config/i18n/i18n";
import App from "@/app/App";
import { AppProvider } from "./app/providers/AppProvider";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
	<AppProvider>
		<App />
	</AppProvider>,
);
