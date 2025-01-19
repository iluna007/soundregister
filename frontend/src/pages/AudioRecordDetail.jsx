import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import appStore from "../store/appStore"; // Importar el store
import { fetchAllAudioRecords } from "../actions/appActions"; // Importar la acción

const AudioRecordDetail = () => {
	const { id } = useParams(); // Obtener el ID desde la URL
	const [audioDetails, setAudioDetails] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				// Obteniendo todos los registros desde el store o la acción
				const records = await fetchAllAudioRecords();

				// Encontrar el registro específico por ID
				const record = records.find((audio) => audio.id === parseInt(id));

				if (!record) {
					setError("Audio record not found.");
				} else {
					setAudioDetails(record);
				}
			} catch (err) {
				console.error("Error fetching audio details:", err);
				setError("Failed to load audio details.");
			}
		};

		fetchDetails();
	}, [id]);

	if (error) {
		return <div className='alert alert-danger'>{error}</div>;
	}

	if (!audioDetails) {
		return <div>Loading...</div>;
	}

	return (
		<div className='container mt-5'>
			<h1>{audioDetails.title || "Untitled Audio"}</h1>
			<ul className='list-group'>
				<li className='list-group-item'>
					<strong>Uploaded by:</strong> {audioDetails.user_name || "Unknown"}
				</li>
				<li className='list-group-item'>
					<strong>Date:</strong> {audioDetails.date || "N/A"}
				</li>
				<li className='list-group-item'>
					<strong>Tags:</strong>{" "}
					{audioDetails.tags && audioDetails.tags.length > 0
						? audioDetails.tags.join(", ")
						: "No tags"}
				</li>
			</ul>
			<audio controls className='mt-3'>
				<source src={audioDetails.audio_path} type='audio/mpeg' />
				Your browser does not support the audio element.
			</audio>
			<Link to='/records' className='btn btn-secondary mt-4'>
				Back to Records
			</Link>
		</div>
	);
};

export default AudioRecordDetail;
