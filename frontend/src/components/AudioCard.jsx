import React from "react";
import "./AudioCard.css";
import { Link } from "react-router-dom";

const AudioCard = ({ id, title, audioUrl, tags, userName }) => {
	console.log({ id, title, audioUrl, tags, userName }); // Verifica que todas las props sean correctas

	return (
		<div className='audio-card'>
			<h5 className='card-title'>{title}</h5>
			<p className='card-user'>
				<strong>Uploaded by:</strong> {userName || "Unknown"}
			</p>
			<p className='card-tags'>
				<strong>Tags:</strong>{" "}
				{tags && tags.length > 0 ? tags.join(", ") : "No tags available"}
			</p>
			<audio controls className='card-audio'>
				<source src={audioUrl} type='audio/mpeg' />
				Your browser does not support the audio element.
			</audio>
			<Link to={`/records/${id}`} className='btn btn-primary mt-3'>
				View Details
			</Link>
		</div>
	);
};

export default AudioCard;
