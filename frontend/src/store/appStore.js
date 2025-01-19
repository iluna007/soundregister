import appDispatcher from "../dispatchers/appDispatcher";
import {
	SET_DATA,
	RESET_DATA,
	FETCH_PING_SUCCESS,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	REGISTER_SUCCESS,
	REGISTER_FAILURE,
	UPLOAD_AUDIO_SUCCESS,
	UPLOAD_AUDIO_FAILURE,
	FETCH_ALL_AUDIO_RECORDS_SUCCESS,
	FETCH_ALL_AUDIO_RECORDS_FAILURE,
} from "../actions/appActions";

class AppStore {
	constructor() {
		this.state = {
			data: null, // Estado inicial
			pingMessage: null, // Nuevo estado para almacenar la respuesta del ping
			user: null, // Almacena los datos del usuario autenticado
			token: null, // Almacena el token JWT
			authError: null, // Manejar errores de autenticación
			registerError: null, // Para manejar errores de registro
			registerMessage: null, // Para mostrar mensajes exitosos de registro
			allAudioRecords: [], // Para almacenar todos los archivos
			fetchAudioError: null, // Para manejar errores en la carga de archivos
		};
		this.listeners = new Set();
	}

	// Obtener el estado actual
	getState() {
		return this.state;
	}

	// Registrar un listener para actualizaciones
	subscribe(listener) {
		this.listeners.add(listener);
	}

	// Desregistrar un listener
	unsubscribe(listener) {
		this.listeners.delete(listener);
	}

	// Notificar a todos los listeners
	emitChange() {
		this.listeners.forEach((listener) => listener(this.state));
	}

	// Manejar acciones despachadas
	handleAction(action) {
		switch (action.type) {
			case SET_DATA:
				this.state = { ...this.state, data: action.payload };
				this.emitChange();
				break;
			case RESET_DATA:
				this.state = { ...this.state, data: null };
				this.emitChange();
				break;
			case FETCH_PING_SUCCESS:
				this.state = { ...this.state, pingMessage: action.payload };
				this.emitChange();
				break;
			case LOGIN_SUCCESS:
				this.state = {
					...this.state,
					user: action.payload.user,
					token: action.payload.access_token,
					authError: null,
				};
				this.emitChange();
				break;
			case LOGIN_FAILURE: // Manejar errores de autenticación
				this.state = {
					...this.state,
					user: null,
					token: null,
					authError: action.payload,
				};
				this.emitChange();
				break;
			case REGISTER_SUCCESS:
				this.state = {
					...this.state,
					registerMessage: "User registered successfully!",
					registerError: null,
				};
				this.emitChange();
				break;
			case REGISTER_FAILURE:
				this.state = {
					...this.state,
					registerError: action.payload,
					registerMessage: null,
				};
				this.emitChange();
				break;
			case UPLOAD_AUDIO_SUCCESS:
				this.state = {
					...this.state,
					uploadMessage: action.payload,
					uploadError: null,
				};
				this.emitChange();
				break;
			case UPLOAD_AUDIO_FAILURE:
				this.state = {
					...this.state,
					uploadMessage: null,
					uploadError: action.payload,
				};
				this.emitChange();
				break;
			case FETCH_ALL_AUDIO_RECORDS_SUCCESS:
				this.state = {
					...this.state,
					allAudioRecords: action.payload,
					fetchAudioError: null,
				};
				this.emitChange();
				break;
			case FETCH_ALL_AUDIO_RECORDS_FAILURE:
				this.state = {
					...this.state,
					allAudioRecords: [],
					fetchAudioError: action.payload,
				};
				this.emitChange();
				break;
		}
	}
}

// Crear una instancia del Store
const appStore = new AppStore();

// Registrar el Store en el Dispatcher
appDispatcher.register((action) => appStore.handleAction(action));

export default appStore;
