import React from 'react';

function Install() {
  return (
    <div className="install-page">
      <div className="install-content">
        <span className="install-icon">📦</span>
        <h2>Download gestartet!</h2>
        <p>
          Vielen Dank für Ihr Interesse an der MSD App. Der Download der <strong>latest.zip</strong> sollte bereits laufen oder abgeschlossen sein.
        </p>
        
        <div className="install-steps">
          <div className="step">
            <span className="step-number">1</span>
            <p>Entpacken Sie die heruntergeladene <strong>latest.zip</strong> Datei.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <p>Suchen Sie im Ordner nach der Datei: <br/> 
            <strong>"MSD App - Einrichtungsguide.pdf"</strong></p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <p>Folgen Sie der PDF-Anleitung für das Setup via Docker oder PHP/SQL.</p>
          </div>
        </div>

        <div className="install-footer-note">
          <p>Probleme beim Download? <a href="/latest.zip">Hier erneut versuchen</a></p>
        </div>
      </div>
    </div>
  );
}

export default Install;