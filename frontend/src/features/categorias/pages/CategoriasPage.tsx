
import { useState } from "react";

import type { Categoria } from "../../../types/Categoria";

import CategoriaList from "../components/CategoriaList";
import CategoriaForm from "../components/CategoriaForm";

function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaEditar, setCategoriaEditar] =
        useState<Categoria | null>(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const abrirFormulario = (categoria?: Categoria) => {
        setCategoriaEditar(categoria ?? null);
        setMostrarFormulario(true);
    };

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setCategoriaEditar(null);
    };

    const guardarCategoria = (datos: Omit<Categoria, "id">) => {
        if (categoriaEditar) {
            setCategorias((actuales) =>
                actuales.map((categoria) =>
                    categoria.id === categoriaEditar.id
                        ? { ...datos, id: categoria.id }
                        : categoria
                )
            );
        } else {
            const nuevaCategoria: Categoria = {
                ...datos,
                id: Date.now()
            };

            setCategorias((actuales) => [
                ...actuales,
                nuevaCategoria
            ]);
        }

        cerrarFormulario();
    };

    const eliminarCategoria = (id: number) => {
        const confirmar = window.confirm(
            "¿Quieres eliminar esta categoría?"
        );

        if (!confirmar) return;

        setCategorias((actuales) =>
            actuales.filter((categoria) => categoria.id !== id)
        );
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

                <CategoriaList
                    categorias={categorias}
                    onEditar={abrirFormulario}
                    onEliminar={eliminarCategoria}
                />
            </section>
        </section>
    );
}

export default CategoriasPage;
