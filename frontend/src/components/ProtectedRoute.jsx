import React from "react";
import { Navigate } from "react-router-dom";
import appStore from "../store/appStore";

const ProtectedRoute = ({ children }) => {
	const { token } = appStore.getState();

	// Si no hay token, redirigir al inicio de sesión
	if (!token) {
		return <Navigate to='/auth' replace />;
	}

	// Si el usuario está autenticado, renderizar el contenido
	return children;
};

export default ProtectedRoute;
