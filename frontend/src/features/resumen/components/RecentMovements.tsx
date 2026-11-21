
import type { Movimiento } from "../../../types/Movimiento";
import MovimientoItem from "../../movimientos/components/MovimientoItem";

interface Props {
    movimientos: Movimiento[];
}

function RecentMovements({ movimientos }: Props) {
    const recientes = [...movimientos]
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .slice(0, 5);

    return (
        <section className="content-card">
            <h2>Últimos movimientos</h2>

            {recientes.length === 0 ? (
                <p className="empty-message">
                    Todavía no hay movimientos.
                </p>
            ) : (
                <div>
                    {recientes.map((movimiento) => (
                        <MovimientoItem
                            key={`${movimiento.tipo}-${movimiento.id}`}
                            movimiento={movimiento}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default RecentMovements;
