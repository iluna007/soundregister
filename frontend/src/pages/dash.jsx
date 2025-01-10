import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FileManager from "../components/FileManager";
import AudioUpFileTest from "../components/AudioUpFileTest";
import AudioMetadataForm from "../components/AudioMetadataForm";
import AudioRecordsList from "../components/AudioRecordsList";

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
            {/* Bloque 1 */}
            <Row className="my-4" style={dashedLineStyle}>
                <Col sm={8} style={debugStyle}>
                    <h3>Bloque 1: Gestor de Ficheros</h3>
                    <FileManager triggerRefresh={refreshTrigger1} />
                </Col>
                <Col sm={4}>
                    <h3>Formulario de Subida</h3>
                    <AudioUpFileTest onFileUploaded={handleFileUploaded} />
                </Col>
            </Row>

            {/* Bloque 2 */}
            <Row className="my-4">
                <Col sm={8} style={debugStyle}>
                    <h3>Bloque 2: Registros de Audio</h3>
                    <AudioRecordsList triggerRefresh={refreshTrigger2} onDeleteSuccess={handleDataUpdated} />
                </Col>
                <Col sm={4}>
                    <h3>Formulario de Atributos</h3>
                    <AudioMetadataForm onDataUpdated={handleDataUpdated} />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
