import { USER_ACCESS_TOKEN } from "@/shared/consts/localStorage";
import { getRouteMain } from "@/shared/consts/router";
import { Button, Input } from "@fluentui/react-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
	const [authData, setAuthData] = useState({
		email: "",
		password: "",
	});
	const [register] = useSignInMutation();
	const nav = useNavigate();
	const { setAuthData: setAuthDataRedux } = useUserActions();
	const onSubmit = async () => {
		const user = await register(authData).unwrap();
		if (user) {
			localStorage.setItem(USER_ACCESS_TOKEN, user.accessToken);
			nav(getRouteMain());
			setAuthDataRedux(user);
		}
	};
	return (
		<div>
			<Input value={authData.email} onChange={(e) => setAuthData((prev) => ({ ...prev, email: e.target.value }))} />
			<Input
				value={authData.password}
				onChange={(e) => setAuthData((prev) => ({ ...prev, password: e.target.value }))}
			/>
			<Button type="submit" onClick={onSubmit}>
				Submit
			</Button>
		</div>
	);
};

export default LoginPage;
