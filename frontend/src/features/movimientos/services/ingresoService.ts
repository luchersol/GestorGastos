
import api from "../../../services/api";
import type { Ingreso } from "../../../types/Ingreso";

const ingresoService = {
    async obtenerTodos(): Promise<Ingreso[]> {
        const respuesta = await api.get<Ingreso[]>("/ingresos");
        return respuesta.data;
    },

    async obtenerPorId(id: number): Promise<Ingreso> {
        const respuesta = await api.get<Ingreso>(`/ingresos/${id}`);
        return respuesta.data;
    },

    async crear(ingreso: Omit<Ingreso, "id">): Promise<Ingreso> {
        const respuesta = await api.post<Ingreso>("/ingresos", ingreso);
        return respuesta.data;
    },

    async actualizar(id: number, ingreso: Partial<Ingreso>): Promise<Ingreso> {
        const respuesta = await api.put<Ingreso>(`/ingresos/${id}`, ingreso);
        return respuesta.data;
    },

    async eliminar(id: number): Promise<void> {
        await api.delete(`/ingresos/${id}`);
    }
};

export default ingresoService;
