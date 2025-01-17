// Definir tipos de acciones
export const SET_DATA = "SET_DATA";
export const RESET_DATA = "RESET_DATA";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

export const UPLOAD_AUDIO_SUCCESS = "UPLOAD_AUDIO_SUCCESS";
export const UPLOAD_AUDIO_FAILURE = "UPLOAD_AUDIO_FAILURE";

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

// Función para iniciar sesión

export const loginUser = (email, password) => {
	return async (dispatch) => {
		try {
			const response = await fetch("http://localhost:5000/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.msg || "Login failed");
			}

			const data = await response.json();
			dispatch({ type: LOGIN_SUCCESS, payload: data }); // Actualiza estado global
		} catch (error) {
			dispatch({ type: LOGIN_FAILURE, payload: error.message });
		}
	};
};



// Función para registrar un nuevo usuario

export const registerUser = (username, email, password) => {
	return async (dispatch) => {
		try {
			const response = await fetch("http://localhost:5000/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				if (response.status === 409) {
					throw new Error(errorData.message); // Mensaje claro desde el backend
				}
				throw new Error(errorData.message || "Registration failed");
			}

			const data = await response.json();
			dispatch({ type: REGISTER_SUCCESS, payload: data.message }); // Mensaje de éxito
		} catch (error) {
			dispatch({ type: REGISTER_FAILURE, payload: error.message }); // Mostrar error en frontend
		}
	};
};


// Obtener registros de audio
export const fetchAudioRecords = async () => {
	try {
		const response = await fetch("http://localhost:5000/api/list-audio-records", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		if (!response.ok) {
			throw new Error("Failed to fetch audio records");
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching audio records:", error);
		throw error;
	}
};

// Eliminar un registro de audio
export const deleteAudioRecord = async (id) => {
	try {
		const response = await fetch(
			`http://localhost:5000/api/delete-audio-record/${id}`,
			{
				method: "POST",
			}
		);

		if (!response.ok) {
			throw new Error("Failed to delete audio record");
		}

		return await response.json();
	} catch (error) {
		console.error("Error deleting audio record:", error);
		throw error;
	}
};

// Subir un nuevo audio
export const uploadAudio = (formData) => {
	return async (dispatch) => {
		try {
			const response = await fetch("http://localhost:5000/api/upload-files", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || "Upload failed");
			}

			const data = await response.json();
			dispatch({ type: UPLOAD_AUDIO_SUCCESS, payload: data.message });
		} catch (error) {
			dispatch({ type: UPLOAD_AUDIO_FAILURE, payload: error.message });
		}
	};
};