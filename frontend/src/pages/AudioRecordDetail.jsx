import React from "react";
import { useParams, Link } from "react-router-dom";
import audioData from "../data/audioData";
import "./AudioRecordDetail.css";

const AudioRecordDetail = () => {
	const { id } = useParams();
	const record = audioData.find((item) => item.id === parseInt(id));

	if (!record) return <div>Record not found!</div>;

	return (
		<div className='container example'>
			<div className='row mt-4'>
				<div className='col-12 mb-4'>
					<img
						src={record.imageUrl}
						alt={record.notes}
						className='img-fluid rounded'
					/>
				</div>
				<div className='col-12'>
					<audio controls className='audio-player'>
						<source src={record.audioUrl} type='audio/mpeg' />
						Your browser does not support the audio element.
					</audio>
				</div>
				<div className='col-12 mt-4'>
					<h2>{record.notes}</h2>
					<p>
						<strong>Date:</strong> {record.date}
					</p>
					<p>
						<strong>Time:</strong> {record.time}
					</p>
					<p>
						<strong>Season:</strong> {record.season}
					</p>
					<p>
						<strong>Location:</strong> {record.location}
					</p>
					<p>
						<strong>Conditions:</strong> {record.conditions}
					</p>
					<p>
						<strong>Temperature:</strong> {record.temperature}
					</p>
					<p>
						<strong>Wind:</strong> {record.wind}
					</p>
					<p>
						<strong>Recordist:</strong> {record.recordist}
					</p>
					<p>
						<strong>Tags:</strong> {record.tags}
					</p>
				</div>
			</div>
			<Link to='/records' className='btn btn-outline-secondary mt-3'>
				Back to Records
			</Link>
		</div>
	);
};

export default AudioRecordDetail;
