import axios from "axios";

// Definir tipos de acciones
export const SET_DATA = "SET_DATA";
export const RESET_DATA = "RESET_DATA";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

export const FETCH_AUDIO_RECORDS_SUCCESS = "FETCH_AUDIO_RECORDS_SUCCESS";

export const FETCH_ALL_AUDIO_RECORDS_SUCCESS =
	"FETCH_ALL_AUDIO_RECORDS_SUCCESS";
export const FETCH_ALL_AUDIO_RECORDS_FAILURE =
	"FETCH_ALL_AUDIO_RECORDS_FAILURE";

export const UPLOAD_AUDIO_SUCCESS = "UPLOAD_AUDIO_SUCCESS";
export const UPLOAD_AUDIO_FAILURE = "UPLOAD_AUDIO_FAILURE";

export const FETCH_PING_SUCCESS = "FETCH_PING_SUCCESS";

// Función para crear una acción de establecer datos
export const setData = (data) => ({
	type: SET_DATA,
	payload: data,
});

// Función para crear una acción de reinicio de datos
export const resetData = () => ({
	type: RESET_DATA,
});


//para despliegue sustituir localhost por la ip de la maquina
//const BACKEND_URL = "http://localhost:5000";
const BACKEND_URL = "http://138.68.165.159:5000";


// Test ping pong conexión con el servidor
export const fetchPing = () => {
	return async (dispatch) => {
		try {
			const { data } = await axios.get(`${BACKEND_URL}/ping`);
			dispatch({ type: FETCH_PING_SUCCESS, payload: data.message });
		} catch (error) {
			console.error("Error fetching ping:", error);
		}
	};
};

// Función para iniciar sesión
export const loginUser = (email, password) => {
	return async (dispatch) => {
		try {
			const { data } = await axios.post(`${BACKEND_URL}/login`, {
				email,
				password,
			});
			dispatch({ type: LOGIN_SUCCESS, payload: data });
		} catch (error) {
			dispatch({
				type: LOGIN_FAILURE,
				payload: error.response?.data?.msg || "Login failed",
			});
		}
	};
};
// Logout function
export const logoutUser = () => {
	return (dispatch) => {
		try {
			// Clear any stored session data
			localStorage.removeItem("userToken");
			sessionStorage.removeItem("userSession");

			// Dispatch RESET_DATA to clear global state
			dispatch({ type: RESET_DATA });

			console.log("User logged out successfully.");
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};
};


// Función para registrar un nuevo usuario
export const registerUser = (username, email, password) => {
	return async (dispatch) => {
		try {
			const { data } = await axios.post(`${BACKEND_URL}/api/users`, {
				username,
				email,
				password,
			});
			dispatch({ type: REGISTER_SUCCESS, payload: data.message });
		} catch (error) {
			dispatch({
				type: REGISTER_FAILURE,
				payload: error.response?.data?.message || "Registration failed",
			});
		}
	};
};

// Obtener registros de audio
export const fetchAudioRecords = async () => {
	try {
		const { data } = await axios.get(
			"${BACKEND_URL}/api/list-audio-records"
		);
		return data;
	} catch (error) {
		console.error("Error fetching audio records:", error);
		throw error;
	}
};

// Eliminar un registro de audio
export const deleteAudioRecord = async (id) => {
	try {
		const { data } = await axios.post(
			`${BACKEND_URL}api/delete-audio-record/${id}`
		);
		return data;
	} catch (error) {
		console.error("Error deleting audio record:", error);
		throw error;
	}
};

// Subir un nuevo audio
export const uploadAudio = (formData) => {
	return async (dispatch) => {
		try {
			const { data } = await axios.post(
				`${BACKEND_URL}/api/upload-files`,
				formData
			);
			dispatch({ type: UPLOAD_AUDIO_SUCCESS, payload: data.message });
		} catch (error) {
			dispatch({
				type: UPLOAD_AUDIO_FAILURE,
				payload: error.response?.data || "Upload failed",
			});
		}
	};
};

// Obtener registros de audio filtrados por usuario
export const fetchUserAudioRecords = async (user_id) => {
	try {
		const { data } = await axios.get(
			`${BACKEND_URL}/api/list-audio-records/${user_id}`
		);
		return data;
	} catch (error) {
		console.error("Error fetching user audio records:", error);
		throw new Error("Failed to fetch audio records.");
	}
};

// Acción para obtener todos los archivos de la API
export const fetchAllAudioRecords = async () => {
	try {
		const { data } = await axios.get(`${BACKEND_URL}/api/list-files`);

		// Validar que los datos sean un array
		if (!Array.isArray(data)) {
			throw new Error("Invalid data format: Expected an array");
		}

		// Garantizar que cada objeto tenga los campos necesarios y validar tags
		const validatedData = data.map((record) => ({
			...record,
			tags: Array.isArray(record.tags)
				? record.tags
				: JSON.parse(record.tags || "[]"),
		}));

		return validatedData;
	} catch (error) {
		console.error("Error fetching audio records:", error);
		throw error;
	}
};



