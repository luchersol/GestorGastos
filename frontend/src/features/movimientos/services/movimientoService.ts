
import gastoService from "./gastoService";
import ingresoService from "./ingresoService";

import type { Gasto } from "../../../types/Gasto";
import type { Ingreso } from "../../../types/Ingreso";
import type { Movimiento } from "../../../types/Movimiento";

const movimientoService = {

    async obtenerTodos(): Promise<Movimiento[]> {
        const [gastos, ingresos] = await Promise.all([
            gastoService.obtenerTodos(),
            ingresoService.obtenerTodos()
        ]);

        const movimientos: Movimiento[] = [];
        // const movimientos: Movimiento[] = [
        //     ...gastos.map((gasto: Gasto) => ({
        //         id: gasto.id,
        //         importe: gasto.importe,
        //         concepto: gasto.concepto,
        //         fecha: gasto.fecha,
        //         categoriaId: 1,
        //         observaciones: gasto.observaciones,
        //         tipo: "GASTO" as const
        //     })),

        //     ...ingresos.map((ingreso: Ingreso) => ({
        //         id: ingreso.id,
        //         importe: ingreso.importe,
        //         concepto: ingreso.concepto,
        //         fecha: ingreso.fecha,
        //         categoriaId: 1,
        //         observaciones: ingreso.observaciones,
        //         tipo: "INGRESO" as const
        //     }))
        // ];

        return movimientos.sort((a, b) =>
            b.fecha.localeCompare(a.fecha)
        );
    }
};

export default movimientoService;
