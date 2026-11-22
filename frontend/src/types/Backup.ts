export type TipoBackup = "DIARIO" | "SEMANAL" | "MENSUAL";

export interface Backup {
    nombre: string;
    fecha: string;
    tamano: number;
    valido: boolean;
    tipo: TipoBackup;
}