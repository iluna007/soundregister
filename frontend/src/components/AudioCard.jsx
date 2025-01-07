import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const AudioCard = ({ id, title, imageUrl, audioUrl }) => {
	return (
		<Card className='mb-4 audio-card'>
			{/* Imagen */}
			{imageUrl && (
				<Card.Img
					variant='top'
					src={imageUrl}
					alt={title}
					className='card-img-top'
				/>
			)}

			{/* Contenido principal */}
			<Card.Body className='text-center'>
				<Card.Title className='card-title'>{title}</Card.Title>

				{/* Control de audio */}
				{audioUrl && (
					<div className='audio-player'>
						<audio controls>
							<source src={audioUrl} type='audio/mpeg' />
							Your browser does not support the audio element.
						</audio>
					</div>
				)}

				{/* Botón Details */}
				<Link to={`/records/${id}`} className='btn btn-primary mt-3'>
					Details
				</Link>
			</Card.Body>
		</Card>
	);
};

export default AudioCard;
