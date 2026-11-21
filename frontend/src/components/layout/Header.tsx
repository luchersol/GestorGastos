
function Header() {
    const fecha = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date());

    return (
        <header className="app-header">
            <div>
                <span className="header-date">{fecha}</span>
            </div>

            <div className="header-status">
                <span className="status-indicator" />
                <span>Almacenamiento local</span>
            </div>
        </header>
    );
}

export default Header;
