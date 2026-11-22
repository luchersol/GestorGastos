
import { useCallback, useEffect, useState } from "react";

import { ShieldCheck, DatabaseBackup } from "lucide-react";

import type { Backup } from "../../../types/Backup";

import backupService from "../services/backupService";

import BackupActions from "../components/BackupActions";
import BackupList from "../components/BackupList";

import "./BackupPage.css";

function BackupPage() {

    const [backups, setBackups] = useState<Backup[]>([]);

    const [cargando, setCargando] = useState(false);
    const [creando, setCreando] = useState(false);

    const [validando, setValidando] = useState<string | null>(null);
    const [eliminando, setEliminando] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const obtenerMensajeError = (e: unknown): string => {

        const errorAxios = e as {
            response?: {
                data?: {
                    mensaje?: string;
                };
            };
        };

        return errorAxios.response?.data?.mensaje
            ?? "Se ha producido un error inesperado.";
    };

    const cargarBackups = useCallback(async () => {

        setCargando(true);
        setError(null);

        try {

            const datos = await backupService.obtenerTodos();

            setBackups(datos);

        } catch (e) {

            setError(obtenerMensajeError(e));

        } finally {

            setCargando(false);
        }

    }, []);

    useEffect(() => {

        cargarBackups();

    }, [cargarBackups]);

    // CREAR BACKUP

    const crearBackup = async () => {

        setCreando(true);
        setError(null);
        setMensaje(null);

        try {

            const backup = await backupService.crear();

            setMensaje(
                `Copia de seguridad creada correctamente: ${backup.nombre}`
            );

            await cargarBackups();

        } catch (e) {

            setError(obtenerMensajeError(e));

        } finally {

            setCreando(false);
        }
    };

    // COMPROBAR INTEGRIDAD

    const comprobarIntegridad = async (nombre: string) => {

        setValidando(nombre);
        setError(null);
        setMensaje(null);

        try {

            const valido =
                await backupService.comprobarIntegridad(nombre);

            setBackups(actuales =>
                actuales.map(backup =>
                    backup.nombre === nombre
                        ? { ...backup, valido }
                        : backup
                )
            );

            setMensaje(
                valido
                    ? "La copia de seguridad es válida."
                    : "La copia de seguridad no ha superado la comprobación."
            );

        } catch (e) {

            setError(obtenerMensajeError(e));

        } finally {

            setValidando(null);
        }
    };

    // ELIMINAR BACKUP

    const eliminarBackup = async (nombre: string) => {

        const confirmar = window.confirm(
            `¿Estás seguro de que deseas eliminar la copia ${nombre}?`
        );

        if (!confirmar) {
            return;
        }

        setEliminando(nombre);
        setError(null);
        setMensaje(null);

        try {

            await backupService.eliminar(nombre);

            setBackups(actuales =>
                actuales.filter(backup => backup.nombre !== nombre)
            );

            setMensaje("Copia de seguridad eliminada correctamente.");

        } catch (e) {

            setError(obtenerMensajeError(e));

        } finally {

            setEliminando(null);
        }
    };

    const ultimoBackup = backups.length > 0
        ? backups[0]
        : null;

    return (

        <main className="page backup-page">

            <header className="page-header">

                <div>
                    <h1>Copias de seguridad</h1>

                    <p>
                        Gestiona y protege los datos de tu aplicación.
                    </p>
                </div>

                <BackupActions
                    onCrear={crearBackup}
                    onActualizar={cargarBackups}
                    creando={creando}
                    cargando={cargando}
                />

            </header>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {mensaje && (
                <div className="success-message">
                    {mensaje}
                </div>
            )}

            <section className="backup-summary">

                <div className="backup-summary-card">

                    <div className="backup-summary-icon">
                        <DatabaseBackup size={23} />
                    </div>

                    <div>
                        <span>Copias disponibles</span>

                        <strong>{backups.length}</strong>
                    </div>

                </div>

                <div className="backup-summary-card">

                    <div className="backup-summary-icon">
                        <ShieldCheck size={23} />
                    </div>

                    <div>
                        <span>Última copia</span>

                        <strong>
                            {ultimoBackup
                                ? new Date(ultimoBackup.fecha).toLocaleDateString("es-ES")
                                : "Sin copias"
                            }
                        </strong>
                    </div>

                </div>

            </section>

            <section className="backup-section">

                <div className="backup-section-header">

                    <div>
                        <h2>Historial de copias</h2>

                        <p>
                            Copias de seguridad almacenadas localmente.
                        </p>
                    </div>

                </div>

                {cargando ? (

                    <div className="backup-loading">
                        Cargando copias de seguridad...
                    </div>

                ) : (

                    <BackupList
                        backups={backups}
                        onValidar={comprobarIntegridad}
                        onEliminar={eliminarBackup}
                        validando={validando}
                        eliminando={eliminando}
                    />

                )}

            </section>

        </main>
    );
}

export default BackupPage;
