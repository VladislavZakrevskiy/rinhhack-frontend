import { Spinner } from "@fluentui/react-components";
import { FC } from "react";

interface Props {}

export const PageLoader: FC<Props> = () => {
	return (
		<div className="flex justify-center items-center h-screen w-full">
			<Spinner />
		</div>
	);
};
