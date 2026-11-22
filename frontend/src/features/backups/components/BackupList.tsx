import type { Backup, TipoBackup } from "../../../types/Backup";

import BackupItem from "./BackupItem";

interface Props {
    backups: Backup[];
    onValidar: (nombre: string) => void;
    onEliminar: (nombre: string) => void;
    validando: string | null;
    eliminando: string | null;
}

function BackupList({
    backups,
    onValidar,
    onEliminar,
    validando,
    eliminando
}: Props) {

    const grupos: {
        tipo: TipoBackup;
        titulo: string;
        descripcion: string;
    }[] = [
        {
            tipo: "DIARIO",
            titulo: "Copias diarias",
            descripcion: "Copias automáticas de cada día"
        },
        {
            tipo: "SEMANAL",
            titulo: "Copias semanales",
            descripcion: "Copias de los lunes"
        },
        {
            tipo: "MENSUAL",
            titulo: "Copias mensuales",
            descripcion: "Copias del primer día de cada mes"
        }
    ];

    if (backups.length === 0) {
        return (
            <div className="backup-empty">
                No hay copias de seguridad disponibles.
            </div>
        );
    }

    return (
        <div className="backup-groups">

            {grupos.map((grupo) => {

                const backupsGrupo = backups.filter(
                    backup => backup.tipo === grupo.tipo
                );

                return (
                    <section
                        key={grupo.tipo}
                        className="backup-group"
                    >
                        <div className="backup-group-header">
                            <div>
                                <h3>{grupo.titulo}</h3>
                                <p>{grupo.descripcion}</p>
                            </div>

                            <span className="backup-group-count">
                                {backupsGrupo.length}
                            </span>
                        </div>

                        {backupsGrupo.length > 0 ? (

                            <div className="backup-group-list">

                                {backupsGrupo.map(backup => (
                                    <BackupItem
                                        key={backup.nombre}
                                        backup={backup}
                                        onValidar={onValidar}
                                        onEliminar={onEliminar}
                                        validando={validando === backup.nombre}
                                        eliminando={eliminando === backup.nombre}
                                    />
                                ))}

                            </div>

                        ) : (

                            <p className="backup-group-empty">
                                Todavía no hay copias de este tipo.
                            </p>

                        )}

                    </section>
                );
            })}

        </div>
    );
}

export default BackupList;
