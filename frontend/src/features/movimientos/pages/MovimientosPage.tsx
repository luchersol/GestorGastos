
import { useMovimientos } from "../hooks/useMovimientos";
import MovimientoFilters from "../components/MovimientoFilters";
import MovimientoList from "../components/MovimientoList";

function MovimientosPage() {
    const {
        movimientos,
        filtros,
        cargando,
        error,
        actualizarFiltro
    } = useMovimientos();

    return (
        <section className="page">
            <div className="page-heading">
                <div>
                    <h1>Movimientos</h1>
                    <p>Consulta y administra tus ingresos y gastos.</p>
                </div>

                <div className="movement-actions">
                    <button className="button button-income">
                        + Ingreso
                    </button>

                    <button className="button button-expense">
                        + Gasto
                    </button>
                </div>
            </div>

            <div className="content-card">
                <div className="movement-toolbar">
                    <div>
                        <h2>Todos los movimientos</h2>
                        <p>{movimientos.length} movimientos encontrados</p>
                    </div>
                </div>

                <MovimientoFilters
                    filtros={filtros}
                    actualizarFiltro={actualizarFiltro}
                />

                <MovimientoList
                    movimientos={movimientos}
                    cargando={cargando}
                    error={error}
                />
            </div>
        </section>
    );
}

export default MovimientosPage;
