import React, { useState } from "react";
import audioData from "../store/datatest";
import MasonryLayout from "../components/MasonryLayout";
import "./AudioRecords.css";

const AudioRecords = () => {
	const [filter, setFilter] = useState("All");

	const allTags = Array.from(new Set(audioData.flatMap((audio) => audio.tags)));

	const filteredAudio =
		filter === "All"
			? audioData
			: audioData.filter((audio) => audio.tags.includes(filter));

	return (
		<div className='container mt-5'>
			<div className='filter-buttons mt-5 mb-4 d-flex flex-wrap justify-content-center'>
				<button
					className='btn btn-outline-secondary m-2'
					onClick={() => setFilter("All")}
				>
					All
				</button>
				{allTags.map((tag, index) => (
					<button
						key={index}
						className={`btn btn-outline-secondary m-2 ${
							filter === tag ? "active" : ""
						}`}
						onClick={() => setFilter(tag)}
					>
						{tag}
					</button>
				))}
			</div>

			<MasonryLayout>
				{filteredAudio.map((audio) => (
					<div className='audio-card' key={audio.id}>
						<img
							src={audio.imageUrl}
							className='card-img-top'
							alt={audio.notes}
						/>
						<div className='card-body'>
							<h5 className='card-title'>
								{audio.date} - {audio.location}
							</h5>
							<p className='card-text'>{audio.notes}</p>
						</div>
					</div>
				))}
			</MasonryLayout>
		</div>
	);
};

export default AudioRecords;
