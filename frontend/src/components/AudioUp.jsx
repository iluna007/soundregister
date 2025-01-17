import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { uploadAudio } from "../actions/appActions";
import appStore from "../store/appStore";

const AudioUp = () => {
	const [formData, setFormData] = useState({
		date: "",
		time: "",
		season: "Winter",
		duration: "00:00:00",
		location: "",
		conditions: "Clear",
		temperature: "0",
		wind_speed: "0",
		wind_direction: "N",
		recordist: "",
		notes: "",
		tags: "",
	});
	const [audioFile, setAudioFile] = useState(null);
	const { uploadMessage, uploadError } = appStore.getState();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleAudioChange = (e) => {
		setAudioFile(e.target.files[0]);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Verificar que todos los campos requeridos estén completos
		for (const key in formData) {
			if (!formData[key]) {
				alert(`Field ${key} is required.`);
				return;
			}
		}

		if (!audioFile) {
			alert("Audio file is required.");
			return;
		}

		// Crear FormData para enviar al backend
		const formDataToSend = new FormData();
		Object.keys(formData).forEach((key) => {
			formDataToSend.append(key, formData[key]);
		});
		formDataToSend.append("audio", audioFile);

		// Llamar a la acción de Flux
		uploadAudio(formDataToSend)(appStore.handleAction.bind(appStore));
	};

	return (
		<Container className='mt-5'>
			{uploadMessage && <Alert variant='success'>{uploadMessage}</Alert>}
			{uploadError && <Alert variant='danger'>{uploadError}</Alert>}
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
						pattern='\d{2}:\d{2}:\d{2}'
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
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Temperature (°C)</Form.Label>
					<Form.Control
						type='text'
						name='temperature'
						value={formData.temperature}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Wind Speed</Form.Label>
					<Form.Control
						type='text'
						name='wind_speed'
						value={formData.wind_speed}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Wind Direction</Form.Label>
					<Form.Control
						type='text'
						name='wind_direction'
						value={formData.wind_direction}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Recordist</Form.Label>
					<Form.Control
						type='text'
						name='recordist'
						value={formData.recordist}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Notes</Form.Label>
					<Form.Control
						as='textarea'
						name='notes'
						value={formData.notes}
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group className='mb-3'>
					<Form.Label>Tags</Form.Label>
					<Form.Control
						type='text'
						name='tags'
						value={formData.tags}
						onChange={handleChange}
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
				<Button variant='primary' type='submit'>
					Upload
				</Button>
			</Form>
		</Container>
	);
};

export default AudioUp;
