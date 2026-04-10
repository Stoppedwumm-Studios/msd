import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Install from './pages/Install';
import Versions from './pages/Versions';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = React.useState(true);
  const [exiting, setExiting] = React.useState(false);

  React.useEffect(() => {
    // 1. Wait for 2 seconds (visual loading time)
    const timer = setTimeout(() => {
      setExiting(true); // Trigger the exit animation
      
      // 2. Wait for the exit animation (0.5s) to finish before removing from DOM
      setTimeout(() => {
        setLoading(false);
      }, 500); 
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {loading && <LoadingScreen isExiting={exiting} />}
      
      <div className={`app-container ${loading ? 'hidden' : 'fade-in'}`}>
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