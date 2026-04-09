import React, { useEffect, useState } from 'react';

function Versions() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/downloads/version.json')
      .then((res) => res.json())
      .then((data) => {
        setVersions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Versionen:", err);
        setLoading(false);
      });
  }, []);

  const getFriendlyName = (filename) => {
    if (filename === 'latest.zip') return 'Aktuelle Version (Latest)';
    return `Version ${filename.replace('.zip', '')}`;
  };

  return (
    <div className="versions-page">
      <header className="section-header">
        <span className="badge">Release-Archiv</span>
        <h2>Versionsübersicht</h2>
        <p>Laden Sie spezifische Versionen der MSD App herunter oder greifen Sie auf den aktuellen Build zu.</p>
      </header>

      <div className="table-container">
        {loading ? (
          <p className="text-center">Versionen werden geladen...</p>
        ) : (
          <table className="versions-table">
            <thead>
              <tr>
                <th>Build / Version</th>
                <th>Dateiname</th>
                <th className="text-right">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((version, index) => (
                <tr key={index}>
                  <td>
                    <div className="version-info">
                      <span className={`status-dot ${version === 'latest.zip' ? 'active' : ''}`}></span>
                      <strong>{getFriendlyName(version)}</strong>
                    </div>
                  </td>
                  <td className="text-muted">{version}</td>
                  <td className="text-right">
                    <a 
                      href={`/downloads/${version}`} 
                      className={`btn-secondary small ${version === 'latest.zip' ? 'btn-highlight' : ''}`}
                      download
                    >
                      💾 Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <section className="info-box">
        <p>
          <strong>Hinweis:</strong> Wir empfehlen immer die Verwendung der <code>latest.zip</code> für produktive Kirchengemeinden, 
          da diese alle aktuellen Sicherheits-Updates enthält.
        </p>
      </section>
    </div>
  );
}

export default Versions;