import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AudioUploadPage from "../components/AudioUp";
import AudioUpFileTest from "../components/AudioUpFileTest";

const Dashboard = () => {
	const debugStyle = {
		outline: "1px dotted red",
	};

	return (
		<Container style={debugStyle}>
			<Row style={debugStyle}>
				<Col sm={8} style={debugStyle}>
					Aqui va el GRID
				</Col>
				<Col sm={4} style={debugStyle}>
                    <AudioUpFileTest />
				</Col>
			</Row>
		</Container>
	);
};

export default Dashboard;
