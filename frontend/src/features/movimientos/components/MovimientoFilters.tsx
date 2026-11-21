
import type { FiltrosMovimiento } from "../hooks/useMovimientos";

interface Props {
    filtros: FiltrosMovimiento;
    actualizarFiltro: <K extends keyof FiltrosMovimiento>(
        campo: K,
        valor: FiltrosMovimiento[K]
    ) => void;
}

function MovimientoFilters({ filtros, actualizarFiltro }: Props) {
    return (
        <div className="movement-filters">
            <select
                value={filtros.tipo}
                onChange={(e) =>
                    actualizarFiltro(
                        "tipo",
                        e.target.value as FiltrosMovimiento["tipo"]
                    )
                }
            >
                <option value="TODOS">Todos los tipos</option>
                <option value="INGRESO">Ingresos</option>
                <option value="GASTO">Gastos</option>
            </select>

            <input
                type="date"
                aria-label="Fecha inicial"
                value={filtros.fechaInicio}
                onChange={(e) =>
                    actualizarFiltro("fechaInicio", e.target.value)
                }
            />

            <input
                type="date"
                aria-label="Fecha final"
                value={filtros.fechaFin}
                onChange={(e) =>
                    actualizarFiltro("fechaFin", e.target.value)
                }
            />

            <input
                type="search"
                placeholder="Buscar concepto..."
                value={filtros.busqueda}
                onChange={(e) =>
                    actualizarFiltro("busqueda", e.target.value)
                }
            />
        </div>
    );
}

export default MovimientoFilters;
