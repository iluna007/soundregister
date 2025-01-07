import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";

const AuthPage = () => {
	const [isSignUp, setIsSignUp] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	// Alternar entre Sign Up y Sign In
	const handleToggle = () => {
		setIsSignUp(!isSignUp);
		setFormData({ username: "", email: "", password: "", confirmPassword: "" });
		setMessage(null);
		setError(null);
	};

	// Manejar cambios en los inputs
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Enviar el formulario
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validación del lado del cliente
		if (isSignUp && formData.password !== formData.confirmPassword) {
			setError("Passwords do not match!");
			return;
		}

		// Configuración de endpoint y payload
		const endpoint = isSignUp
			? "http://localhost:5000/api/users"
			: "http://localhost:5000/api/signin";

		const payload = isSignUp
			? {
					username: formData.username,
					email: formData.email,
					password: formData.password,
			  }
			: {
					email: formData.email,
					password: formData.password,
			  };

		try {
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			// Manejo de errores del backend
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "An error occurred.");
			}

			// Analizar respuesta exitosa
			const data = await response.json();
			setMessage(data.message || (isSignUp ? "User created successfully!" : "Login successful!"));
			setError(null);

			// Limpia el formulario tras éxito en Sign Up
			if (isSignUp) {
				setFormData({ username: "", email: "", password: "", confirmPassword: "" });
			}

			// Manejo adicional tras inicio de sesión exitoso (ej. guardar sesión)
			if (!isSignUp) {
				console.log("Logged in user:", data.user);
			}
		} catch (err) {
			setError(err.message || "An error occurred.");
			setMessage(null);
		}
	};

	return (
		<Container className="mt-5">
			<Row>
				<Col></Col>
				<Col>
					<h2 className="text-center">{isSignUp ? "Sign Up" : "Sign In"}</h2>
					{message && <Alert variant="success">{message}</Alert>}
					{error && <Alert variant="danger">{error}</Alert>}
					<Form onSubmit={handleSubmit}>
						{isSignUp && (
							<Form.Group className="mb-3">
								<Form.Label>Username</Form.Label>
								<Form.Control
									type="text"
									name="username"
									value={formData.username}
									onChange={handleChange}
									placeholder="Enter your username"
									required
								/>
							</Form.Group>
						)}
						<Form.Group className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter your email"
								required
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Enter your password"
								required
							/>
						</Form.Group>
						{isSignUp && (
							<Form.Group className="mb-3">
								<Form.Label>Confirm Password</Form.Label>
								<Form.Control
									type="password"
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									placeholder="Confirm your password"
									required
								/>
							</Form.Group>
						)}
						<Button variant="primary" type="submit">
							{isSignUp ? "Sign Up" : "Sign In"}
						</Button>
					</Form>
					<div className="text-center mt-3">
						<Button variant="link" onClick={handleToggle}>
							{isSignUp
								? "Already have an account? Sign In"
								: "Don't have an account? Sign Up"}
						</Button>
					</div>
				</Col>
				<Col></Col>
			</Row>
		</Container>
	);
};

export default AuthPage;
