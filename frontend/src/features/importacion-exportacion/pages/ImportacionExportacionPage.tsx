
import { useState } from "react";
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Tags,
    ArrowLeftRight
} from "lucide-react";

import gastoService from "../../movimientos/services/gastoService";
import ingresoService from "../../movimientos/services/ingresoService";
import categoriaService from "../../categorias/services/categoriaService";
import movimientoService from "../../movimientos/services/movimientoService";

import descargaService from "../../../services/descargaService";

import CSVCard from "../components/CSVCard";

import type { TipoMovimiento } from "../../../types/Movimiento";

type TipoCSV = TipoMovimiento | "CATEGORIA" | "MOVIMIENTOS";

type OperacionCSV = {
    tipo: TipoCSV;
    accion: "IMPORTAR" | "EXPORTAR";
} | null;

function ImportacionExportacionPage() {

    const [operacion, setOperacion] = useState<OperacionCSV>(null);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    async function exportarCSV(tipo: TipoCSV) {
        setMensaje("");
        setError("");

        try {
            setOperacion({ tipo, accion: "EXPORTAR" });

            let blob: Blob;
            let nombre: string;

            switch (tipo) {
                case "GASTO":
                    blob = await gastoService.exportar();
                    nombre = "gastos.csv";
                    break;

                case "INGRESO":
                    blob = await ingresoService.exportar();
                    nombre = "ingresos.csv";
                    break;

                case "CATEGORIA":
                    blob = await categoriaService.exportar();
                    nombre = "categorias.csv";
                    break;

                case "MOVIMIENTOS":
                    blob = await movimientoService.exportar();
                    nombre = "movimientos.csv";
                    break;
            }

            descargaService.descargar(blob, nombre);
            setMensaje(`Archivo ${nombre} exportado correctamente.`);

        } catch (e) {
            console.error(e);
            setError("No se ha podido exportar el archivo.");
        } finally {
            setOperacion(null);
        }
    }

    async function importarCSV(tipo: TipoCSV, file: File) {
        setMensaje("");
        setError("");

        if (!file.name.toLowerCase().endsWith(".csv")) {
            setError("Selecciona un archivo CSV.");
            return;
        }

        try {
            setOperacion({ tipo, accion: "IMPORTAR" });

            switch (tipo) {
                case "GASTO":
                    await gastoService.importar(file);
                    break;

                case "INGRESO":
                    await ingresoService.importar(file);
                    break;

                case "CATEGORIA":
                    await categoriaService.importar(file);
                    break;

                case "MOVIMIENTOS":
                    await movimientoService.importar(file);
                    break;
            }

            const nombres: Record<TipoCSV, string> = {
                GASTO: "Gastos",
                INGRESO: "Ingresos",
                CATEGORIA: "Categorías",
                MOVIMIENTOS: "Movimientos"
            };

            setMensaje(`${nombres[tipo]} importados correctamente.`);

        } catch (e) {
            console.error(e);
            setError("No se ha podido importar el archivo.");
        } finally {
            setOperacion(null);
        }
    }

    const ocupado = operacion !== null;

    function estadoExportacion(tipo: TipoCSV): boolean {
        return operacion?.tipo === tipo &&
            operacion.accion === "EXPORTAR";
    }

    function estadoImportacion(tipo: TipoCSV): boolean {
        return operacion?.tipo === tipo &&
            operacion.accion === "IMPORTAR";
    }

    return (
        <section className="page">

            <header className="page-header">
                <div>
                    <h1>Importación y exportación</h1>
                    <p>
                        Gestiona tus gastos, ingresos, categorías y movimientos
                        mediante archivos CSV.
                    </p>
                </div>
            </header>

            {mensaje && (
                <p className="success-message">{mensaje}</p>
            )}

            {error && (
                <p className="error-message">{error}</p>
            )}

            <div className="csv-page-grid">

                <CSVCard
                    titulo="Gastos"
                    descripcion="Importa o exporta todos tus gastos registrados."
                    icono={<ArrowDownCircle size={24} />}
                    textoExportar="Descargar gastos CSV"
                    textoImportar="Importar gastos CSV"
                    exportando={estadoExportacion("GASTO")}
                    importando={estadoImportacion("GASTO")}
                    ocupado={ocupado}
                    onExportar={() => exportarCSV("GASTO")}
                    onImportar={(file) => importarCSV("GASTO", file)}
                />

                <CSVCard
                    titulo="Ingresos"
                    descripcion="Importa o exporta todos tus ingresos registrados."
                    icono={<ArrowUpCircle size={24} />}
                    textoExportar="Descargar ingresos CSV"
                    textoImportar="Importar ingresos CSV"
                    exportando={estadoExportacion("INGRESO")}
                    importando={estadoImportacion("INGRESO")}
                    ocupado={ocupado}
                    onExportar={() => exportarCSV("INGRESO")}
                    onImportar={(file) => importarCSV("INGRESO", file)}
                />

                <CSVCard
                    titulo="Categorías"
                    descripcion="Importa o exporta las categorías que utilizas para clasificar tus movimientos."
                    icono={<Tags size={24} />}
                    textoExportar="Descargar categorías CSV"
                    textoImportar="Importar categorías CSV"
                    exportando={estadoExportacion("CATEGORIA")}
                    importando={estadoImportacion("CATEGORIA")}
                    ocupado={ocupado}
                    onExportar={() => exportarCSV("CATEGORIA")}
                    onImportar={(file) => importarCSV("CATEGORIA", file)}
                />

                <CSVCard
                    titulo="Todos los movimientos"
                    descripcion="Importa o exporta conjuntamente gastos e ingresos en un único archivo CSV."
                    icono={<ArrowLeftRight size={24} />}
                    textoExportar="Descargar movimientos CSV"
                    textoImportar="Importar movimientos CSV"
                    exportando={estadoExportacion("MOVIMIENTOS")}
                    importando={estadoImportacion("MOVIMIENTOS")}
                    ocupado={ocupado}
                    onExportar={() => exportarCSV("MOVIMIENTOS")}
                    onImportar={(file) => importarCSV("MOVIMIENTOS", file)}
                />

            </div>
        </section>
    );
}

export default ImportacionExportacionPage;
