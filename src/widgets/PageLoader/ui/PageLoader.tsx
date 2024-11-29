import { Spinner } from "@fluentui/react-components";
import { FC } from "react";

interface Props {}

export const PageLoader: FC<Props> = () => {
	return (
		<div>
			<Spinner />
		</div>
	);
};
