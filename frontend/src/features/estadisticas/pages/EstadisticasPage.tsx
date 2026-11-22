
import { useEffect, useState } from "react";

import IncomeExpenseChart, {
    type ComparacionMensual
} from "../components/IncomeExpenseCart";

import CategoryChart, {
    type DatoCategoria
} from "../components/CategoryChart";

import BalanceChart, {
    type BalanceMensual
} from "../components/BalanceChart";

import movimientoService from "../../movimientos/services/movimientoService";
import categoriaService from "../../categorias/services/categoriaService";

import type { Movimiento } from "../../../types/Movimiento";
import type { Categoria } from "../../../types/Categoria";

function EstadisticasPage() {

    const [comparacionMensual, setComparacionMensual] =
        useState<ComparacionMensual[]>([]);

    const [gastosPorCategoria, setGastosPorCategoria] =
        useState<DatoCategoria[]>([]);

    const [evolucionBalance, setEvolucionBalance] =
        useState<BalanceMensual[]>([]);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function cargarEstadisticas() {
            try {
                setCargando(true);
                setError("");

                const [movimientos, categorias] = await Promise.all([
                    movimientoService.obtenerTodos(),
                    categoriaService.obtenerTodos()
                ]);

                calcularEstadisticas(movimientos, categorias);

            } catch (e) {
                console.error("Error al cargar las estadísticas:", e);
                setError("No se han podido cargar las estadísticas.");
            } finally {
                setCargando(false);
            }
        }

        cargarEstadisticas();

    }, []);

    function calcularEstadisticas(
        movimientos: Movimiento[],
        categorias: Categoria[]
    ) {

        // Agrupación mensual de ingresos y gastos.
        const meses = new Map<string, {
            ingresos: number;
            gastos: number;
        }>();

        movimientos.forEach(movimiento => {

            const mes = movimiento.fecha.substring(0, 7);

            if (!meses.has(mes)) {
                meses.set(mes, {
                    ingresos: 0,
                    gastos: 0
                });
            }

            const datos = meses.get(mes)!;

            if (movimiento.tipo === "INGRESO") {
                datos.ingresos += movimiento.importe;
            } else {
                datos.gastos += movimiento.importe;
            }
        });

        const mesesOrdenados = [...meses.entries()]
            .sort(([mesA], [mesB]) => mesA.localeCompare(mesB));

        const comparacion: ComparacionMensual[] = mesesOrdenados.map(
            ([mes, datos]) => ({
                mes: new Intl.DateTimeFormat("es-ES", {
                    month: "short",
                    year: "numeric"
                }).format(new Date(`${mes}-15T12:00:00`)),
                ingresos: datos.ingresos,
                gastos: datos.gastos
            })
        );

        setComparacionMensual(comparacion);

        // Gastos agrupados por categoría.
        const categoriasMap = new Map(
            categorias.map(categoria => [categoria.id, categoria])
        );

        const importesCategoria = new Map<number, number>();

        movimientos
            .filter(movimiento => movimiento.tipo === "GASTO")
            .forEach(movimiento => {

                const actual = importesCategoria.get(
                    movimiento.categoriaId
                ) ?? 0;

                importesCategoria.set(
                    movimiento.categoriaId,
                    actual + movimiento.importe
                );
            });

        const datosCategoria: DatoCategoria[] = [
            ...importesCategoria.entries()
        ].map(([categoriaId, importe]) => {

            const categoria = categoriasMap.get(categoriaId);

            return {
                nombre: categoria?.nombre ?? "Sin categoría",
                importe,
                color: categoria?.color ?? "#808080"
            };
        });

        setGastosPorCategoria(datosCategoria);

        // Evolución mensual del balance acumulado.
        let balanceAcumulado = 0;

        const balance: BalanceMensual[] = mesesOrdenados.map(
            ([mes, datos]) => {

                balanceAcumulado += datos.ingresos - datos.gastos;

                return {
                    mes: new Intl.DateTimeFormat("es-ES", {
                        month: "short",
                        year: "numeric"
                    }).format(new Date(`${mes}-15T12:00:00`)),
                    balance: balanceAcumulado
                };
            }
        );

        setEvolucionBalance(balance);
    }

    if (cargando) {
        return (
            <section className="page">
                <div className="page-heading">
                    <div>
                        <h1>Estadísticas</h1>
                        <p>Analiza la evolución de tus ingresos y gastos.</p>
                    </div>
                </div>

                <p>Cargando estadísticas...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="page">
                <div className="page-heading">
                    <div>
                        <h1>Estadísticas</h1>
                        <p>Analiza la evolución de tus ingresos y gastos.</p>
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
                    <h1>Estadísticas</h1>
                    <p>
                        Analiza la evolución de tus ingresos y gastos.
                    </p>
                </div>
            </div>

            <div className="statistics-grid">

                <IncomeExpenseChart
                    datos={comparacionMensual}
                />

                <CategoryChart
                    datos={gastosPorCategoria}
                />

                <BalanceChart
                    datos={evolucionBalance}
                />

            </div>

        </section>
    );
}

export default EstadisticasPage;
