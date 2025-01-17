import React from "react";
import appStore from "../store/appStore";

const DashboardUser = () => {
	const { user } = appStore.getState();

	return (
		<div>
			<h1>Welcome to your Dashboard !!!</h1>
			{user ? <p>Hello, {user.username}!</p> : <p>Loading...</p>}
		</div>
	);
};

export default DashboardUser;
