
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Movimiento, TipoMovimiento } from "../../../types/Movimiento";
import movimientoService from "../services/movimientoService";

export interface FiltrosMovimiento {
    tipo: TipoMovimiento | "TODOS";
    categoriaId: number | "TODAS";
    fechaInicio: string;
    fechaFin: string;
    busqueda: string;
}

const filtrosIniciales: FiltrosMovimiento = {
    tipo: "TODOS",
    categoriaId: "TODAS",
    fechaInicio: "",
    fechaFin: "",
    busqueda: ""
};

export function useMovimientos() {
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [filtros, setFiltros] = useState<FiltrosMovimiento>(filtrosIniciales);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarMovimientos = useCallback(async () => {
        try {
            setCargando(true);
            setError(null);

            const datos = await movimientoService.obtenerTodos();
            setMovimientos(datos);
        } catch (err) {
            console.error("Error al cargar movimientos:", err);
            setError("No se han podido cargar los movimientos.");
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarMovimientos();
    }, [cargarMovimientos]);

    const movimientosFiltrados = useMemo(() => {
        return movimientos.filter((movimiento) => {
            const coincideTipo =
                filtros.tipo === "TODOS" ||
                movimiento.tipo === filtros.tipo;

            const coincideCategoria =
                filtros.categoriaId === "TODAS" ||
                movimiento.categoria?.id === filtros.categoriaId;

            const coincideFechaInicio =
                !filtros.fechaInicio ||
                movimiento.fecha >= filtros.fechaInicio;

            const coincideFechaFin =
                !filtros.fechaFin ||
                movimiento.fecha <= filtros.fechaFin;

            const coincideBusqueda =
                !filtros.busqueda ||
                movimiento.concepto
                    .toLowerCase()
                    .includes(filtros.busqueda.toLowerCase());

            return (
                coincideTipo &&
                coincideCategoria &&
                coincideFechaInicio &&
                coincideFechaFin &&
                coincideBusqueda
            );
        });
    }, [movimientos, filtros]);

    const actualizarFiltro = <K extends keyof FiltrosMovimiento>(
        campo: K,
        valor: FiltrosMovimiento[K]
    ) => {
        setFiltros((actuales) => ({
            ...actuales,
            [campo]: valor
        }));
    };

    return {
        movimientos,
        filtros,
        cargando,
        error,
        actualizarFiltro,
        recargar: cargarMovimientos
    };
}
