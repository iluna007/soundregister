import React, { useState } from "react";
import Masonry from "react-masonry-css"; // Importar react-masonry-css
import AudioCard from "../components/AudioCard";
import audioData from "../store/datatest";
import "./AudioRecords.css";

const AudioRecords = () => {
	const [filter, setFilter] = useState("All");

	// Obtener una lista única de tags
	const allTags = Array.from(new Set(audioData.flatMap((audio) => audio.tags)));

	// Filtrar los datos de audio
	const filteredAudio =
		filter === "All"
			? audioData
			: audioData.filter((audio) => audio.tags.includes(filter));

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
						imageUrl={audio.imageUrl}
						audioUrl={audio.audioUrl}
					/>
				))}
			</Masonry>
		</div>
	);
};

export default AudioRecords;
