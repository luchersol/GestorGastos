
import { useState } from "react";

import { useMovimientos } from "../hooks/useMovimientos";
import movimientoService from "../services/movimientoService";
import MovimientoFilters from "../components/MovimientoFilters";
import MovimientoList from "../components/MovimientoList";
import MovimientoForm from "../components/MovimientoForm";

import gastoService from "../services/gastoService";
import ingresoService from "../services/ingresoService";
import descargaService from "../../../services/descargaService";

import type {
    TipoMovimiento,
    Movimiento
} from "../../../types/Movimiento";

function MovimientosPage() {

    const {
        movimientos,
        filtros,
        cargando,
        error,
        actualizarFiltro,
        recargar
    } = useMovimientos();

    const [tipoFormulario, setTipoFormulario] =
        useState<TipoMovimiento | null>(null);

    const [movimientoEditar, setMovimientoEditar] =
        useState<Movimiento | null>(null);

    // Abrir formulario para crear
    function abrirFormulario(tipo: TipoMovimiento) {
        setMovimientoEditar(null);
        setTipoFormulario(tipo);
    }

    // Abrir formulario para editar
    function editarMovimiento(movimiento: Movimiento) {
        setMovimientoEditar(movimiento);
        setTipoFormulario(movimiento.tipo);
    }

    async function eliminarMovimiento(movimiento: Movimiento) {
        const confirmado = window.confirm(
            `¿Estás seguro de que quieres eliminar el movimiento "${movimiento.concepto}"?`
        );

        if (!confirmado) return;

        try {
            await movimientoService.eliminar(
                movimiento.id,
                movimiento.tipo
            );

            await recargar();
        } catch (error) {
            console.error("Error al eliminar movimiento:", error);
            alert("No se ha podido eliminar el movimiento.");
        }
    }

    // Cerrar formulario
    function cerrarFormulario() {
        setTipoFormulario(null);
        setMovimientoEditar(null);
    }

    // Finalizar operación
    async function finalizarGuardado() {
        cerrarFormulario();
        await recargar();
    }

    return (
        <section className="page">

            <div className="page-heading">
                <div>
                    <h1>Movimientos</h1>
                    <p>
                        Consulta y administra tus ingresos y gastos.
                    </p>
                </div>

                <div className="movement-actions">

                    <button
                        className="button button-income"
                        onClick={() => abrirFormulario("INGRESO")}
                    >
                        + Ingreso
                    </button>

                    <button
                        className="button button-expense"
                        onClick={() => abrirFormulario("GASTO")}
                    >
                        + Gasto
                    </button>

                </div>
            </div>

            <div className="content-card">

                <div className="movement-toolbar">
                    <div>
                        <h2>Todos los movimientos</h2>
                        <p>
                            {movimientos.length} movimientos encontrados
                        </p>
                    </div>
                </div>

                <MovimientoFilters
                    filtros={filtros}
                    actualizarFiltro={actualizarFiltro}
                />

                <MovimientoList
                    movimientos={movimientos}
                    cargando={cargando}
                    error={error}
                    onEditar={editarMovimiento}
                    onEliminar={eliminarMovimiento}
                />

            </div>

            {tipoFormulario && (
                <MovimientoForm
                    tipo={tipoFormulario}
                    movimiento={movimientoEditar}
                    onCerrar={cerrarFormulario}
                    onGuardado={finalizarGuardado}
                />
            )}

        </section>
    );
}

export default MovimientosPage;
