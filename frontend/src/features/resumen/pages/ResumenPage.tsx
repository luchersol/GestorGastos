
import BalanceCard from "../components/BalanceCard";
import IncomeExpenseCards from "../components/IncomeExpenseCards";
import RecentMovements from "../components/RecentMovements";
import type { Movimiento } from "../../../types/Movimiento";



function ResumenPage() {
    // Datos provisionales hasta conectar el backend.
    const ingresos = 0;
    const gastos = 0;
    const movimientos: Movimiento[] = [];

    const balance = ingresos - gastos;

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
