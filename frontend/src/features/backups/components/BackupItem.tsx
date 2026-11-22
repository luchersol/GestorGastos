
import {
    Calendar,
    HardDrive,
    ShieldCheck,
    ShieldAlert,
    RefreshCw,
    Trash2
} from "lucide-react";

import type { Backup } from "../../../types/Backup";

interface Props {
    backup: Backup;
    onValidar: (nombre: string) => void;
    onEliminar: (nombre: string) => void;
    validando: boolean;
    eliminando: boolean;
}

function BackupItem({
    backup,
    onValidar,
    onEliminar,
    validando,
    eliminando
}: Props) {

    const formatearFecha = (fecha: string) => {

        return new Date(fecha).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const tipoTexto = {
        DIARIO: "Diario",
        SEMANAL: "Semanal",
        MENSUAL: "Mensual"
    }[backup.tipo];

    const formatearTamano = (bytes: number) => {

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <article className="backup-item">

            <div className="backup-item-info">

                <div className="backup-icon">
                    <HardDrive size={22} />
                </div>

                <div className="backup-item-details">

                    <h3>{backup.nombre}</h3>

                    <div className="backup-metadata">

                        <span>
                            <Calendar size={14} />
                            {formatearFecha(backup.fecha)}
                        </span>

                        <span>
                            <HardDrive size={14} />
                            {formatearTamano(backup.tamano)}
                        </span>

                        <span className="backup-type">
                            {tipoTexto}
                        </span>

                    </div>

                </div>

            </div>

            <div className="backup-item-actions">

                <span className={
                    backup.valido
                        ? "backup-status backup-valid"
                        : "backup-status backup-invalid"
                }>
                    {backup.valido ? (
                        <>
                            <ShieldCheck size={15} />
                            Válida
                        </>
                    ) : (
                        <>
                            <ShieldAlert size={15} />
                            No válida
                        </>
                    )}
                </span>

                <button
                    className="backup-icon-button"
                    title="Comprobar integridad"
                    onClick={() => onValidar(backup.nombre)}
                    disabled={validando || eliminando}
                >
                    <RefreshCw
                        size={17}
                        className={validando ? "backup-spin" : ""}
                    />
                </button>

                <button
                    className="backup-icon-button backup-delete-button"
                    title="Eliminar copia"
                    onClick={() => onEliminar(backup.nombre)}
                    disabled={eliminando || validando}
                >
                    <Trash2 size={17} />
                </button>

            </div>

        </article>
    );
}

export default BackupItem;
