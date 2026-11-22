
import { useEffect, useState } from "react";

import BalanceCard from "../components/BalanceCard";
import IncomeExpenseCards from "../components/IncomeExpenseCards";
import RecentMovements from "../components/RecentMovements";

import movimientoService from "../../movimientos/services/movimientoService";

import type { Movimiento } from "../../../types/Movimiento";

function ResumenPage() {

    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function cargarMovimientos() {
            try {
                setCargando(true);
                setError("");

                const datos = await movimientoService.obtenerTodos();

                setMovimientos(datos);

            } catch (e) {
                console.error("Error al cargar el resumen:", e);
                setError("No se ha podido cargar el resumen financiero.");
            } finally {
                setCargando(false);
            }
        }

        cargarMovimientos();

    }, []);

    const ingresos = movimientos
        .filter(movimiento => movimiento.tipo === "INGRESO")
        .reduce((total, movimiento) => total + movimiento.importe, 0);

    const gastos = movimientos
        .filter(movimiento => movimiento.tipo === "GASTO")
        .reduce((total, movimiento) => total + movimiento.importe, 0);

    const balance = ingresos - gastos;

    if (cargando) {
        return (
            <section className="page">
                <div className="page-heading">
                    <div>
                        <h1>Resumen</h1>
                        <p>Consulta el estado general de tus finanzas.</p>
                    </div>
                </div>

                <p>Cargando información financiera...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="page">
                <div className="page-heading">
                    <div>
                        <h1>Resumen</h1>
                        <p>Consulta el estado general de tus finanzas.</p>
                    </div>
                </div>

                <p className="error-message">{error}</p>
            </section>
        );
    }

    return (
        <section className="page">

            <div className="page-heading">
                <div>
                    <h1>Resumen</h1>
                    <p>Consulta el estado general de tus finanzas.</p>
                </div>
            </div>

            <div className="summary-grid">

                <BalanceCard balance={balance} />

                <IncomeExpenseCards
                    ingresos={ingresos}
                    gastos={gastos}
                />

            </div>

            <RecentMovements movimientos={movimientos} />

        </section>
    );
}

export default ResumenPage;
