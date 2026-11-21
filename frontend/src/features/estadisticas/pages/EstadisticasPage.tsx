
import IncomeExpenseChart, { type ComparacionMensual } from "../components/IncomeExpenseCart";
import CategoryChart, { type DatoCategoria } from "../components/CategoryChart";
import BalanceChart, { type BalanceMensual } from "../components/BalanceChart";

function EstadisticasPage() {
    // Datos provisionales.
    const comparacionMensual: ComparacionMensual[] = [];
    const gastosPorCategoria: DatoCategoria[] = [];
    const evolucionBalance: BalanceMensual[] = [];

    return (
        <section className="page">
            <div className="page-heading">
                <div>
                    <h1>Estadísticas</h1>
                    <p>
                        Analiza la evolución de tus ingresos y gastos.
                    </p>
                </div>
            </div>

            <div className="statistics-grid">
                <IncomeExpenseChart datos={comparacionMensual} />

                <CategoryChart datos={gastosPorCategoria} />

                <BalanceChart datos={evolucionBalance} />
            </div>
        </section>
    );
}

export default EstadisticasPage;
