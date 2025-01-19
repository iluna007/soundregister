import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import appStore from "../store/appStore";
import {
	fetchUserAudioRecords,
	deleteAudioRecord,
} from "../actions/appActions";
import AudioUpTest from "../components/AudioUpTest";

const Dashboard = () => {
	const { user } = appStore.getState();
	const navigate = useNavigate();

	const [audioRecords, setAudioRecords] = useState([]);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	// Cargar registros de audio al montar
	useEffect(() => {
		const loadUserAudioRecords = async () => {
			try {
				if (!user) {
					setError("User not authenticated");
					return;
				}

				const records = await fetchUserAudioRecords(user.id);
				setAudioRecords(records);
			} catch (err) {
				setError("Failed to load audio records");
			}
		};
		loadUserAudioRecords();
	}, [user]);

	// Manejar la subida exitosa
	const handleUploadSuccess = async () => {
		try {
			const records = await fetchUserAudioRecords(user.id);
			setAudioRecords(records);
			setMessage("Audio uploaded successfully!");
		} catch (err) {
			setError("Failed to reload audio records");
		}
	};

	// Manejar el cierre de sesión
	const handleLogout = () => {
		appStore.handleAction({ type: "RESET_DATA" });
		navigate("/auth");
	};

	return (
		<Container className='mt-5'>
			{/* Bienvenida y Logout */}
			<h1>Welcome to your Dashboard</h1>
			{user && <p>Hello, {user.username}!</p>}
			<Button variant='danger' onClick={handleLogout}>
				Logout
			</Button>

			{/* Formulario para subir audios */}
			<h2 className='mt-4'>Upload Audio!</h2>
			<AudioUpTest
				onUploadSuccess={handleUploadSuccess}
				setMessage={setMessage}
			/>

			{/* Mensajes */}
			{message && <Alert variant='success'>{message}</Alert>}
			{error && <Alert variant='danger'>{error}</Alert>}

			{/* Tabla para listar audios */}
			<h2 className='mt-4'>Your Audio Records</h2>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Title</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{audioRecords.map((record, index) => (
						<tr key={record.id}>
							<td>{index + 1}</td>
							<td>{record.title}</td>
							<td>{record.date}</td>
							<td>
								<Button
									variant='info'
									size='sm'
									onClick={() => handleDownload(record.audio_path)}
								>
									Download
								</Button>
								<Button
									variant='danger'
									size='sm'
									onClick={() => handleDelete(record.id)}
								>
									Delete
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default Dashboard;
