
import { Plus, RefreshCw } from "lucide-react";

interface Props {
    onCrear: () => void;
    onActualizar: () => void;
    creando: boolean;
    cargando: boolean;
}

function BackupActions({
    onCrear,
    onActualizar,
    creando,
    cargando
}: Props) {

    return (
        <div className="backup-actions">

            <button
                className="button button-secondary"
                onClick={onActualizar}
                disabled={cargando || creando}
            >
                <RefreshCw size={17} />
                Actualizar
            </button>

            <button
                className="button button-primary"
                onClick={onCrear}
                disabled={creando || cargando}
            >
                {creando ? (
                    <>
                        <RefreshCw size={17} className="backup-spin" />
                        Creando...
                    </>
                ) : (
                    <>
                        <Plus size={17} />
                        Crear copia
                    </>
                )}
            </button>

        </div>
    );
}

export default BackupActions;
