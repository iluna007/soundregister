import React from "react";
import { useParams, Link } from "react-router-dom";
import audioData from "../store/datatest";

const AudioRecordDetail = () => {
	const { id } = useParams();
	const audio = audioData.find((item) => item.id === parseInt(id));

	if (!audio) {
		return <div>Audio record not found!</div>;
	}

	return (
		<div className='container mt-5'>
			<h1 className='mb-4'>{audio.notes}</h1>
			<div className='row'>
				<div className='col-md-6'>
					<img
						src={audio.imageUrl}
						alt={audio.notes}
						className='img-fluid rounded'
					/>
				</div>
				<div className='col-md-6'>
					<ul className='list-group'>
						<li className='list-group-item'>
							<strong>Date:</strong> {audio.date}
						</li>
						<li className='list-group-item'>
							<strong>Time:</strong> {audio.time}
						</li>
						<li className='list-group-item'>
							<strong>Location:</strong> {audio.location}
						</li>
						<li className='list-group-item'>
							<strong>Conditions:</strong> {audio.conditions}
						</li>
						<li className='list-group-item'>
							<strong>Temperature:</strong> {audio.temperature}
						</li>
						<li className='list-group-item'>
							<strong>Wind:</strong> {audio.wind}
						</li>
						<li className='list-group-item'>
							<strong>Recordist:</strong> {audio.recordist}
						</li>
						<li className='list-group-item'>
							<strong>Tags:</strong>{" "}
							{Array.isArray(audio.tags)
								? audio.tags.join(", ")
								: "No tags available"}
						</li>
					</ul>
					<audio controls className='mt-3 w-100'>
						<source src={audio.audioUrl} type='audio/mpeg' />
						Your browser does not support the audio element.
					</audio>
				</div>
			</div>
			<Link to='/records' className='btn btn-secondary mt-4'>
				Back to Records
			</Link>
		</div>
	);
};

export default AudioRecordDetail;
