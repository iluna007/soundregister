import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const AudioMetadataForm = ({ onDataUpdated }) => {
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        location: "",
        conditions: "",
        temperature: "",
        wind_speed: "",
        wind_direction: "",
        recordist: "",
        notes: "",
        tags: "",
    });
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAudioChange = (e) => {
        setAudioFile(e.target.files[0]);
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!audioFile) {
            setError("Please select an audio file.");
            return;
        }

        const uploadData = new FormData();
        uploadData.append("audio", audioFile);
        if (imageFile) uploadData.append("image", imageFile);

        try {
            // Subir archivo a S3
            const uploadResponse = await fetch("http://localhost:5000/api/upload-files", {
                method: "POST",
                body: uploadData,
            });
            const uploadResult = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(uploadResult.error || "Error uploading file");
            }

            // Guardar registro en la base de datos
            const recordData = {
                ...formData,
                original_audio_name: uploadResult.original_filename,
                audio_path: uploadResult.unique_filename,
            };

            const saveResponse = await fetch("http://localhost:5000/api/save-audio-record", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(recordData),
            });

            const saveResult = await saveResponse.json();

            if (!saveResponse.ok) {
                throw new Error(saveResult.error || "Error saving record");
            }

            setMessage("Record saved successfully!");
            setError(null);

            // Notificar al componente padre
            if (onDataUpdated) {
                onDataUpdated();
            }
        } catch (err) {
            setError(err.message || "An error occurred.");
            setMessage(null);
        }
    };

    return (
        <div>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Time</Form.Label>
                    <Form.Control type="time" name="time" value={formData.time} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                <Form.Label>Conditions</Form.Label>
                <Form.Control type="text" name="conditions" value={formData.conditions} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Temperature</Form.Label>
                    <Form.Control type="number" name="temperature" value={formData.temperature} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Wind Speed</Form.Label>
                    <Form.Control type="number" name="wind_speed" value={formData.wind_speed} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Wind Direction</Form.Label>
                    <Form.Control type="text" name="wind_direction" value={formData.wind_direction} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Recordist</Form.Label>
                    <Form.Control type="text" name="recordist" value={formData.recordist} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" name="notes" value={formData.notes} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Tags</Form.Label>
                    <Form.Control type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Comma-separated tags" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Audio File</Form.Label>
                    <Form.Control type="file" accept="audio/*" onChange={handleAudioChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Image File (optional)</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Group>
                <Button type="submit">Save Record</Button>
            </Form>
        </div>
    );
};

export default AudioMetadataForm;
