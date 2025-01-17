// Definir tipos de acciones
export const SET_DATA = "SET_DATA";
export const RESET_DATA = "RESET_DATA";

// Función para crear una acción de establecer datos
export const setData = (data) => ({
	type: SET_DATA,
	payload: data,
});

// Función para crear una acción de reinicio de datos
export const resetData = () => ({
	type: RESET_DATA,
});

// Test ping pong conexion con el servidor

export const FETCH_PING_SUCCESS = "FETCH_PING_SUCCESS";

export const fetchPing = () => {
	return async (dispatch) => {
		try {
			const response = await fetch("http://localhost:5000/ping"); // Ajusta la URL si es necesario
			const data = await response.json();
			dispatch({ type: FETCH_PING_SUCCESS, payload: data.message });
		} catch (error) {
			console.error("Error fetching ping:", error);
		}
	};
};
