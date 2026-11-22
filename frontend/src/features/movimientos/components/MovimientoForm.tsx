
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { TipoMovimiento, Movimiento } from "../../../types/Movimiento";
import type { Categoria } from "../../../types/Categoria";

import movimientoService from "../services/movimientoService";
import categoriaService from "../../categorias/services/categoriaService";

interface MovimientoFormProps {
    tipo: TipoMovimiento;
    movimiento: Movimiento | null;
    onCerrar: () => void;
    onGuardado: () => void;
}

function MovimientoForm({
    tipo,
    movimiento,
    onCerrar,
    onGuardado
}: MovimientoFormProps) {

    const [concepto, setConcepto] = useState(
        movimiento?.concepto ?? ""
    );

    const [importe, setImporte] = useState(
        movimiento?.importe?.toString() ?? ""
    );

    const [fecha, setFecha] = useState(
        movimiento?.fecha ?? new Date().toISOString().split("T")[0]
    );

    const [categoriaId, setCategoriaId] = useState(
        movimiento?.categoria?.id?.toString() ?? ""
    );

    const [observaciones, setObservaciones] = useState(
        movimiento?.observaciones ?? ""
    );

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [cargandoCategorias, setCargandoCategorias] = useState(true);
    const [errorCategorias, setErrorCategorias] = useState("");

    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    const esGasto = tipo === "GASTO";
    const esEdicion = movimiento !== null;

    // Cargar categorías disponibles
    useEffect(() => {

        async function cargarCategorias() {

            try {
                setCargandoCategorias(true);
                setErrorCategorias("");

                const datos = await categoriaService.obtenerTodos();

                const disponibles = datos.filter(
                    categoria => categoria.tipo === tipo
                );

                setCategorias(disponibles);

            } catch (error) {

                console.error("Error al cargar las categorías:", error);

                setErrorCategorias(
                    "No se han podido cargar las categorías."
                );

            } finally {
                setCargandoCategorias(false);
            }
        }

        cargarCategorias();

    }, [tipo]);

    // Actualizar los campos cuando cambia el movimiento
    useEffect(() => {

        setConcepto(movimiento?.concepto ?? "");

        setImporte(
            movimiento?.importe?.toString() ?? ""
        );

        setFecha(
            movimiento?.fecha ?? new Date().toISOString().split("T")[0]
        );

        setCategoriaId(
            movimiento?.categoria?.id?.toString() ?? ""
        );

        setObservaciones(
            movimiento?.observaciones ?? ""
        );

        setError("");

    }, [movimiento, tipo]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {

        event.preventDefault();

        setError("");

        const valorImporte = Number(importe);
        const valorCategoria = Number(categoriaId);

        if (!Number.isFinite(valorImporte) || valorImporte <= 0) {
            setError("Introduce un importe válido.");
            return;
        }

        if (
            !Number.isInteger(valorCategoria) ||
            !categorias.some(
                categoria => categoria.id === valorCategoria
            )
        ) {
            setError("Selecciona una categoría válida.");
            return;
        }

        const datos = {
            concepto: concepto.trim(),
            importe: valorImporte,
            fecha,
            categoriaId: valorCategoria,
            observaciones: observaciones.trim(),
            tipo
        };

        try {

            setGuardando(true);

            if (esEdicion) {

                await movimientoService.actualizar(
                    movimiento.id,
                    datos
                );

            } else {

                await movimientoService.crear(datos);

            }

            onGuardado();

        } catch (error) {

            console.error(
                "Error al guardar el movimiento:",
                error
            );

            setError(
                esEdicion
                    ? "No se ha podido actualizar el movimiento."
                    : "No se ha podido guardar el movimiento."
            );

        } finally {
            setGuardando(false);
        }
    }

    const sinCategorias =
        !cargandoCategorias && categorias.length === 0;

    return (
        <div className="modal-overlay" onClick={onCerrar}>

            <div
                className="movement-modal"
                onClick={event => event.stopPropagation()}
            >

                <div className="modal-heading">

                    <div>
                        <h2>
                            {esEdicion
                                ? `Editar ${esGasto ? "gasto" : "ingreso"}`
                                : `Nuevo ${esGasto ? "gasto" : "ingreso"}`
                            }
                        </h2>

                        <p>
                            {esEdicion
                                ? "Modifica los datos del movimiento."
                                : "Introduce los datos del movimiento."
                            }
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onCerrar}
                    >
                        ×
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="concepto">
                            Concepto
                        </label>

                        <input
                            id="concepto"
                            type="text"
                            value={concepto}
                            onChange={e => setConcepto(e.target.value)}
                            placeholder="Ej. Compra supermercado"
                            required
                        />

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label htmlFor="importe">
                                Importe (€)
                            </label>

                            <input
                                id="importe"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={importe}
                                onChange={e => setImporte(e.target.value)}
                                placeholder="0,00"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="fecha">
                                Fecha
                            </label>

                            <input
                                id="fecha"
                                type="date"
                                value={fecha}
                                onChange={e => setFecha(e.target.value)}
                                required
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="categoriaId">
                            Categoría
                        </label>

                        {cargandoCategorias ? (

                            <select id="categoriaId" disabled>
                                <option>Cargando categorías...</option>
                            </select>

                        ) : errorCategorias ? (

                            <p className="form-error">
                                {errorCategorias}
                            </p>

                        ) : sinCategorias ? (

                            <p className="form-error">
                                No existen categorías disponibles para este
                                tipo de movimiento. Crea primero una categoría.
                            </p>

                        ) : (

                            <select
                                id="categoriaId"
                                value={categoriaId}
                                onChange={e => setCategoriaId(e.target.value)}
                                required
                            >

                                <option value="">
                                    Selecciona una categoría
                                </option>

                                {categorias.map(categoria => (

                                    <option
                                        key={categoria.id}
                                        value={categoria.id}
                                    >
                                        {categoria.nombre}
                                    </option>

                                ))}

                            </select>

                        )}

                    </div>

                    <div className="form-group">

                        <label htmlFor="observaciones">
                            Observaciones
                        </label>

                        <textarea
                            id="observaciones"
                            value={observaciones}
                            onChange={e => setObservaciones(e.target.value)}
                            placeholder="Información adicional (opcional)"
                            rows={3}
                        />

                    </div>

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={onCerrar}
                            disabled={guardando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className={`button ${
                                esGasto ? "button-expense" : "button-income"
                            }`}
                            disabled={
                                guardando ||
                                cargandoCategorias ||
                                sinCategorias ||
                                !!errorCategorias
                            }
                        >
                            {guardando
                                ? "Guardando..."
                                : esEdicion
                                    ? "Actualizar"
                                    : esGasto
                                        ? "Guardar gasto"
                                        : "Guardar ingreso"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default MovimientoForm;
