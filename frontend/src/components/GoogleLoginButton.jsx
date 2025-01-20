import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import appStore from "../store/appStore";

const GoogleLoginButton = () => {
	const navigate = useNavigate();

	const handleGoogleSuccess = async (credentialResponse) => {
		try {
			// Decodificar el token de Google
			const decoded = jwtDecode(credentialResponse.credential);

			// Enviar el token al backend
			const response = await axios.post(
				"http://localhost:5000/api/google-login",
				{
					email: decoded.email,
					name: decoded.name,
				}
			);

			// Actualizar el estado global con los datos del usuario
			appStore.handleAction({
				type: "LOGIN_SUCCESS",
				payload: response.data.user,
			});

			// Redirigir al Dashboard
			navigate("/dash");
		} catch (error) {
			console.error("Error with Google login:", error);
			alert("Failed to log in with Google.");
		}
	};

	const handleGoogleError = () => {
		console.error("Google Login Error");
		alert("Google login failed. Please try again.");
	};

	return (
		<div className='text-center mt-3'>
			<GoogleLogin
				onSuccess={handleGoogleSuccess}
				onError={handleGoogleError}
			/>
		</div>
	);
};

export default GoogleLoginButton;
