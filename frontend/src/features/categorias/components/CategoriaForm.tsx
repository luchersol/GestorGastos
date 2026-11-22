import { useEffect, useState } from "react";
import type { Categoria } from "../../../types/Categoria";
import type { TipoMovimiento } from "../../../types/Movimiento";


interface CategoriaFormProps {
    categoria: Categoria | null;
    onGuardar: (datos: Omit<Categoria, "id">) => void | Promise<void>;
    onCancelar: () => void;
}

function CategoriaForm({
    categoria,
    onGuardar,
    onCancelar
}: CategoriaFormProps) {
    const [nombre, setNombre] = useState("");
    const [color, setColor] = useState("#5369D8");
    const [tipo, setTipo] = useState<TipoMovimiento>("GASTO");

    useEffect(() => {
        setNombre(categoria?.nombre ?? "");
        setColor(categoria?.color ?? "#5369D8");
        setTipo(categoria?.tipo ?? "GASTO");
    }, [categoria]);

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const datos: Omit<Categoria, "id"> = {
            nombre,
            color,
            tipo
        };

        onGuardar(datos);
    };

    return (
        <form className="category-form" onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor="categoria-nombre">
                    Nombre
                </label>

                <input
                    id="categoria-nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Alimentación"
                    maxLength={60}
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="categoria-tipo">
                    Tipo
                </label>

                <select
                    id="categoria-tipo"
                    value={tipo}
                    onChange={(e) =>
                        setTipo(e.target.value as TipoMovimiento)
                    }
                >
                    <option value="GASTO">Gasto</option>
                    <option value="INGRESO">Ingreso</option>
                </select>
            </div>

            <div className="form-field">
                <label htmlFor="categoria-color">
                    Color
                </label>

                <div className="color-input">
                    <input
                        id="categoria-color"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />

                    <span>{color.toUpperCase()}</span>
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="button button-secondary"
                    onClick={onCancelar}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    className="button button-primary"
                >
                    {categoria ? "Guardar cambios" : "Crear categoría"}
                </button>
            </div>
        </form>
    );
}

export default CategoriaForm;
