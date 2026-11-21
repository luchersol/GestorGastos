
import type { Categoria } from "../../../types/Categoria";

interface Props {
    categorias: Categoria[];
    onEditar: (categoria: Categoria) => void;
    onEliminar: (id: number) => void;
}

function CategoriaList({
    categorias,
    onEditar,
    onEliminar
}: Props) {
    if (categorias.length === 0) {
        return (
            <p className="empty-message">
                No hay categorías disponibles.
            </p>
        );
    }

    return (
        <div className="category-list">
            {categorias.map((categoria) => (
                <article
                    className="category-item"
                    key={categoria.id}
                >
                    <div className="category-info">
                        <span
                            className="category-color"
                            style={{
                                backgroundColor: categoria.color
                            }}
                        />

                        <div>
                            <strong>{categoria.nombre}</strong>
                            <small>
                                {categoria.tipo === "INGRESO"
                                    ? "Ingreso"
                                    : "Gasto"}
                            </small>
                        </div>
                    </div>

                    <div className="category-actions">
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={() => onEditar(categoria)}
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            className="button button-danger"
                            onClick={() => onEliminar(categoria.id)}
                        >
                            Eliminar
                        </button>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default CategoriaList;
