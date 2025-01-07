import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap"; // Added Row and Col

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

	const handleToggle = () => {
		setIsSignUp(!isSignUp);
		setFormData({ username: "", email: "", password: "", confirmPassword: "" });
		setMessage(null);
		setError(null);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const endpoint = isSignUp ? "/signup" : "/signin";
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

			// Verifica si la respuesta es exitosa
			if (!response.ok) {
				const errorData = await response.text(); // Obtén texto sin intentar convertirlo a JSON
				throw new Error(errorData || "An error occurred.");
			}

			// Intenta analizar la respuesta solo si tiene un cuerpo
			const responseBody = await response.text();
			const data = responseBody ? JSON.parse(responseBody) : {};
			setMessage(data.message || "Success!");
			setError(null);
		} catch (err) {
			setError(err.message || "An error occurred.");
			setMessage(null);
		}
	};

	return (
		<Container className='mt-5'>
			<Row>
				<Col></Col>
				<Col>
					<h2 className='text-center'>{isSignUp ? "Sign Up" : "Sign In"}</h2>
					{message && <Alert variant='success'>{message}</Alert>}
					{error && <Alert variant='danger'>{error}</Alert>}
					<Form onSubmit={handleSubmit}>
						{isSignUp && (
							<Form.Group className='mb-3'>
								<Form.Label>Username</Form.Label>
								<Form.Control
									type='text'
									name='username'
									value={formData.username}
									onChange={handleChange}
									placeholder='Enter your username'
									required
								/>
							</Form.Group>
						)}
						<Form.Group className='mb-3'>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='Enter your email'
								required
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								name='password'
								value={formData.password}
								onChange={handleChange}
								placeholder='Enter your password'
								required
							/>
						</Form.Group>
						{isSignUp && (
							<Form.Group className='mb-3'>
								<Form.Label>Confirm Password</Form.Label>
								<Form.Control
									type='password'
									name='confirmPassword'
									value={formData.confirmPassword}
									onChange={handleChange}
									placeholder='Confirm your password'
									required
								/>
							</Form.Group>
						)}
						<Button variant='primary' type='submit'>
							{isSignUp ? "Sign Up" : "Sign In"}
						</Button>
					</Form>
					<div className='text-center mt-3'>
						<Button variant='link' onClick={handleToggle}>
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
