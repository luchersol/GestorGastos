
import api from "../../../services/api";

import type { Backup } from "../../../types/Backup";

const URL = "/backups";

const obtenerTodos = async (): Promise<Backup[]> => {

    const response = await api.get<Backup[]>(URL);

    return response.data;
};

const crear = async (): Promise<Backup> => {

    const response = await api.post<Backup>(URL);

    return response.data;
};

const comprobarIntegridad = async (
    nombre: string
): Promise<boolean> => {

    const response = await api.get<boolean>(
        `${URL}/${encodeURIComponent(nombre)}/validar`
    );

    return response.data;
};

const eliminar = async (nombre: string): Promise<void> => {

    await api.delete(
        `${URL}/${encodeURIComponent(nombre)}`
    );
};

const backupService = {
    obtenerTodos,
    crear,
    comprobarIntegridad,
    eliminar
};

export default backupService;
