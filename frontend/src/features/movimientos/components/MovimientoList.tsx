
import type { Movimiento } from "../../../types/Movimiento";
import MovimientoItem from "./MovimientoItem";

interface Props {
    movimientos: Movimiento[];
    cargando: boolean;
    error: string | null;
}

function MovimientoList({ movimientos, cargando, error }: Props) {
    if (cargando) {
        return <p className="empty-message">Cargando movimientos...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (movimientos.length === 0) {
        return (
            <p className="empty-message">
                No hay movimientos que coincidan con los filtros.
            </p>
        );
    }

    return (
        <div className="movement-list">
            {movimientos.map((movimiento) => (
                <MovimientoItem
                    key={`${movimiento.tipo}-${movimiento.id}`}
                    movimiento={movimiento}
                />
            ))}
        </div>
    );
}

export default MovimientoList;
