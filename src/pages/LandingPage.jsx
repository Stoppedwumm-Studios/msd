import React from 'react';
import { useNavigate } from 'react-router-dom';
function LandingPage() {
    const navigate = useNavigate();
const handleDownload = () => {
  window.location.href = "/latest.zip";
  navigate('/install');
};
  return (
    <>
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <span className="badge">Für Kirchengemeinden</span>
          <h2 className="hero-title">Die smarte Verwaltung für Ihre Messdiener</h2>
          <p className="hero-byline">Von einem Messdiener, für Messdiener.</p>
          <p className="hero-subtitle">
            Automatisierte Dienstpläne, einfaches Vertretungssystem und volle Übersicht über Ausfälle. 
            Sparen Sie sich das Zettelchaos und digitalisieren Sie Ihre Sakristei.
          </p>
          <div className="hero-actions">
            <button className="btn-primary large" onClick={handleDownload}>App Herunterladen</button>
            <a href="#features" className="btn-secondary large">Mehr erfahren</a>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img src="/1.png" alt="MSD App Dashboard" className="hero-image" />
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Alles, was Ihre Gemeinde braucht</h2>
          <p>Entwickelt, um die Organisation von Messdienern so einfach wie möglich zu machen.</p>
        </div>

        <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Automatische Pläne</h3>
              <p>Generieren Sie Dienstpläne per Knopfdruck. Das System berücksichtigt automatisch alle Abwesenheiten und Regeln Ihrer Gemeinde.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Flexible Termine</h3>
              <p>Tragen Sie Einzeltermine (wie Urlaub) oder Dauer-Termine (z.B. "Jeden Freitag Fußballtraining") ein, damit niemand fälschlicherweise eingeteilt wird.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Vertretungssystem</h3>
              <p>Jemand ist spontan krank? Eine Anfrage in der App genügt. Andere können die Vertretung annehmen und der Plan aktualisiert sich sofort von selbst.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Benachrichtigungen</h3>
              <p>Automatische Erinnerungen, wenn eine Messe ansteht oder Benachrichtigungen, falls jemand unentschuldigt fehlt. So bleibt der Altar nie leer.</p>
            </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase-section">
        <div className="showcase-content">
          <h2>Einzel- und Dauertermine im Blick</h2>
          <p>
            Geben Sie Ihren Messdienern die Freiheit, ihre Verfügbarkeiten selbst zu verwalten. 
            Egal ob der Sommerurlaub ansteht oder das wöchentliche Hobby – die App blockt die Zeiten automatisch für die Planung.
          </p>
          <ul className="showcase-list">
            <li>✔️ Einfache Übersicht der eigenen Termine</li>
            <li>✔️ Klare Trennung zwischen einmalig und dauerhaft</li>
            <li>✔️ Sofortige Synchronisation mit dem Dienstplan</li>
          </ul>
        </div>
        <div className="showcase-image-wrapper">
          <img src="/0.png" alt="Terminverwaltung in der MSD App" className="showcase-image" />
        </div>
      </section>

      {/* Creator's Note Section */}
      <section className="creator-section">
        <div className="creator-content">
            <h3>Aus der Praxis, für die Praxis</h3>
            <p>
              <strong>"Von einem Messdiener für Messdiener"</strong> ist nicht nur ein Spruch, sondern das Herzstück dieser App.
              Nach Jahren mit unübersichtlichen Excel-Listen und endlosen WhatsApp-Chats für die Tauschbörse war klar: 
              Es muss eine bessere Lösung her. Eine, die versteht, was Leiterrunden wirklich brauchen und den Ehrenamtlichen Zeit zurückgibt.
            </p>
            <p className="creator-signature">
              &mdash; Bernhard Tepe, Entwickler & Messdienerleiter
            </p>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="tech-section">
        <h2>Einfaches Hosting für Ihre IT-Ehrenamtlichen</h2>
        <p>Modernste Technologie, verpackt für eine unkomplizierte Einrichtung auf dem Server Ihrer Gemeinde.</p>
        <div className="tech-badges">
          <span className="tech-badge">🐳 Docker Compose Ready</span>
          <span className="tech-badge">🐘 PHP Frontend</span>
          <span className="tech-badge">🗄️ SQL Datenbank</span>
          <span className="tech-badge">🐍 Python Cronjobs</span>
        </div>
        <div className="download-cta">
          <button className="btn-primary large" onClick={handleDownload}>Jetzt Source Code Herunterladen</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} MSD App - Ein Projekt von Bernhard Tepe.</p>
          <p>
            Open Source für Gemeinden. Der Quellcode ist im Download-Paket enthalten.
          </p>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;