import React, { useEffect, useState } from "react";
import { setData, resetData } from "../actions/appActions";
import appDispatcher from "../dispatchers/appDispatcher";
import appStore from "../store/appStore";

const MainComponent = () => {
	const [state, setState] = useState(appStore.getState());

	// Suscribirse a los cambios en el Store
	useEffect(() => {
		const handleChange = (newState) => setState(newState);
		appStore.subscribe(handleChange);

		return () => {
			appStore.unsubscribe(handleChange);
		};
	}, []);

	// Manejar acciones
	const handleSetData = () => {
		const data = { message: "Hello, Flux!" };
		appDispatcher.dispatch(setData(data)); // Despachar acción para actualizar estado
	};

	const handleResetData = () => {
		appDispatcher.dispatch(resetData()); // Despachar acción para reiniciar estado
	};

	return (
		<div>
			<h1>Flux Architecture</h1>
			<p>
				Current Data: {state.data ? state.data.message : "No data available"}
			</p>
			<button onClick={handleSetData}>Set Data</button>
			<button onClick={handleResetData}>Reset Data</button>
		</div>
	);
};

export default MainComponent;
