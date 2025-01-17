import React, { useState, useEffect } from "react";
import "./reactTest.css";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import appStore from "../store/appStore"; // Importar el Store
import { fetchPing } from "../actions/appActions"; // Importar la acción

function RT() {
	const [state, setState] = useState(appStore.getState()); // Obtener el estado inicial desde el Store

	// Suscribirse al Store
	useEffect(() => {
		const handleStoreChange = (newState) => setState(newState);
		appStore.subscribe(handleStoreChange);

		// Despachar la acción para obtener datos del backend
		fetchPing()(appStore.handleAction.bind(appStore));

		return () => {
			appStore.unsubscribe(handleStoreChange); // Desuscribirse al desmontar
		};
	}, []);

	return (
		<>
			<div>
				<a href='https://vite.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank'>
					<img src={reactLogo} className='logo react' alt='React logo' />
				</a>
			</div>
			<h1>Vite + React + Flask + Python + PostgreSQL</h1>
			<div className='card'>
				<button
					onClick={() =>
						setState((prev) => ({ ...prev, count: (prev.count || 0) + 1 }))
					}
				>
					count is {state.count || 0}
				</button>
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className='read-the-docs'>
				Click on the Vite and React logos to learn more
			</p>
			{/* Mostrar el mensaje del backend */}
			<div className='backend-message'>
				<h2>Backend Connection Test</h2>
				<p>{state.pingMessage || "Loading...Pong"}</p>
			</div>
		</>
	);
}

export default RT;
