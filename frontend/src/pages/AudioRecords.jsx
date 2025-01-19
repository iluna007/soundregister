import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css"; // Importar react-masonry-css
import AudioCard from "../components/AudioCard";
import appStore from "../store/appStore"; // Importar el store
import { fetchAllAudioRecords } from "../actions/appActions"; // Importar la acción
import "./AudioRecords.css";
import AudioFileList from "../components/AudioFileList";

const AudioRecords = () => {
	const [filter, setFilter] = useState("All");
	const [audioRecords, setAudioRecords] = useState([]);

	// Cargar los datos al montar el componente
	useEffect(() => {
		const loadAudioRecords = async () => {
			try {
				const records = await fetchAllAudioRecords();
				setAudioRecords(records);
			} catch (error) {
				console.error("Failed to fetch audio records:", error);
			}
		};
		loadAudioRecords();
	}, []);

	// Obtener una lista única de tags
	const allTags = Array.from(
		new Set(
			audioRecords.flatMap((audio) => audio.tags.map((tag) => tag.trim()))
		)
	);

	// Filtrar los datos de audio
	const filteredAudio =
		filter === "All"
			? audioRecords
			: audioRecords.filter((audio) =>
					audio.tags.some(
						(tag) => tag.trim().toLowerCase() === filter.toLowerCase()
					)
			  );

	// Configuración de columnas para Masonry
	const breakpointColumnsObj = {
		default: 4, // 4 columnas para pantallas grandes
		1100: 3, // 3 columnas para pantallas medianas
		768: 2, // 2 columnas para pantallas pequeñas
		500: 1, // 1 columna para pantallas muy pequeñas
	};

	return (
		<div className='container mt-5'>
			<div className='filter-buttons mb-4 d-flex flex-wrap justify-content-center'>
				<button
					className={`btn m-2 ${
						filter === "All" ? "btn-primary" : "btn-outline-primary"
					}`}
					onClick={() => setFilter("All")}
				>
					All
				</button>
				{allTags.map((tag, index) => (
					<button
						key={index}
						className={`btn m-2 ${
							filter === tag ? "btn-primary" : "btn-outline-primary"
						}`}
						onClick={() => setFilter(tag)}
					>
						{tag}
					</button>
				))}
			</div>
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className='masonry-grid'
				columnClassName='masonry-grid-column'
			>
				{filteredAudio.map((audio) => (
					<AudioCard
						key={audio.id}
						id={audio.id}
						title={audio.title}
						audioUrl={audio.audio_path} // Asegúrate de pasar audio.audio_path aquí
						tags={audio.tags}
						userName={audio.user_name}
					/>
				))}
			</Masonry>
		</div>
	);
};

export default AudioRecords;
