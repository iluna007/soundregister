import React, { useState } from "react";
import AudioCard from "../components/AudioCard"; // Importa el componente AudioCard
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

	return (
		<div className='container mt-5'>
			{/* Botones de filtro */}
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

			{/* Tarjetas de audio */}
			<div className='audio-grid'>
				{filteredAudio.map((audio) => (
					<AudioCard
						key={audio.id}
						id={audio.id} // Pasar id
						title={`Audio ${audio.id}`} // Generar el título
						date={audio.date}
						time={audio.time}
						season={audio.season}
						duration={audio.duration}
						location={audio.location}
						conditions={audio.conditions}
						temperature={audio.temperature}
						wind={audio.wind}
						recordist={audio.recordist}
						notes={audio.notes}
						tags={audio.tags}
						imageUrl={audio.imageUrl}
						audioUrl={audio.audioUrl}
					/>
				))}
			</div>
		</div>
	);
};

export default AudioRecords;
