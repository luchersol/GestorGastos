import type { TipoMovimiento } from "./Movimiento";

export interface Categoria {
    id: number;
    nombre: string;
    color: string;
    tipo: TipoMovimiento;
}
