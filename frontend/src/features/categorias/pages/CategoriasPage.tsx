import { useEffect, useState } from "react";

import type { Categoria } from "../../../types/Categoria";

import categoriaService from "../services/categoriaService";

import CategoriaList from "../components/CategoriaList";
import CategoriaForm from "../components/CategoriaForm";

function CategoriasPage() {

    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [categoriaEditar, setCategoriaEditar] =
        useState<Categoria | null>(null);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Cargar categorías desde el backend
    const cargarCategorias = async () => {

        try {
            setCargando(true);
            setError("");

            const datos = await categoriaService.obtenerTodas();
            console.log(datos)
            setCategorias(datos);

        } catch (error) {
            console.error("Error al obtener categorías:", error);
            setError("No se han podido cargar las categorías.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    const abrirFormulario = (categoria?: Categoria) => {
        setCategoriaEditar(categoria ?? null);
        setMostrarFormulario(true);
    };

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setCategoriaEditar(null);
    };

    // Crear o actualizar categoría
    const guardarCategoria = async (datos: Omit<Categoria, "id">) => {

        try {

            if (categoriaEditar) {
                await categoriaService.actualizar(
                    categoriaEditar.id,
                    datos
                );
            } else {
                await categoriaService.crear(datos);
            }

            cerrarFormulario();

            await cargarCategorias();

        } catch (error) {
            console.error("Error al guardar categoría:", error);
            throw error;
        }
    };

    // Eliminar categoría
    const eliminarCategoria = async (id: number) => {

        const confirmar = window.confirm(
            "¿Quieres eliminar esta categoría?"
        );

        if (!confirmar) return;

        try {
            await categoriaService.eliminar(id);

            await cargarCategorias();

        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            setError("No se ha podido eliminar la categoría.");
        }
    };

    return (
        <section className="page">

            <div className="page-heading">
                <div>
                    <h1>Categorías</h1>
                    <p>Organiza tus ingresos y gastos.</p>
                </div>

                <button
                    className="button button-primary"
                    onClick={() => abrirFormulario()}
                >
                    + Nueva categoría
                </button>
            </div>

            {mostrarFormulario && (
                <section className="content-card">

                    <h2>
                        {categoriaEditar
                            ? "Editar categoría"
                            : "Nueva categoría"}
                    </h2>

                    <CategoriaForm
                        categoria={categoriaEditar}
                        onGuardar={guardarCategoria}
                        onCancelar={cerrarFormulario}
                    />

                </section>
            )}

            <section className="content-card">

                <h2>Tus categorías</h2>

                {cargando ? (
                    <p>Cargando categorías...</p>
                ) : error ? (
                    <p className="form-error">{error}</p>
                ) : (
                    <CategoriaList
                        categorias={categorias}
                        onEditar={abrirFormulario}
                        onEliminar={eliminarCategoria}
                    />
                )}

            </section>

        </section>
    );
}

export default CategoriasPage;