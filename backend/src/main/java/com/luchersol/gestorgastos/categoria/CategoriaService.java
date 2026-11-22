package com.luchersol.gestorgastos.categoria;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.luchersol.gestorgastos.gasto.GastoRepository;
import com.luchersol.gestorgastos.ingreso.IngresoRepository;
import com.luchersol.gestorgastos.movimiento.Movimiento;
import com.luchersol.gestorgastos.shared.base.BaseService;

import jakarta.persistence.EntityNotFoundException;

@Service 
public class CategoriaService extends BaseService<CategoriaRepository, Categoria> {

    private final IngresoRepository ingresoRepository;
    private final GastoRepository gastoRepository;

    public CategoriaService(CategoriaRepository repository, GastoRepository gastoRepository, IngresoRepository ingresoRepository) {
        super(repository);
        this.ingresoRepository = ingresoRepository;
        this.gastoRepository = gastoRepository;
    }

    @Override 
    @Transactional(readOnly = true)
    public List<Categoria> obtenerTodos() {
        List<Categoria> categorias = super.obtenerTodos();
        categorias.sort(Comparator.comparing(Categoria::getTipo).thenComparing(Categoria::getNombre));
        return categorias;
    }
    
    @Override 
    @Transactional 
    public void eliminar(Long id) {

        Categoria categoria = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(
                "Categoría no encontrada"
            ));

        // Evitar eliminar las categorías predeterminadas
        if (categoria.getNombre().equals("Otros gastos")
                || categoria.getNombre().equals("Otros ingresos")) {
            throw new IllegalArgumentException(
                "No puedes eliminar una categoría predeterminada"
            );
        }

        TipoMovimiento tipo = categoria.getTipo();

        String nombreCategoriaDestino =
            tipo == TipoMovimiento.GASTO
                ? "Otros gastos"
                : "Otros ingresos";

        Categoria categoriaDestino = repository
            .findByNombreAndTipo(nombreCategoriaDestino, tipo)
            .orElseThrow(() -> new EntityNotFoundException(
                "No existe la categoría predeterminada: "
                    + nombreCategoriaDestino
            ));

        if (tipo == TipoMovimiento.GASTO) {
            gastoRepository.reasignarCategoria(id, categoriaDestino);
        } else {
            ingresoRepository.reasignarCategoria(id, categoriaDestino);
        }

        repository.delete(categoria);
    }

}
