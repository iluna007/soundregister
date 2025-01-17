import React, { createContext, useReducer } from "react";

// Crear el contexto
export const AppContext = createContext();

// Reducer inicial para manejar las acciones
const initialState = {};
const appReducer = (state, action) => {
	switch (action.type) {
		// Aquí definirás los casos según las acciones
		default:
			return state;
	}
};

// Proveedor del contexto
export const AppProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReducer, initialState);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
};
