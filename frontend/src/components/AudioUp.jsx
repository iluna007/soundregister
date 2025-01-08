import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";

const AudioUploadPage = () => {
	const [formData, setFormData] = useState({
		date: "",
		time: "",
		season: "Winter", // Predeterminado a 'Winter'
		duration: "00:00:00", // Duración predeterminada en formato hh:mm:ss
		location: "", // Formato: Lat, Long
		conditions: "Clear", // Condición predeterminada
		temperature: "0°C", // Formato para grados Celsius
		wind: "NW 0 km/h", // Predeterminado a dirección y velocidad
		recordistance: "0 meters", // Predeterminado con unidades
		notes: "",
		tags: "",
	});
	const [audioFile, setAudioFile] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleAudioChange = (e) => {
		setAudioFile(e.target.files[0]);
	};

	const handleImageChange = (e) => {
		setImageFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formDataToSend = new FormData();
		Object.keys(formData).forEach((key) => {
			formDataToSend.append(key, formData[key]);
		});
		if (audioFile) formDataToSend.append("audio", audioFile);
		if (imageFile) formDataToSend.append("image", imageFile);

		try {
			const response = await fetch("http://localhost:5000/api/upload-audio", {
				method: "POST",
				body: formDataToSend,
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || "An error occurred.");
			}

			const data = await response.json();
			setMessage(data.message || "Audio uploaded successfully!");
			setError(null);
		} catch (err) {
			setError(err.message || "An error occurred.");
			setMessage(null);
		}
	};

	return (
		<Container className='mt-5'>
			<h2 className='text-center'>Upload Audio</h2>
			{message && <Alert variant='success'>{message}</Alert>}
			{error && <Alert variant='danger'>{error}</Alert>}
			<Form onSubmit={handleSubmit}>
				<Form.Group className='mb-3'>
					<Form.Label>Date</Form.Label>
					<Form.Control
						type='date'
						name='date'
						value={formData.date}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Time</Form.Label>
					<Form.Control
						type='time'
						name='time'
						value={formData.time}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Season</Form.Label>
					<Form.Control
						as='select'
						name='season'
						value={formData.season}
						onChange={handleChange}
					>
						<option>Winter</option>
						<option>Spring</option>
						<option>Summer</option>
						<option>Autumn</option>
					</Form.Control>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Duration (hh:mm:ss)</Form.Label>
					<Form.Control
						type='text'
						name='duration'
						value={formData.duration}
						onChange={handleChange}
						placeholder='00:00:00'
						pattern='\d{2}:\d{2}:\d{2}' // Validación para formato hh:mm:ss
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Location (Lat, Long)</Form.Label>
					<Form.Control
						type='text'
						name='location'
						value={formData.location}
						onChange={handleChange}
						placeholder='e.g., 37.7749, -122.4194'
						pattern='^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$' // Validación de coordenadas
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Conditions</Form.Label>
					<Form.Control
						type='text'
						name='conditions'
						value={formData.conditions}
						onChange={handleChange}
						placeholder='e.g., Clear, Few clouds'
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Temperature (°C)</Form.Label>
					<Form.Control
						type='text'
						name='temperature'
						value={formData.temperature}
						onChange={handleChange}
						placeholder='e.g., 20°C'
						pattern='^-?\d+°C$' // Validación para formato de temperatura
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Wind (e.g., NW 10 km/h)</Form.Label>
					<Form.Control
						type='text'
						name='wind'
						value={formData.wind}
						onChange={handleChange}
						placeholder='e.g., NW 10 km/h'
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Record Distance (meters)</Form.Label>
					<Form.Control
						type='text'
						name='recordistance'
						value={formData.recordistance}
						onChange={handleChange}
						placeholder='e.g., 100 meters'
						pattern='^\d+\s*meters$' // Validación para metros
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Notes</Form.Label>
					<Form.Control
						as='textarea'
						name='notes'
						value={formData.notes}
						onChange={handleChange}
						placeholder='Enter notes about the audio'
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Tags</Form.Label>
					<Form.Control
						type='text'
						name='tags'
						value={formData.tags}
						onChange={handleChange}
						placeholder='Enter tags separated by commas'
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Audio File</Form.Label>
					<Form.Control
						type='file'
						accept='audio/*'
						onChange={handleAudioChange}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Image</Form.Label>
					<Form.Control
						type='file'
						accept='image/*'
						onChange={handleImageChange}
					/>
				</Form.Group>
				<Button variant='primary' type='submit'>
					Upload
				</Button>
			</Form>
		</Container>
	);
};

export default AudioUploadPage;
