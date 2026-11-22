import type { TipoMovimiento } from "./Movimiento";

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    color: string;
    tipo: TipoMovimiento;
    activa: boolean;
}