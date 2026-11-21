
import type { Movimiento } from "../../../types/Movimiento";

interface Props {
    movimiento: Movimiento;
}

function MovimientoItem({ movimiento }: Props) {
    const esIngreso = movimiento.tipo === "INGRESO";

    const importe = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR"
    }).format(movimiento.importe);

    const fecha = new Intl.DateTimeFormat("es-ES").format(
        new Date(`${movimiento.fecha}T00:00:00`)
    );

    return (
        <article className="movement-item">
            <div className="movement-item-info">
                <div
                    className={`movement-type-icon ${
                        esIngreso ? "income" : "expense"
                    }`}
                >
                    {esIngreso ? "+" : "−"}
                </div>

                <div>
                    <strong>{movimiento.concepto}</strong>
                    <span>
                        {movimiento.categoria?.nombre ?? "Sin categoría"}
                    </span>
                </div>
            </div>

            <span className="movement-item-date">{fecha}</span>

            <strong className={esIngreso ? "income-text" : "expense-text"}>
                {esIngreso ? "+" : "−"}{importe}
            </strong>
        </article>
    );
}

export default MovimientoItem;
