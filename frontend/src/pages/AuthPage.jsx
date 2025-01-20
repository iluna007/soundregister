import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../actions/appActions";
import appStore from "../store/appStore";
import GoogleLoginButton from "../components/GoogleLoginButton";

const AuthPage = () => {
	const navigate = useNavigate();
	const [isSignUp, setIsSignUp] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { authError, registerError, registerMessage } = appStore.getState();

	// Clear messages on component mount
	useEffect(() => {
		appStore.handleAction({ type: "CLEAR_REGISTER_MESSAGE" });
		appStore.handleAction({ type: "CLEAR_AUTH_ERROR" });
	}, []);

	// Automatically clear messages after a few seconds
	useEffect(() => {
		let timeout;
		if (registerMessage || authError || registerError) {
			timeout = setTimeout(() => {
				appStore.handleAction({ type: "CLEAR_REGISTER_MESSAGE" });
				appStore.handleAction({ type: "CLEAR_AUTH_ERROR" });
			}, 3000); // Clear messages after 3 seconds
		}
		return () => clearTimeout(timeout); // Cleanup timeout
	}, [registerMessage, authError, registerError]);

	// Handle store changes and navigation
	useEffect(() => {
		const handleStoreChange = () => {
			const { user } = appStore.getState();

			// Redirect to dashboard if logged in
			if (user) {
				navigate("/dash");
			}
		};

		appStore.subscribe(handleStoreChange);
		return () => appStore.unsubscribe(handleStoreChange);
	}, [navigate]);

	const handleToggle = () => {
		setIsSignUp(!isSignUp);
		setFormData({ username: "", email: "", password: "", confirmPassword: "" });
		appStore.handleAction({ type: "CLEAR_REGISTER_MESSAGE" });
		appStore.handleAction({ type: "CLEAR_AUTH_ERROR" });
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isSignUp) {
			if (formData.password !== formData.confirmPassword) {
				return appStore.handleAction({
					type: "REGISTER_FAILURE",
					payload: "Passwords do not match",
				});
			}
			registerUser(
				formData.username,
				formData.email,
				formData.password
			)(appStore.handleAction.bind(appStore));
		} else {
			loginUser(
				formData.email,
				formData.password
			)(appStore.handleAction.bind(appStore));
		}
	};

	return (
		<Container className='mt-5'>
			<Row>
				<Col></Col>
				<Col>
					<h2 className='text-center'>{isSignUp ? "Sign Up" : "Sign In"}</h2>
					{registerMessage && (
						<Alert variant='success'>{registerMessage}</Alert>
					)}
					{(authError || registerError) && (
						<Alert variant='danger'>{authError || registerError}</Alert>
					)}
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
			<Row>
				<Col></Col>
				<Col>
					<GoogleLoginButton />
				</Col>
				<Col></Col>
			</Row>
		</Container>
	);
};

export default AuthPage;
