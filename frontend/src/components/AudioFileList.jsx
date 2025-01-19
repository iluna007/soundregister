import React, { useEffect, useState } from "react";
import axios from "axios";

const AudioFileList = () => {
	const [audioFiles, setAudioFiles] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Cargar la lista de archivos desde la API
		const fetchAudioFiles = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/list-files"
				);
				setAudioFiles(response.data);
			} catch (err) {
				console.error("Error fetching audio files:", err);
				setError("Failed to load audio files.");
			}
		};

		fetchAudioFiles();
	}, []);

	if (error) {
		return <div className='container mt-5 alert alert-danger'>{error}</div>;
	}

	if (audioFiles.length === 0) {
		return <div className='container mt-5'>No audio files found.</div>;
	}

	return (
		<div className='container mt-5'>
			<h1 className='mb-4'>Uploaded Audio Files</h1>
			<ul className='list-group'>
				{audioFiles.map((audio) => (
					<li
						key={audio.id}
						className='list-group-item d-flex align-items-center'
					>
						<div className='me-3'>
							<strong>{audio.title || "Untitled Audio"}</strong>
							<p className='mb-0 text-muted'>
								Uploaded by: {audio.user_name || "Unknown"}
							</p>
						</div>
						<audio controls className='ms-auto'>
							<source src={audio.audio_path} type='audio/mpeg' />
							Your browser does not support the audio element.
						</audio>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AudioFileList;
