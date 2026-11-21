
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

export interface BalanceMensual {
    mes: string;
    balance: number;
}

interface Props {
    datos: BalanceMensual[];
}

function BalanceChart({ datos }: Props) {
    return (
        <section className="content-card chart-card">
            <h2>Evolución del balance</h2>

            {datos.length === 0 ? (
                <p className="empty-message">
                    No hay datos suficientes para mostrar la evolución.
                </p>
            ) : (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={datos}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />

                            <Tooltip
                                formatter={(value) =>
                                    `${Number(value).toFixed(2)} €`
                                }
                            />

                            <Line
                                type="monotone"
                                dataKey="balance"
                                name="Balance"
                                stroke="#5369D8"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}

export default BalanceChart;
