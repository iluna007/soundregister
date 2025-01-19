import axios from "axios";

// Definir tipos de acciones
export const SET_DATA = "SET_DATA";
export const RESET_DATA = "RESET_DATA";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

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

// Test ping pong conexión con el servidor
export const fetchPing = () => {
	return async (dispatch) => {
		try {
			const { data } = await axios.get("http://localhost:5000/ping");
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
			const { data } = await axios.post("http://localhost:5000/login", {
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

// Función para registrar un nuevo usuario
export const registerUser = (username, email, password) => {
	return async (dispatch) => {
		try {
			const { data } = await axios.post("http://localhost:5000/api/users", {
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
			"http://localhost:5000/api/list-audio-records"
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
			`http://localhost:5000/api/delete-audio-record/${id}`
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
				"http://localhost:5000/api/upload-files",
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
export const fetchUserAudioRecords = async (userId) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/api/list-audio-records/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching user audio records:", error);
    throw error;
  }
};