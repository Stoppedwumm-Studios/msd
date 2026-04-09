import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const handleDownload = () => {
      window.location.href = "/downloads/latest.zip";
      navigate('/install');
    };
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="nav-brand-link">
          <span className="logo-icon">⛪</span>
          <h1>MSD App</h1>
        </Link>
      </div>
      <div className="nav-links">
        <a href="/#features">Funktionen</a>
        <a href="/#tech">Technologie</a>
        <Link to="/install">Installation</Link>
        <Link to="/versions">Versionen</Link> {/* New Link */}
      </div>
      <button onClick={handleDownload} className="btn-primary nav-btn">
        Jetzt Herunterladen
      </button>
    </nav>
  );
}

export default Navbar;