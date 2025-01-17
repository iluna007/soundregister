import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { uploadAudio } from "../actions/appActions";

const AudioUploadForm = () => {
	const [file, setFile] = useState(null);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!file) {
			setError("Please select a file to upload.");
			return;
		}

		// Crear FormData para enviar al backend
		const formData = new FormData();
		formData.append("audio", file);

		try {
			const response = await uploadAudio(formData); // Llama a la acción para subir audio
			setMessage(response.message || "Audio uploaded successfully!");
			setError(null);
			setFile(null); // Limpia el formulario
		} catch (err) {
			setError("Failed to upload audio. Please try again.");
			setMessage(null);
		}
	};

	return (
		<>
			{message && <Alert variant='success'>{message}</Alert>}
			{error && <Alert variant='danger'>{error}</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId='formFile'>
					<Form.Label>Upload Audio</Form.Label>
					<Form.Control type='file' onChange={handleFileChange} />
				</Form.Group>
				<Button variant='primary' type='submit' className='mt-3'>
					Upload
				</Button>
			</Form>
		</>
	);
};

export default AudioUploadForm;
