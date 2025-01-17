// Dispatcher básico
class Dispatcher {
	constructor() {
		this.callbacks = new Map();
	}

	// Registrar un callback
	register(callback) {
		const id = Date.now().toString();
		this.callbacks.set(id, callback);
		return id;
	}

	// Desregistrar un callback
	unregister(id) {
		this.callbacks.delete(id);
	}

	// Despachar una acción
	dispatch(action) {
		this.callbacks.forEach((callback) => {
			callback(action);
		});
	}
}

// Instancia única del Dispatcher
const appDispatcher = new Dispatcher();
export default appDispatcher;
