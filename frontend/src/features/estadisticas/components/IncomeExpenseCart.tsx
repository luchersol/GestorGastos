
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

export interface ComparacionMensual {
    mes: string;
    ingresos: number;
    gastos: number;
}

interface Props {
    datos: ComparacionMensual[];
}

const formatoEuro = (valor: number) =>
    `${valor.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} €`;

function IncomeExpenseChart({ datos }: Props) {
    return (
        <section className="content-card chart-card">
            <h2>Ingresos y gastos</h2>

            {datos.length === 0 ? (
                <p className="empty-message">
                    No hay datos suficientes para mostrar la gráfica.
                </p>
            ) : (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={datos}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) =>
                                    formatoEuro(Number(value))
                                }
                            />
                            <Legend />

                            <Bar
                                dataKey="ingresos"
                                name="Ingresos"
                                fill="#239B70"
                                radius={[5, 5, 0, 0]}
                            />

                            <Bar
                                dataKey="gastos"
                                name="Gastos"
                                fill="#D65B61"
                                radius={[5, 5, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}

export default IncomeExpenseChart;
