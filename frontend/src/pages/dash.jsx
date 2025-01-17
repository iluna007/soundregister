import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import appStore from "../store/appStore";
import { fetchAudioRecords, deleteAudioRecord } from "../actions/appActions";
import AudioUp from "../components/AudioUp";

const Dashboard = () => {
	const { user } = appStore.getState();
	const navigate = useNavigate();

	const [audioRecords, setAudioRecords] = useState([]);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	// Cargar registros de audio al montar
	useEffect(() => {
		const loadAudioRecords = async () => {
			try {
				const records = await fetchAudioRecords();
				setAudioRecords(records);
			} catch (err) {
				setError("Failed to load audio records");
			}
		};
		loadAudioRecords();
	}, []);

	// Manejar el cierre de sesión
	const handleLogout = () => {
		appStore.handleAction({ type: "RESET_DATA" });
		navigate("/auth");
	};

	// Manejar la eliminación de un audio
	const handleDelete = async (id) => {
		try {
			await deleteAudioRecord(id);
			setAudioRecords(audioRecords.filter((record) => record.id !== id));
			setMessage("Audio record deleted successfully!");
		} catch (err) {
			setError("Failed to delete audio record");
		}
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
			<h2 className='mt-4'>Upload Audio</h2>
			<AudioUp />

			{/* Mensajes */}
			{message && <Alert variant='success'>{message}</Alert>}
			{error && <Alert variant='danger'>{error}</Alert>}

			{/* Tabla para listar audios */}
			<h2 className='mt-4'>Your Audio Records</h2>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Original Name</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{audioRecords.map((record, index) => (
						<tr key={record.id}>
							<td>{index + 1}</td>
							<td>{record.original_audio_name}</td>
							<td>{record.date}</td>
							<td>
								<Button
									variant='danger'
									size='sm'
									onClick={() => handleDelete(record.id)}
								>
									Delete
								</Button>
								{/* Aquí puedes agregar el botón de editar si es necesario */}
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default Dashboard;
