import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";

const AudioUploadPage = () => {
	const [formData, setFormData] = useState({
		date: "",
		time: "",
		season: "",
		duration: "",
		location: "",
		conditions: "",
		temperature: "",
		wind: "",
		recordist: "",
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
			const response = await fetch("/api/upload-audio", {
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
			<Row>
				<Col></Col>
				<Col>
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
								type='text'
								name='season'
								value={formData.season}
								onChange={handleChange}
								required
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Duration</Form.Label>
							<Form.Control
								type='text'
								name='duration'
								value={formData.duration}
								onChange={handleChange}
								required
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Location</Form.Label>
							<Form.Control
								type='text'
								name='location'
								value={formData.location}
								onChange={handleChange}
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
							<Form.Label>Temperature</Form.Label>
							<Form.Control
								type='text'
								name='temperature'
								value={formData.temperature}
								onChange={handleChange}
								required
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Wind</Form.Label>
							<Form.Control
								type='text'
								name='wind'
								value={formData.wind}
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
				</Col>
				<Col></Col>
			</Row>
		</Container>
	);
};

export default AudioUploadPage;
