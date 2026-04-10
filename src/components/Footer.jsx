function Footer() {
    return (
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} MSD App - Ein Projekt von Bernhard Tepe.</p>
          <p>
            Open Source für Gemeinden. Der Quellcode ist im Download-Paket enthalten.
          </p>
        </div>
      </footer>
      )
}

export default Footer