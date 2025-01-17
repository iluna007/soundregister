import appDispatcher from "../dispatchers/appDispatcher";
import {
	SET_DATA,
	RESET_DATA,
	FETCH_PING_SUCCESS,
} from "../actions/appActions";

class AppStore {
	constructor() {
		this.state = {
			data: null, // Estado inicial
			pingMessage: null, // Nuevo estado para almacenar la respuesta del ping
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
			case FETCH_PING_SUCCESS: // Manejar la acción de ping
				this.state = { ...this.state, pingMessage: action.payload };
				this.emitChange();
				break;
			default:
				break;
		}
	}
}

// Crear una instancia del Store
const appStore = new AppStore();

// Registrar el Store en el Dispatcher
appDispatcher.register((action) => appStore.handleAction(action));

export default appStore;
