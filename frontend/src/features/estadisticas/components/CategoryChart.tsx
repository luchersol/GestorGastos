
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

export interface DatoCategoria {
    nombre: string;
    importe: number;
    color: string;
}

interface Props {
    datos: DatoCategoria[];
}

function CategoryChart({ datos }: Props) {
    return (
        <section className="content-card chart-card">
            <h2>Gastos por categoría</h2>

            {datos.length === 0 ? (
                <p className="empty-message">
                    No hay gastos categorizados para mostrar.
                </p>
            ) : (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={datos}
                                dataKey="importe"
                                nameKey="nombre"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(1)}%`
                                }
                            >
                                {datos.map((dato, index) => (
                                    <Cell
                                        key={`${dato.nombre}-${index}`}
                                        fill={dato.color}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                formatter={(value) =>
                                    `${Number(value).toFixed(2)} €`
                                }
                            />

                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    );
}

export default CategoryChart;
