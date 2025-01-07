import React, { useState } from "react";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";
import audioData from "../data/audioData"; // Import mock audio data
import "./AudioRecords.css";

const AudioRecords = () => {
	const [filter, setFilter] = useState("All");

	const filteredRecords =
		filter === "All"
			? audioData
			: audioData.filter((record) => record.tags.includes(filter));

	const breakpointColumnsObj = {
		default: 4,
		1100: 3,
		700: 2,
		500: 1,
	};

	return (
		<div className='container example'>
			<div className='filter-buttons mt-5 mb-4 d-flex flex-wrap justify-content-center'>
				<button
					className='btn btn-outline-secondary m-2'
					onClick={() => setFilter("All")}
				>
					All
				</button>
				<button
					className='btn btn-outline-secondary m-2'
					onClick={() => setFilter("Winter")}
				>
					Winter
				</button>
				<button
					className='btn btn-outline-secondary m-2'
					onClick={() => setFilter("Nature")}
				>
					Nature
				</button>
				<button
					className='btn btn-outline-secondary m-2'
					onClick={() => setFilter("Ocean")}
				>
					Ocean
				</button>
			</div>

			<Masonry
				breakpointCols={breakpointColumnsObj}
				className='masonry-grid'
				columnClassName='masonry-grid-column'
			>
				{filteredRecords.map((record, index) => (
					<div className='masonry-grid-item' key={index}>
						<Link to={`/records/${record.id}`}>
							<div className='audio-card'>
								<img
									src={record.imageUrl}
									alt={record.notes}
									className='card-img'
								/>
								<div className='overlay'>
									<div className='text'>{record.notes}</div>
								</div>
							</div>
						</Link>
					</div>
				))}
			</Masonry>
		</div>
	);
};

export default AudioRecords;
