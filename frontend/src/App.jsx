import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Corrige la ruta del CSS de Bootstrap
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import RT from "./pages/ReactTest";
import AuthPage from "./pages/AuthPage";
import AudioRecords from "./pages/AudioRecords";
import AudioRecordDetail from "./pages/AudioRecordDetail";
import Dashboard from "./pages/dash";

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/about' element={<About />} />
				<Route path='/reacttest' element={<RT />} />
				<Route path='/auth' element={<AuthPage />} />
				<Route path='/dash' element={<Dashboard />} />
				<Route path='/records' element={<AudioRecords />} />
				<Route path='/records/:id' element={<AudioRecordDetail />} />
			</Routes>
		</Router>
	);
}

export default App;
