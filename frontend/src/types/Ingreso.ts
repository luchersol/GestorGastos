export interface Ingreso {
    id: number;
    importe: number;
    concepto: string;
    fecha: string;
    categoriaId: number;
    observaciones?: string;
}
