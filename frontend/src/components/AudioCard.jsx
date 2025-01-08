import React from "react";
import "./AudioCard.css";
import { Link } from "react-router-dom";

const AudioCard = ({ id, title, imageUrl, audioUrl }) => {
	return (
		<div className='audio-card'>
			<img src={imageUrl} alt={title} className='card-img' />
			<h5 className='card-title'>{title}</h5>
			<audio controls className='card-audio'>
				<source src={audioUrl} type='audio/mpeg' />
				Your browser does not support the audio element.
			</audio>
			<Link to={`/records/${id}`} className='btn btn-primary'>
				View Details
			</Link>
		</div>
	);
};

export default AudioCard;
