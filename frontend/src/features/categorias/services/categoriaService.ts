import api from "../../../services/api";
import type { Categoria } from "../../../types/Categoria";

const categoriaService = {

    async obtenerTodas(): Promise<Categoria[]> {
        const respuesta = await api.get<Categoria[]>("/categorias");
        return respuesta.data;
    },

    async crear(categoria: Omit<Categoria, "id">): Promise<Categoria> {
        const respuesta = await api.post<Categoria>("/categorias", categoria);
        return respuesta.data;
    },

    async actualizar(id: number, categoria: Omit<Categoria, "id">): Promise<Categoria> {
        const respuesta = await api.put<Categoria>(`/categorias/${id}`, categoria);
        return respuesta.data;
    },

    async eliminar(id: number): Promise<void> {
        await api.delete(`/categorias/${id}`);
    },

    async exportar(): Promise<Blob> {
        const respuesta = await api.get("/categorias/exportar", {
            params: { nombre: "categorias.csv" },
            responseType: "blob"
        });

        return respuesta.data;
    },

    async importar(file: File): Promise<void> {
        const formData = new FormData();
        formData.append("file", file);

        await api.post("/categorias/importar", formData);
    }

};

export default categoriaService;