import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AudioUpFileTest from "../components/AudioUpFileTest";
import FileManager from "../components/FileManager";

const Dashboard = () => {
	const [refreshTrigger, setRefreshTrigger] = useState(0); // Estado para controlar el refresco

	// Función para actualizar el trigger de refresco
	const handleFileUploaded = () => {
		setRefreshTrigger((prev) => prev + 1); // Incrementa el valor para forzar el refresco
	};

	const debugStyle = {
		outline: "1px dotted red",
	};

	return (
		<Container style={debugStyle}>
			<Row style={debugStyle}>
				<Col sm={8} style={debugStyle}>
					{/* Pasamos el estado triggerRefresh a FileManager */}
					<FileManager triggerRefresh={refreshTrigger} />
				</Col>
				<Col sm={4} style={debugStyle}>
					{/* Pasamos la función handleFileUploaded a AudioUpFileTest */}
					<AudioUpFileTest onFileUploaded={handleFileUploaded} />
				</Col>
			</Row>
		</Container>
	);
};

export default Dashboard;
