import React from "react";
import { Card, Button } from "react-bootstrap";

const AudioCardAdmin = ({
    id,
    title,
    imageUrl,
    audioUrl,
    onDownload,
    onDelete,
}) => {
    return (
        <Card className="mb-4 audio-card">
            {/* Imagen */}
            {imageUrl && (
                <Card.Img
                    variant="top"
                    src={imageUrl}
                    alt={title}
                    className="card-img-top"
                />
            )}

            {/* Contenido principal */}
            <Card.Body className="text-center">
                <Card.Title className="card-title">{title}</Card.Title>

                {/* Control de audio */}
                {audioUrl && (
                    <div className="audio-player">
                        <audio id={`audio-${id}`} controls>
                            <source src={audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="d-flex justify-content-between mt-3">
                    <Button variant="success" onClick={onDownload}>
                        Download
                    </Button>
                    <Button variant="danger" onClick={onDelete}>
                        Delete
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default AudioCardAdmin;

