import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";

const AudioCardAdmin = ({
	id,
	title,
	imageUrl,
	audioUrl,
	onDownload,
	onDelete,
}) => {
	const [showModal, setShowModal] = useState(false);

	const handleShowModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleConfirmDelete = () => {
		setShowModal(false); // Cierra el modal
		onDelete(); // Ejecuta la acción de borrar
	};

	return (
		<>
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
							<audio id={`audio-${id}`} controls>
								<source src={audioUrl} type='audio/mpeg' />
								Your browser does not support the audio element.
							</audio>
						</div>
					)}

					{/* Botones de acción */}
					<div className='d-flex justify-content-between mt-3'>
						<Button variant='success' onClick={onDownload}>
							Download
						</Button>
						<Button variant='danger' onClick={handleShowModal}>
							Delete
						</Button>
					</div>
				</Card.Body>
			</Card>

			{/* Modal de confirmación */}
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Delete</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Are you sure you want to delete this file? This action cannot be
					undone.
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleCloseModal}>
						Cancel
					</Button>
					<Button variant='danger' onClick={handleConfirmDelete}>
						Confirm Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default AudioCardAdmin;
