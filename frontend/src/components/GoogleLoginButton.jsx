import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const GoogleLoginButton = ({ onSuccess, onError }) => {
	const navigate = useNavigate();

	function handleLogout() {
		console.log("Google Logout Success");
		navigate("/auth");
	}

	return (
		<div className='text-center mt-3'>
			<GoogleLogin
				onSuccess={(credentialResponse) => {
					console.log("Google Login Success");
					console.log(jwtDecode(credentialResponse.credential));
					onSuccess();
					navigate("/dash");
				}}
				onError={() => {
					console.log("Google Login Error");
					onError();
				}}
			/>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
};

export default GoogleLoginButton;
