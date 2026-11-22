import gastoService from "./gastoService";
import ingresoService from "./ingresoService";
import api from "../../../services/api";

import type {
    Movimiento,
    TipoMovimiento
} from "../../../types/Movimiento";

type MovimientoDatos = {
    importe: number;
    concepto: string;
    fecha: string;
    categoriaId: number;
    observaciones?: string;
};

type MovimientoCrear = MovimientoDatos & {
    tipo: TipoMovimiento;
};

const movimientoService = {

    async obtenerTodos(): Promise<Movimiento[]> {

        const respuesta = await Promise.all([
            gastoService.obtenerTodos(),
            ingresoService.obtenerTodos()
        ]);

        const movimientos: Movimiento[] = [
            ...respuesta[0].map(gasto => ({
                ...gasto,
                tipo: "GASTO" as const
            })),
            ...respuesta[1].map(ingreso => ({
                ...ingreso,
                tipo: "INGRESO" as const
            }))
        ];

        return movimientos.sort((a, b) =>
            b.fecha.localeCompare(a.fecha)
        );
    },

    async crear(movimiento: MovimientoCrear): Promise<void> {

        const { tipo, ...datos } = movimiento;

        if (tipo === "GASTO") {
            await gastoService.crear(datos);
        } else {
            await ingresoService.crear(datos);
        }
    },

    async actualizar(
        id: number,
        movimiento: MovimientoCrear
    ): Promise<void> {

        const { tipo, ...datos } = movimiento;

        if (tipo === "GASTO") {
            await gastoService.actualizar(id, datos);
        } else {
            await ingresoService.actualizar(id, datos);
        }
    },
    
    async eliminar(id: number, tipo: TipoMovimiento): Promise<void> {
        if (tipo === "GASTO") {
            await gastoService.eliminar(id);
        } else {
            await ingresoService.eliminar(id);
        }
    },

    async exportar(): Promise<Blob> {
        const respuesta = await api.get("/movimientos/exportar", {
            params: { nombre: "movimientos.csv" },
            responseType: "blob"
        });

        return respuesta.data;
    },

    async importar(file: File): Promise<void> {
        const formData = new FormData();
        formData.append("file", file);

        await api.post("/movimientos/importar", formData);
    }
};

export default movimientoService;
