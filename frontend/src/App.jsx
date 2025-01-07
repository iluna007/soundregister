

import React from "react";

import "/node_modules/bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import RT from "./pages/ReactTest";
import AuthPage from "./pages/AuthPage";
import AudioUploadPage from "./pages/AudioUp";

import AudioRecords from "./pages/ArchivesRecords";
import AudioRecordDetail from "./pages/AudioRecordDetail";

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/about' element={<About />} />
				<Route path='/reacttest' element={<RT />} />
				<Route path='/auth' element={<AuthPage />} />
				<Route path='/audio-upload' element={<AudioUploadPage />} />
				<Route path='/records' element={<AudioRecords />} />
				<Route path='/records/:id' element={<AudioRecordDetail />} />
			</Routes>
		</Router>
	);
}

export default App;
