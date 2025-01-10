import React, { useEffect, useState } from "react";

const AudioRecordsList = ({ triggerRefresh, onDeleteSuccess }) => {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);

    const fetchRecords = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/list-audio-records");
            if (!response.ok) {
                throw new Error("Failed to fetch audio records");
            }
            const data = await response.json();
            setRecords(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [triggerRefresh]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/delete-audio-record/${id}`, {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error("Failed to delete audio record");
            }
            onDeleteSuccess();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="record-list">
                {records.map((record) => (
                    <div key={record.id}>
                        <h5>{record.original_audio_name}</h5>
                        <p>{record.date} - {record.location}</p>
                        <p><strong>Conditions:</strong> {record.conditions || "N/A"}</p>
                        <p><strong>Temperature:</strong> {record.temperature || "N/A"} °C</p>
                        <p><strong>Wind Speed:</strong> {record.wind_speed || "N/A"} km/h</p>
                        <p><strong>Wind Direction:</strong> {record.wind_direction || "N/A"}</p>
                        <p><strong>Recordist:</strong> {record.recordist || "N/A"}</p>
                        <audio controls>
                            <source src={`http://localhost:5000/api/download/${record.audio_path}`} type="audio/mpeg" />
                        </audio>
                        <button onClick={() => handleDelete(record.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AudioRecordsList;
