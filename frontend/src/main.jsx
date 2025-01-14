import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Importa el proveedor de Google OAuth
import "./index.css";
import App from "./App.jsx";

const CLIENT_ID =
	"713442684422-03urpr3nhdcbq573hihilqn09s3ih58g.apps.googleusercontent.com";
// Reemplaza "TU_CLIENT_ID_DE_GOOGLE" con tu Client ID de Google
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={CLIENT_ID}>
			<App />
		</GoogleOAuthProvider>
	</StrictMode>
);
