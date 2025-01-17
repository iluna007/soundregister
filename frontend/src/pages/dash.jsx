import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import appStore from "../store/appStore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const { user } = appStore.getState();
	const navigate = useNavigate();

	const [show, setShow] = useState(false);

	// Manejar el cierre de sesión
	const handleLogout = () => {
		appStore.handleAction({ type: "RESET_DATA" }); // Limpia el estado global
		navigate("/auth"); // Redirige al inicio de sesión
	};

	return (
		<div>
			<h1>Welcome to your Dashboard</h1>
			{user && <p>Hello, {user.username}!</p>}

			{/* Botón para abrir el modal */}
			<Button variant='danger' onClick={() => setShow(true)}>
				Logout
			</Button>

			{/* Modal de confirmación */}
			<Modal show={show} onHide={() => setShow(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Logout</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to log out?</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={() => setShow(false)}>
						Cancel
					</Button>
					<Button variant='danger' onClick={handleLogout}>
						Logout
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Dashboard;

{
	/*import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FileManager from "../components/FileManager";
import AudioUpFileTest from "../components/AudioUpFileTest";
import AudioMetadataForm from "../components/AudioMetadataForm";
import AudioRecordsList from "../components/AudioRecordsList";
import DashboardUser from "../components/DashboardUser";

const Dashboard = () => {
    const [refreshTrigger1, setRefreshTrigger1] = useState(0); // Refresca Bloque 1
    const [refreshTrigger2, setRefreshTrigger2] = useState(0); // Refresca Bloque 2

    // Función para refrescar Bloque 1
    const handleFileUploaded = () => {
        setRefreshTrigger1((prev) => prev + 1);
    };

    // Función para refrescar Bloque 2
    const handleDataUpdated = () => {
        setRefreshTrigger2((prev) => prev + 1);
    };

    const dashedLineStyle = {
        borderBottom: "2px dashed #ccc",
        marginBottom: "20px",
    };

    const debugStyle = {
        borderRight: "2px dashed #ccc",
        paddingRight: "15px",
    };

    return (
			<Container fluid>
				  
				<DashboardUser />
				
				 Bloque 1 <Row className='my-4' style={dashedLineStyle}>
					<Col sm={8} style={debugStyle}>
						<h3>Block 1: Files</h3>
						<FileManager triggerRefresh={refreshTrigger1} />
					</Col>
					<Col sm={4}>
						<h3>Upload file</h3>
						<AudioUpFileTest onFileUploaded={handleFileUploaded} />
					</Col>
				</Row>

				  <Row className='my-4'>
					<Col sm={8} style={debugStyle}>
						<h3>Bloque 2: Audio register</h3>
						<AudioRecordsList
							triggerRefresh={refreshTrigger2}
							onDeleteSuccess={handleDataUpdated}
						/>
					</Col>
					<Col sm={4}>
						<h3>Attributes</h3>
						<AudioMetadataForm onDataUpdated={handleDataUpdated} />
					</Col>
				</Row>
                 
			</Container>
		);
};

export default Dashboard;
*/
}
