import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import appStore from "../store/appStore";
import {
	fetchUserAudioRecords,
	deleteAudioRecord,
	logoutUser
} from "../actions/appActions";
import AudioUpTest from "../components/AudioUpTest";

const Dashboard = () => {
	const { user } = appStore.getState();
	const navigate = useNavigate();

	const [audioRecords, setAudioRecords] = useState([]);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	// Load user audio records on component mount
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

	// Handle successful audio upload
	const handleUploadSuccess = async () => {
		try {
			const records = await fetchUserAudioRecords(user.id);
			setAudioRecords(records);
			setMessage("Audio uploaded successfully!");
		} catch (err) {
			setError("Failed to reload audio records");
		}
	};

	// Handle sign out
	const handleLogout = () => {
		logoutUser()(appStore.handleAction.bind(appStore)); // Dispatch logout action
		navigate("/auth");
	};

	// Handle deleting an audio record
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
			{/* Welcome Section */}
			<h1>Welcome to your Dashboard</h1>
			{user && <p>Hello, {user.username}!</p>}
			<Button variant='danger' onClick={handleLogout}>
				Sign Out
			</Button>

			{/* Upload Section */}
			<h2 className='mt-4'>Upload Audio</h2>
			<AudioUpTest
				onUploadSuccess={handleUploadSuccess}
				setMessage={setMessage}
			/>

			{/* Messages Section */}
			{message && <Alert variant='success'>{message}</Alert>}
			{error && <Alert variant='danger'>{error}</Alert>}

			{/* Audio Records Table */}
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
