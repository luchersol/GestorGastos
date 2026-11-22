
import api from "../../../services/api";
import type { Gasto } from "../../../types/Gasto";

const gastoService = {
    async obtenerTodos(): Promise<Gasto[]> {
        const respuesta = await api.get<Gasto[]>("/gastos");
        return respuesta.data;
    },

    async obtenerPorId(id: number): Promise<Gasto> {
        const respuesta = await api.get<Gasto>(`/gastos/${id}`);
        return respuesta.data;
    },

    async crear(gasto: Omit<Gasto, "id">): Promise<Gasto> {
        const respuesta = await api.post<Gasto>("/gastos/dto", gasto);
        return respuesta.data;
    },

    async actualizar(id: number, gasto: Partial<Gasto>): Promise<Gasto> {
        const respuesta = await api.put<Gasto>(`/gastos/${id}`, gasto);
        return respuesta.data;
    },

    async eliminar(id: number): Promise<void> {
        await api.delete(`/gastos/${id}`);
    },

    async exportar(): Promise<Blob> {
        const respuesta = await api.get("/gastos/exportar", {
            params: {
                nombre: "gastos.csv"
            },
            responseType: "blob"
        });

        return respuesta.data;
    },

    async importar(file: File): Promise<void> {
        const formData = new FormData();
        formData.append("file", file);

        await api.post("/gastos/importar", formData);
    }
};

export default gastoService;
