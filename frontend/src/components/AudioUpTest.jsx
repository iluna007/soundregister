import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import appStore from "../store/appStore";

const AudioUpTest = ({ onUploadSuccess, setMessage }) => {
	const [formData, setFormData] = useState({
		title: "",
		date: "",
		tags: "",
	});
	const [audioFile, setAudioFile] = useState(null);
	const { user, token } = appStore.getState();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleAudioChange = (e) => {
		setAudioFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.title || !formData.date || !audioFile) {
			alert("Please complete all fields and select an audio file.");
			return;
		}

		try {
			const formDataToSend = new FormData();
			Object.keys(formData).forEach((key) => {
				if (key === "tags") {
					formDataToSend.append(key, JSON.stringify(formData[key].split(",")));
				} else {
					formDataToSend.append(key, formData[key]);
				}
			});
			formDataToSend.append("audio", audioFile);

			// Inspeccionar el contenido del FormData (opcional)
			for (let pair of formDataToSend.entries()) {
				console.log(`${pair[0]}: ${pair[1]}`);
			}

			await axios.post(
				"http://localhost:5000/api/upload-files",
				formDataToSend,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// Notificar al Dashboard
			if (onUploadSuccess) onUploadSuccess();

			// Mostrar mensaje de éxito
			if (setMessage) setMessage("Audio uploaded successfully!");

			// Limpiar formulario
			setFormData({
				title: "",
				date: "",
				tags: "",
			});
			setAudioFile(null);
		} catch (error) {
			alert("Error uploading file. Please try again.");
			console.error(error.response?.data || error);
		}
	};

	return (
		<div className='mt-5'>
			<Form onSubmit={handleSubmit}>
				<Form.Group className='mb-3'>
					<Form.Label>Title</Form.Label>
					<Form.Control
						type='text'
						name='title'
						value={formData.title}
						onChange={handleChange}
						placeholder='Enter title'
						required
					/>
				</Form.Group>
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
				<Button variant='primary' type='submit'>
					Upload
				</Button>
			</Form>
		</div>
	);
};

export default AudioUpTest;
