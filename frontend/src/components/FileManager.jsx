import React, { useState, useEffect } from "react";
import AudioCardAdmin from "../components/AudioCardAdmin";


const FileManager = ({ triggerRefresh }) => {
	const [audioData, setAudioData] = useState([]);
	const [error, setError] = useState(null);

	// Función para obtener la lista de archivos
	const fetchAudioData = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/list-files");
			if (!response.ok) {
				throw new Error("Error fetching files");
			}
			const data = await response.json();
			const transformedData = data.files.map((file, index) => ({
				id: index,
				title: file,
				audioUrl: `http://localhost:5000/api/download/${file}`,
			}));
			setAudioData(transformedData);
		} catch (err) {
			setError(err.message);
		}
	};

	// Refrescar lista al cargar o al cambiar triggerRefresh
	useEffect(() => {
		fetchAudioData();
	}, [triggerRefresh]);

	const handleDelete = async (audioId, audioTitle) => {
		try {
			const response = await fetch(`http://localhost:5000/api/delete/${audioTitle}`, {
				method: "POST",
			});
			if (!response.ok) {
				throw new Error("Error deleting file");
			}
			setAudioData((prevData) => prevData.filter((audio) => audio.id !== audioId));
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<div className="container mt-5">
			<h2>File Manager</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<div className="audio-grid">
				{audioData.map((audio) => (
					<AudioCardAdmin
						key={audio.id}
						id={audio.id}
						title={audio.title}
						audioUrl={audio.audioUrl}
						onDelete={() => handleDelete(audio.id, audio.title)}
					/>
				))}
			</div>
		</div>
	);
};

export default FileManager;
