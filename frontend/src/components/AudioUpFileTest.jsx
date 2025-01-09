import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const AudioUpFileTest = ({ onFileUploaded }) => {
	const [audioFile, setAudioFile] = useState(null);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	const handleAudioChange = (e) => {
		setAudioFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!audioFile) {
			setError("Please select an audio file to upload.");
			setMessage(null);
			return;
		}

		const formData = new FormData();
		formData.append("audio", audioFile);

		try {
			const response = await fetch("http://localhost:5000/api/upload-files", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || "An error occurred.");
			}

			const data = await response.json();
			setMessage(data.message || "Audio uploaded successfully!");
			setError(null);

			// Llamar a la función del padre para notificar el éxito
			if (onFileUploaded) {
				onFileUploaded();
			}
		} catch (err) {
			setError(err.message || "An error occurred.");
			setMessage(null);
		}
	};

	return (
		<div>
			{message && <Alert variant="success">{message}</Alert>}
			{error && <Alert variant="danger">{error}</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Audio File</Form.Label>
					<Form.Control
						type="file"
						accept="audio/*"
						onChange={handleAudioChange}
						required
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Upload
				</Button>
			</Form>
		</div>
	);
};

export default AudioUpFileTest;
