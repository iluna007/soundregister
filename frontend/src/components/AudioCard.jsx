import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";

const AudioCard = ({
	date,
	time,
	season,
	duration,
	location,
	conditions,
	temperature,
	wind,
	recordist,
	notes,
	tags,
	imageUrl,
	audioUrl,
}) => {
	return (
		<Card className='mb-4'>
			{/* Image */}
			{imageUrl && <Card.Img variant='top' src={imageUrl} alt='Audio Image' />}

			{/* Card Body */}
			<Card.Body>
				<Card.Title>Audio Details</Card.Title>
				<Card.Text>
					<strong>Recordist:</strong> {recordist}
				</Card.Text>
				<Card.Text>
					<strong>Notes:</strong> {notes}
				</Card.Text>
			</Card.Body>

			{/* List Group for Additional Info */}
			<ListGroup className='list-group-flush'>
				<ListGroupItem>
					<strong>Date:</strong> {date}
				</ListGroupItem>
				<ListGroupItem>
					<strong>Time:</strong> {time}
				</ListGroupItem>
				<ListGroupItem>
					<strong>Season:</strong> {season}
				</ListGroupItem>
				<ListGroupItem>
					<strong>Duration:</strong> {duration}
				</ListGroupItem>
				<ListGroupItem>
					<strong>Location:</strong> {location}
				</ListGroupItem>
				<ListGroupItem>
					<strong>Conditions:</strong> {conditions}
				</ListGroupItem>
				<ListGroupItem>
					<strong>Temperature:</strong> {temperature}
				</ListGroupItem>
				<ListGroupItem>
					<strong>Wind:</strong> {wind}
				</ListGroupItem>
				{tags && (
					<ListGroupItem>
						<strong>Tags:</strong> {tags}
					</ListGroupItem>
				)}
			</ListGroup>

			{/* Audio Player */}
			{audioUrl && (
				<Card.Body>
					<Card.Text>
						<strong>Audio Preview:</strong>
					</Card.Text>
					<audio controls>
						<source src={audioUrl} type='audio/mpeg' />
						Your browser does not support the audio element.
					</audio>
				</Card.Body>
			)}
		</Card>
	);
};

export default AudioCard;
