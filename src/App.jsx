import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Install from './pages/Install';
import Versions from './pages/Versions';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/install" element={<Install />} />
            <Route path="/versions" element={<Versions />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;