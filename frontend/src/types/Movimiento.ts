import type { Categoria } from "./Categoria";

export type TipoMovimiento = "INGRESO" | "GASTO";

export interface Movimiento {
    id: number;
    importe: number;
    concepto: string;
    fecha: string;
    tipo: TipoMovimiento;
    categoriaId: number;
    categoria?: Categoria;
    observaciones?: string;
}