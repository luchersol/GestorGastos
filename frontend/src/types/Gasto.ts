export interface Gasto {
    id: number;
    importe: number;
    concepto: string;
    fecha: string;
    categoriaId: number;
    observaciones?: string;
}
