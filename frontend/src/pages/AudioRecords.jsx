import React, { useState } from "react";
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
			<div className='audio-grid'>
				{filteredAudio.map((audio) => (
					<AudioCard
						key={audio.id}
						id={audio.id}
						title={audio.title}
						imageUrl={audio.imageUrl}
						audioUrl={audio.audioUrl}
					/>
				))}
			</div>
		</div>
	);
};

export default AudioRecords;
