import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Importa el proveedor de Google OAuth
import { AppProvider } from "./AppContext"; // Contexto global
import App from "./App.jsx";
import './main.css';  // Asegúrate de que la ruta sea correcta


const CLIENT_ID =
	"32564316129-c0m0sa303p4a7p7b9joi2ihpd4vbn19a.apps.googleusercontent.com";
// Reemplaza "TU_CLIENT_ID_DE_GOOGLE" con tu Client ID de Google
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={CLIENT_ID}>
			<AppProvider>
				<App />
			</AppProvider>
		</GoogleOAuthProvider>
	</StrictMode>
);
