
import type { ChangeEvent, ReactNode } from "react";

interface CSVCardProps {
    titulo: string;
    descripcion: string;
    icono: ReactNode;
    textoExportar: string;
    textoImportar: string;
    exportando: boolean;
    importando: boolean;
    ocupado: boolean;
    onExportar: () => void;
    onImportar: (file: File) => void;
}

function CSVCard({
    titulo,
    descripcion,
    icono,
    textoExportar,
    textoImportar,
    exportando,
    importando,
    ocupado,
    onExportar,
    onImportar
}: CSVCardProps) {

    function seleccionarArchivo(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            onImportar(file);
        }

        event.target.value = "";
    }

    return (
        <article className="csv-card">

            <div className="csv-card-header">
                <h2>{titulo}</h2>
                <span className="csv-icon">
                    {icono}
                </span>
            </div>

            <p>{descripcion}</p>

            <div className="csv-card-actions">

                <button
                    type="button"
                    className="button button-secondary"
                    onClick={onExportar}
                    disabled={ocupado}
                >
                    {exportando ? "Exportando..." : textoExportar}
                </button>

                <label
                    className={`button button-primary ${ocupado ? "disabled" : ""
                        }`}
                >
                    {importando ? "Importando..." : textoImportar}

                    <input
                        type="file"
                        accept=".csv,text/csv"
                        hidden
                        disabled={ocupado}
                        onChange={seleccionarArchivo}
                    />
                </label>

            </div>
        </article>
    );
}

export default CSVCard;
